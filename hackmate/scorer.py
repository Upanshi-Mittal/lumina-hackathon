import numpy as np
from typing import List, Tuple
from .features import encode_candidate, encode_role, team_gap_vector, bonus_vector
from .skills import SkillIndex
from .schemas import Candidate, Team, TeamRole
from .config import W

def cosine(a: np.ndarray, b: np.ndarray) -> float:
    da, db = np.linalg.norm(a), np.linalg.norm(b)
    if da == 0 or db == 0:
        return 0.0
    return float(np.dot(a, b) / (da * db))

def availability_overlap(a, b) -> float:
    common = set(a.days) & set(b.days)
    if not common:
        return 0.0
    overlap = max(0, min(a.end, b.end) - max(a.start, b.start))
    span = max(1, max(a.end, b.end) - min(a.start, b.start))
    return overlap / span

def covered_fraction(si: SkillIndex, required_names: List[str], v_cand: np.ndarray) -> float:
    idxs = [si.index[si.canon(r)] for r in required_names if si.canon(r) in si.index]
    if not idxs:
        return 0.0
    covered = sum(1 for i in idxs if v_cand[i] >= 0.4)
    return covered / len(idxs)

def reason_chips(si: SkillIndex, cand: Candidate, team: Team, role: TeamRole, v_cand, gap_vec) -> List[str]:
    chips = []
    req_idxs = [si.index[si.canon(r)] for r in role.required if si.canon(r) in si.index]
    matched_req = [k for i, k in enumerate(si.canonical) if i in req_idxs and v_cand[i] >= 0.5]
    if matched_req:
        chips.append("Matches: " + ", ".join(matched_req[:3]))
    gap_idxs = [i for i in range(si.dim()) if gap_vec[i] > 0.5 and v_cand[i] >= 0.5]
    if gap_idxs:
        names = [si.canonical[i] for i in gap_idxs[:3]]
        chips.append("Covers team gap: " + ", ".join(names))
    av = availability_overlap(cand.availability, team.availability)
    if av >= 0.3:
        chips.append(f"Availability overlap ~{int(av*100)}%")
    if cand.primaryRole and role.title.lower() == (cand.primaryRole or "").lower():
        chips.append("Primary role fit")
    if set(cand.themes) & set(team.themes):
        chips.append("Same theme interest")
    return chips[:4]

def score_candidate_for_role(si: SkillIndex, cand: Candidate, team: Team, role: TeamRole) -> Tuple[float, List[str]]:
    E_c, parts = encode_candidate(si, cand)
    v_cand = parts["v_skill"]
    E_r = encode_role(si, role)
    skill_sim = cosine(E_c, E_r)
    bonus_sim = cosine(v_cand, bonus_vector(si, role.bonus))
    gap_vec = team_gap_vector(si, team)
    gap_cover = covered_fraction(si, role.required, v_cand) if role.required else 0.0
    role_fit = 1.0 if (cand.primaryRole and cand.primaryRole.lower() == role.title.lower()) else (0.6 if role.title.lower() in [r.lower() for r in cand.secondaryRoles] else 0.0)
    avail = availability_overlap(cand.availability, team.availability)
    prefs = 1.0 if set(cand.themes) & set(team.themes) else 0.0
    activity = cand.github.activity

    score = (
        W["skill_sim"]*skill_sim +
        W["bonus_sim"]*bonus_sim +
        W["role_fit"]*role_fit +
        W["gap_cover"]*gap_cover +
        W["avail"]*avail +
        W["prefs"]*prefs +
        W["activity"]*(0.1*activity)
    )
    chips = reason_chips(si, cand, team, role, v_cand, gap_vec)
    return float(score), chips
