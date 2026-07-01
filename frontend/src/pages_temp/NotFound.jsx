import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="notfound-container">
      <h1 className="notfound-code">404</h1>
      <h2 className="notfound-title">Looks like this car took a wrong turn</h2>
      <p className="notfound-message">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="notfound-btn">
        Back to Showroom
      </Link>
    </div>
  );
}

export default NotFound;