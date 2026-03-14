import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Event } from '../types/event';
import { supabase } from '../lib/supabase';

interface EventContextType {
  events: Event[];
  loading: boolean;
  addEvent: (event: Omit<Event, 'id'>) => Promise<Event | null>;
  getEventById: (id: string) => Event | undefined;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export function useEvents() {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
}

interface EventProviderProps {
  children: ReactNode;
}

export function EventProvider({ children }: EventProviderProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchEvents = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'approved')
        .order('date', { ascending: true });

      if (!isMounted) return;

      if (error) {
        setEvents([]);
      } else {
        setEvents(data ?? []);
      }
      setLoading(false);
    };

    fetchEvents();

    return () => {
      isMounted = false;
    };
  }, []);

  const addEvent = async (event: Omit<Event, 'id'>) => {
    const { data, error } = await supabase
      .from('events')
      .insert(event)
      .select('*')
      .single();

    if (error) {
      return null;
    }

    setEvents(prevEvents => [...prevEvents, data]);
    return data;
  };

  const getEventById = (id: string) => {
    return events.find(event => event.id === id);
  };

  return (
    <EventContext.Provider value={{ events, loading, addEvent, getEventById }}>
      {children}
    </EventContext.Provider>
  );
}
