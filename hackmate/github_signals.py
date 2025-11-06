import requests
from collections import defaultdict
from datetime import datetime, timedelta, timezone
from typing import Dict, Any

GITHUB_API = "https://api.github.com"

def fetch_github_signals_with_token(access_token: str) -> Dict[str, Any]:
    headers = {"Authorization": f"Bearer {access_token}", "Accept": "application/vnd.github+json"}
    user = requests.get(f"{GITHUB_API}/user", headers=headers).json()
    login = user.get("login")

    repos, page = [], 1
    while True:
        r = requests.get(f"{GITHUB_API}/user/repos?per_page=100&page={page}&sort=updated", headers=headers)
        data = r.json()
        if not isinstance(data, list) or not data:
            break
        repos.extend(data)
        if len(data) < 100:
            break
        page += 1

    lang_bytes = defaultdict(int)
    topics = set()
    commit_recent = 0
    cutoff = datetime.now(timezone.utc) - timedelta(days=90)

    for repo in repos:
        if repo.get("fork"):
            continue
        langs_url = repo.get("languages_url")
        if langs_url:
            ld = requests.get(langs_url, headers=headers).json() or {}
            for k, v in ld.items():
                lang_bytes[k.lower()] += int(v)
        topics.update([t.lower() for t in repo.get("topics", [])])
        pushed_at = repo.get("pushed_at")
        if pushed_at:
            dt = datetime.fromisoformat(pushed_at.replace("Z", "+00:00"))
            if dt >= cutoff:
                commit_recent += 1

    total = sum(lang_bytes.values()) or 1
    langs_frac = {k: v/total for k, v in lang_bytes.items()}
    activity = min(1.0, commit_recent / 20.0)

    return {
        "github_handle": login,
        "langs": langs_frac,
        "topics": list(topics),
        "activity": activity,
        "avatar_url": user.get("avatar_url"),
        "name": user.get("name") or user.get("login"),
        "email": user.get("email"),
    }
