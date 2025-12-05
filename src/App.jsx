import React, { useState, useEffect } from 'react';
import logo from './assets/logo.png';

const _envApi = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = (typeof _envApi !== 'undefined' && _envApi !== '')
  ? _envApi
  : (typeof window !== 'undefined' && window.location && window.location.hostname.includes('localhost') ? '' : 'https://backend-chem.vercel.app');

import { AuthLayout, LoginPage, RegisterPage } from './components/AuthPages';
import { Navbar } from './components/Navbar.jsx';
import { Sidebar } from './components/Sidebar.jsx';
import { InputForm } from './components/InputForm.jsx';
import { OutputSection } from './components/OutputSection.jsx';

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
  </svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

const LandingNavbar = ({ onLoginClick, isDarkMode }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`flex items-center justify-between px-8 py-4 animate-fade-in-down sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? (isDarkMode ? 'bg-gradient-to-r from-blue-900/20 to-green-900/20 backdrop-blur-sm shadow-lg' : 'bg-white/90 backdrop-blur-sm shadow-lg border-b border-gray-200')
        : (isDarkMode ? 'bg-[#121212]' : 'bg-transparent')
    }`}>
      <div className="flex items-center gap-2 text-2xl font-bold select-none cursor-pointer">
        <div className="relative">
          <img src={logo} alt="Logo" className="w-16 h-16 object-contain" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
        </div>
        <div className="flex items-center">
          <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>CHEMIC</span>
          <span className="text-blue-500">AI</span>
        </div>
      </div>

      <div className={`hidden md:flex items-center gap-8 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        <a href="#home" className={`hover:text-blue-500 transition`}>Beranda</a>
        <a href="#about" className={`hover:text-blue-500 transition`}>Tentang Kami</a>
        <a href="#features" className={`hover:text-blue-500 transition`}>
          Fitur
        </a>
        <button onClick={onLoginClick} className="hover:text-white transition px-4 py-2 rounded bg-blue-900/20 hover:bg-blue-900/50 text-blue-300 border border-blue-900/50">Login</button>
      </div>
    </nav>
  );
};

const HeroSection = ({ onStartClick, isDarkMode }) => {
  return (
    <section id="home" className="flex flex-col lg:flex-row items-center justify-between px-8 py-16 lg:py-24 max-w-7xl mx-auto gap-12 animate-fade-in" style={{scrollMarginTop: '100px'}}>
      <div className="lg:w-1/2 space-y-6">
        <h1 className={`text-5xl lg:text-6xl font-bold tracking-tight leading-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent animate-pulse">Revolusi Kimia dengan</span> <span className="text-blue-500">AI</span>
        </h1>
        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-lg leading-relaxed text-justify`}>
          Chemic AI adalah sebuah inisiatif perintis yang menyoroti pentingnya
          mengintegrasikan kecerdasan buatan (AI) ke dalam ilmu kimia. Platform
          ini menawarkan kesempatan unik kepada mahasiswa dan peneliti untuk
          mengeksplorasi persimpangan antara analisis prediktif AI dan penemuan
          molekuler – sebuah area yang belum sepenuhnya dirangkul oleh banyak
          program sains di negara ini.
        </p>
        <div className="flex gap-4 mt-8">
          <button
            onClick={onStartClick}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold rounded-xl transition shadow-lg shadow-blue-900/30 transform hover:scale-105 flex items-center gap-2"
          >
            Mulai Sekarang
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </button>
          <button
            onClick={() => window.open('https://www.youtube.com/watch?v=7Ua-DhKWMvk', '_blank')}
            className={`px-8 py-4 border-2 font-medium rounded-xl transition flex items-center gap-2 hover:bg-fuchsia-500 hover:border-fuchsia-500 hover:text-white ${isDarkMode ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-600'}`}
          >
            <div className="relative overflow-hidden">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 hover:scale-110">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" className="transition-transform duration-500 origin-left hover:rotate-12"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" className="transition-transform duration-500 origin-left hover:-rotate-6"/>
              </svg>
            </div>
            Manual Book
          </button>
        </div>
      </div>

      <div className="lg:w-1/2 flex justify-center lg:justify-end">
        <div className={`relative w-[400px] h-[500px] bg-gradient-to-br rounded-3xl overflow-hidden border shadow-2xl transform hover:scale-105 transition duration-700 backdrop-blur-sm ${isDarkMode ? 'from-blue-900/20 to-green-900/20 border-gray-700 shadow-blue-900/20' : 'from-blue-100 to-green-100 border-white shadow-blue-200'}`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full h-full">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  <span className="text-white font-bold text-xl">AI</span>
                </div>
              </div>

              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-blue-400/50 rounded-full animate-spin" style={{animationDuration: '8s'}}>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-green-500 rounded-full shadow-lg"></div>
              </div>

              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-purple-400/30 rounded-full animate-spin" style={{animationDuration: '12s'}}>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-purple-500 rounded-full shadow-lg"></div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-4 h-4 bg-pink-500 rounded-full shadow-lg"></div>
              </div>

              <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-cyan-400 rounded-full animate-bounce opacity-70"></div>
              <div className="absolute top-3/4 right-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-bounce opacity-70" style={{animationDelay: '0.5s'}}></div>
              <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-red-400 rounded-full animate-bounce opacity-70" style={{animationDelay: '1s'}}></div>
            </div>
          </div>

          <div className={`absolute inset-0 bg-gradient-to-t via-transparent to-transparent ${isDarkMode ? 'from-black/60' : 'from-white/60'}`}></div>

          <div className="absolute bottom-8 left-8 right-8">
            <div className={`${isDarkMode ? 'bg-black/40 border-white/10 text-white' : 'bg-white/40 border-white/50 text-gray-900'} backdrop-blur-sm rounded-xl p-4 border`}>
              <p className="text-sm font-medium">Molecular Design Engine</p>
              <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>AI-powered chemical synthesis</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const AboutSection = ({ isDarkMode }) => {
  return (
    <section id="about" className={`py-20 px-8 ${isDarkMode ? 'bg-gradient-to-b from-[#121212] to-[#0a0a0a]' : 'bg-gradient-to-b from-gray-50 to-white'}`} style={{scrollMarginTop: '100px'}}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className={`text-4xl lg:text-5xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Tentang <span className="text-blue-500">ChemicAI</span>
          </h2>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-lg max-w-3xl mx-auto`}>
            Platform revolusioner yang menghubungkan kecerdasan buatan dengan ilmu kimia untuk mempercepat penemuan molekul baru
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className={`${isDarkMode ? 'bg-gradient-to-br from-blue-900/20 to-blue-800/20 border-blue-900/30' : 'bg-white border-gray-200 shadow-lg'} backdrop-blur-sm border rounded-2xl p-8 hover:scale-[1.02] transition-all duration-300 group`}>
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <h3 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Misi Kami</h3>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
              Memberdayakan peneliti dan mahasiswa dengan teknologi AI canggih untuk mengeksplorasi batas-batas penemuan molekuler dan mempercepat inovasi dalam bidang kimia.
            </p>
          </div>

          <div className={`${isDarkMode ? 'bg-gradient-to-br from-green-900/20 to-green-800/20 border-green-900/30' : 'bg-white border-gray-200 shadow-lg'} backdrop-blur-sm border rounded-2xl p-8 hover:scale-[1.02] transition-all duration-300 group`}>
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </div>
            <h3 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Visi Kami</h3>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
              Menjadi platform terdepan dalam integrasi AI dan kimia, menciptakan ekosistem dimana penemuan ilmiah menjadi lebih efisien, akurat, dan inovatif.
            </p>
          </div>

          <div className={`${isDarkMode ? 'bg-gradient-to-br from-purple-900/20 to-purple-800/20 border-purple-900/30' : 'bg-white border-gray-200 shadow-lg'} backdrop-blur-sm border rounded-2xl p-8 hover:scale-[1.02] transition-all duration-300 group`}>
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
            </div>
            <h3 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Harapan Kami</h3>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
              Telah membantu ratusan peneliti dalam mengembangkan kandidat obat baru, mengoptimalkan proses sintesis, dan mempercepat penelitian kimia secara signifikan.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-500 mb-2">500+</div>
            <div className="text-gray-400">Peneliti Aktif</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-500 mb-2">10K+</div>
            <div className="text-gray-400">Molekul Dianalisis</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-500 mb-2">95%</div>
            <div className="text-gray-400">Akurasi Prediksi</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-pink-500 mb-2">24/7</div>
            <div className="text-gray-400">Support Online</div>
          </div>
        </div>
      </div>
    </section>
  );
};

const FeaturesSection = ({ isDarkMode }) => {
  return (
    <section id="features" className={`py-20 px-8 ${isDarkMode ? 'bg-gradient-to-b from-[#0a0a0a] to-[#121212]' : 'bg-white'}`} style={{scrollMarginTop: '100px'}}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className={`text-4xl lg:text-5xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Fitur <span className="text-green-500">Unggulan</span>
          </h2>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-lg max-w-3xl mx-auto`}>
            Teknologi AI canggih yang didukung oleh algoritma machine learning terdepan untuk analisis molekuler yang akurat dan efisien
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          <div className={`${isDarkMode ? 'bg-gradient-to-br from-blue-900/10 to-blue-800/10 border-blue-900/20' : 'bg-gray-50 border-gray-200 hover:shadow-md'} backdrop-blur-sm border rounded-2xl p-8 transition-all duration-300 group`}>
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12l2 2 4-4"/>
                <path d="M21 12c.552 0 1-.448 1-1V5c0-.552-.448-1-1-1H3c-.552 0-1 .448-1 1v6c0 .552.448 1 1 1"/>
                <path d="M3 21h18"/>
              </svg>
            </div>
            <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Molecular Design</h3>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
              Desain molekul baru dengan bantuan AI yang mempertimbangkan sifat farmakokinetik, toksisitas, dan potensi terapeutik secara otomatis.
            </p>
          </div>



          <div className={`${isDarkMode ? 'bg-gradient-to-br from-purple-900/10 to-purple-800/10 border-purple-900/20' : 'bg-gray-50 border-gray-200 hover:shadow-md'} backdrop-blur-sm border rounded-2xl p-8 transition-all duration-300 group`}>
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Optimization Engine</h3>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
              Optimasi molekul secara iteratif menggunakan algoritma genetika dan CMA-ES untuk menemukan kandidat dengan sifat terbaik.
            </p>
          </div>

          <div className={`${isDarkMode ? 'bg-gradient-to-br from-pink-900/10 to-pink-800/10 border-pink-900/20' : 'bg-gray-50 border-gray-200 hover:shadow-md'} backdrop-blur-sm border rounded-2xl p-8 transition-all duration-300 group`}>
            <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
              </svg>
            </div>
            <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Toxicity Screening</h3>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
              Skrining toksisitas dini untuk mengidentifikasi potensi bahaya molekul sebelum masuk ke tahap pengembangan lebih lanjut.
            </p>
          </div>

          <div className={`${isDarkMode ? 'bg-gradient-to-br from-green-900/10 to-green-800/10 border-green-900/20' : 'bg-gray-50 border-gray-200 hover:shadow-md'} backdrop-blur-sm border rounded-2xl p-8 transition-all duration-300 group`}>
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18"/>
                <path d="M18 17V9"/>
                <path d="M13 17V5"/>
                <path d="M8 17v-3"/>
              </svg>
            </div>
            <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Multi-Dimensional Feasibility Analysis</h3>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
              Sistem kami tidak hanya mengidentifikasi molekul, tetapi bertindak sebagai konsultan bisnis dan kimia. Kami memberikan wawasan tiga dimensi: Scientific (nama IUPAC dan gugus fungsinya), Economic (estimasi modal dan kesulitan sintesis dengan SA Score), dan Industrial (aplikasi seperti Farmasi, Skincare, dll., serta risikonya).
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};



const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-20 px-8 mt-auto overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-blue-500/20 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-indigo-600/30 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-br from-cyan-400/20 to-transparent rounded-full blur-2xl"></div>
      </div>

      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="footer-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="1" fill="white"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#footer-pattern)"/>
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold flex items-center gap-2">
              <img src={logo} alt="Logo" className="w-16 h-16 object-contain" />
              <span className="text-white">CHEMIC</span>
              <span className="text-blue-500">AI</span>
          </h2>
          <div className="text-sm text-blue-100 space-y-1 opacity-80">
            <p>Platform riset kimia berbasis AI terdepan.</p>
            <p>Membantu peneliti menemukan molekul baru lebih cepat.</p>
            <p>Mengintegrasikan komputasi canggih dengan ilmu murni.</p>
          </div>
          <div className="text-sm text-blue-100 opacity-80 mt-2">
            <p>&copy; 2025 ChemicAI Labs. All rights reserved.</p>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Lokasi</h3>
          <p className="text-sm text-blue-100">
            Jl. Cempaka Putih No. 15, Cengkareng, Jakarta Utara<br/>
            Indonesia, 11730
          </p>
        </div>
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Contact Us</h3>
          <div className="text-sm text-blue-100 space-y-2">
            <p>+62 812 1212 1212</p>
            <p>support@chemicai.com</p>
          </div>
        </div>
      </div>
    </footer>
  );
};


function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [authToken, setAuthToken] = useState(
    () => localStorage.getItem("chemic_auth_token")
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    example: 'Aspirin',
    smiles: 'O=C(Oc1ccccc1C(=O)O)C',
    numMolecules: '25',
    algorithm: 'CMA-ES',
    property: 'QED',
    maximize: true,
    similarity: 0.3,
    particles: '30',
    iterations: '10'
  });
  const [history, setHistory] = useState([
  ]);
  const [outputData, setOutputData] = useState(null);
  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/chem/history`, {
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
      });
      if (!res.ok) return;
      const data = await res.json();
      setHistory(data || []);
    } catch (e) {
      console.error('History fetch error:', e);
    }
  };


  useEffect(() => {
    const savedToken = localStorage.getItem('chemic_auth_token');
    if (savedToken && currentView === 'landing') {
      setAuthToken(savedToken);
      setCurrentView('dashboard');
    }
  }, []);

  useEffect(() => {
    if (authToken) {
      localStorage.setItem('chemic_auth_token', authToken);
      fetchHistory();
    }
  }, [authToken]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFormData({
      example: 'Aspirin',
      smiles: 'O=C(Oc1ccccc1C(=O)O)C',
      numMolecules: '25',
      algorithm: 'CMA-ES',
      property: 'QED',
      maximize: true,
      similarity: 0.3,
      particles: '30',
      iterations: '10'
    });
    setOutputData(null);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  let content;
  switch (currentView) {
    case 'landing':
      content = (
        <div className={`min-h-screen ${isDarkMode ? 'bg-[#121212] text-white' : 'bg-gray-50 text-gray-900'} font-sans flex flex-col transition-colors duration-300`}>
          <LandingNavbar onLoginClick={() => setCurrentView('login')} isDarkMode={isDarkMode} />
          <HeroSection onStartClick={() => setCurrentView('login')} isDarkMode={isDarkMode} />
          <AboutSection isDarkMode={isDarkMode} />
          <FeaturesSection isDarkMode={isDarkMode} />
          <Footer />
        </div>
      );
      break;

    case 'login':
      content = (
        <div className={`min-h-screen ${isDarkMode ? 'bg-[#121212] text-white' : 'bg-gray-50 text-gray-900'} font-sans transition-colors duration-300`}>
          <LoginPage
            onLoginSuccess={() => setCurrentView('dashboard')}
            onRegisterClick={() => setCurrentView('register')}
            onBack={() => setCurrentView('landing')}
            isDarkMode={isDarkMode}
            onSetToken={setAuthToken}
          />
        </div>
      );
      break;

    case 'register':
      content = (
        <div className={`min-h-screen ${isDarkMode ? 'bg-[#121212] text-white' : 'bg-gray-50 text-gray-900'} font-sans transition-colors duration-300`}>
          <RegisterPage
            onRegisterSuccess={() => setCurrentView('dashboard')}
            onLoginClick={() => setCurrentView('login')}
            onBack={() => setCurrentView('landing')}
            isDarkMode={isDarkMode}
            onSetToken={setAuthToken}
          />
        </div>
      );
      break;

    case 'dashboard':
      content = (
        <div className={`min-h-screen ${isDarkMode ? 'bg-[#121212] text-gray-200' : 'bg-gray-50 text-gray-900'} font-sans selection:bg-green-500/30 transition-colors duration-300`}>
          <Navbar
            onMenuClick={() => setSidebarOpen(!sidebarOpen)}
            onLogoClick={() => setCurrentView('landing')}
            onLogout={async () => {
              try {
                await fetch(`${API_BASE_URL}/api/auth/logout`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
                  },
                });
              } catch (e) {
                console.warn('Logout request failed', e);
              }

              setAuthToken(null);
              setCurrentView('landing');
              setOutputData(null);
              setHistory([]);
              try { localStorage.removeItem('chemic_auth_token'); } catch {};
            }}
          />

          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            history={history}
            authToken={authToken}
            apiBaseUrl={API_BASE_URL}
            onSelect={async (generationId) => {
              try {
                setIsLoading(true);
                const res = await fetch(`${API_BASE_URL}/api/chem/history/${generationId}`, {
                  headers: {
                    'Content-Type': 'application/json',
                    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
                  },
                });
                if (!res.ok) throw new Error('Failed to fetch generation details');
                const d = await res.json();

                setFormData(prev => ({
                  ...prev,
                  smiles: d.smi_string || d.meta?.ori_smiles || prev.smiles,
                  numMolecules: d.num_molecules || prev.numMolecules,
                  algorithm: d.algorithm || d.meta?.algorithm || prev.algorithm,
                  property: d.property_to_optimize || prev.property,
                  maximize: !(d.minimize ?? !prev.maximize),
                  similarity: d.min_similarity ?? prev.similarity,
                  particles: d.particles ?? prev.particles,
                  iterations: d.iterations ?? prev.iterations,
                }));

                const processed = { ...d, timestamp: new Date().toLocaleString('en-GB') };
                setOutputData(processed);
              } catch (e) {
                console.error(e);
                alert('Gagal mengambil detail history');
              } finally {
                setIsLoading(false);
              }
            }}
          />

          <main className="max-w-7xl mx-auto p-6 lg:p-8 mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
              <InputForm
                formData={formData}
                onInputChange={handleInputChange}
                onReset={handleReset}
                setFormData={setFormData}
                authToken={authToken}
                apiBaseUrl={API_BASE_URL}
                onSetOutput={(data) => setOutputData(data)}
                onAddHistory={(entry) => setHistory(prev => [entry, ...prev])}
                setIsLoading={setIsLoading}
                fetchHistory={fetchHistory}
              />
              <OutputSection outputData={outputData} isLoading={isLoading} />
            </div>
          </main>
        </div>
      );
      break;

    default:
      content = null;
  }
  useEffect(() => {
  console.log("Run History:", history);
}, [history]);
  return (
    <>
      {content}

      <button
        onClick={toggleTheme}
        className={`fixed bottom-6 right-6 p-3 rounded-full shadow-lg transition-all duration-300 z-50 ${
          isDarkMode
            ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400 hover:text-yellow-300'
            : 'bg-white hover:bg-gray-100 text-gray-600 hover:text-gray-800'
        } border ${isDarkMode ? 'border-gray-700' : 'border-gray-300'} hover:scale-110`}
        aria-label="Toggle theme"
      >
        {isDarkMode ? <SunIcon /> : <MoonIcon />}
      </button>
    </>
  );
}

export default App;