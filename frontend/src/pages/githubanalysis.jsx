import { useState } from "react";
import { analyzeGithub } from "../services/github";

const GithubAnalysis = () => {
  const [token, setToken] = useState("");
  const [result, setResult] = useState(null);

  const analyze = async () => {
    const res = await analyzeGithub(token);
    setResult(res.data);
  };

  return (
    <div>
      <h1>GitHub Analyzer</h1>

      <input
        type="text"
        placeholder="Enter GitHub Token"
        value={token}
        onChange={(e) => setToken(e.target.value)}
      />

      <button onClick={analyze}>Analyze</button>

      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
};

export default GithubAnalysis;
