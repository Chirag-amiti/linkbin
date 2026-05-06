import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { getPasteAnalytics } from '../api/pasteApi.js';
import StatCard from '../components/StatCard.jsx';

const PasteAnalytics = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getPasteAnalytics(id).then(setData).catch((err) => setError(err.message));
  }, [id]);

  if (error) return <main className="page"><p className="alert">{error}</p></main>;
  if (!data) return <main className="page"><p>Loading analytics...</p></main>;

  return (
    <main className="page">
      <section className="section-header">
        <div>
          <p className="eyebrow">Paste analytics</p>
          <h1>{data.paste.title}</h1>
        </div>
      </section>
      <section className="stats-grid">
        <StatCard label="Total views" value={data.paste.totalViews} />
        <StatCard label="Unique views" value={data.paste.uniqueViews || data.analytics.uniqueVisitors} />
        <StatCard label="Last viewed" value={data.paste.lastViewedAt ? new Date(data.paste.lastViewedAt).toLocaleDateString() : 'Never'} />
      </section>
      <section className="data-grid">
        <div className="panel">
          <h2>Views by date</h2>
          <div className="mini-chart">
            {data.analytics.viewsByDate.map((item) => (
              <div key={item.date} className="bar-row">
                <span>{item.date}</span>
                <div><i style={{ width: `${Math.min(100, item.views * 12)}%` }} /></div>
                <strong>{item.views}</strong>
              </div>
            ))}
          </div>
        </div>
        <div className="panel">
          <h2>Recent views</h2>
          <div className="table-list">
            {data.analytics.recentEvents.map((event) => (
              <article className="row-card" key={event._id}>
                <div>
                  <strong>{event.browser} · {event.device}</strong>
                  <p>{event.os}</p>
                </div>
                <span className="muted">{new Date(event.viewedAt).toLocaleString()}</span>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default PasteAnalytics;
