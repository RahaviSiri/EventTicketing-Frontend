import React, { useContext } from 'react';
import { AppContext } from './context/AppContext.jsx';
import OrganizerLayout from './layouts/OrganizerLayout.jsx';
import AttendeeLayout from './layouts/AttendeeLayout.jsx';
import Home from './pages/User/Home.jsx';

const App = () => {
  const { role } = useContext(AppContext);
  console.log(role); // add this temporary log

  if (!role) {
    return <Home />;
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
