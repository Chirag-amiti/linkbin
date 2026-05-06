import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <main className="page narrow">
      <section className="panel">
        <h1>404</h1>
        <p className="muted">The page you are looking for does not exist.</p>
        <Link className="button primary" to="/">Go home</Link>
      </section>
    </main>
  );
};

export default NotFound;
