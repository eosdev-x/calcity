import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Event } from '../types/event';
import { clsx } from 'clsx';

interface EventCalendarProps {
  events: Event[];
}

export function EventCalendar({ events }: EventCalendarProps) {
  // State for current month and year
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  
  // Day names for header
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Month names for display
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  // Navigate to previous month
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };
  
  // Navigate to next month
  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };
  
  // Go to current month
  const goToCurrentMonth = () => {
    const now = new Date();
    setCurrentMonth(now.getMonth());
    setCurrentYear(now.getFullYear());
  };
  
  // Generate calendar days for the current month
  const calendarDays = useMemo(() => {
    // Get the first day of the month
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    // Get the last day of the month
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    
    // Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDayOfMonth.getDay();
    
    // Calculate how many days from the previous month to show
    const daysFromPrevMonth = firstDayOfWeek;
    
    // Get the last day of the previous month
    const lastDayOfPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
    
    // Calculate total days to display (maximum 42 for a 6-row calendar)
    const totalDays = 42;
    
    // Generate the calendar days array
    const days = [];
    
    // Add days from the previous month
    for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
      const day = lastDayOfPrevMonth - i;
      const date = new Date(currentYear, currentMonth - 1, day);
      days.push({
        date,
        day,
        isCurrentMonth: false,
        isPast: date < new Date(new Date().setHours(0, 0, 0, 0)),
        isToday: false
      });
    }
    
    // Add days from the current month
    const today = new Date();
    const isCurrentMonthAndYear = 
      today.getMonth() === currentMonth && 
      today.getFullYear() === currentYear;
    
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      const date = new Date(currentYear, currentMonth, day);
      days.push({
        date,
        day,
        isCurrentMonth: true,
        isPast: date < new Date(new Date().setHours(0, 0, 0, 0)),
        isToday: isCurrentMonthAndYear && today.getDate() === day
      });
    }
    
    // Add days from the next month to fill the calendar
    const remainingDays = totalDays - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(currentYear, currentMonth + 1, day);
      days.push({
        date,
        day,
        isCurrentMonth: false,
        isPast: false,
        isToday: false
      });
    }
    
    return days;
  }, [currentMonth, currentYear]);
  
  // Filter events for the current month view
  const eventsInView = useMemo(() => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getMonth() === currentMonth &&
        eventDate.getFullYear() === currentYear
      );
    });
  }, [events, currentMonth, currentYear]);
  
  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateString);
  };
  
  return (
    <div className="card">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold flex items-center">
          <CalendarIcon className="w-6 h-6 text-desert-400 mr-2" />
          Event Calendar
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={goToCurrentMonth}
            className="px-3 py-1 text-sm bg-desert-100 dark:bg-night-desert-300 text-desert-700 dark:text-desert-300 rounded-md hover:bg-desert-200 dark:hover:bg-night-desert-400 transition-colors"
          >
            Today
          </button>
        </div>
      </div>
      
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousMonth}
          className="p-2 rounded-full hover:bg-desert-100 dark:hover:bg-night-desert-300 transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5 text-desert-600 dark:text-desert-400" />
        </button>
        
        <h3 className="text-xl font-medium text-desert-800 dark:text-desert-200">
          {monthNames[currentMonth]} {currentYear}
        </h3>
        
        <button
          onClick={goToNextMonth}
          className="p-2 rounded-full hover:bg-desert-100 dark:hover:bg-night-desert-300 transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5 text-desert-600 dark:text-desert-400" />
        </button>
      </div>
      
      {/* Calendar Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Day Headers */}
          <div className="grid grid-cols-7 mb-2">
            {dayNames.map(day => (
              <div
                key={day}
                className="text-center font-medium text-desert-600 dark:text-desert-400 py-2"
              >
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              const dayEvents = getEventsForDate(day.date);
              const hasEvents = dayEvents.length > 0;
              
              return (
                <div
                  key={index}
                  className={clsx(
                    "min-h-[100px] p-1 border rounded-md transition-colors",
                    day.isCurrentMonth
                      ? "border-desert-200 dark:border-night-desert-400"
                      : "border-desert-100 dark:border-night-desert-500 bg-desert-50 dark:bg-night-desert-600",
                    day.isToday && "ring-2 ring-desert-400 dark:ring-desert-500",
                    day.isPast && !day.isToday && "opacity-70"
                  )}
                >
                  <div className="flex flex-col h-full">
                    {/* Day Number */}
                    <div className={clsx(
                      "text-right text-sm font-medium mb-1",
                      day.isCurrentMonth
                        ? "text-desert-800 dark:text-desert-200"
                        : "text-desert-500 dark:text-desert-500"
                    )}>
                      {day.day}
                    </div>
                    
                    {/* Events for this day */}
                    <div className="flex-grow space-y-1 overflow-y-auto">
                      {hasEvents && dayEvents.map(event => (
                        <Link
                          key={event.id}
                          to={`/events/${event.id}`}
                          className="block px-2 py-1 text-xs rounded bg-desert-100 dark:bg-night-desert-300 text-desert-700 dark:text-desert-300 hover:bg-desert-200 dark:hover:bg-night-desert-400 truncate transition-colors"
                          title={event.title}
                        >
                          {event.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Events Summary */}
      <div className="mt-6 pt-4 border-t border-desert-200 dark:border-night-desert-400">
        <h4 className="font-medium text-desert-700 dark:text-desert-300 mb-2">
          {eventsInView.length} Events This Month
        </h4>
        
        {eventsInView.length > 0 ? (
          <ul className="space-y-2">
            {eventsInView.map(event => {
              const eventDate = new Date(event.date);
              return (
                <li key={event.id} className="flex items-center">
                  <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-desert-100 dark:bg-night-desert-300 rounded-md text-desert-700 dark:text-desert-300 font-medium">
                    {eventDate.getDate()}
                  </div>
                  <div className="ml-3">
                    <Link
                      to={`/events/${event.id}`}
                      className="font-medium text-desert-700 dark:text-desert-300 hover:text-desert-500 dark:hover:text-desert-400 transition-colors"
                    >
                      {event.title}
                    </Link>
                    <div className="text-sm text-desert-500 dark:text-desert-500">
                      {event.time}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-desert-500 dark:text-desert-500 text-sm">
            No events scheduled for this month.
          </p>
        )}
      </div>
    </div>
  );
}
