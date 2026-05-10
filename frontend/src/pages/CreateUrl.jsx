import { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

import { createShortUrl } from '../api/urlApi.js';
import { aliasPattern, isPositiveInteger, isValidUrl, mapApiValidationDetails } from '../utils/validation.js';

const CreateUrl = () => {
  const [form, setForm] = useState({
    originalUrl: '',
    customAlias: '',
    title: '',
    expiresInHours: '',
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    setFieldErrors((current) => ({ ...current, [event.target.name]: '' }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setFieldErrors({});
    setResult(null);

    const nextErrors = {};
    const normalizedAlias = form.customAlias.trim().toLowerCase();

    if (!isValidUrl(form.originalUrl.trim())) {
      nextErrors.originalUrl = 'Enter a valid http or https URL.';
    }

    if (normalizedAlias && !aliasPattern.test(normalizedAlias)) {
      nextErrors.customAlias = 'Alias must be 3-40 characters using lowercase letters, numbers, and hyphens.';
    }

    if (!isPositiveInteger(form.expiresInHours)) {
      nextErrors.expiresInHours = 'Expiry must be a positive whole number.';
    }

    if (Object.keys(nextErrors).length) {
      setFieldErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);

    const payload = {
      originalUrl: form.originalUrl.trim(),
      customAlias: normalizedAlias || undefined,
      title: form.title || undefined,
      expiresInHours: form.expiresInHours ? Number(form.expiresInHours) : undefined,
    };

    try {
      const data = await createShortUrl(payload);
      setResult(data);
      setForm({ originalUrl: '', customAlias: '', title: '', expiresInHours: '' });
    } catch (err) {
      setError(err.message);
      setFieldErrors(mapApiValidationDetails(err.details));
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
          <span className="field-label">Long URL <span className="required">*</span></span>
          <input name="originalUrl" type="url" value={form.originalUrl} onChange={handleChange} required />
          {fieldErrors.originalUrl && <span className="field-error">{fieldErrors.originalUrl}</span>}
        </label>
        <label>
          <span className="field-label">Custom alias <span className="optional">(optional)</span></span>
          <input
            name="customAlias"
            pattern="[a-z0-9-]{3,40}"
            placeholder="run-shoes"
            title="Use 3-40 lowercase letters, numbers, or hyphens."
            value={form.customAlias}
            onChange={handleChange}
          />
          {fieldErrors.customAlias && <span className="field-error">{fieldErrors.customAlias}</span>}
        </label>
        <label>
          <span className="field-label">Title <span className="optional">(optional)</span></span>
          <input name="title" placeholder="LinkedIn campaign" value={form.title} onChange={handleChange} />
        </label>
        <label>
          <span className="field-label">Expiry in hours <span className="optional">(optional)</span></span>
          <input name="expiresInHours" type="number" min="1" value={form.expiresInHours} onChange={handleChange} />
          {fieldErrors.expiresInHours && <span className="field-error">{fieldErrors.expiresInHours}</span>}
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
