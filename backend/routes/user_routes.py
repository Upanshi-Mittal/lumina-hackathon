from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backend.utils.storage import load_json, save_json

router = APIRouter(prefix="/users", tags=["Users"])

DATA_PATH = "data/users.json"

class RegisterModel(BaseModel):
    roll: str
    github_token: str | None = None
    linkedin_url: str | None = None
    email: str | None = None
    phone: str | None = None
    website: str | None = None

@router.post("/register")
def register_user(body: RegisterModel):
    users = load_json(DATA_PATH, default={})
    user = users.get(body.roll, {})
    user.update({k: v for k, v in body.dict().items() if v is not None})
    users[body.roll] = user
    save_json(DATA_PATH, users)
    return {"status": "ok", "user": users[body.roll]}

@router.get("/{roll}")
def get_user(roll: str):
    users = load_json(DATA_PATH, default={})
    if roll not in users:
        raise HTTPException(404, "User not found")
    return users[roll]
