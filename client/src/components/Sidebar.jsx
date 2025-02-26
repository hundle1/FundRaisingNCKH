import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../assets';
import { navlinks } from '../constants';
import favicon from '../assets/favicon.ico';

const Sidebar = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState('dashboard');

  return (
    <div className="flex flex-col sticky top-5 h-[93vh] w-[220px] bg-[#f0f0f0] rounded-[20px] p-4 shadow-lg">
      {/* Logo */}
      <Link
        to="/"
        className="flex items-center gap-3 outline-none focus:outline-none"
      >
        <img
          className="w-[42px] h-[42px] rounded-lg"
          src={favicon}
          alt="logo"
        />
        <span className="text-lg font-semibold text-gray-800">Stack Market</span>
      </Link>

      {/* Navigation */}
      <div className="flex-1 flex flex-col justify-between mt-12 outline-none focus:outline-none">
        <div className="flex flex-col gap-3 outline-none focus:outline-none">
          {navlinks.map((link) => (
            <div
              key={link.name}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all outline-none focus:outline-none select-none
                ${isActive === link.name ? 'bg-[#434343] text-white' : 'hover:bg-gray-300 text-gray-700'}`}
              onClick={() => {
                if (!link.disabled) {
                  setIsActive(link.name);
                  navigate(link.link);
                }
              }}
            >
              <img src={link.imgUrl} alt={link.name} className="w-6 h-6" />
              <span className="text-md font-medium">{link.name.charAt(0).toUpperCase() + link.name.slice(1)}</span>
            </div>
          ))}
        </div>

        {/* Logout Button */}
        <div className="flex items-center gap-3 p-3 rounded-lg cursor-pointer bg-[#ffffff] text-black hover:bg-[#434343] hover:text-white transition-all group outline-none focus:outline-none select-none">
          <img src={logout} alt="logout" className="w-6 h-6 hover:border-l-stone-900 " />
          <span className="text-md font-medium group-hover:text-white">Logout</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
