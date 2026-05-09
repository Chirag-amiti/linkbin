import { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

import { createShortUrl } from '../api/urlApi.js';

const CreateUrl = () => {
  const [form, setForm] = useState({
    originalUrl: '',
    customAlias: '',
    title: '',
    expiresInHours: '',
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setResult(null);
    setIsSubmitting(true);

    const payload = {
      originalUrl: form.originalUrl,
      customAlias: form.customAlias || undefined,
      title: form.title || undefined,
      expiresInHours: form.expiresInHours ? Number(form.expiresInHours) : undefined,
    };

    try {
      const data = await createShortUrl(payload);
      setResult(data);
      setForm({ originalUrl: '', customAlias: '', title: '', expiresInHours: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyLink = () => {
    if (result?.shortLink) navigator.clipboard.writeText(result.shortLink);
  };

  return (
    <main className="page two-column">
      <form className="panel form" onSubmit={handleSubmit}>
        <h1>Create Short URL</h1>
        {error && <p className="alert">{error}</p>}
        <label>
          Long URL <span className="required">*</span>
          <input name="originalUrl" type="url" value={form.originalUrl} onChange={handleChange} required />
        </label>
        <label>
          Custom alias <span className="optional">(optional)</span>
          <input name="customAlias" placeholder="run-shoes" value={form.customAlias} onChange={handleChange} />
        </label>
        <label>
          Title <span className="optional">(optional)</span>
          <input name="title" placeholder="LinkedIn campaign" value={form.title} onChange={handleChange} />
        </label>
        <label>
          Expiry in hours <span className="optional">(optional)</span>
          <input name="expiresInHours" type="number" min="1" value={form.expiresInHours} onChange={handleChange} />
        </label>
        <button className="button primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create short URL'}
        </button>
      </form>

      <section className="panel result-panel">
        <h2>Result</h2>
        {result ? (
          <>
            <p className="short-link">{result.shortLink}</p>
            <div className="qr-box">
              <QRCodeCanvas value={result.shortLink} size={156} />
            </div>
            <button className="button secondary" type="button" onClick={copyLink}>Copy link</button>
          </>
        ) : (
          <p className="muted">Your generated link and QR code will appear here.</p>
        )}
      </section>
    </main>
  );
};

export default CreateUrl;
