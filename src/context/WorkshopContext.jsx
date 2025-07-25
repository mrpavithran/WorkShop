import React, { createContext, useContext, useState, useEffect } from 'react';

const WorkshopContext = createContext();

export const useWorkshop = () => {
  const context = useContext(WorkshopContext);
  if (!context) {
    throw new Error('useWorkshop must be used within a WorkshopProvider');
  }
  return context;
};

export function WorkshopProvider({ children }) {
  const [workshops, setWorkshops] = useState([]);
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    // Load mock data
    const mockWorkshops = [
      {
        id: 1,
        title: 'React Advanced Patterns',
        date: '2025-02-15',
        time: '10:00',
        price: 199,
        description: 'Learn advanced React patterns and best practices',
        creatorId: 1,
        capacity: 50,
        registeredCount: 25,
        qrCode: 'workshop-1-qr'
      },
      {
        id: 2,
        title: 'UI/UX Design Fundamentals',
        date: '2025-02-20',
        time: '14:00',
        price: 149,
        description: 'Master the fundamentals of user interface and experience design',
        creatorId: 1,
        capacity: 30,
        registeredCount: 18,
        qrCode: 'workshop-2-qr'
      }
    ];
    
    setWorkshops(mockWorkshops);
  }, []);

  const createWorkshop = (workshopData) => {
    const newWorkshop = {
      id: Date.now(),
      ...workshopData,
      registeredCount: 0,
      qrCode: `workshop-${Date.now()}-qr`
    };
    setWorkshops(prev => [...prev, newWorkshop]);
    return newWorkshop;
  };

  const registerForWorkshop = (workshopId, participantData) => {
    const registration = {
      id: Date.now(),
      workshopId,
      ...participantData,
      registeredAt: new Date().toISOString(),
      attended: false,
      feedbackSubmitted: false
    };
    
    setRegistrations(prev => [...prev, registration]);
    setWorkshops(prev => prev.map(w => 
      w.id === workshopId 
        ? { ...w, registeredCount: w.registeredCount + 1 }
        : w
    ));
    
    return registration;
  };

  const updateAttendance = (registrationId, attended) => {
    setRegistrations(prev => prev.map(r => 
      r.id === registrationId ? { ...r, attended } : r
    ));
  };

  const submitFeedback = (registrationId, feedback) => {
    setRegistrations(prev => prev.map(r => 
      r.id === registrationId 
        ? { ...r, feedback, feedbackSubmitted: true }
        : r
    ));
  };

  const value = {
    workshops,
    registrations,
    createWorkshop,
    registerForWorkshop,
    updateAttendance,
    submitFeedback
  };

  return <WorkshopContext.Provider value={value}>{children}</WorkshopContext.Provider>;
}