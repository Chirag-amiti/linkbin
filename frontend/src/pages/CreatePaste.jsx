import { useState } from 'react';

import { createPaste } from '../api/pasteApi.js';

const languageOptions = [
  'text',
  'javascript',
  'typescript',
  'jsx',
  'json',
  'html',
  'css',
  'bash',
  'powershell',
  'python',
  'java',
  'csharp',
  'sql',
  'yaml',
  'markdown',
  'log',
];

const CreatePaste = () => {
  const [form, setForm] = useState({
    title: '',
    slug: '',
    content: '',
    language: 'text',
    visibility: 'unlisted',
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
      ...form,
      title: form.title || undefined,
      slug: form.slug || undefined,
      language: form.language || 'text',
      expiresInHours: form.expiresInHours ? Number(form.expiresInHours) : undefined,
    };

    try {
      const data = await createPaste(payload);
      setResult(data);
      setForm({ title: '', slug: '', content: '', language: 'text', visibility: 'unlisted', expiresInHours: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyLink = () => {
    if (result?.pasteLink) navigator.clipboard.writeText(result.pasteLink);
  };

  return (
    <main className="page">
      <form className="panel form paste-form" onSubmit={handleSubmit}>
        <h1>Create Paste</h1>
        {error && <p className="alert">{error}</p>}
        <div className="form-grid">
          <label>
            Title <span className="optional">(optional)</span>
            <input name="title" value={form.title} onChange={handleChange} />
          </label>
          <label>
            Custom slug <span className="optional">(optional)</span>
            <input name="slug" placeholder="jwt-error-log" value={form.slug} onChange={handleChange} />
          </label>
          <label>
            Language <span className="required">*</span>
            <select name="language" value={form.language} onChange={handleChange} required>
              {languageOptions.map((language) => (
                <option key={language} value={language}>
                  {language}
                </option>
              ))}
            </select>
          </label>
          <label>
            Visibility <span className="required">*</span>
            <select name="visibility" value={form.visibility} onChange={handleChange}>
              <option value="public">Public</option>
              <option value="unlisted">Unlisted</option>
              <option value="private">Private</option>
            </select>
          </label>
          <label>
            Expiry in hours <span className="optional">(optional)</span>
            <input name="expiresInHours" type="number" min="1" value={form.expiresInHours} onChange={handleChange} />
          </label>
        </div>
        <label>
          Content <span className="required">*</span>
          <textarea name="content" rows="16" value={form.content} onChange={handleChange} required />
        </label>
        <button className="button primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create paste'}
        </button>
        {result && (
          <div className="inline-result">
            <span>{result.pasteLink}</span>
            <button className="button secondary compact" type="button" onClick={copyLink}>Copy</button>
          </div>
        )}
      </form>
    </main>
  );
};

export default CreatePaste;
