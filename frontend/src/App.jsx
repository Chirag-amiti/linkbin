import { Route, Routes } from 'react-router-dom';

import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import CreatePaste from './pages/CreatePaste.jsx';
import CreateUrl from './pages/CreateUrl.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Expired from './pages/Expired.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import NotFound from './pages/NotFound.jsx';
import PasteAnalytics from './pages/PasteAnalytics.jsx';
import Register from './pages/Register.jsx';
import UrlAnalytics from './pages/UrlAnalytics.jsx';
import ViewPaste from './pages/ViewPaste.jsx';

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/p/:slug" element={<ViewPaste />} />
        <Route path="/expired" element={<Expired />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/urls/new" element={<CreateUrl />} />
          <Route path="/urls/:id/analytics" element={<UrlAnalytics />} />
          <Route path="/pastes/new" element={<CreatePaste />} />
          <Route path="/pastes/:id/analytics" element={<PasteAnalytics />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
