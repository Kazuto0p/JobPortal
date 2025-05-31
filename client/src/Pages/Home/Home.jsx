import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../Components/Header/Header';
import Title from '../../Components/Title/Title';
import Navigation from '../../Components/Navigation/Navigation';
import SearchBar from '../../Components/SearchBar/SearchBar';
import JobCard from '../../Components/JobCard/JobCard';

const HomePage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/jobs`);
        setJobs(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch jobs. Please try again later.');
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleJobClick = (job) => {
    setSelectedJob(job);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Title />
      <Navigation />
      <SearchBar />
      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto p-4 gap-4">
        {/* Job Cards Column */}
        <div className="w-full lg:w-1/2">
          {loading ? (
            <div className="p-4 text-center text-gray-600">Loading jobs...</div>
          ) : error ? (
            <div className="p-4 text-center text-red-600">{error}</div>
          ) : jobs.length === 0 ? (
            <div className="p-4 text-center text-gray-600">No jobs found.</div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {jobs.map((job) => (
                <div
                  key={job._id}
                  onClick={() => handleJobClick(job)}
                  className={`cursor-pointer ${selectedJob?._id === job._id ? 'ring-2 ring-blue-500' : ''}`}
                >
                  <JobCard
                     _id={job._id}
                    company={job.company}
                    title={job.jobTitle || 'Untitled Job'}
                    salary={job.salary}
                    location={job.location}
                    type={job.experiencelvl}
                    role={job.role}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Job Details Panel */}
        <div className="w-full lg:w-1/2 bg-white p-6 rounded-lg shadow-md hidden lg:block">
          {selectedJob ? (
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{selectedJob.jobTitle || 'Untitled Job'}</h2>
              <p className="text-lg text-gray-600">{selectedJob.company}</p>
              <div className="mt-4 space-y-2">
                <p><span className="font-semibold">Location:</span> {selectedJob.location}</p>
                <p><span className="font-semibold">Salary:</span> {selectedJob.salary}</p>
                <p><span className="font-semibold">Experience Level:</span> {selectedJob.experiencelvl}</p>
                <p><span className="font-semibold">Role:</span> {selectedJob.role}</p>
                {/* Add more job details as available in your API response */}
                {selectedJob.description && (
                  <p><span className="font-semibold">Description:</span> {selectedJob.description}</p>
                )}
              </div>
              <div className=' gap 10px'>

              <button
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => setSelectedJob(null)}
              >
                Close
              </button>

              {/* <button
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => setSelectedJob(null)}
              > <img className='ob' src="../../../public/ban.png" alt="" srcset="" />
              
              </button> */}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-600">
              Select a job to view details
            </div>
          )}
        </div>
        {/* Mobile Job Details Modal */}
        {selectedJob && (
          <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-11/12 max-w-md">
              <h2 className="text-2xl font-bold text-gray-800">{selectedJob.jobTitle || 'Untitled Job'}</h2>
              <p className="text-lg text-gray-600">{selectedJob.company}</p>
              <div className="mt-4 space-y-2">
                <p><span className="font-semibold">Location:</span> {selectedJob.location}</p>
                <p><span className="font-semibold">Salary:</span> {selectedJob.salary}</p>
                <p><span className="font-semibold">Experience Level:</span> {selectedJob.experiencelvl}</p>
                <p><span className="font-semibold">Role:</span> {selectedJob.role}</p>
                {selectedJob.description && (
                  <p><span className="font-semibold">Description:</span> {selectedJob.description}</p>
                )}
              </div>
              <button
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
                onClick={() => setSelectedJob(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;