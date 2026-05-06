import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { getUrlAnalytics } from '../api/urlApi.js';
import StatCard from '../components/StatCard.jsx';

const UrlAnalytics = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getUrlAnalytics(id).then(setData).catch((err) => setError(err.message));
  }, [id]);

  if (error) return <main className="page"><p className="alert">{error}</p></main>;
  if (!data) return <main className="page"><p>Loading analytics...</p></main>;

  return (
    <main className="page">
      <section className="section-header">
        <div>
          <p className="eyebrow">URL analytics</p>
          <h1>{data.shortUrl.title || data.shortUrl.shortCode}</h1>
        </div>
      </section>
      <section className="stats-grid">
        <StatCard label="Total clicks" value={data.shortUrl.totalClicks} />
        <StatCard label="Unique clicks" value={data.shortUrl.uniqueClicks || data.analytics.uniqueVisitors} />
        <StatCard label="Last clicked" value={data.shortUrl.lastClickedAt ? new Date(data.shortUrl.lastClickedAt).toLocaleDateString() : 'Never'} />
      </section>
      <section className="data-grid">
        <div className="panel">
          <h2>Clicks by date</h2>
          <div className="mini-chart">
            {data.analytics.clicksByDate.map((item) => (
              <div key={item.date} className="bar-row">
                <span>{item.date}</span>
                <div><i style={{ width: `${Math.min(100, item.clicks * 12)}%` }} /></div>
                <strong>{item.clicks}</strong>
              </div>
            ))}
          </div>
        </div>
        <div className="panel">
          <h2>Recent clicks</h2>
          <div className="table-list">
            {data.analytics.recentEvents.map((event) => (
              <article className="row-card" key={event._id}>
                <div>
                  <strong>{event.browser} · {event.device}</strong>
                  <p>{event.city}, {event.country} · {event.referrer}</p>
                </div>
                <span className="muted">{new Date(event.clickedAt).toLocaleString()}</span>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default UrlAnalytics;
