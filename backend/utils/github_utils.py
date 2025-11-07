from typing import Dict, Any
# adjust import to your actual location:
# if your file is hackmate/github_signals.py:
from backend.hackmate.github_signals import fetch_github_signals_with_token

def analyze_github_with_token(token: str) -> Dict[str, Any]:
    try:
        data = fetch_github_signals_with_token(token)
        return {"features": data}
    except Exception as e:
        return {"error": str(e)}
