import React from 'react';
import NavBar from '../components/NavBar.jsx';
import Events from '../pages/User/Events.jsx';
import { Routes, Route } from 'react-router-dom';


const AttendeeLayout = () => {
  return (
    <div className="flex flex-col h-screen">
      <NavBar />
      <main className="flex-1 p-4 overflow-y-auto">
          <Routes>
            {/* <Route path="/" element={<Dashboard />} /> */}
            <Route path="/Events" element={<Events />} />
            
          </Routes>
        </main>
    </div>
  );
};

export default AttendeeLayout;
