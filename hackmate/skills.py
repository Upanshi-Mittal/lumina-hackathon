import json, os
from typing import Dict, List, Tuple

class SkillIndex:
    def __init__(self, skills_path: str):
        with open(skills_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        self.canonical: List[str] = data["canonical_skills"]
        self.aliases: Dict[str, str] = data.get("aliases", {})
        self.index: Dict[str, int] = {s: i for i, s in enumerate(self.canonical)}

    def canon(self, s: str) -> str:
        s = (s or "").strip().lower()
        return self.aliases.get(s, s)

    def to_index(self, names: List[str]) -> List[int]:
        idxs = []
        for n in names:
            c = self.canon(n)
            if c in self.index:
                idxs.append(self.index[c])
        return idxs

    def dim(self) -> int:
        return len(self.canonical)
