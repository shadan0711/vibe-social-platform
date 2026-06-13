import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import AuthForm from './components/AuthForm.jsx';
import Feed from './components/Feed.jsx';
import Profile from './components/Profile.jsx';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent-violet/30 border-t-accent-violet rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900">
      {user && <Navbar />}
      <main className={user ? 'pt-20' : ''}>
        <Routes>
          <Route
            path="/"
            element={user ? <Feed /> : <Navigate to="/auth" replace />}
          />
          <Route
            path="/auth"
            element={!user ? <AuthForm /> : <Navigate to="/" replace />}
          />
          <Route
            path="/profile/:id"
            element={user ? <Profile /> : <Navigate to="/auth" replace />}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
