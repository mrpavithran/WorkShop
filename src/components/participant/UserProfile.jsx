import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWorkshop } from '../../context/WorkshopContext';
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  Users, 
  Star,
  Award,
  Download,
  MessageSquare,
  CheckCircle,
  XCircle,
  User,
  Mail,
  Phone
} from 'lucide-react';

function UserProfile() {
  const { user } = useAuth();
  const { workshops, registrations, submitFeedback } = useWorkshop();
  const [activeTab, setActiveTab] = useState('workshops');
  const [feedbackData, setFeedbackData] = useState({});

  const userRegistrations = registrations.filter(r => r.email === user?.email || r.userId === user?.id);
  const registeredWorkshops = workshops.filter(w => 
    userRegistrations.some(r => r.workshopId === w.id)
  );

  const upcomingWorkshops = registeredWorkshops.filter(w => new Date(w.date) >= new Date());
  const pastWorkshops = registeredWorkshops.filter(w => new Date(w.date) < new Date());
  const attendedWorkshops = pastWorkshops.filter(w => {
    const registration = userRegistrations.find(r => r.workshopId === w.id);
    return registration?.attended;
  });

  const handleFeedbackSubmit = (workshopId, registrationId) => {
    const feedback = feedbackData[workshopId];
    if (feedback) {
      submitFeedback(registrationId, feedback);
      setFeedbackData({
        ...feedbackData,
        [workshopId]: ''
      });
    }
  };

  const downloadCertificate = (workshop) => {
    // Create a simple certificate using canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = 800;
    canvas.height = 600;
    
    // Background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, 800, 600);
    
    // Border
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 8;
    ctx.strokeRect(20, 20, 760, 560);
    
    // Title
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Certificate of Completion', 400, 120);
    
    // Participant name
    ctx.font = 'bold 36px Arial';
    ctx.fillStyle = '#3b82f6';
    ctx.fillText(user.name, 400, 200);
    
    // Workshop title
    ctx.font = '24px Arial';
    ctx.fillStyle = '#6b7280';
    ctx.fillText(`has successfully completed`, 400, 250);
    ctx.font = 'bold 32px Arial';
    ctx.fillStyle = '#1f2937';
    ctx.fillText(workshop.title, 400, 300);
    
    // Date
    ctx.font = '20px Arial';
    ctx.fillStyle = '#6b7280';
    ctx.fillText(`Completed on ${new Date(workshop.date).toLocaleDateString()}`, 400, 400);
    
    // Download
    const link = document.createElement('a');
    link.download = `${workshop.title}-certificate.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-md p-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
          <div className="bg-blue-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-4 md:mb-0">
            <User className="h-10 w-10 text-blue-600" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{user?.name}</h1>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 text-gray-600">
              <div className="flex items-center mb-2 sm:mb-0">
                <Mail className="h-4 w-4 mr-2" />
                <span>{user?.email}</span>
              </div>
              <div className="flex items-center">
                <Award className="h-4 w-4 mr-2" />
                <span>{attendedWorkshops.length} workshops completed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Registered</p>
              <p className="text-2xl font-bold text-blue-600">{userRegistrations.length}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Completed</p>
              <p className="text-2xl font-bold text-green-600">{attendedWorkshops.length}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Upcoming</p>
              <p className="text-2xl font-bold text-orange-600">{upcomingWorkshops.length}</p>
            </div>
            <Clock className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Spent</p>
              <p className="text-2xl font-bold text-purple-600">
                ${userRegistrations.reduce((sum, r) => {
                  const workshop = workshops.find(w => w.id === r.workshopId);
                  return sum + (workshop?.price || 0);
                }, 0)}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-md">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'workshops', label: 'My Workshops', icon: Calendar },
              { id: 'certificates', label: 'Certificates', icon: Award },
              { id: 'feedback', label: 'Feedback', icon: MessageSquare }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'workshops' && (
            <div className="space-y-6">
              {/* Upcoming Workshops */}
              {upcomingWorkshops.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Workshops</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {upcomingWorkshops.map(workshop => {
                      const registration = userRegistrations.find(r => r.workshopId === workshop.id);
                      return (
                        <div key={workshop.id} className="border border-green-200 bg-green-50 p-6 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-2">{workshop.title}</h4>
                          <div className="space-y-2 text-sm text-gray-600 mb-4">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2" />
                              {new Date(workshop.date).toLocaleDateString()} at {workshop.time}
                            </div>
                            <div className="flex items-center">
                              <DollarSign className="h-4 w-4 mr-2" />
                              ${workshop.price}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                              Registered
                            </span>
                            <span className="text-sm text-gray-600">
                              Registered on {new Date(registration?.registeredAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Past Workshops */}
              {pastWorkshops.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Past Workshops</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {pastWorkshops.map(workshop => {
                      const registration = userRegistrations.find(r => r.workshopId === workshop.id);
                      return (
                        <div key={workshop.id} className={`border p-6 rounded-lg ${
                          registration?.attended 
                            ? 'border-blue-200 bg-blue-50' 
                            : 'border-gray-200 bg-gray-50'
                        }`}>
                          <h4 className="font-semibold text-gray-900 mb-2">{workshop.title}</h4>
                          <div className="space-y-2 text-sm text-gray-600 mb-4">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2" />
                              {new Date(workshop.date).toLocaleDateString()} at {workshop.time}
                            </div>
                            <div className="flex items-center">
                              <DollarSign className="h-4 w-4 mr-2" />
                              ${workshop.price}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              registration?.attended
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {registration?.attended ? 'Attended' : 'Missed'}
                            </span>
                            {registration?.attended && (
                              <button
                                onClick={() => downloadCertificate(workshop)}
                                className="text-blue-600 hover:text-blue-700 text-sm flex items-center"
                              >
                                <Download className="h-4 w-4 mr-1" />
                                Certificate
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {registeredWorkshops.length === 0 && (
                <div className="text-center py-8">
                  <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No workshops yet</h3>
                  <p className="text-gray-600 mb-6">Discover and register for workshops to see them here</p>
                  <a 
                    href="/workshops"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 inline-block"
                  >
                    Browse Workshops
                  </a>
                </div>
              )}
            </div>
          )}

          {activeTab === 'certificates' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Your Certificates</h3>
              
              {attendedWorkshops.length === 0 ? (
                <div className="text-center py-8">
                  <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-xl font-medium text-gray-900 mb-2">No certificates yet</h4>
                  <p className="text-gray-600">Complete workshops to earn certificates</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {attendedWorkshops.map(workshop => (
                    <div key={workshop.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-lg mb-4 text-white text-center">
                        <Award className="h-8 w-8 mx-auto mb-2" />
                        <h4 className="font-semibold text-sm">{workshop.title}</h4>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-4">
                          Completed on {new Date(workshop.date).toLocaleDateString()}
                        </p>
                        <button
                          onClick={() => downloadCertificate(workshop)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2 mx-auto"
                        >
                          <Download className="h-4 w-4" />
                          <span>Download</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'feedback' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Workshop Feedback</h3>
              
              {pastWorkshops.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-xl font-medium text-gray-900 mb-2">No feedback to submit</h4>
                  <p className="text-gray-600">Attend workshops to provide feedback</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {pastWorkshops.map(workshop => {
                    const registration = userRegistrations.find(r => r.workshopId === workshop.id);
                    if (!registration?.attended) return null;
                    
                    return (
                      <div key={workshop.id} className="border border-gray-200 rounded-lg p-6">
                        <h4 className="font-semibold text-gray-900 mb-2">{workshop.title}</h4>
                        <p className="text-sm text-gray-600 mb-4">
                          Completed on {new Date(workshop.date).toLocaleDateString()}
                        </p>
                        
                        {registration.feedbackSubmitted ? (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-center mb-2">
                              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                              <span className="text-green-800 font-medium">Feedback submitted</span>
                            </div>
                            <p className="text-green-700">{registration.feedback}</p>
                          </div>
                        ) : (
                          <div>
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Your feedback:
                              </label>
                              <textarea
                                value={feedbackData[workshop.id] || ''}
                                onChange={(e) => setFeedbackData({
                                  ...feedbackData,
                                  [workshop.id]: e.target.value
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                rows="4"
                                placeholder="Share your experience with this workshop..."
                              />
                            </div>
                            <button
                              onClick={() => handleFeedbackSubmit(workshop.id, registration.id)}
                              disabled={!feedbackData[workshop.id]?.trim()}
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                              Submit Feedback
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;