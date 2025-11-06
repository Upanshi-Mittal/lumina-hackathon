import os
import numpy as np
from typing import Dict, Tuple
import google.generativeai as genai
from .skills import SkillIndex
from .schemas import Candidate, Team, TeamRole

from .config import GEMINI_EMBED_MODEL

def maybe_init_gemini():
    key = os.getenv("GEMINI_API_KEY")
    if key:
        genai.configure(api_key=key)
    return bool(key)

_HAS_GEMINI = maybe_init_gemini()
_TEXT_CACHE: Dict[str, np.ndarray] = {}

def empty_skill_vec(si: SkillIndex) -> np.ndarray:
    return np.zeros(si.dim(), dtype=float)

def skill_vector(si: SkillIndex, skills) -> np.ndarray:
    v = empty_skill_vec(si)
    for s in skills:
        name = si.canon(s.name)
        if name in si.index:
            v[si.index[name]] = max(v[si.index[name]], s.level / 5.0)
    return v

def req_vector(si: SkillIndex, names) -> np.ndarray:
    v = empty_skill_vec(si)
    for n in names:
        c = si.canon(n)
        if c in si.index:
            v[si.index[c]] = 1.0
    return v

def bonus_vector(si: SkillIndex, names) -> np.ndarray:
    v = empty_skill_vec(si)
    for n in names:
        c = si.canon(n)
        if c in si.index:
            v[si.index[c]] = max(v[si.index[c]], 0.6)
    return v

def embed_text(text: str) -> np.ndarray:
    text = (text or "").strip()
    if not text or not _HAS_GEMINI:
        return np.zeros(768, dtype=float)
    if text in _TEXT_CACHE:
        return _TEXT_CACHE[text]
    resp = genai.embed_content(model=GEMINI_EMBED_MODEL, content=text)
    vec = np.array(resp["embedding"], dtype=float)
    _TEXT_CACHE[text] = vec
    return vec

def github_vector(si: SkillIndex, langs: Dict[str, float]) -> np.ndarray:
    v = empty_skill_vec(si)
    for lang, frac in (langs or {}).items():
        c = si.canon(lang)
        if c in si.index:
            v[si.index[c]] = max(v[si.index[c]], float(frac))
    return v

def encode_candidate(si: SkillIndex, cand: Candidate) -> Tuple[np.ndarray, Dict[str, np.ndarray]]:
    v_skill = skill_vector(si, cand.skills)
    v_git = github_vector(si, cand.github.langs)
    v_text = embed_text(cand.bio or "")
    # Keep text separate; use mainly structured signals for explainability
    proj_text = np.zeros_like(v_skill)
    E_c = 0.55 * v_skill + 0.25 * v_git + 0.20 * proj_text
    return E_c, {"v_skill": v_skill, "v_git": v_git, "v_text": v_text}

def encode_role(si: SkillIndex, role: TeamRole) -> np.ndarray:
    return 0.7 * req_vector(si, role.required) + 0.3 * bonus_vector(si, role.bonus)

def team_gap_vector(si: SkillIndex, team: Team) -> np.ndarray:
    max_cover = empty_skill_vec(si)
    for m in team.members:
        mv = skill_vector(si, m.skills)
        max_cover = np.maximum(max_cover, mv)
    req_sum = empty_skill_vec(si)
    for r in team.roles:
        if r.filledBy:
            continue
        req_sum = np.maximum(req_sum, req_vector(si, r.required))
    return np.clip(req_sum - max_cover, 0, 1)
