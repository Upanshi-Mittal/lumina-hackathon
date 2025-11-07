from beanie import Document

class UserDetails(Document):
    personalEmail: str
    phoneNumber: str
    githubProfile: str
    linkedinProfile: str
    skills: str
    portfolio: str

    class Settings:
        name = "userdetails"  # MongoDB collection name
