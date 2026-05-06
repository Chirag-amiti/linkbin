import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, ExternalLink, Trash2 } from 'lucide-react';

import { getDashboardSummary } from '../api/dashboardApi.js';
import { deletePaste, listPastes } from '../api/pasteApi.js';
import { deleteShortUrl, listShortUrls } from '../api/urlApi.js';
import EmptyState from '../components/EmptyState.jsx';
import StatCard from '../components/StatCard.jsx';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [urls, setUrls] = useState([]);
  const [pastes, setPastes] = useState([]);
  const [error, setError] = useState('');

  const loadDashboard = async () => {
    try {
      const [summaryData, urlData, pasteData] = await Promise.all([
        getDashboardSummary(),
        listShortUrls(),
        listPastes(),
      ]);
      setSummary(summaryData);
      setUrls(urlData);
      setPastes(pasteData);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleDeleteUrl = async (id) => {
    await deleteShortUrl(id);
    loadDashboard();
  };

  const handleDeletePaste = async (id) => {
    await deletePaste(id);
    loadDashboard();
  };

  return (
    <main className="page">
      <section className="section-header">
        <div>
          <p className="eyebrow">Workspace</p>
          <h1>Dashboard</h1>
        </div>
        <div className="header-actions">
          <Link className="button secondary" to="/urls/new">New URL</Link>
          <Link className="button primary" to="/pastes/new">New paste</Link>
        </div>
      </section>

      {error && <p className="alert">{error}</p>}

      <section className="stats-grid">
        <StatCard label="URLs" value={summary?.urls?.totalUrls} />
        <StatCard label="URL clicks" value={summary?.urls?.totalClicks} />
        <StatCard label="Pastes" value={summary?.pastes?.totalPastes} />
        <StatCard label="Paste views" value={summary?.pastes?.totalViews} />
      </section>

      <section className="data-grid">
        <div className="panel">
          <h2>Short URLs</h2>
          {urls.length ? (
            <div className="table-list">
              {urls.map((url) => (
                <article className="row-card" key={url._id}>
                  <div>
                    <strong>{url.title || url.shortCode}</strong>
                    <p>/{url.shortCode} · {url.totalClicks} clicks</p>
                  </div>
                  <div className="row-actions">
                    <a className="icon-button" href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/${url.shortCode}`} target="_blank" rel="noreferrer" aria-label="Open">
                      <ExternalLink size={17} />
                    </a>
                    <Link className="icon-button" to={`/urls/${url._id}/analytics`} aria-label="Analytics">
                      <BarChart3 size={17} />
                    </Link>
                    <button className="icon-button danger" type="button" onClick={() => handleDeleteUrl(url._id)} aria-label="Delete">
                      <Trash2 size={17} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState title="No URLs yet" text="Create your first short link to see it here." />
          )}
        </div>

        <div className="panel">
          <h2>Pastes</h2>
          {pastes.length ? (
            <div className="table-list">
              {pastes.map((paste) => (
                <article className="row-card" key={paste._id}>
                  <div>
                    <strong>{paste.title}</strong>
                    <p>/{paste.slug} · {paste.totalViews} views · {paste.visibility}</p>
                  </div>
                  <div className="row-actions">
                    <Link className="icon-button" to={`/p/${paste.slug}`} aria-label="Open">
                      <ExternalLink size={17} />
                    </Link>
                    <Link className="icon-button" to={`/pastes/${paste._id}/analytics`} aria-label="Analytics">
                      <BarChart3 size={17} />
                    </Link>
                    <button className="icon-button danger" type="button" onClick={() => handleDeletePaste(paste._id)} aria-label="Delete">
                      <Trash2 size={17} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState title="No pastes yet" text="Create a paste for code, logs, JSON, or notes." />
          )}
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
