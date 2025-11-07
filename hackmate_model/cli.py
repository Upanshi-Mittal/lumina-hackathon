import json, sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from hackmate.skills import SkillIndex
from hackmate.schemas import Candidate, Team, TeamRole
from hackmate.scorer import score_candidate_for_role



def main(path_data: str, path_skills: str = "skills.json"):
    si = SkillIndex(path_skills)
    with open(path_data, "r", encoding="utf-8") as f:
        data = json.load(f)

    candidates = [Candidate(**c) for c in data["candidates"]]
    team = Team(**data["team"])
    open_roles = [r for r in team.roles if not r.filledBy]

    print("=== Scores per candidate (best role) ===")
    for c in candidates:
        best = (-1.0, None, [])
        for r in open_roles:
            s, why = score_candidate_for_role(si, c, team, r)
            if s > best[0]:
                best = (s, r, why)
        print(f"{c.id:>3}  best={best[0]:.3f}  role={best[1].title if best[1] else '-'}  why={best[2]}")

    print("\n=== Optimal assignment (role <- candidate) ===")
    triples, unfilled = assign_candidates_to_roles(si, candidates, team, open_roles)
    for role_id, cand_id, score in triples:
        print(f"{role_id} <- {cand_id}   score={score:.3f}")
    if unfilled:
        print("Unfilled roles:", unfilled)

if __name__ == "__main__":
    path = sys.argv[1] if len(sys.argv) > 1 else "sample_data.json"
    main(path)
