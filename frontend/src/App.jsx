import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Projects from './pages/Projects.jsx';
import ProjectDetail from './pages/ProjectDetail.jsx';
import Navbar from './components/Navbar.jsx';

const PrivateRoute = ({ children }) => {
  return localStorage.getItem('token')
    ? children
    : <Navigate to="/login" />;
};

const Layout = ({ children }) => (
  <>
    <Navbar />
    <div className="min-h-screen bg-gray-50 pt-16">
      {children}
    </div>
  </>
);

export default function App() {
  return (
    <BrowserRouter>
      <Toaster richColors position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Layout><Dashboard /></Layout>
          </PrivateRoute>
        } />
        <Route path="/projects" element={
          <PrivateRoute>
            <Layout><Projects /></Layout>
          </PrivateRoute>
        } />
        <Route path="/projects/:id" element={
          <PrivateRoute>
            <Layout><ProjectDetail /></Layout>
          </PrivateRoute>
        } />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}