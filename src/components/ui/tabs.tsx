import { createContext, useContext, useState, ReactNode } from 'react';

// Context for tabs
type TabsContextType = {
  activeTab: string;
  setActiveTab: (id: string) => void;
};

const TabsContext = createContext<TabsContextType | undefined>(undefined);

// Props for the Tabs component
interface TabsProps {
  children: ReactNode;
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

// Props for the TabsList component
interface TabsListProps {
  children: ReactNode;
  className?: string;
}

// Props for the TabsTrigger component
interface TabsTriggerProps {
  children: ReactNode;
  value: string;
  className?: string;
}

// Props for the TabsContent component
interface TabsContentProps {
  children: ReactNode;
  value: string;
  className?: string;
}

// Main Tabs component
export function Tabs({ 
  children, 
  defaultValue, 
  value, 
  onValueChange,
  className = ''
}: TabsProps) {
  const [activeTab, setActiveTabInternal] = useState(defaultValue);
  
  // Use controlled or uncontrolled pattern
  const currentValue = value !== undefined ? value : activeTab;
  
  const setActiveTab = (newValue: string) => {
    if (value === undefined) {
      setActiveTabInternal(newValue);
    }
    onValueChange?.(newValue);
  };
  
  return (
    <TabsContext.Provider value={{ activeTab: currentValue, setActiveTab }}>
      <div className={className}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

// TabsList component
export function TabsList({ children, className = '' }: TabsListProps) {
  return (
    <div className={`flex border-b border-desert-200 dark:border-night-desert-700 ${className}`}>
      {children}
    </div>
  );
}

// TabsTrigger component
export function TabsTrigger({ children, value, className = '' }: TabsTriggerProps) {
  const context = useContext(TabsContext);
  
  if (!context) {
    throw new Error('TabsTrigger must be used within a Tabs component');
  }
  
  const { activeTab, setActiveTab } = context;
  const isActive = activeTab === value;
  
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={() => setActiveTab(value)}
      className={`px-4 py-2 font-medium text-sm transition-colors
        ${isActive 
          ? 'text-desert-800 dark:text-desert-100 border-b-2 border-desert-500 dark:border-desert-400' 
          : 'text-desert-600 dark:text-desert-300 hover:text-desert-800 dark:hover:text-desert-100'
        } ${className}`}
    >
      {children}
    </button>
  );
}

// TabsContent component
export function TabsContent({ children, value, className = '' }: TabsContentProps) {
  const context = useContext(TabsContext);
  
  if (!context) {
    throw new Error('TabsContent must be used within a Tabs component');
  }
  
  const { activeTab } = context;
  
  if (activeTab !== value) {
    return null;
  }
  
  return (
    <div role="tabpanel" className={`py-4 ${className}`}>
      {children}
    </div>
  );
}
