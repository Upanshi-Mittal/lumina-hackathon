import { useNavigate } from "react-router-dom";

const Details = () => {
    const navigate = useNavigate();

    const detailsSave = (e) => {
        e.preventDefault();

        // ✅ Collect form data
        const userDetails = {
            personalEmail: e.target.personalEmail.value,
            phoneNumber: e.target.phoneNumber.value,
            githubProfile: e.target.githubProfile.value,
            linkedinProfile: e.target.linkedinProfile.value,
            skills: e.target.skills.value,
            portfolio: e.target.portfolio.value,
        };

        // ✅ Save details to localStorage
        localStorage.setItem("userDetails", JSON.stringify(userDetails));

        // ✅ Create prototype session for Dashboard
        localStorage.setItem(
            "jiit_session",
            JSON.stringify({
                name: userDetails.personalEmail.split("@")[0],  // username from email
                enrollmentno: "Prototype123",
                instituteid: "JIIT",
            })
        );

        // ✅ Redirect to home page
        navigate("/home");
    };

    return (
        <div style={{ padding: 40 }}>
            <form onSubmit={detailsSave}>
                <h1>Details Page</h1>

                <label>
                    Personal Email:
                    <input type="email" name="personalEmail" required />
                </label>
                <br /><br />

                <label>
                    Phone Number:
                    <input type="tel" name="phoneNumber" required />
                </label>
                <br /><br />

                <label>
                    GitHub Profile:
                    <input type="url" name="githubProfile" required />
                </label>
                <br /><br />

                <label>
                    LinkedIn Profile:
                    <input type="url" name="linkedinProfile" required />
                </label>
                <br /><br />

                <label>
                    Skills:
                    <input type="text" name="skills" required />
                </label>
                <br /><br />

                <label>
                    Portfolio:
                    <input type="url" name="portfolio" required />
                </label>
                <br /><br />

                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default Details;
