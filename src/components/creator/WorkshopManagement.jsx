import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWorkshop } from '../../context/WorkshopContext';
import QRCode from 'react-qr-code';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  Download,
  Mail,
  MessageSquare,
  CheckCircle,
  XCircle,
  ArrowLeft,
  QrCode,
  Star
} from 'lucide-react';

function WorkshopManagement() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { workshops, registrations, updateAttendance } = useWorkshop();
  
  const workshop = workshops.find(w => w.id === parseInt(id));
  const workshopRegistrations = registrations.filter(r => r.workshopId === parseInt(id));
  
  const [activeTab, setActiveTab] = useState('overview');

  if (!workshop) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Workshop not found</h1>
          <button 
            onClick={() => navigate('/creator/dashboard')}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleAttendanceToggle = (registrationId, currentStatus) => {
    updateAttendance(registrationId, !currentStatus);
  };

  const downloadQRCode = () => {
    const svg = document.getElementById('workshop-qr-code');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `${workshop.title}-qr-code.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const workshopUrl = `${window.location.origin}/workshop/${workshop.id}/register`;
  const attendedCount = workshopRegistrations.filter(r => r.attended).length;
  const feedbackCount = workshopRegistrations.filter(r => r.feedbackSubmitted).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button 
          onClick={() => navigate('/creator/dashboard')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors duration-200"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Dashboard
        </button>
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{workshop.title}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-gray-600">
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(workshop.date).toLocaleDateString()} at {workshop.time}
              </span>
              <span className="flex items-center">
                <DollarSign className="h-4 w-4 mr-1" />
                ${workshop.price}
              </span>
              <span className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {workshop.registeredCount}/{workshop.capacity} registered
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Registered</p>
              <p className="text-2xl font-bold text-blue-600">{workshop.registeredCount}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Attended</p>
              <p className="text-2xl font-bold text-green-600">{attendedCount}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Revenue</p>
              <p className="text-2xl font-bold text-orange-600">${workshop.registeredCount * workshop.price}</p>
            </div>
            <DollarSign className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Feedback</p>
              <p className="text-2xl font-bold text-purple-600">{feedbackCount}</p>
            </div>
            <Star className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-md">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: Calendar },
              { id: 'participants', label: 'Participants', icon: Users },
              { id: 'qr-code', label: 'QR Code', icon: QrCode },
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
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600">{workshop.description}</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Workshop Details</h3>
                  <dl className="space-y-3">
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Date & Time:</dt>
                      <dd className="font-medium">{new Date(workshop.date).toLocaleDateString()} at {workshop.time}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Price:</dt>
                      <dd className="font-medium">₹{workshop.price}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Capacity:</dt>
                      <dd className="font-medium">{workshop.capacity} participants</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Registered:</dt>
                      <dd className="font-medium">{workshop.registeredCount} participants</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Available Spots:</dt>
                      <dd className="font-medium">{workshop.capacity - workshop.registeredCount} remaining</dd>
                    </div>
                  </dl>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2">
                      <Mail className="h-4 w-4" />
                      <span>Send Reminder Email</span>
                    </button>
                    <button className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center space-x-2">
                      <MessageSquare className="h-4 w-4" />
                      <span>Send SMS Reminder</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'participants' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Participants ({workshopRegistrations.length})
                </h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>Email All</span>
                </button>
              </div>
              
              {workshopRegistrations.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No participants yet</h4>
                  <p className="text-gray-600">Participants will appear here once they register</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Participant
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Registered
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Attendance
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {workshopRegistrations.map((registration) => (
                        <tr key={registration.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{registration.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-600">{registration.email}</div>
                            <div className="text-sm text-gray-600">{registration.phone}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {new Date(registration.registeredAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => handleAttendanceToggle(registration.id, registration.attended)}
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
                                registration.attended
                                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                              }`}
                            >
                              {registration.attended ? (
                                <>
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Attended
                                </>
                              ) : (
                                <>
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Not Attended
                                </>
                              )}
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            <button className="text-blue-600 hover:text-blue-700 mr-3">Email</button>
                            <button className="text-blue-600 hover:text-blue-700">SMS</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'qr-code' && (
            <div className="max-w-2xl mx-auto text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Workshop QR Code</h3>
              
              <div className="bg-white p-8 rounded-lg border inline-block mb-6">
                <QRCode
                  id="workshop-qr-code"
                  value={workshopUrl}
                  size={256}
                  level="M"
                />
              </div>
              
              <div className="space-y-4">
                <button
                  onClick={downloadQRCode}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2 mx-auto"
                >
                  <Download className="h-5 w-5" />
                  <span>Download QR Code</span>
                </button>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Registration URL:</p>
                  <code className="text-sm bg-white px-2 py-1 rounded border break-all">
                    {workshopUrl}
                  </code>
                </div>
                
                <p className="text-gray-600">
                  Share this QR code to allow participants to easily register for your workshop
                </p>
              </div>
            </div>
          )}

          {activeTab === 'feedback' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Participant Feedback ({feedbackCount} responses)
              </h3>
              
              {feedbackCount === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No feedback yet</h4>
                  <p className="text-gray-600">Feedback will appear here after the workshop</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {workshopRegistrations
                    .filter(r => r.feedbackSubmitted)
                    .map((registration) => (
                      <div key={registration.id} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{registration.name}</h4>
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star} 
                                className="h-4 w-4 text-yellow-400 fill-current" 
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-600">{registration.feedback}</p>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WorkshopManagement;