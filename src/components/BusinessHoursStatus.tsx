import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { clsx } from 'clsx';

interface BusinessHours {
  [key: string]: string;
}

interface BusinessHoursStatusProps {
  hours: BusinessHours;
  className?: string;
}

type Status = 'open' | 'closed' | 'opening-soon' | 'closing-soon';

export function BusinessHoursStatus({ hours, className }: BusinessHoursStatusProps) {
  const [status, setStatus] = useState<Status>('closed');
  const [nextOpenTime, setNextOpenTime] = useState<string | null>(null);

  useEffect(() => {
    function calculateStatus() {
      const now = new Date();
      const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' });
      const currentTime = now.toLocaleTimeString('en-US', { hour12: false });
      
      const todayHours = hours[dayOfWeek];
      
      if (todayHours === 'Closed') {
        findNextOpenTime(now);
        return 'closed';
      }

      if (todayHours === '24/7') {
        return 'open';
      }

      const [openTime, closeTime] = todayHours.split(' - ').map(time => {
        const [hours, minutes] = time.match(/(\d+):(\d+)/)?.slice(1) || [];
        const period = time.match(/[AP]M/)?.[0];
        let hour = parseInt(hours);
        
        if (period === 'PM' && hour !== 12) hour += 12;
        if (period === 'AM' && hour === 12) hour = 0;
        
        return `${hour.toString().padStart(2, '0')}:${minutes}`;
      });

      // Handle businesses open past midnight
      let closeTimeDate = new Date();
      if (closeTime < openTime) {
        closeTimeDate.setDate(closeTimeDate.getDate() + 1);
      }

      const thirtyMinutes = 30 * 60 * 1000;
      const openTimeMs = new Date(`${now.toDateString()} ${openTime}`).getTime();
      const closeTimeMs = new Date(`${closeTimeDate.toDateString()} ${closeTime}`).getTime();
      const currentTimeMs = now.getTime();

      if (currentTimeMs >= openTimeMs && currentTimeMs <= closeTimeMs) {
        if (closeTimeMs - currentTimeMs <= thirtyMinutes) {
          return 'closing-soon';
        }
        return 'open';
      } else {
        if (openTimeMs - currentTimeMs <= thirtyMinutes && openTimeMs > currentTimeMs) {
          return 'opening-soon';
        }
        findNextOpenTime(now);
        return 'closed';
      }
    }

    function findNextOpenTime(now: Date) {
      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      let currentDay = now.getDay();
      let daysChecked = 0;

      while (daysChecked < 7) {
        const dayHours = hours[daysOfWeek[currentDay]];
        if (dayHours !== 'Closed' && dayHours !== '24/7') {
          const openTime = dayHours.split(' - ')[0];
          setNextOpenTime(`${daysOfWeek[currentDay]} at ${openTime}`);
          break;
        }
        currentDay = (currentDay + 1) % 7;
        daysChecked++;
      }
    }

    function updateStatus() {
      setStatus(calculateStatus());
    }

    updateStatus();
    const interval = setInterval(updateStatus, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [hours]);

  const statusConfig = {
    'open': {
      color: 'text-green-500',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      text: 'Open'
    },
    'closed': {
      color: 'text-red-500',
      bgColor: 'bg-red-100 dark:bg-red-900/20',
      text: 'Closed'
    },
    'opening-soon': {
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
      text: 'Opening Soon'
    },
    'closing-soon': {
      color: 'text-orange-500',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
      text: 'Closing Soon'
    }
  };

  return (
    <div className={clsx('flex items-center gap-2', className)}>
      <div className={clsx(
        'px-2 py-1 rounded-full flex items-center gap-1.5',
        statusConfig[status].bgColor
      )}>
        <Clock className={clsx('w-4 h-4', statusConfig[status].color)} />
        <span className={clsx('font-medium text-sm', statusConfig[status].color)}>
          {statusConfig[status].text}
        </span>
      </div>
      {status === 'closed' && nextOpenTime && (
        <span className="text-sm text-desert-600 dark:text-desert-400">
          Opens {nextOpenTime}
        </span>
      )}
    </div>
  );
}