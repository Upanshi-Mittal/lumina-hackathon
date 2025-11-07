import { useState } from "react";
import { WebPortal, LoginError } from "jsjiit";
import { useNavigate } from "react-router-dom";
import "./login.css"; // ✅ IMPORTANT: add this

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
      const session = await portal.student_login(roll, password);

      localStorage.setItem("jiit_session", JSON.stringify(session));

      console.log("✅ Login success!", session);
      navigate("/Details");

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
    <div className="login-container">

      <h1 className="login-title" >Hackmate</h1>
      <form onSubmit={handleLogin} className="login-card">

        <h2 className="title" >JIIT Login</h2>

        <input
          type="text"
          placeholder="Enrollment Number"
          value={roll}
          onChange={(e) => setRoll(e.target.value)}
          className="input"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
          style={{ marginBottom: "45px" }}
        />

        <button disabled={loading} type="submit" className="btn" style={{ marginBottom: "0px" }}>
          {loading ? "Logging in..." : "Login"}
        </button>

      </form>
    </div>
  );
}
