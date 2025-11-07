# backend/routes/skills_routes.py
from fastapi import APIRouter, UploadFile, HTTPException
from backend.hackmate.skills import SkillIndex
import json

router = APIRouter(prefix="/skills", tags=["Skills"])

@router.get("/list")
def list_skills():
    try:
        si = SkillIndex("hackmate-model/skills.json")
        return {"skills": list(si.skills.keys())}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/upload")
def upload_skills(file: UploadFile):
    try:
        content = file.file.read()
        data = json.loads(content)
        with open("hackmate-model/skills.json", "w", encoding="utf-8") as f:
            json.dump(data, f, indent=4)
        return {"message": "Skills file updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
