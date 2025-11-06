from typing import List, Tuple
import numpy as np

from .schemas import Candidate, Team, TeamRole
from .skills import SkillIndex
from .scorer import score_candidate_for_role
from .config import MIN_SCORE

def assign_candidates_to_roles(si: SkillIndex, candidates: List[Candidate], team: Team, roles: List[TeamRole]) -> Tuple[List[Tuple[str,str,float]], List[str]]:
    """
    Returns (assignments, unfilledRoles)
    assignments: list of (roleId, candidateId, score)
    """
    if not roles or not candidates:
        return [], [r.id for r in roles]

    try:
        from scipy.optimize import linear_sum_assignment
        scores = np.zeros((len(roles), len(candidates)))
        for i, r in enumerate(roles):
            for j, c in enumerate(candidates):
                s, _ = score_candidate_for_role(si, c, team, r)
                scores[i, j] = s
        cost = 1.0 - scores  # maximize scores
        row_ind, col_ind = linear_sum_assignment(cost)
        out = []
        for i, j in zip(row_ind, col_ind):
            if scores[i, j] >= MIN_SCORE:
                out.append((roles[i].id, candidates[j].id, float(scores[i, j])))
        assigned_roles = {a[0] for a in out}
        unfilled = [r.id for r in roles if r.id not in assigned_roles]
        return out, unfilled
    except Exception:
        # Greedy fallback
        used = set()
        out = []
        for r in roles:
            best = (-1.0, None)
            for c in candidates:
                if c.id in used:
                    continue
                s, _ = score_candidate_for_role(si, c, team, r)
                if s > best[0]:
                    best = (s, c)
            if best[1] and best[0] >= MIN_SCORE:
                out.append((r.id, best[1].id, float(best[0])))
                used.add(best[1].id)
        unfilled = [r.id for r in roles if r.id not in [a[0] for a in out]]
        return out, unfilled
