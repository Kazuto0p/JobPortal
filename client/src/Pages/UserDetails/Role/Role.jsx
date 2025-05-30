import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { useUser } from '../../../UserContext';
import { toast } from 'react-toastify';

const Role = () => {
  const [role, setRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const { userData, updateUserData } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        // Get email either from Auth0 user or local userData
        const email = userData?.email;
        if (!email) {
          console.error('No email found');
          navigate('/auth');
          return;
        }

        const token = await getAccessTokenSilently();
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/users`, 
          { email },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('User data loaded:', res.data);
        setUser(res.data);
        
        // If user already has a role, redirect to home
        if (res.data.role) {
          navigate('/');
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        setError('Failed to load user data');
        if (error.response?.status === 401) {
          navigate('/auth');
        }
      }
    };

    if (!isLoading) {
      loadData();
    }
  }, [userData, navigate, getAccessTokenSilently]);

  const handleChange = (e) => {
    setRole(e.target.value);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!role) {
      setError("Please select a role");
      return;
    }

    if (!user?.email) {
      setError("User email not found");
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const token = await getAccessTokenSilently();
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/updateRole`,
        {
          email: user.email,
          role: role
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.status === 200) {
        // Update local user data
        updateUserData({ ...user, role });
        toast.success('Role updated successfully');
        navigate('/');
      }
    } catch (err) {
      console.error("Role update error:", err);
      setError(err.response?.data?.message || "Failed to update role");
      toast.error(err.response?.data?.message || "Failed to update role");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Choose your role
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 text-red-600 text-sm">{error}</div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  id="jobSeeker"
                  type="radio"
                  name="role"
                  value="jobSeeker"
                  checked={role === 'jobSeeker'}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <label htmlFor="jobSeeker" className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer">
                  <div className="font-semibold">Job Seeker</div>
                  <div className="text-gray-500 text-xs">Looking for job opportunities</div>
                </label>
              </div>

              <div className="flex items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  id="recruiter"
                  type="radio"
                  name="role"
                  value="recruiter"
                  checked={role === 'recruiter'}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <label htmlFor="recruiter" className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer">
                  <div className="font-semibold">Recruiter</div>
                  <div className="text-gray-500 text-xs">Hiring and posting jobs</div>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !role}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                isLoading || !role
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              } transition-colors`}
            >
              {isLoading ? 'Updating...' : 'Continue'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Role;