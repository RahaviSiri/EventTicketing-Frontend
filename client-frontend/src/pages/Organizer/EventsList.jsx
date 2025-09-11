import React, { useContext, useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ShareIcon from '@mui/icons-material/Share';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ViewEventHeader from '../../components/OrganizerComponents/ViewEventHeader';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { HeaderContext } from '../../context/HeaderContext';

const EventsList = () => {
    const [events, setEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const navigate = useNavigate();
    const { userID } = useContext(AppContext);
    const { api } = useContext(HeaderContext);

    useEffect(() => {
        const fetchEvents = async () => {
            if (!userID) return; // wait until userID is available
            const id = parseInt(userID, 10);
            try {
                const data = await api.getEventsByOrganizer(id);
                setEvents(data);
                console.log("Fetched events:", data);
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };
        fetchEvents();
        console.log("UserID in EventsList:", userID);
        console.log(events);
    }, [api ,userID]);

    // Filter events by search
    const filteredEvents = events.filter((e) => {
        const title = e.event?.name || '';
        const location = e.event?.location || '';
        return title.toLowerCase().includes(searchTerm.toLowerCase()) || // In JavaScript, any string includes the empty string.
               location.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const handleCardClick = (event) => {
        navigate(`/organizers/eventDetails`, { state: { event } });
    };

    const handleMenuOpen = (e, evt) => {
        e.stopPropagation();
        setAnchorEl(e.currentTarget);
        setSelectedEvent(evt);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedEvent(null);
    };

    const handleUpdate = () => {
        navigate(`/organizers/updateEvent/${selectedEvent.id}`);
        handleMenuClose();
        // navigate('/organizers/viewEvent');
    };

    const handleDelete = () => {
        api.deleteEvent(selectedEvent.id)
            .then(() => {
                setEvents(events.filter(e => e.event.id !== selectedEvent.id));
                handleMenuClose()
            })
            .catch((err) => console.error(err));
    };

    return (
        <div className="flex flex-col">
            <ViewEventHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 px-4">
                {filteredEvents.map((event) => (
                    <Card
                        key={event.event.id}
                        sx={{ maxWidth: 350, backgroundColor: '#faf8f5', cursor: 'pointer' }}
                    >
                        <CardHeader
                            action={
                                <>
                                    <IconButton
                                        aria-label="settings"
                                        sx={{ padding: 0.5 }}
                                        onClick={(e) => handleMenuOpen(e, event.event)}
                                    >
                                        <MoreVertIcon fontSize="small" />
                                    </IconButton>
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={Boolean(anchorEl)}
                                        onClose={handleMenuClose}
                                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                    >
                                        <MenuItem onClick={handleUpdate}>Update</MenuItem>
                                        <MenuItem onClick={handleDelete}>Delete</MenuItem>
                                    </Menu>
                                </>
                            }
                            title={
                                <>
                                    {event.event.name}
                                    <span
                                        style={{
                                            marginLeft: "8px",
                                            fontSize: "0.8rem",
                                            color: new Date(event.event.endDate) < new Date() ? "red" : "green",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {new Date(event.event.endDate) < new Date() ? "Expired" : "Active"}
                                    </span>
                                </>
                            }
                            subheader={new Date(event.event.startDate).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                            titleTypographyProps={{
                                sx: { color: '#8076a3', fontWeight: 'bold', mb: 0.5, fontSize: { xs: '1.2rem', md: '1.3rem' } },
                            }}
                            subheaderTypographyProps={{
                                sx: { color: '#8076a3', mb: 0, fontSize: { xs: '0.9rem', md: '1rem' } },
                            }}
                            sx={{ pb: 1.5 }}
                        />
                        <CardMedia
                            component="img"
                            height="140"
                            image={event.event.imageUrl}
                            alt={event.name}
                            onClick={() => handleCardClick(event.event)}
                            sx={{ cursor: 'pointer', objectFit: 'cover' }}
                        />
                        <CardContent sx={{ pt: 1, pb: 1 }}>
                            <Typography variant="body2" sx={{ color: 'text.secondary', pt: 1, mb: 0 }}>
                                {event.event.description}
                            </Typography>
                        </CardContent>
                        <CardActions disableSpacing sx={{ pt: 0, pb: 1, px: 1 }}>
                            <IconButton aria-label="add to favorite" sx={{ p: 0.5 }}>
                                <FavoriteIcon fontSize="small" />
                            </IconButton>
                            <IconButton aria-label="share" sx={{ p: 0.5 }}>
                                <ShareIcon fontSize="small" />
                            </IconButton>
                        </CardActions>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default EventsList;
