import React, { useState, useEffect } from 'react';
import logo from '../assets/logo.png';
import { ArrowLeftIcon } from './Icons';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://backend-chem.vercel.app';

export const AuthLayout = ({ children, onBack, isDarkMode }) => {
  const [particlesLoaded, setParticlesLoaded] = useState(false);

  useEffect(() => {
    const initParticles = async () => {
      try {
        await loadSlim(window.tsParticles);
      } catch (e) {
      }
      setParticlesLoaded(true);
    };

    initParticles();
  }, []);

  const particlesOptions = {
    background: { color: { value: 'transparent' } },
    fpsLimit: 120,
    interactivity: { events: { onClick: { enable: true, mode: 'push' }, onHover: { enable: true, mode: 'repulse' }, resize: true }, modes: { push: { quantity: 4 }, repulse: { distance: 200, duration: 0.4 } } },
    particles: { color: { value: isDarkMode ? ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'] : ['#2563eb', '#059669', '#7c3aed', '#d97706', '#dc2626'] }, links: { color: isDarkMode ? '#374151' : '#d1d5db', distance: 150, enable: true, opacity: 0.3, width: 1 }, move: { direction: 'none', enable: true, outModes: { default: 'bounce' }, random: false, speed: 2, straight: false }, number: { density: { enable: true, area: 800 }, value: 80 }, opacity: { value: { min: 0.1, max: 0.5 }, animation: { enable: true, speed: 1, minimumValue: 0.1, sync: false } }, shape: { type: ['circle', 'triangle', 'polygon'], polygon: { sides: 6 } }, size: { value: { min: 1, max: 4 }, animation: { enable: true, speed: 2, minimumValue: 1, sync: false } } },
    detectRetina: true,
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden ${isDarkMode ? 'bg-[#121212]' : 'bg-gray-50'}`}>
      {particlesLoaded && typeof Particles !== 'undefined' && (
        <Particles id="tsparticles" options={particlesOptions} className="absolute inset-0" />
      )}

      <div className="w-full max-w-md z-10 animate-fade-in-up">
        <button
          onClick={onBack}
          className={`mb-6 flex items-center transition text-sm group ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
        >
          <span className={`p-2 rounded-full group-hover:bg-gray-800 transition mr-2 ${isDarkMode ? '' : 'group-hover:bg-gray-200'}`}>
              <ArrowLeftIcon />
          </span>
          Kembali ke Beranda
        </button>

        <div className={`${isDarkMode ? 'bg-[#161616] border-gray-800 shadow-black/50' : 'bg-white border-gray-300 shadow-gray-200/50'} border rounded-2xl p-8 shadow-2xl relative overflow-hidden transition-colors duration-300 backdrop-blur-sm`}>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-green-500"></div>
          {children}
        </div>
      </div>
    </div>
  );
};

export const LoginPage = ({ onLoginSuccess, onRegisterClick, onBack, isDarkMode, onSetToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!email || !password) return;
    setLoading(true);
    setError('');
    try {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const response = await fetch(`${API_BASE_URL}/api/auth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData,
      });
      if (!response.ok) throw new Error('Login gagal. Email atau password salah.');
      const data = await response.json();
      onSetToken(data.access_token);
      onLoginSuccess();
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout onBack={onBack} isDarkMode={isDarkMode}>
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <img src={logo} alt="ChemicAI Logo" className="w-16 h-16 object-contain" />
        </div>
        <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Selamat Datang Kembali</h2>
        <p className="text-gray-400 text-sm">Masuk untuk melanjutkan penelitian Anda</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-red-900/30 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm">{error}</div>
        )}
        <div>
          <label className={`block text-xs font-bold uppercase mb-2 tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-700'}`}>Alamat Gmail</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="peneliti@gmail.com" className={`w-full ${isDarkMode ? 'bg-[#1E1E1E] border-gray-700 text-gray-200 placeholder-gray-600' : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500'} border rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition`} />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wider">Password</label>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={`w-full ${isDarkMode ? 'bg-[#1E1E1E] border-gray-700 text-gray-200 placeholder-gray-600' : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500'} border rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition`} />
        </div>
        <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold rounded-lg transition shadow-lg shadow-blue-900/30 transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">{loading ? 'Sedang Masuk...' : 'Masuk'}</button>
      </form>

      <div className="mt-6 text-center text-sm">
        <span className={`${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>Belum punya akun? </span>
        <button onClick={onRegisterClick} className={`font-medium transition ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>Daftar Sekarang</button>
      </div>
    </AuthLayout>
  );
};

export const RegisterPage = ({ onRegisterSuccess, onLoginClick, onBack, isDarkMode, onSetToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!email || !password || !username) return;
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || 'Registrasi gagal');
      }
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);
      const loginRes = await fetch(`${API_BASE_URL}/api/auth/token`, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: formData });
      if (loginRes.ok) {
        const loginData = await loginRes.json();
        onSetToken(loginData.access_token);
      }
      onRegisterSuccess();
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat registrasi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout onBack={onBack} isDarkMode={isDarkMode}>
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <img src={logo} alt="ChemicAI Logo" className="w-16 h-16 object-contain" />
        </div>
        <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Buat Akun Baru</h2>
        <p className="text-gray-400 text-sm">Bergabunglah dengan revolusi kimia AI</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <div className="bg-red-900/30 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm">{error}</div>}
        <div>
          <label className={`block text-xs font-bold uppercase mb-2 tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-700'}`}>Username</label>
          <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} placeholder="nama_pengguna" className={`w-full ${isDarkMode ? 'bg-[#1E1E1E] border-gray-700 text-gray-200 placeholder-gray-600' : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500'} border rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition`} />
        </div>
        <div>
          <label className={`block text-xs font-bold uppercase mb-2 tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-700'}`}>Alamat Gmail</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nama@gmail.com" className={`w-full ${isDarkMode ? 'bg-[#1E1E1E] border-gray-700 text-gray-200 placeholder-gray-600' : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500'} border rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition`} />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wider">Password</label>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Buat password kuat" className={`w-full ${isDarkMode ? 'bg-[#1E1E1E] border-gray-700 text-gray-200 placeholder-gray-600' : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500'} border rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition`} />
        </div>

        <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-bold rounded-lg transition shadow-lg shadow-green-900/30 transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">{loading ? 'Sedang Mendaftar...' : 'Daftar Akun'}</button>
      </form>

      <div className="mt-6 text-center text-sm">
        <span className={`${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>Sudah punya akun? </span>
        <button onClick={onLoginClick} className={`font-medium transition ${isDarkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-700'}`}>Login disini</button>
      </div>
    </AuthLayout>
  );
};

export default {
  AuthLayout,
  LoginPage,
  RegisterPage,
};
