import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getEventDetails } from '../../mock/mockApi';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    getEventDetails(id).then(setEvent);
  }, [id]);

  if (!event) return <p>Loading...</p>;

  return (
    <div>
      <h2>{event.title}</h2>
      <p>{event.description}</p>
      <p>Date: {event.date}</p>
      <Link to={`/event/${event.id}/book`}>
        <button>Book Ticket</button>
      </Link>
    </div>
  );
};

export default EventDetails;
