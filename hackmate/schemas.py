from pydantic import BaseModel, Field
from typing import List, Optional, Dict

class Availability(BaseModel):
    days: List[str] = Field(default_factory=list)  # ["Fri","Sat"]
    start: int = 18  # 24h hour integer
    end: int = 23
    tz: str = "+05:30"

class Skill(BaseModel):
    name: str
    level: int = Field(ge=1, le=5)

class GitHubSignals(BaseModel):
    langs: Dict[str, float] = Field(default_factory=dict)  # {"python":0.6, "js":0.4}
    topics: List[str] = Field(default_factory=list)
    activity: float = 0.0  # 0..1

class Candidate(BaseModel):
    id: str
    name: Optional[str] = None
    primaryRole: Optional[str] = None
    secondaryRoles: List[str] = Field(default_factory=list)
    skills: List[Skill] = Field(default_factory=list)
    themes: List[str] = Field(default_factory=list)
    availability: Availability = Availability()
    github: GitHubSignals = GitHubSignals()
    bio: Optional[str] = None

class TeamRole(BaseModel):
    id: str
    title: str
    required: List[str] = Field(default_factory=list)
    bonus: List[str] = Field(default_factory=list)
    filledBy: Optional[str] = None

class Team(BaseModel):
    id: str
    name: str
    themes: List[str] = Field(default_factory=list)
    availability: Availability = Availability()
    stack: List[str] = Field(default_factory=list)
    members: List[Candidate] = Field(default_factory=list)
    roles: List[TeamRole] = Field(default_factory=list)
