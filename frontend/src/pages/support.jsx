import { useState, useEffect, useRef } from "react";

const SYSTEM_PROMPT = `You are a helpful support assistant for CarField, a premium car showroom web application built on the MERN stack.

You help users with:
- Browsing and filtering cars (by brand, price, fuel type, body type, transmission)
- Adding cars to wishlist or cart
- Placing and tracking orders
- Account management (login, register, profile editing, password change)
- Admin features (adding, editing, soft-deleting cars; managing all orders)
- Subscription plans (Free, Pro, Premium)

Key facts about CarField:
- Users must be logged in to access wishlist, cart, orders, and profile
- Orders go through a checkout modal where users enter shipping details
- Admin users can manage the car inventory and update order statuses (pending → confirmed → delivered → cancelled)
- Phone numbers must be 10 digits; pincodes must be 6 digits
- Passwords must be at least 6 characters on registration, 8 on profile update

Keep responses concise, friendly, and specific to CarField. If something is outside CarField's scope, say so briefly. Never make up features that don't exist.`;

function Support() {
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi! I'm the ShowRoom support assistant. Ask me about cars, wishlist, cart, orders, or your account." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;

    const userMessage = { role: "user", text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      // Convert our { role: "bot"/"user", text } format to Anthropic API format
      const apiMessages = updatedMessages
        .filter((m) => m.role === "user" || m.role === "bot")
        .map((m) => ({
          role: m.role === "bot" ? "assistant" : "user",
          content: m.text,
        }));

        const response = await fetch(`${import.meta.env.VITE_API_URL}/chat`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
              system: SYSTEM_PROMPT,
              messages: apiMessages,
          }),
      });

      const data = await response.json();
      const replyText =
        data?.content?.[0]?.text ||
        "Sorry, I couldn't get a response. Please try again.";

      setMessages((prev) => [...prev, { role: "bot", text: replyText }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Something went wrong. Please try again shortly." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="support-wrapper">
      <div className="support-header">
        <div className="support-avatar">🚗</div>
        <div className="support-header-info">
          <p className="support-title">ShowRoom Support</p>
          <span className="support-status">Online</span>
        </div>
      </div>

      <div className="support-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`msg-row ${msg.role === "user" ? "msg-user" : "msg-bot"}`}>
            {msg.role === "bot" && <div className="bot-icon">🤖</div>}
            <div className={`bubble ${msg.role}`}>{msg.text}</div>
          </div>
        ))}
        {loading && (
          <div className="msg-row msg-bot">
            <div className="bot-icon">🤖</div>
            <div className="bubble bot" style={{ color: "#888", fontStyle: "italic" }}>Typing...</div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="support-input-area">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your question..."
          rows={1}
          disabled={loading}
        />
        <button onClick={handleSend} className="send-btn" disabled={loading}>Send</button>
      </div>
    </div>
  );
}

export default Support;