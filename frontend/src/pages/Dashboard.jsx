import { useEffect, useState } from "react";
import { getUser } from "../services/auth";
import { analyzeGithub } from "../services/github";

export default function Dashboard() {
  const roll = localStorage.getItem("roll");
  const [user, setUser] = useState(null);
  const [ghToken, setGhToken] = useState("");
  const [ghData, setGhData] = useState(null);

  useEffect(() => {
    if (!roll) return;
    getUser(roll).then(res => setUser(res.data)).catch(() => setUser(null));
  }, [roll]);

  const saveGithub = async () => {
    if (!ghToken) return;
    const res = await analyzeGithub(ghToken);
    setGhData(res.data);
    // optionally POST the token to /users/register to save it with the user:
    // await registerUser({ roll, github_token: ghToken });
  };

  if (!roll) return <p>Please login first.</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-semibold mb-2">Welcome, {roll}</h1>
      <pre className="bg-gray-100 p-3 rounded mb-4">{JSON.stringify(user, null, 2)}</pre>

      <div className="space-y-2">
        <h2 className="font-semibold">Connect GitHub</h2>
        <input
          className="border p-2 w-full"
          placeholder="GitHub Personal Access Token"
          value={ghToken}
          onChange={e => setGhToken(e.target.value)}
        />
        <button className="border p-2 w-full" onClick={saveGithub}>Analyze GitHub</button>
        {ghData && <pre className="bg-gray-100 p-3 rounded mt-2">{JSON.stringify(ghData, null, 2)}</pre>}
      </div>
    </div>
  );
}
