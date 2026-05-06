import { Link } from 'react-router-dom';

const Expired = () => {
  return (
    <main className="page narrow">
      <section className="panel">
        <h1>Expired</h1>
        <p className="muted">This URL or paste is no longer available.</p>
        <Link className="button primary" to="/">Go home</Link>
      </section>
    </main>
  );
};

export default Expired;
