// import React from 'react';
// import { Link } from 'react-router-dom';

// // Sidebar Component (reused)
// const Sidebar = () => {
//   return (
//     <div className="w-64 h-screen bg-white shadow-md">
//       <div className="p-4">

//       <Link to="/"><h1 className="text-2xl font-bold text-blue-600">GetJob</h1></Link>
//       </div>
//       <nav className="mt-4">
//   <Link to="/dashboard" className="flex items-center p-4 text-gray-600 hover:text-blue-600">
//     <span className="mr-2">🏠</span> Dashboard
//   </Link>
//         <Link to="/savedjobs" className="flex items-center p-4 text-gray-600 hover:text-blue-600">
//           <span className="mr-2">💼</span> Saved Jobs
//         </Link>
//         <Link to="/profile" className="flex items-center p-4 text-gray-600 hover:text-blue-600">
//           <span className="mr-2">👤</span> Profile
//         </Link>
//       </nav>
//     </div>
//   );
// };

// // JobCard Component (reused from previous conversation)
// const JobCard = ({ role, company, status }) => {
//   return (
//     <div className="border rounded p-4 m-2 flex justify-between items-center">
//       <div>
//         <h3 className="text-lg font-bold">{role}</h3>
//         <p className="text-gray-600">{company}</p>
//       </div>
//       <span className={`px-4 py-1 rounded ${status === 'Accepted' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
//         {status}
//       </span>
//     </div>
//   );
// };

// // SavedJobs Component
// const SavedJobs = () => {
//   const jobs = [
//     { role: "Software Engineer", company: "Datage Difect Jor • Full Time", status: "Search Job" },
//     { role: "Data Analyst", company: "Datage Jor • Full Time", status: "Princing" },
//     { role: "Product Manager", company: "Datage Jor • Full Time", status: "Accepted" },
//   ];

//   return (
//     <div className="flex">
//       <Sidebar />
//       <div className="flex-1 p-4">
//         <h2 className="text-2xl font-bold">Saved Jobs</h2>
//         <div className="mt-4">
//           {jobs.map((job, index) => (
//             <JobCard
//               key={index}
//               role={job.role}
//               company={job.company}
//               status={job.status}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SavedJobs;

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth0 } from '@auth0/auth0-react';

// Reused JobCard component (same as in HomePage)
const JobCard = ({ company, title, salary, location, type }) => {
  return (
    <div className="border rounded-lg p-6 m-2 flex justify-between items-center bg-white shadow-sm hover:shadow-md transition-shadow">
      <div>
        <h3 className="text-xl font-semibold text-gray-900">{company}</h3>
        <p className="text-lg font-medium text-gray-700">{title}</p>
        <p className="text-sm text-gray-500">{salary}</p>
        <p className="text-sm text-gray-500">{location} • {type}</p>
      </div>
    </div>
  );
};

// Sidebar Component (unchanged)
const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-white shadow-md">
      <div className="p-4">
        <Link to="/" className="text-2xl font-bold text-blue-600">GetJob</Link>
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

// SavedJobs Component
const SavedJobs = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



const handleRemove = async (jobId) => {
  try {
    const email = localStorage.getItem("email");

    if (!email) {
      toast.error("User email not found. Please log in.");
      return;
    }

    await axios.post("http://localhost:3000/api/removeSavedJob", {
      email,
      jobId,
    });

    setSavedJobs((prev) => prev.filter((job) => job._id !== jobId));
    toast.success("Job removed successfully.");
  } catch (error) {
    console.error("Error removing job:", error);
    toast.error("Something went wrong.");
  }
};


  useEffect(() => {
    const fetchSavedJobs = async () => {
      const userData = JSON.parse(localStorage.getItem('userData')) || null;
      const email = isAuthenticated ? user?.email : userData?.email;

      if (!email) {
        setError('Please log in to view saved jobs.');
        setLoading(false);
        navigate('/auth?mode=login');
        return;
      }

      try {
        const res = await axios.post('http://localhost:3000/api/getSavedJobs', { email });
        setSavedJobs(res.data.savedJobs || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching saved jobs:', error.response?.data || error.message);
        setError('Failed to fetch saved jobs. Please try again.');
        setLoading(false);
        toast.error('Failed to fetch saved jobs.');
      }
    };

    if (!isLoading) {
      fetchSavedJobs();
    }
  }, [isAuthenticated, user, isLoading, navigate]);

  if (isLoading || loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-4">
          <h2 className="text-2xl font-bold">Saved Jobs</h2>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-4">
          <h2 className="text-2xl font-bold">Saved Jobs</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4">
        <h2 className="text-2xl font-bold">Saved Jobs</h2>
        <div className="mt-4">
          {savedJobs.length === 0 ? (
            <p className="text-gray-600">No saved jobs found.</p>
          ) : (
            savedJobs.map((job) => (
              <div
                key={job._id}
                className="relative border rounded-lg p-6 m-2 bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <JobCard
                  company={job.company}
                  title={job.title}
                  salary={job.salary}
                  location={job.location}
                  type={job.type}
                />
                <button
                  onClick={() => handleRemove(job._id)}
                  className="absolute top-2 right-2 text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Remove
                </button>
              </div>
            ))

          )}
        </div>
      </div>
    </div>
  );
};

export default SavedJobs;