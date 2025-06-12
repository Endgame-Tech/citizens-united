import { useState } from 'react';
import TextInput from '../../../components/inputs/TextInput';
import Toast from '../../../components/Toast';
import { registerUser, loginUser } from '../../../services/authService';
import { Eye, EyeOff } from 'lucide-react';

export default function SupportAndRegisterModal({ code, onClose, onSupportSuccess }: { code: string, onClose: () => void, onSupportSuccess: () => void }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });
  const [stage, setStage] = useState<'register' | 'verify' | 'success' | 'login'>('register');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm({ ...loginForm, [name]: value });
  };

  // Registration step
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerUser({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
      // Store cause code in localStorage for post-login survey
      localStorage.setItem('support-cause-code', code);
      setStage('verify');
    } catch (err: any) {
      setToast({ message: err?.response?.data?.message || 'Registration failed. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Login step
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginUser({
        email: loginForm.email,
        password: loginForm.password,
      });
      localStorage.setItem('support-cause-code', code);
      setToast({ message: 'Login successful', type: 'success' });
      setTimeout(() => {
        window.location.reload();
      }, 800);
    } catch (err: any) {
      setToast({ message: err?.response?.data?.message || 'Login failed. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // --- UI ---
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center">Support this Cause</h2>
        {stage === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            <TextInput
              label="Full Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <TextInput
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <TextInput
              label="Phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              required
            />
            <div className="relative">
              <TextInput
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-gray-500"
                tabIndex={-1}
                onClick={() => setShowPassword((v) => !v)}
                style={{ background: 'none', border: 'none', padding: 0 }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <button
              type="submit"
              className="w-full bg-[#006837] text-white py-2 rounded-xl disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Register'}
            </button>
            <div className="text-center mt-2">
              <span className="text-sm">Already a user?{' '}
                <button
                  type="button"
                  className="text-[#006837] underline font-medium"
                  onClick={() => setStage('login')}
                >
                  Log in
                </button>
              </span>
            </div>
          </form>
        )}
        {stage === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <TextInput
              label="Email"
              name="email"
              type="email"
              value={loginForm.email}
              onChange={handleLoginChange}
              required
            />
            <div className="relative">
              <TextInput
                label="Password"
                name="password"
                type={showLoginPassword ? 'text' : 'password'}
                value={loginForm.password}
                onChange={handleLoginChange}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-gray-500"
                tabIndex={-1}
                onClick={() => setShowLoginPassword((v) => !v)}
                style={{ background: 'none', border: 'none', padding: 0 }}
              >
                {showLoginPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <button
              type="submit"
              className="w-full bg-[#006837] text-white py-2 rounded-xl disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Log in'}
            </button>
            <div className="text-center mt-2">
              <span className="text-sm">Don't have an account?{' '}
                <button
                  type="button"
                  className="text-[#006837] underline font-medium"
                  onClick={() => setStage('register')}
                >
                  Register
                </button>
              </span>
            </div>
          </form>
        )}
        {stage === 'verify' && (
          <div className="text-center space-y-4">
            <p className="text-lg">A verification link has been sent to your email. Please verify your email to continue.</p>
            <button
              className="w-full bg-primary text-white py-2 rounded"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        )}
        {stage === 'success' && (
          <div className="text-center space-y-4">
            <p className="text-lg text-green-600 font-semibold">You have supported this cause successfully!</p>
            <button
              className="w-full bg-primary text-white py-2 rounded"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        )}
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    </div>
  );
}
