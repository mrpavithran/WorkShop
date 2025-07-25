import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWorkshop } from '../../context/WorkshopContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Calendar, 
  Clock, 
  Users, 
  Search,
  Filter,
  MapPin,
  Star,
  ArrowRight
} from 'lucide-react';

// Custom Rupee Icon Component
const RupeeIcon = ({ className = '' }) => (
  <span className={`text-lg ${className}`}>₹</span>
);

function WorkshopListing() {
  const { workshops } = useWorkshop();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const filteredWorkshops = workshops.filter(workshop => {
    const matchesSearch = workshop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workshop.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPrice = priceFilter === 'all' || 
                        (priceFilter === 'free' && workshop.price === 0) ||
                        (priceFilter === 'paid' && workshop.price > 0) ||
                        (priceFilter === 'under-100' && workshop.price < 100) ||
                        (priceFilter === 'over-100' && workshop.price >= 100);
    
    const today = new Date();
    const workshopDate = new Date(workshop.date);
    const matchesDate = dateFilter === 'all' ||
                       (dateFilter === 'upcoming' && workshopDate >= today) ||
                       (dateFilter === 'this-month' && 
                        workshopDate.getMonth() === today.getMonth() &&
                        workshopDate.getFullYear() === today.getFullYear());
    
    return matchesSearch && matchesPrice && matchesDate;
  });

  const featuredWorkshops = workshops.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Discover Amazing Workshops
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Learn new skills, meet like-minded people, and grow professionally with our curated selection of workshops
        </p>
      </div>

      {/* Featured Workshops */}
      {!user && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Workshops</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredWorkshops.map(workshop => (
              <div key={workshop.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
                <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <h3 className="text-white text-xl font-bold text-center px-4">
                    {workshop.title}
                  </h3>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(workshop.date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center">
                      <RupeeIcon className="mr-1" />
                      ₹{workshop.price}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-2">{workshop.description}</p>
                  <Link 
                    to={`/workshop/₹{workshop.id}/register`}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <span>Register Now</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-6 space-y-4 lg:space-y-0">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search workshops..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            >
              <option value="all">All Prices</option>
              <option value="free">Free</option>
              <option value="under-100">Under ₹100</option>
              <option value="over-100">₹100+</option>
            </select>
            
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            >
              <option value="all">All Dates</option>
              <option value="upcoming">Upcoming</option>
              <option value="this-month">This Month</option>
            </select>
          </div>
        </div>
      </div>

      {/* Workshops Grid */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            All Workshops ({filteredWorkshops.length})
          </h2>
          {user?.role === 'participant' && (
            <Link 
              to="/profile"
              className="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
            >
              <span>My Workshops</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>

      {filteredWorkshops.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No workshops found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkshops.map((workshop) => (
            <div key={workshop.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
              <div className="h-48 bg-gradient-to-br from-blue-500 via-purple-500 to-orange-500 flex items-center justify-center relative">
                <h3 className="text-white text-xl font-bold text-center px-4 z-10">
                  {workshop.title}
                </h3>
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(workshop.date).toLocaleDateString()}
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {workshop.time}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">
                  {workshop.description}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {workshop.registeredCount}/{workshop.capacity}
                    </span>
                    <span className="flex items-center font-medium text-blue-600">
                      <RupeeIcon className="mr-1" />
                      ₹{workshop.price}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-2">4.8 (24)</span>
                  </div>
                  
                  <Link 
                    to={`/workshop/${workshop.id}/register`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-1 text-sm font-medium"
                  >
                    <span>Register</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Call to Action */}
      {!user && (
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-xl mb-6 opacity-90">Join thousands of learners and start your journey today</p>
          <div className="space-x-4">
            <Link 
              to="/register"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 inline-block"
            >
              Sign Up Now
            </Link>
            <Link 
              to="/login"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-200 inline-block"
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default WorkshopListing;