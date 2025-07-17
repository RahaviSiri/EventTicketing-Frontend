import React, { useContext } from 'react';
import { AppContext } from './context/AppContext.jsx';
import OrganizerLayout from './layouts/OrganizerLayout.jsx';
import AttendeeLayout from './layouts/AttendeeLayout.jsx';

const App = () => {
  const { role } = useContext(AppContext);

  if (role === "ORGANIZER") {
    return <OrganizerLayout />;
  } else if (role === "ATTENDEE") {
    return <AttendeeLayout />;
  }
};

export default App;
