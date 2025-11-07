import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const nav = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const s = localStorage.getItem("jiit_session");
    if (!s) return nav("/");

    setUser(JSON.parse(s));
  }, []);

  if (!user) return null;

  return (
    <div
      className="min-h-screen w-full p-6 flex flex-col items-center bg-gradient-to-b 
      from-blue-200 via-sky-100 to-amber-100 dark:from-blue-900 dark:via-sky-950 dark:to-amber-900"
    >
      {/* HEADER */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-slate-800 dark:text-slate-100 drop-shadow-lg mt-4"
      >
        🌊 Hackmate Dashboard
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-lg text-slate-700 dark:text-slate-300 mb-10"
      >
        Welcome, {user.name || "Student"} 👋
      </motion.p>

      {/* GRID CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full">

        {/* PROFILE CARD */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <Card className="backdrop-blur-xl bg-white/70 dark:bg-black/30 shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle>👤 Profile</CardTitle>
              <CardDescription>Your Webkiosk info</CardDescription>
            </CardHeader>

            <CardContent className="space-y-2">
              <p><strong>Roll:</strong> {user.enrollmentno}</p>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Institute:</strong> {user.instituteid}</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* GitHub Analysis */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <Card className="backdrop-blur-xl bg-white/70 dark:bg-black/30 shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle>🐙 GitHub Analysis</CardTitle>
              <CardDescription>Analyze repos & score contributions</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => nav("/github")}>
                Analyze GitHub
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Skills Upload */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <Card className="backdrop-blur-xl bg-white/70 dark:bg-black/30 shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle>📝 Skills</CardTitle>
              <CardDescription>Upload or update your skill matrix</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => nav("/skills")}>
                Upload Skills
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Team Assignment */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <Card className="backdrop-blur-xl bg-white/70 dark:bg-black/30 shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle>🧩 Team Assignment</CardTitle>
              <CardDescription>Find your ideal hackathon team</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => nav("/team")}>
                Assign Team
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Candidate Score */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <Card className="backdrop-blur-xl bg-white/70 dark:bg-black/30 shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle>📊 Candidate Score</CardTitle>
              <CardDescription>AI score of your profile</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => nav("/score")}>
                View Score
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* LOGOUT */}
        <motion.div whileHover={{ scale: 1.03 }}>
          <Card className="backdrop-blur-xl bg-white/70 dark:bg-black/30 shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle>🚪 Logout</CardTitle>
              <CardDescription>End your session</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => {
                  localStorage.removeItem("jiit_session");
                  nav("/");
                }}
              >
                Logout
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
