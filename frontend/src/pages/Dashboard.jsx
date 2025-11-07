import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Card, CardHeader, CardTitle, CardContent, CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import {
  LayoutDashboard, Github, Sparkles, Users2,
  LineChart, Settings, LogOut
} from "lucide-react";

// ------------------------ Helpers ------------------------
const getGithubUsername = (url) => {
  if (!url) return null;
  try {
    const clean = url.replace(/^https?:\/\//, "").replace(/\/+$/, "");
    const after = clean.split("github.com/")[1] || clean;
    return after.split("/")[0].trim();
  } catch {
    return null;
  }
};

function useGithubProfile(username) {
  const [data, setData] = useState(null);
  useEffect(() => {
    let ignore = false;
    if (!username) return;
    fetch(`https://api.github.com/users/${username}`)
      .then((r) => r.json())
      .then((d) => { if (!ignore) setData(d); });
    return () => { ignore = true; };
  }, [username]);
  return data;
}

// ------------------------ UI Helpers ------------------------
const SidebarLink = ({ icon, label, to, active }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-3 py-2 rounded-xl border border-white/10 transition 
      ${active ? "bg-white/10" : "hover:bg-white/5"}`}
  >
    <span className="text-white/80">{icon}</span>
    <span className="text-sm">{label}</span>
  </Link>
);

const GlassCard = ({ children, className = "" }) => (
  <Card className={`bg-white/5 backdrop-blur-2xl border border-white/10 shadow-lg rounded-2xl ${className}`}>
    {children}
  </Card>
);

const Row = ({ k, v }) => (
  <div className="flex items-center justify-between gap-4">
    <span className="text-white/70">{k}</span>
    <span className="text-white font-medium truncate">{v}</span>
  </div>
);

const Stat = ({ label, value }) => (
  <div className="rounded-xl bg-white/5 border border-white/10 px-3 py-2">
    <div className="text-xl font-bold">{value}</div>
    <div className="text-xs text-white/60">{label}</div>
  </div>
);

// ------------------------ MAIN DASHBOARD ------------------------
export default function DashboardPremium() {
  const nav = useNavigate();
  const [user, setUser] = useState(null);
  const [details, setDetails] = useState(null);

  useEffect(() => {
    const s = localStorage.getItem("jiit_session");
    const d = localStorage.getItem("userDetails");
    if (!s) return nav("/");
    setUser(JSON.parse(s));
    if (d) setDetails(JSON.parse(d));
  }, []);

  const githubUsername = useMemo(
    () => getGithubUsername(details?.githubProfile),
    [details?.githubProfile]
  );

  const gh = useGithubProfile(githubUsername);

  if (!user || !details) return null;

  // -------- Skills --------
  const skillArray = details.skills
    ? details.skills.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const skillStats = skillArray.map((s) => ({
    skill: s,
    value: Math.floor(Math.random() * 60) + 40,
  }));

  const COLORS = ["#22d3ee", "#a78bfa", "#34d399", "#f59e0b", "#ef4444", "#60a5fa"];

  const weeklyActivity = [
    { day: "Mon", commits: 2 },
    { day: "Tue", commits: 5 },
    { day: "Wed", commits: 3 },
    { day: "Thu", commits: 8 },
    { day: "Fri", commits: 4 },
    { day: "Sat", commits: 6 },
    { day: "Sun", commits: 1 },
  ];

  // ✅ ✅ ✅ CENTERED DASHBOARD WRAPPER
  return (
    <div className="flex flex-col items-center justify-center w-80vw h-100vh bg-gradient-to-b from-gray-900 via-black to-gray-900">
    <div className="min-h-screen w-full flex items-center justify-center  
        bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]
        from-slate-900 via-slate-950 to-black p-6">

      {/* ✅ PREMIUM CENTER CONTAINER */}
      <div className="w-[90%] max-w-7xl min-h-[85vh] rounded-3xl 
          bg-white/10 backdrop-blur-2xl border border-white/10 shadow-2xl 
          overflow-hidden flex">

        {/* ✅ SIDEBAR + MAIN */}
        <div className="flex w-full">

          {/* ---------- Sidebar ---------- */}
          <aside className="hidden md:flex md:w-64 lg:w-72 flex-col gap-4 p-5
            bg-white/5 backdrop-blur-xl border-r border-white/10">
            <div className="flex items-center gap-3 px-2 py-2">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400" />
              <div className="text-lg font-semibold tracking-wide">Hackmate</div>
            </div>

            <nav className="mt-2 flex flex-col gap-2">
              <SidebarLink icon={<LayoutDashboard size={18} marginRight={8} />} label="Dashboard.  " to="#" active />
              <SidebarLink icon={<Github size={18} marginRight={8} />} label="GitHub Analysis.  " to="/github" />
              <SidebarLink icon={<Sparkles size={18} marginRight={8} />} label="Skills.  " to="/skills" />
              <SidebarLink icon={<Users2 size={18} marginRight={8} />} label="Team Builder.  " to="/team" />
              <SidebarLink icon={<LineChart size={18} marginRight={8} />} label="Score.  " to="/score" />
              <SidebarLink icon={<Settings size={18} marginRight={8} />} label="Settings.  " to="/settings" />
            </nav>

            <div className="mt-auto">
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => { localStorage.removeItem("jiit_session"); nav("/"); }}
              >
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </div>
          </aside>

          {/* ---------- MAIN PANEL ---------- */}
          <main className="flex-1 min-w-0">

            {/* Top Bar */}
            <div className="flex items-center justify-between px-6 py-5
              border-b border-white/10 bg-black/20 backdrop-blur">

              <div>
                <motion.h1
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl font-extrabold tracking-tight"
                >
                  Welcome, {user.name} 👋
                </motion.h1>
                <p className="text-white/60">
                  Analytics Panel • Institute: {user.instituteid} • Roll: {user.enrollmentno}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <img
                  src={gh?.avatar_url}
                  className="h-12 w-12 rounded-full border border-white/20 shadow"
                />
                <div className="text-right">
                  <div className="font-semibold">{githubUsername}</div>
                  <div className="text-xs text-white/60">{gh?.followers ?? 0} followers</div>
                </div>
              </div>
            </div>

            {/* ------------- CONTENT ------------- */}
            <div className="max-w-7xl mx-auto px-6 py-8">

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Profile Summary */}
                <GlassCard>
                  <CardHeader>
                    <CardTitle>👤 Profile Summary</CardTitle>
                    <CardDescription className="text-white/70">Your hackathon identity</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Row k="Email" v={details.personalEmail} />
                    <Row k="Skills" v={details.skills} />
                    <Row k="GitHub" v={<a className="underline" href={details.githubProfile} target="_blank">{details.githubProfile}</a>} />

                    {gh && (
                      <div className="mt-3 grid grid-cols-3 gap-3 text-center">
                        <Stat label="Repos" value={gh.public_repos} />
                        <Stat label="Followers" value={gh.followers} />
                        <Stat label="Following" value={gh.following} />
                      </div>
                    )}
                  </CardContent>
                </GlassCard>

                {/* Skill Strength */}
                <GlassCard className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>📊 Skill Strength</CardTitle>
                  </CardHeader>
                  <CardContent style={{ height: 260 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={skillStats}>
                        <XAxis dataKey="skill" stroke="#aaa" />
                        <YAxis stroke="#aaa" />
                        <Tooltip />
                        <Bar dataKey="value" fill="#60a5fa" radius={8} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </GlassCard>

                {/* Skill Distribution */}
                <GlassCard>
                  <CardHeader>
                    <CardTitle>🧠 Skill Distribution</CardTitle>
                  </CardHeader>
                  <CardContent style={{ height: 250 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={skillStats}
                          dataKey="value"
                          nameKey="skill"
                          innerRadius={50}
                          outerRadius={90}
                        >
                          {skillStats.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </GlassCard>

                {/* Weekly Activity */}
                <GlassCard className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>🔥 Weekly Coding Activity</CardTitle>
                  </CardHeader>
                  <CardContent style={{ height: 250 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyActivity}>
                        <XAxis dataKey="day" stroke="#aaa" />
                        <YAxis stroke="#aaa" />
                        <Tooltip />
                        <Bar dataKey="commits" fill="#22d3ee" radius={10} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </GlassCard>

                {/* Actions */}
                <GlassCard>
                  <CardHeader>
                    <CardTitle>🧩 Team Builder</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" onClick={() => nav("/team")}>Generate Team</Button>
                  </CardContent>
                </GlassCard>

                <GlassCard>
                  <CardHeader>
                    <CardTitle>📈 Candidate Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" onClick={() => nav("/score")}>View Score</Button>
                  </CardContent>
                </GlassCard>

              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
    </div>
  );
}
