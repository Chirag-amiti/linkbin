import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext.jsx';
import { mapApiValidationDetails } from '../utils/validation.js';

const Register = () => {
  const { isAuthenticated, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    setFieldErrors((current) => ({ ...current, [event.target.name]: '' }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setFieldErrors({});

    const nextErrors = {};

    if (form.name.trim().length < 2) nextErrors.name = 'Name must be at least 2 characters.';
    if (form.password.length < 8) nextErrors.password = 'Password must be at least 8 characters.';

    if (Object.keys(nextErrors).length) {
      setFieldErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
      setFieldErrors(mapApiValidationDetails(err.details));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="page narrow">
      <form className="panel form" onSubmit={handleSubmit}>
        <h1>Register</h1>
        {error && <p className="alert">{error}</p>}
        <label>
          <span className="field-label">Name <span className="required">*</span></span>
          <input name="name" minLength={2} value={form.name} onChange={handleChange} required />
          {fieldErrors.name && <span className="field-error">{fieldErrors.name}</span>}
        </label>
        <label>
          <span className="field-label">Email <span className="required">*</span></span>
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
          {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
        </label>
        <label>
          <span className="field-label">Password <span className="required">*</span></span>
          <input name="password" type="password" minLength={8} value={form.password} onChange={handleChange} required />
          {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
        </label>
        <button className="button primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create account'}
        </button>
        <p className="muted">Already have an account? <Link to="/login">Login</Link></p>
      </form>
    </main>
  );
};

export default Register;
