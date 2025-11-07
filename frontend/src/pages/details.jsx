import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { X } from "lucide-react";
import "./login.css";

const ALL_SKILLS = [
  "Frontend Development", "Backend Development", "Fullstack Development",
  "Data Science", "Machine Learning", "DevOps", "Mobile Development",
  "UI/UX Design", "Cybersecurity", "Cloud Computing", "Blockchain",
  "Game Development", "Embedded Systems", "AR/VR Development", "IoT"
];

export default function Details() {
  const navigate = useNavigate();

  const [skillsModal, setSkillsModal] = useState(false);
  const [skills, setSkills] = useState([]);

  const toggleSkill = (skill) => {
    if (skills.includes(skill)) {
      setSkills(skills.filter((s) => s !== skill));
    } else {
      setSkills([...skills, skill]);
    }
  };

  const detailsSave = (e) => {
    e.preventDefault();

    const userDetails = {
      personalEmail: e.target.personalEmail.value,
      phoneNumber: e.target.phoneNumber.value,
      githubProfile: e.target.githubProfile.value,
      linkedinProfile: e.target.linkedinProfile.value,
      skills: skills.join(","),
      portfolio: e.target.portfolio.value,
    };

    localStorage.setItem("userDetails", JSON.stringify(userDetails));
    localStorage.setItem(
      "jiit_session",
      JSON.stringify({
        name: userDetails.personalEmail.split("@")[0],
        enrollmentno: "Prototype123",
        instituteid: "JIIT",
      })
    );

    navigate("/home");
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Your Details</h1>

      <form className="login-card" onSubmit={detailsSave}>

        <input type="email" name="personalEmail" placeholder="Personal Email" required className="details-input" />
        <input type="tel" name="phoneNumber" placeholder="Phone Number" required className="details-input" />
        <input type="url" name="githubProfile" placeholder="GitHub Profile URL" required className="details-input" />
        <input type="linkedin" name="linkedinProfile" placeholder="LinkedIn Profile URL" required className="details-input" />

        <div
          className="details-input flex flex-wrap gap-2 cursor-pointer bg-black"
          onClick={() => setSkillsModal(true)}
        >
          {skills.length > 0 ? (
            skills.map((skill) => (
              <span key={skill} className="tag-skill">
                {skill}
                <X
                  size={14}
                  className="ml-1 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSkill(skill);
                  }}
                />
              </span>
            ))
          ) : (
            <span className="text-gray-500">Select Skills</span>
          )}
        </div>

        <input type="hidden" name="skills" value={skills.join(",")} />

        <input type="url" name="portfolio" placeholder="Portfolio URL" required className="details-input" />

        <button className="btn" type="submit">
          Save & Continue
        </button>
      </form>

      {skillsModal && (
        <div
          className="skills-overlay"
          onClick={() => setSkillsModal(false)} // ✅ close on outside click
        >
          <div
            className="skills-modal"
            onClick={(e) => e.stopPropagation()} // ✅ prevent closing when clicking inside modal
          >
            <h2 className="modal-title">Select Your Skills</h2>

            <div className="skills-list">
              {ALL_SKILLS.map((skill) => (
                <div
                  key={skill}
                  className={`skill-item ${skills.includes(skill) ? "selected-skill" : ""}`}
                  onClick={() => toggleSkill(skill)}
                >
                  {skill}
                </div>
              ))}
            </div>

            <button className="btn mt-4" onClick={() => setSkillsModal(false)}>
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
