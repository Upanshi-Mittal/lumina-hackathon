import { useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! I’m HackMate AI. How can I help you?" }
  ]);
  const [input, setInput] = useState("");

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // user message
    const newMessages = [...messages, { sender: "user", text: input }];

    // very simple bot reply
    const botReply = {
      sender: "bot",
      text: "Interesting! Tell me more…" 
    };

    setMessages([...newMessages, botReply]);
    setInput("");
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Welcome to HackMate</h1>

      {/* ✅ DASHBOARD LINK */}
      <Link to="/dashboard">
        <button style={{ marginBottom: 20 }}>Go to Dashboard</button>
      </Link>

      {/* ✅ CHATBOT SECTION */}
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "20px",
          width: "400px",
          height: "400px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            marginBottom: "10px",
            paddingRight: "10px"
          }}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                margin: "8px 0",
                textAlign: msg.sender === "user" ? "right" : "left"
              }}
            >
              <span
                style={{
                  background: msg.sender === "user" ? "#007bff" : "#eee",
                  color: msg.sender === "user" ? "white" : "black",
                  padding: "8px 12px",
                  borderRadius: "12px",
                  display: "inline-block",
                  maxWidth: "75%"
                }}
              >
                {msg.text}
              </span>
            </div>
          ))}
        </div>

        {/* ✅ INPUT BOX */}
        <form onSubmit={sendMessage} style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            placeholder="Type a message…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc"
            }}
          />

          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
}
