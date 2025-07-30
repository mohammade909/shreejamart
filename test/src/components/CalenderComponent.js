import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { fetchEvents } from '../redux/eventSlice';
import { useSelector, useDispatch } from 'react-redux';

const localizer = momentLocalizer(moment);

const CalendarComponent = () => {
  const dispatch = useDispatch();
  const { events } = useSelector((state) => state.events);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  // Convert event dates to Date objects for react-big-calendar
  const convertEvents = (eventsArray) => {
    return eventsArray.map((event) => ({
      ...event,
      start: new Date(event.start_date),
      end: new Date(event.end_date),
      title: event.title,
      allDay: false, // You can set to true if the event spans the whole day
    }));
  };

  // Filter events for upcoming ones (events happening after today)
  const getUpcomingEvents = (eventsArray) => {
    const today = new Date();
    return eventsArray.filter((event) => new Date(event.start_date) > today);
  };

  useEffect(() => {
    dispatch(fetchEvents()); // Fetch events from the server
  }, [dispatch]);

  useEffect(() => {
    if (events.length > 0) {
      setUpcomingEvents(getUpcomingEvents(events));
    }
  }, [events]);

  // Handler for date click
  const handleDateClick = (slotInfo) => {
    console.log('Selected date:', slotInfo.start);
    alert(`You clicked on ${slotInfo.start.toLocaleDateString()}`);
  };

  return (
    <div className="container mx-auto my-10">
      {/* Display upcoming events */}
      <div className="mb-5">
        <h2 className="text-xl font-bold mb-3">Upcoming Events</h2>
        {upcomingEvents.length > 0 ? (
          <ul className="space-y-2">
            {upcomingEvents.map((event) => (
              <li key={event.event_id} className="p-3 border rounded bg-blue-50/40">
                <div className="font-semibold">{event.title}</div>
                <div>
                  {new Date(event.start_date).toLocaleDateString()} -{' '}
                  {new Date(event.end_date).toLocaleDateString()}
                </div>
                <div>{event.location}</div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No upcoming events</p>
        )}
      </div>

      {/* Calendar to display all events */}
      <div className="border p-2">
        <Calendar
          localizer={localizer}
          events={convertEvents(events)} // Pass converted events
          startAccessor="start"
          endAccessor="end"
          defaultView="month"
          selectable={true}
          onSelectSlot={handleDateClick}
          style={{ height: 500 }}
        />
      </div>
    </div>
  );
};

export default CalendarComponent;
