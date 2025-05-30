import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const EventCard = ({ event }) => {
  const { isDarkMode } = useTheme();

  // Format date and time
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString();
  const formattedTime = eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <Link to={`/events/${event._id}`} className="block h-full">
      <motion.div 
        className={`h-full rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
        whileHover={{ y: -5 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Event Image */}
        <div className="relative h-48 overflow-hidden">
          <img 
            src={event.image || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'} 
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        
        {/* Event Content */}
        <div className="p-4 space-y-3">
          {/* Event Title */}
          <h3 className="text-lg font-bold text-gray-800 dark:text-white line-clamp-2">
            {event.title}
          </h3>

          {/* Date and Time */}
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <svg className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formattedDate} at {formattedTime}</span>
          </div>
          
          {/* Location */}
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <svg className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="line-clamp-1">{event.location}</span>
          </div>
          
          {/* Price Badge */}
          <div className="pt-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
              {event.price === 0 ? 'FREE' : `$${event.price}`}
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default EventCard; 