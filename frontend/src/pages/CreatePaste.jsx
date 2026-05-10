import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

import { createPaste } from '../api/pasteApi.js';
import { getLanguageLabel, languageOptions } from '../utils/language.js';
import { isPositiveInteger, mapApiValidationDetails, slugPattern } from '../utils/validation.js';

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
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

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
    const normalizedSlug = form.slug.trim().toLowerCase();

    if (normalizedSlug && !slugPattern.test(normalizedSlug)) {
      nextErrors.slug = 'Slug must be 3-60 characters using lowercase letters, numbers, and hyphens.';
    }

    if (!form.content.trim()) {
      nextErrors.content = 'Paste content is required.';
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
      ...form,
      title: form.title || undefined,
      slug: normalizedSlug || undefined,
      language: form.language || 'text',
      expiresInHours: form.expiresInHours ? Number(form.expiresInHours) : undefined,
    };

    try {
      const data = await createPaste(payload);
      setResult(data);
      setForm({ title: '', slug: '', content: '', language: 'text', visibility: 'unlisted', expiresInHours: '' });
    } catch (err) {
      setError(err.message);
      setFieldErrors(mapApiValidationDetails(err.details));
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
            <span className="field-label">Title <span className="optional">(optional)</span></span>
            <input name="title" value={form.title} onChange={handleChange} />
          </label>
          <label>
            <span className="field-label">Custom slug <span className="optional">(optional)</span></span>
            <input
              name="slug"
              pattern="[a-z0-9-]{3,60}"
              placeholder="jwt-error-log"
              title="Use 3-60 lowercase letters, numbers, or hyphens."
              value={form.slug}
              onChange={handleChange}
            />
            {fieldErrors.slug && <span className="field-error">{fieldErrors.slug}</span>}
          </label>
          <div className="field">
            <span className="field-label">Language <span className="required">*</span></span>
            <div className="custom-select">
              <button
                className="custom-select-trigger"
                type="button"
                onClick={() => setIsLanguageOpen((current) => !current)}
                aria-haspopup="listbox"
                aria-expanded={isLanguageOpen}
              >
                <span>{getLanguageLabel(form.language)}</span>
                <ChevronDown size={17} />
              </button>
              {isLanguageOpen && (
                <div className="custom-select-menu" role="listbox">
                  {languageOptions.map((language) => (
                    <button
                      className={language.value === form.language ? 'selected' : ''}
                      key={language.value}
                      type="button"
                      onClick={() => {
                        setForm((current) => ({ ...current, language: language.value }));
                        setFieldErrors((current) => ({ ...current, language: '' }));
                        setIsLanguageOpen(false);
                      }}
                      role="option"
                      aria-selected={language.value === form.language}
                    >
                      {language.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <label>
            <span className="field-label">Visibility <span className="required">*</span></span>
            <select name="visibility" value={form.visibility} onChange={handleChange}>
              <option value="public">Public</option>
              <option value="unlisted">Unlisted</option>
              <option value="private">Private</option>
            </select>
          </label>
          <label>
            <span className="field-label">Expiry in hours <span className="optional">(optional)</span></span>
            <input name="expiresInHours" type="number" min="1" value={form.expiresInHours} onChange={handleChange} />
            {fieldErrors.expiresInHours && <span className="field-error">{fieldErrors.expiresInHours}</span>}
          </label>
        </div>
        <label>
          <span className="field-label">Content <span className="required">*</span></span>
          <textarea name="content" rows="16" value={form.content} onChange={handleChange} required />
          {fieldErrors.content && <span className="field-error">{fieldErrors.content}</span>}
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
