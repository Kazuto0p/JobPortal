import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

const Role = () => {
  const [role, setRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState([])
//   const { user, isAuthenticated } = useAuth0();
  const navigate = useNavigate();


  const loadData = async()=>{
    try {
        const email = localStorage.getItem("email")
        const res = await axios.get("http://localhost:3000/api/getUser", {email})
        console.log(res)
        setUser(res.data)
    } catch (error) {
        console.log(error)
    }
  }

  useEffect(()=>{
    loadData()
  },[])


  const handleChange = (e) => {
    setRole(e.target.value);
    setError(''); // Clear any previous errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!role) {
      setError("Please select a role");
      return;
    }

    // if (!isAuthenticated || !user) {
    //   setError("User not authenticated");
    //   return;
    // }

    setIsLoading(true);
    setError('');

    try {
      // Update user role in database
      const response = await axios.put('http://localhost:3000/api/updateRole', {
        email: user.email,
        role: role
      });

      if (response.status === 200) {
        // Role updated successfully, redirect to dashboard
        navigate('/');
      }
    } catch (err) {
      console.error("Role update error:", err);
      setError(err.response?.data?.message || "Failed to update role");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Choose Your Role
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Select your role to get started
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            
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

          <div>
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
          </div>
        </form>
      </div>
    </div>
  );
};

export default Role;