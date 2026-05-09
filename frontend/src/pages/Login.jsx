import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext.jsx';

const Login = () => {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="page narrow">
      <form className="panel form" onSubmit={handleSubmit}>
        <h1>Login</h1>
        {error && <p className="alert">{error}</p>}
        <label>
          <span className="field-label">Email <span className="required">*</span></span>
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          <span className="field-label">Password <span className="required">*</span></span>
          <input name="password" type="password" value={form.password} onChange={handleChange} required />
        </label>
        <button className="button primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
        <p className="muted">New here? <Link to="/register">Create an account</Link></p>
      </form>
    </main>
  );
};

export default Login;
