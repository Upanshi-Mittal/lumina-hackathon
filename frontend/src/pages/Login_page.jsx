import { useState } from "react";
import { WebPortal, LoginError } from "jsjiit";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [roll, setRoll] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const portal = new WebPortal();

      // ✅ Correct JSJIIT function
      const session = await portal.student_login(roll, password);

localStorage.setItem("jiit_session", JSON.stringify(session));

console.log("✅ Login success!", session);
navigate("/Details");
;

    } catch (err) {
      if (err instanceof LoginError) {
        alert("❌ Invalid credentials");
      } else {
        alert("❌ Error: " + err.message);
      }
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>JIIT Login</h2>

      <form onSubmit={handleLogin}>

        <input
          type="text"
          placeholder="Enrollment Number"
          value={roll}
          onChange={(e) => setRoll(e.target.value)}
        />
        <br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />

        <button disabled={loading} type="submit">
          {loading ? "Logging in..." : "Login"}
        </button>

      </form>
    </div>
  );
}
