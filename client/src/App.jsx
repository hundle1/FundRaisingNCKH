import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { Sidebar, Navbar } from './components';
import { CampaignDetails, CreateCampaign, Home, Profile } from './pages';
import UserProfile from './pages/UserProfile';

const App = () => {
  return (
    <div className="relative sm:-8 p-4 bg-[#ffffff] min-h-screen flex flex-row outline-none focus:outline-none">
      <div className="sm:flex hidden mr-10 relative outline-none focus:outline-none">
        <Sidebar />
      </div>

      <div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5 ">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-campaign" element={<CreateCampaign />} />
          <Route path="/campaign-details/:id" element={<CampaignDetails />} />
          <Route path='/UserProfile' element={<UserProfile/>} />
        </Routes>
      </div>
    </div>
  )
}

export default App