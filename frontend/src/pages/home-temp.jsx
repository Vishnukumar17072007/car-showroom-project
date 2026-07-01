import { Link } from "react-router-dom";

const quickStats = [
  { label: "Premium Brands", value: "25+" },
  { label: "Available Vehicles", value: "500+" },
  { label: "Customer Rating", value: "4.8/5" },
];

const highlights = [
  {
    title: "Curated Inventory",
    description:
      "From daily city hatchbacks to luxury SUVs, every model is handpicked for quality and value.",
  },
  {
    title: "Smart Filtering",
    description:
      "Find the right car in seconds using price, body type, transmission, and fuel preferences.",
  },
  {
    title: "Easy Checkout Flow",
    description:
      "Wishlist, cart, and order experience are designed to keep your buying journey simple.",
  },
];

const categories = [
  { title: "SUV Collection", sub: "Adventure-ready premium utility lineup" },
  { title: "City Hatchbacks", sub: "Compact, fuel efficient, and practical" },
  { title: "Family Sedans", sub: "Comfort-focused drives for every day" },
];

function Home() {
  return (
    <main className="landing-page">
      <section className="landing-hero">
        <p className="landing-kicker">AUTOSALES PREMIUM</p>
        <h1>Discover your next car with confidence.</h1>
        <p className="landing-subtitle">
          A premium dark-themed showroom experience tailored for modern car
          discovery, comparison, and checkout.
        </p>
        <div className="landing-cta-row">
          <Link to="/vehicles" className="landing-btn-primary">
            Explore Vehicles
          </Link>
          <Link to="/support" className="landing-btn-secondary">
            Talk to Support
          </Link>
        </div>
      </section>

      <section className="landing-stats-grid">
        {quickStats.map((item) => (
          <article key={item.label} className="landing-stat-card">
            <p>{item.label}</p>
            <h2>{item.value}</h2>
          </article>
        ))}
      </section>

      <section className="landing-section-grid">
        <div className="landing-feature-column">
          <h3>Why AutoSales</h3>
          {highlights.map((item) => (
            <article key={item.title} className="landing-feature-card">
              <h4>{item.title}</h4>
              <p>{item.description}</p>
            </article>
          ))}
        </div>

        <div className="landing-feature-column">
          <h3>Shop by Category</h3>
          {categories.map((item) => (
            <article key={item.title} className="landing-category-card">
              <h4>{item.title}</h4>
              <p>{item.sub}</p>
            </article>
          ))}
          <Link to="/vehicles" className="landing-link">
            View full vehicle catalog
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Home;