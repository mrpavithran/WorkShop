import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useWorkshop } from '../../context/WorkshopContext';
import { 
  PlusCircle, 
  Calendar, 
  Users, 
  TrendingUp,
  Eye
} from 'lucide-react';

// Custom Rupee Icon Component
const RupeeIcon = ({ className = '' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 10h16M4 14h16M10 4c0 4.5-2 8-6 8M14 20c0-4.5 2-8 6-8" />
  </svg>
);

function CreatorDashboard() {
  const { user } = useAuth();
  const { workshops, registrations } = useWorkshop();

  const userWorkshops = workshops.filter(w => w.creatorId === user.id);
  const totalRevenue = userWorkshops.reduce((sum, w) => sum + (w.registeredCount * w.price), 0);
  const totalParticipants = userWorkshops.reduce((sum, w) => sum + w.registeredCount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {user.name}!</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Workshops</p>
              <p className="text-3xl font-bold text-gray-900">{userWorkshops.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Participants</p>
              <p className="text-3xl font-bold text-gray-900">{totalParticipants}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900">₹{totalRevenue}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <RupeeIcon className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            to="/creator/create"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <PlusCircle className="h-5 w-5" />
            <span>Create New Workshop</span>
          </Link>
          <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>View Analytics</span>
          </button>
        </div>
      </div>

      {/* Workshops List */}
      <div className="bg-white rounded-xl shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Your Workshops</h2>
        </div>
        
        {userWorkshops.length === 0 ? (
          <div className="p-8 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No workshops yet</h3>
            <p className="text-gray-600 mb-6">Create your first workshop to get started</p>
            <Link 
              to="/creator/create"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 inline-flex items-center space-x-2"
            >
              <PlusCircle className="h-5 w-5" />
              <span>Create Workshop</span>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {userWorkshops.map((workshop) => (
              <div key={workshop.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1 mb-4 lg:mb-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {workshop.title}
                    </h3>
                    <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-600 space-y-1 sm:space-y-0 sm:space-x-6">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(workshop.date).toLocaleDateString()} at {workshop.time}
                      </span>
                      <span className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {workshop.registeredCount}/{workshop.capacity} registered
                      </span>
                      <span className="flex items-center">
                        <RupeeIcon className="h-4 w-4 mr-1" />
                        ₹{workshop.price}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Link 
                      to={`/creator/workshop/${workshop.id}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                    >
                      <Eye className="h-4 w-4" />
                      <span>Manage</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CreatorDashboard;