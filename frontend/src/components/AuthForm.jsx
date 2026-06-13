import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Zap, Mail, Lock, User, ArrowRight, Sparkles } from 'lucide-react';

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        await login(form.email, form.password);
      } else {
        await register(form.username, form.email, form.password);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-accent-violet/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent-cyan/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-pink/5 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md animate-fade-in relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-violet to-accent-cyan flex items-center justify-center">
              <Zap className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Vibe</h1>
          <p className="text-dark-300 text-sm">
            {isLogin ? 'Welcome back! Sign in to continue.' : 'Join the community. Create your account.'}
          </p>
        </div>

        {/* Form card */}
        <div className="glass-card rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="animate-fade-in">
                <label className="block text-sm font-medium text-dark-200 mb-1.5">Username</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-dark-400" />
                  <input
                    type="text"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-dark-700/50 border border-dark-500/50 rounded-xl text-white placeholder-dark-400 focus:outline-none focus:border-accent-violet/50 focus:ring-1 focus:ring-accent-violet/30 transition-all"
                    placeholder="Choose a username"
                    required
                    minLength={3}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-dark-200 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-dark-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-dark-700/50 border border-dark-500/50 rounded-xl text-white placeholder-dark-400 focus:outline-none focus:border-accent-violet/50 focus:ring-1 focus:ring-accent-violet/30 transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-200 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-dark-400" />
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-dark-700/50 border border-dark-500/50 rounded-xl text-white placeholder-dark-400 focus:outline-none focus:border-accent-violet/50 focus:ring-1 focus:ring-accent-violet/30 transition-all"
                  placeholder="Enter your password"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {error && (
              <div className="px-4 py-3 bg-accent-rose/10 border border-accent-rose/20 rounded-xl text-accent-rose text-sm animate-fade-in">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl btn-gradient font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-dark-300 text-sm">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                onClick={toggleMode}
                className="text-accent-violet hover:text-accent-cyan font-medium transition-colors"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>

        {/* Bottom decoration */}
        <div className="mt-6 text-center">
          <p className="text-dark-400 text-xs flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3" />
            Built with vibes and good energy
          </p>
        </div>
      </div>
    </div>
  );
}
