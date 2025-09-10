import React, { useContext } from 'react';
import { AppContext } from './context/AppContext.jsx';
import OrganizerLayout from './layouts/OrganizerLayout.jsx';
import AttendeeLayout from './layouts/AttendeeLayout.jsx';
import Login from './pages/Login.jsx';

const App = () => {
  const { role } = useContext(AppContext);

  if (role === "ORGANIZER") {
    return <OrganizerLayout />;
  }

  if (role === "ATTENDEE" || role === null) {
    return <AttendeeLayout />;
  }
};

export default App;
