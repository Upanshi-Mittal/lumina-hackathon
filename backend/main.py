from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from dotenv import load_dotenv
import os
from backend.routes.details_route import router as details_router

# Load environment variables
load_dotenv()

# ✅ Import ROUTES (correct path!)
from backend.routes import (
    candidates_routes,
    teams_routes,
    skills_routes,
    github_routes,
    #users_routes
)
from routes.details_route import router as details_router

# ✅ Import MODELS (correct path!)
from models.details_model import UserDetails
from models.candidate_models import Candidate
from models.skill_models import Skill
from models.team_models import Team

# ✅ FastAPI App
app = FastAPI(title="Hackmate API", version="1.0.0")

# ✅ CORS (temporary allow all — tighten later)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ✅ Startup Event → Connect MongoDB
@app.on_event("startup")
async def init_db():
    mongo_url = os.getenv("MONGO_URL")
    db_name = os.getenv("DB_NAME")

    if not mongo_url:
        raise Exception("❌ MONGO_URL not found in .env")
    if not db_name:
        raise Exception("❌ DB_NAME not found in .env")

    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]

    # ✅ Initialize Beanie ODM
    await init_beanie(
        database=db,
        document_models=[
            UserDetails,
            Candidate,
            Skill,
            Team
        ]
    )

    print("✅ MongoDB + Beanie connected successfully!")


# ✅ Include ALL routes under /api
app.include_router(details_router,            prefix="/api")
app.include_router(users_routes.router,       prefix="/api")
app.include_router(candidates_routes.router,  prefix="/api")
app.include_router(teams_routes.router,       prefix="/api")
app.include_router(skills_routes.router,      prefix="/api")
app.include_router(github_routes.router,      prefix="/api")


# ✅ Root Route
@app.get("/")
def root():
    return {"message": "Hackmate backend running ✅"}
