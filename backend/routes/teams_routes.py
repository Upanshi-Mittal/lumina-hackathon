# backend/routes/teams_routes.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
from backend.hackmate.assign import assign_candidates_to_roles
from backend.hackmate.scorer import score_candidate_for_role

router = APIRouter(prefix="/teams", tags=["Teams"])

class TeamMember(BaseModel):
    name: str
    role: str
    skills: Dict[str, float]

class Team(BaseModel):
    name: str
    members: List[TeamMember]

@router.post("/create")
def create_team(team: Team):
    try:
        # You can expand this with DB or file storage later
        return {"message": f"Team '{team.name}' created successfully", "team": team.model_dump()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/evaluate")
def evaluate_team(team: Team):
    try:
        scores = []
        for member in team.members:
            role = {"name": member.role, "requirements": member.skills}
            candidate = {"name": member.name, "skills": member.skills}
            score = score_candidate_for_role(candidate, role)
            scores.append({"member": member.name, "role": member.role, "score": score})
        return {"team": team.name, "evaluation": scores}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
