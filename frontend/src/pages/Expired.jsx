import { Link } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';

const Expired = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type');
  const label = type === 'paste' ? 'paste' : 'short link';

  return (
    <main className="page narrow">
      <section className="panel">
        <h1>Expired</h1>
        <p className="muted">This {label} is no longer available.</p>
        <Link className="button primary" to="/">Go home</Link>
      </section>
    </main>
  );
};

export default Expired;
