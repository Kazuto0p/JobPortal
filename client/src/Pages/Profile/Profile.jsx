import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../UserContext';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-white shadow-mdNice">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-blue-600">Umesh</h1>
      </div>
      <nav className="mt-4">
        
        <Link to="/dashboard" className="flex items-center p-4 text-gray-600 hover:text-blue-600">
          <span className="mr-2">🏠</span> Dashboard
        </Link>
        <Link to="/savedjobs" className="flex items-center p-4 text-gray-600 hover:text-blue-600">
          <span className="mr-2">💼</span> Saved Jobs
        </Link>
        <Link to="/profile" className="flex items-center p-4 text-gray-600 hover:text-blue-600">
          <span className="mr-2">👤</span> Profile
        </Link>
      </nav>
    </div>
  );
};

const ProfileCard = ({ label, value }) => {
  return (
    <div className="border rounded p-4 m-2">
      <h3 className="text-lg font-bold">{label}</h3>
      <p className="text-gray-600">{value}</p>
    </div>
  );
};

const Profile = () => {
  const { userData, setUserData } = useUser();
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    skills: '',
    experience: '',
    education: '',
    linkedin: '',
    github: '',
    portfolio: '',
    profilepicture: null
  });

  useEffect(() => {
    if (!userData) {
      navigate('/auth');
      return;
    }

    // Pre-fill form with existing user data
    setFormData({
      username: userData.username || '',
      email: userData.email || '',
      phone: userData.phone || '',
      location: userData.location || '',
      bio: userData.bio || '',
      skills: userData.skills || '',
      experience: userData.experience || '',
      education: userData.education || '',
      linkedin: userData.linkedin || '',
      github: userData.github || '',
      portfolio: userData.portfolio || '',
      profilepicture: userData.profilepicture || null
    });
  }, [userData, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        profilepicture: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!userData || !userData._id) {
        toast.error('User data not found. Please try logging in again.');
        navigate('/auth');
        return;
      }

      const token = isAuthenticated ? await getAccessTokenSilently() : localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication token not found. Please log in again.');
        navigate('/auth');
        return;
      }

      const formDataToSend = new FormData();
      
      // Append all text fields
      Object.keys(formData).forEach(key => {
        if (key !== 'profilepicture' || formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Add profileComplete flag
      formDataToSend.append('profileComplete', 'true');

      // First try the new endpoint
      try {
        const response = await axios.put(
          `${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/users/profile/${userData._id}`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );

        if (response.status === 200) {
          const updatedUser = response.data.data || response.data;
          setUserData(updatedUser);
          toast.success('Profile updated successfully');
          navigate('/');
          return;
        }
      } catch (newEndpointError) {
        // If new endpoint fails, try the old endpoint
        console.log('Trying fallback endpoint...');
        const response = await axios.put(
          `${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/updateProfile/${userData._id}`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );

        if (response.status === 200) {
          const updatedUser = response.data.data || response.data;
          setUserData(updatedUser);
          toast.success('Profile updated successfully');
          navigate('/');
        }
      }
    } catch (error) {
      console.error('Profile update error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      toast.error(errorMessage);
      
      // If unauthorized, redirect to auth page
      if (error.response?.status === 401) {
        navigate('/auth');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const profileDetails = [
    { label: "Name", value: "John Doe" },
    { label: "Email", value: "john.doe@gmail.com" },
    { label: "Resume", value: "Uploaded on 1st Apr 2025" },
    { label: "Account Created", value: "15th Mar 2024" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Complete Your Profile</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows="3"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Professional Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Professional Information</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Skills</label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                placeholder="e.g., JavaScript, React, Node.js (comma separated)"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Experience</label>
              <textarea
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                rows="3"
                placeholder="Brief description of your work experience"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Education</label>
              <textarea
                name="education"
                value={formData.education}
                onChange={handleInputChange}
                rows="3"
                placeholder="Your educational background"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Social Links</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">LinkedIn</label>
                <input
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">GitHub</label>
                <input
                  type="url"
                  name="github"
                  value={formData.github}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Portfolio Website</label>
                <input
                  type="url"
                  name="portfolio"
                  value={formData.portfolio}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Profile Picture */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;