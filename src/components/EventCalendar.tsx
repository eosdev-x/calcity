import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Event } from '../types/event';
import { clsx } from 'clsx';

interface EventCalendarProps {
  events: Event[];
}

export function EventCalendar({ events }: EventCalendarProps) {
  // State for current month and year
  const [currentMonth, setCurrentMonth] = useState(new Date());
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
    if (currentMonth.getMonth() === 0) {
      setCurrentMonth(new Date(currentYear - 1, 11));
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(new Date(currentYear, currentMonth.getMonth() - 1));
    }
  };
  
  // Navigate to next month
  const goToNextMonth = () => {
    if (currentMonth.getMonth() === 11) {
      setCurrentMonth(new Date(currentYear + 1, 0));
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(new Date(currentYear, currentMonth.getMonth() + 1));
    }
  };
  
  // Go to current month
  const goToCurrentMonth = () => {
    const now = new Date();
    setCurrentMonth(now);
    setCurrentYear(now.getFullYear());
  };
  
  // Generate calendar days for the current month
  const calendarDays = useMemo(() => {
    // Get the first day of the month
    const firstDayOfMonth = new Date(currentYear, currentMonth.getMonth(), 1);
    // Get the last day of the month
    const lastDayOfMonth = new Date(currentYear, currentMonth.getMonth() + 1, 0);
    
    // Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDayOfMonth.getDay();
    
    // Calculate how many days from the previous month to show
    const daysFromPrevMonth = firstDayOfWeek;
    
    // Get the last day of the previous month
    const lastDayOfPrevMonth = new Date(currentYear, currentMonth.getMonth(), 0).getDate();
    
    // Calculate total days to display (maximum 42 for a 6-row calendar)
    const totalDays = 42;
    
    // Generate the calendar days array
    const days = [];
    
    // Add days from the previous month
    for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
      const day = lastDayOfPrevMonth - i;
      const date = new Date(currentYear, currentMonth.getMonth() - 1, day);
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
      today.getMonth() === currentMonth.getMonth() && 
      today.getFullYear() === currentYear;
    
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      const date = new Date(currentYear, currentMonth.getMonth(), day);
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
      const date = new Date(currentYear, currentMonth.getMonth() + 1, day);
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
  

  
  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    // Format the date as YYYY-MM-DD for comparison with event.date
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    
    return events.filter(event => event.date === dateString);
  };
  
  // Render the events list below the calendar
  const renderEventsList = () => {
    const eventsInMonth = events.filter(event => {
      const dateParts = event.date.split('-');
      const eventDate = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
      return eventDate.getMonth() === currentMonth.getMonth() && 
             eventDate.getFullYear() === currentYear;
    });

    // Sort events by date
    eventsInMonth.sort((a, b) => {
      return a.date.localeCompare(b.date);
    });

    if (eventsInMonth.length === 0) {
      return (
        <div className="text-center py-8 text-desert-600 dark:text-desert-400">
          No events scheduled for {monthNames[currentMonth.getMonth()]} {currentYear}
        </div>
      );
    }

    return (
      <div className="mt-8 bg-white dark:bg-night-desert-800 rounded-lg shadow-md p-4">
        <h3 className="text-xl font-semibold text-desert-800 dark:text-desert-200 mb-4">
          Events in {monthNames[currentMonth.getMonth()]} {currentYear}
        </h3>
        <div className="space-y-4">
          {eventsInMonth.map(event => {
            // Format the date for display
            const dateParts = event.date.split('-');
            const eventDate = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
            const formattedDate = eventDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
            
            return (
              <div key={event.id} className="border-b border-desert-100 dark:border-night-desert-700 pb-4 last:border-0">
                <Link 
                  to={`/events/${event.id}`}
                  className="block hover:bg-desert-50 dark:hover:bg-night-desert-700 rounded-md p-2 -mx-2 transition-colors"
                >
                  <h4 className="text-lg font-medium text-desert-700 dark:text-desert-300">{event.title}</h4>
                  <div className="flex items-center text-desert-600 dark:text-desert-400 text-sm mt-1">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{formattedDate}</span>
                    <span className="mx-2">•</span>
                    <span>{event.time}</span>
                  </div>
                  <p className="text-sm text-desert-500 dark:text-desert-500 mt-1 line-clamp-2">{event.description}</p>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="card">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold flex items-center">
          <Calendar className="w-6 h-6 text-desert-400 mr-2" />
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
          {monthNames[currentMonth.getMonth()]} {currentYear}
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
              const isToday = day.isToday;
              const isPast = day.isPast;
              
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
                  <div className="h-full min-h-[80px] p-1">
                    {/* Day number */}
                    <div className={`text-sm font-medium ${isToday ? 'bg-desert-500 text-white rounded-full w-6 h-6 flex items-center justify-center' : isPast ? 'text-desert-400 dark:text-desert-600' : 'text-desert-800 dark:text-desert-200'}`}>
                      {day.day}
                    </div>
                    
                    {/* Events for this day */}
                    <div className="mt-1 space-y-1 overflow-y-auto max-h-[60px]">
                      {hasEvents ? (
                        dayEvents.map((event) => (
                          <Link 
                            key={event.id}
                            to={`/events/${event.id}`}
                            className="block text-xs p-1 rounded bg-desert-100 dark:bg-night-desert-700 text-desert-700 dark:text-desert-300 truncate hover:bg-desert-200 dark:hover:bg-night-desert-600"
                          >
                            {event.title}
                          </Link>
                        ))
                      ) : (
                        // Empty day indicator (only show for current month)
                        day.isCurrentMonth && 
                        <div className="w-full h-1 mt-2"></div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Events Summary */}
      {renderEventsList()}
    </div>
  );
}
