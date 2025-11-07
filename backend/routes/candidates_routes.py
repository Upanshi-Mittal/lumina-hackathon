# backend/routes/candidates_routes.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
from backend.hackmate.assign import assign_candidates_to_roles
from backend.hackmate.skills import SkillIndex
from backend.hackmate.scorer import score_candidate_for_role

router = APIRouter(prefix="/candidates", tags=["Candidates"])

class Candidate(BaseModel):
    name: str
    skills: Dict[str, float]

class Role(BaseModel):
    name: str
    requirements: Dict[str, float]

class TeamAssignmentRequest(BaseModel):
    candidates: List[Candidate]
    roles: List[Role]

@router.post("/assign")
def assign_teams(request: TeamAssignmentRequest):
    try:
        result = assign_candidates_to_roles(request.model_dump())
        return {"status": "success", "teams": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/score")
def score_candidate(candidate: Candidate, role: Role):
    try:
        score = score_candidate_for_role(candidate.model_dump(), role.model_dump())
        return {"candidate": candidate.name, "role": role.name, "score": score}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
