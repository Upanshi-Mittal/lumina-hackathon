from fastapi import APIRouter
from backend.models.details_model import UserDetails

router = APIRouter()

@router.post("/details")
async def save_details(details: UserDetails):
    await details.insert()
    return {"success": True, "message": "Details saved"}
