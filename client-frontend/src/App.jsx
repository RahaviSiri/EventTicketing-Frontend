import React, { useContext } from 'react';
import { AppContext } from './context/AppContext.jsx';
import OrganizerLayout from './layouts/OrganizerLayout.jsx';
import AttendeeLayout from './layouts/AttendeeLayout.jsx';
import Login from './pages/Login.jsx';

const App = () => {
  const { role } = useContext(AppContext);

  if (!role) {
    return <Login />;
  }

  if (role === "ORGANIZER") {
    return <OrganizerLayout />;
  }

  if (role === "ATTENDEE") {
    return <AttendeeLayout />;
  }

  return <div>Invalid role</div>; 
};

export default App;
