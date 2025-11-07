from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests
from hackmate_model import SkillIndex, Candidate, TeamRole, Team, score_candidate_for_role
import re

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------
# ✅ Extract GitHub Username
# -----------------------
def extract_username(url: str):
    if not url:
        return None
    return url.rstrip("/").split("/")[-1]


# -----------------------
# ✅ Extract Skills From GitHub Repos
# -----------------------
def extract_skills_from_github(username: str):
    url = f"https://api.github.com/users/{username}/repos"
    res = requests.get(url)

    if res.status_code != 200:
        return []

    repos = res.json()
    skills = set()

    for repo in repos:
        lang = repo.get("language")
        name = repo.get("name", "").lower()

        if lang:
            skills.add(lang.lower())

        # Detect frameworks/libraries by repo name
        if "react" in name:
            skills.add("react")
        if "node" in name or "express" in name:
            skills.add("node")
            skills.add("express")
        if "django" in name:
            skills.add("django")
        if "flask" in name:
            skills.add("flask")
        if "ml" in name or "ai" in name or "vision" in name:
            skills.add("machine learning")
        if "flutter" in name:
            skills.add("flutter")

    return list(skills)


# -----------------------
# ✅ Recommend Tech Stack (based on idea)
# -----------------------
def recommend_tech_stack(idea: str):
    idea = idea.lower()

    if any(word in idea for word in ["app", "mobile", "android", "ios"]):
        return ["Flutter", "React Native", "Firebase", "Node.js"]

    if any(word in idea for word in ["ai", "ml", "machine learning", "model"]):
        return ["Python", "FastAPI", "TensorFlow", "Scikit-learn", "MongoDB"]

    if any(word in idea for word in ["website", "web", "platform", "saas"]):
        return ["React", "Node.js", "Express", "MongoDB", "Tailwind"]

    if "chatbot" in idea:
        return ["Python", "FastAPI", "NLP", "Transformers"]

    return ["React", "Node.js", "MongoDB"]


# -----------------------
# ✅ Recommend Team Structure
# -----------------------
def recommend_team_structure(idea: str):
    idea = idea.lower()

    if "ai" in idea or "ml" in idea:
        return [
            "1 Machine Learning Engineer",
            "1 Backend Engineer",
            "1 Data Engineer",
            "1 UI/UX Designer"
        ]

    if "app" in idea or "mobile" in idea:
        return [
            "1 Flutter/React Native Developer",
            "1 Backend Engineer",
            "1 UI/UX Designer"
        ]

    return [
        "1 Frontend Developer",
        "1 Backend Developer",
        "1 UI/UX Designer",
        "1 DevOps"
    ]


# -----------------------
# ✅ Score user's best role (using GitHub skills)
# -----------------------
def get_best_role(skills):
    si = SkillIndex("skills.json")

    candidate = Candidate(id="you", skills=skills, projects=1, github="")

    roles = [
        TeamRole(id="fe", title="Frontend Developer", skills=["react", "javascript"]),
        TeamRole(id="be", title="Backend Developer", skills=["node", "python"]),
        TeamRole(id="ml", title="Machine Learning Engineer", skills=["python", "ml"]),
    ]

    best_score = -1
    best_role = None

    team = Team(id="t1", roles=roles)

    for role in roles:
        score, reason = score_candidate_for_role(si, candidate, team, role)
        if score > best_score:
            best_score = score
            best_role = role.title

    return best_role, best_score


# -----------------------
# ✅ MAIN CHATBOT ENDPOINT
# -----------------------
@app.post("/chat")
def chat(data: dict):
    message = data.get("message", "")
    github_url = data.get("githubProfile")

    username = extract_username(github_url)
    if not username:
        return {"reply": "I can't detect your GitHub profile."}

    skills = extract_skills_from_github(username)

    techstack = recommend_tech_stack(message)
    team = recommend_team_structure(message)
    role, score = get_best_role(skills)

    reply = f"""
✅ **Tech Stack Recommendation**
{', '.join(techstack)}

✅ **Team Members Needed**
- {chr(10).join(team)}

✅ **Your Best Role**
{role} (Score: {round(score, 2)})

✅ **Skills detected from your GitHub**
{', '.join(skills) if skills else "No skills detected"}
"""

    return {"reply": reply}
