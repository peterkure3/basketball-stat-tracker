import React, { useState } from 'react';
import { Link } from 'next/link';
import { motion } from 'framer-motion';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-[#2A2A2A] shadow-lg">
      <div className="max-w-6xl px-4 mx-auto">
        <div className="flex justify-between">
          <div className="flex space-x-7">
            <div>
              <Link to="/" className="flex items-center px-2 py-4">
                <span className="text-lg font-semibold text-white">BasketballStats</span>
              </Link>
            </div>
          </div>
          <div className="items-center hidden space-x-1 md:flex">
            <Link to="/" className="px-2 py-4 text-white transition duration-300 hover:text-gray-300">Home</Link>
            <Link to="/players" className="px-2 py-4 text-white transition duration-300 hover:text-gray-300">Players</Link>
            <Link to="/teams" className="px-2 py-4 text-white transition duration-300 hover:text-gray-300">Teams</Link>
            <Link to="/leaderboard" className="px-2 py-4 text-white transition duration-300 hover:text-gray-300">Leaderboard</Link>
          </div>
          <div className="flex items-center md:hidden">
            <button className="outline-none mobile-menu-button" onClick={toggleMenu}>
              <svg
                className="w-6 h-6 text-white hover:text-gray-300"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <motion.div 
          className="mobile-menu md:hidden"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ul className="">
            <li><Link to="/" className="block text-sm px-2 py-4 text-white hover:bg-[#3A3A3A] transition duration-300">Home</Link></li>
            <li><Link to="/players" className="block text-sm px-2 py-4 text-white hover:bg-[#3A3A3A] transition duration-300">Players</Link></li>
            <li><Link to="/teams" className="block text-sm px-2 py-4 text-white hover:bg-[#3A3A3A] transition duration-300">Teams</Link></li>
            <li><Link to="/leaderboard" className="block text-sm px-2 py-4 text-white hover:bg-[#3A3A3A] transition duration-300">Leaderboard</Link></li>
          </ul>
        </motion.div>
      )}
    </nav>
  );
};

export default NavBar;
