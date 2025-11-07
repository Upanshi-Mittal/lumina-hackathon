from fastapi import APIRouter, Header, HTTPException
from backend.utils.github_utils import analyze_github_with_token

router = APIRouter(prefix="/github", tags=["GitHub"])

@router.get("/analyze")
def analyze(authorization: str = Header(..., description="Authorization: Bearer <GitHub PAT>")):
    try:
        parts = authorization.split()
        if len(parts) != 2 or parts[0].lower() != "bearer":
            raise HTTPException(400, "Use Authorization: Bearer <token>")
        token = parts[1]
        result = analyze_github_with_token(token)
        if "error" in result:
            raise HTTPException(400, result["error"])
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, str(e))
