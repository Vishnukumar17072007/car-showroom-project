import { useState, useEffect, useRef } from "react";

const faqs = [
  {
    keywords: ["browse", "view cars", "see cars", "find car", "search car", "list"],
    answer: "You can browse all available cars on the Cars page. Use the filters to narrow down by brand, price, fuel type, and more."
  },
  {
    keywords: ["filter", "sort", "brand", "price", "fuel"],
    answer: "Use the filter panel on the Cars page to filter by brand, price range, or fuel type. Results update instantly as you apply filters."
  },
  {
    keywords: ["wishlist", "favourite", "favorite", "save car", "saved"],
    answer: "Click the heart icon on any car card to add it to your Wishlist. You can view all saved cars under the Wishlist section."
  },
  {
    keywords: ["cart", "add to cart", "basket", "buy"],
    answer: "Click 'Add to Cart' on a car detail page. Go to your Cart to review items before placing an order."
  },
  {
    keywords: ["order", "purchase", "bought", "checkout", "placed"],
    answer: "After reviewing your cart, click 'Place Order' to confirm. You can view all past and current orders in the Orders section."
  },
  {
    keywords: ["login", "sign in", "log in", "signin"],
    answer: "Click the Login button on the navbar. Enter your registered email and password to sign in."
  },
  {
    keywords: ["register", "sign up", "signup", "create account", "new account"],
    answer: "Click 'Register' on the navbar. Fill in your name, email, and password to create a new account."
  },
  {
    keywords: ["logout", "log out", "sign out"],
    answer: "Click your profile icon on the navbar and select 'Logout'. Your session will be cleared securely."
  },
  {
    keywords: ["password", "forgot", "reset"],
    answer: "Password reset must be done by contacting the admin. A self-service reset feature is coming soon."
  },
  {
    keywords: ["admin", "manage cars", "add car", "delete car", "edit car"],
    answer: "Admin users can manage the car inventory from the Admin Panel. Only admin accounts can add, edit, or delete cars."
  },
  {
    keywords: ["account", "profile", "my details", "my info"],
    answer: "Visit your Profile page to see your account details including your name, email, and role."
  },
  {
    keywords: ["contact", "support", "help", "issue", "problem"],
    answer: "For further help, reach out to us at support@showroom.com. We typically respond within 24 hours."
  },
  {
    keywords: ["payment", "pay", "credit card", "debit"],
    answer: "Payment integration is coming soon. Orders are currently placed as requests and confirmed by our team."
  },
  {
    keywords: ["delivery", "shipping", "test drive"],
    answer: "Once your order is confirmed, our team will contact you to schedule a test drive or arrange delivery."
  },
  {
    keywords: ["hello", "hi", "hey", "greetings"],
    answer: "Hello! Welcome to ShowRoom support. How can I help you today?"
  },
  {
    keywords: ["thank", "thanks", "thankyou"],
    answer: "You're welcome! Feel free to ask if you have any more questions."
  }
];

function findAnswer(input) {
  const lower = input.toLowerCase();

  for (let i = 0; i < faqs.length; i++) {
    const faq = faqs[i];
    for (let j = 0; j < faq.keywords.length; j++) {
      if (lower.includes(faq.keywords[j])) {
        return faq.answer;
      }
    }
  }

  return "Sorry, I didn't catch that. Try asking about cars, wishlist, cart, orders, login, or admin features.";
}

function Support() {
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi! I'm the ShowRoom support assistant. Ask me about cars, wishlist, cart, orders, or your account." }
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend() {
    const text = input.trim();
    if (!text) return;

    const userMessage = { role: "user", text };
    const botMessage = { role: "bot", text: findAnswer(text) };

    setMessages((prev) => [...prev, userMessage, botMessage]);
    setInput("");
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
            {msg.role === "bot" && <div className="bot-icon">🚗</div>}
            <div className={`bubble ${msg.role}`}>{msg.text}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="support-input-area">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your question..."
          rows={1}
        />
        <button onClick={handleSend} className="send-btn">Send</button>
      </div>
    </div>
  );
}

export default Support;