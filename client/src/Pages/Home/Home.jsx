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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Title />
      <Navigation />
      <SearchBar />
      {loading ? (
        <div className="p-4 text-center text-gray-600">Loading jobs...</div>
      ) : error ? (
        <div className="p-4 text-center text-red-600">{error}</div>
      ) : jobs.length === 0 ? (
        <div className="p-4 text-center text-gray-600">No jobs found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 max-w-7xl mx-auto">
          {jobs.map((job) => (
            <JobCard
              key={job._id}
              company={job.company}
              title={job.jobTitle || 'Untitled Job'}
              salary={job.salary}
              location={job.location}
              type={job.experiencelvl}
              role={job.role}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;