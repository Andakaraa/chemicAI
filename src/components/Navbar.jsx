import React from 'react';
import logo from '../assets/logo.png';
import { MenuIcon } from './Icons';

export const Navbar = ({ onMenuClick, onLogoClick, onLogout }) => {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-[#0a0a0a] border-b border-gray-800 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="text-gray-300 hover:text-white transition">
          <MenuIcon />
        </button>
        <button onClick={onLogoClick} className="flex items-center gap-2 text-xl font-bold select-none hover:opacity-80 transition">
          <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
          <div className="flex items-center">
            <span className="text-white">CHEMIC</span>
            <span className="text-blue-500">AI</span>
          </div>
        </button>
      </div>
      <div className="flex items-center gap-4">
         <span className="text-sm text-gray-400 hidden sm:block">Welcome, Researcher</span>
         <button onClick={onLogout} className="px-4 py-2 text-sm font-medium bg-[#1f2937] hover:bg-red-900/50 hover:text-red-200 rounded text-white transition border border-gray-700">
           Logout
         </button>
      </div>
    </nav>
  );
};

export default Navbar;