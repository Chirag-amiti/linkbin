import { Link } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { FileText, Link2, ShieldCheck, Zap } from 'lucide-react';

import { useAuth } from '../context/AuthContext.jsx';

const Home = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <main className="page">
      <section className="hero">
        <div>
          <p className="eyebrow">URL shortener + paste sharing</p>
          <h1>LinkBin</h1>
          <p className="hero-copy">
            Create clean links, share readable code snippets, track engagement, and manage everything from one focused dashboard.
          </p>
          <div className="hero-actions">
            <Link className="button primary" to="/register">Start building</Link>
            <Link className="button secondary" to="/login">Login</Link>
          </div>
        </div>
        <div className="feature-grid">
          <article>
            <Link2 />
            <h3>Short URLs</h3>
            <p>Random codes, custom aliases, expiry, QR-friendly sharing, and redirect analytics.</p>
          </article>
          <article>
            <FileText />
            <h3>Pastes</h3>
            <p>Share code, logs, JSON, notes, and API responses with clean public links.</p>
          </article>
          <article>
            <Zap />
            <h3>Redis</h3>
            <p>Cache-aside redirect lookups and rate limiting counters built for real backend discussion.</p>
          </article>
          <article>
            <ShieldCheck />
            <h3>Auth</h3>
            <p>JWT auth, protected dashboard routes, password hashing, validation, and safe access control.</p>
          </article>
        </div>
      </section>
    </main>
  );
};

export default Home;
