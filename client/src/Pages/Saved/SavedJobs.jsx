import React from 'react';
import { Link } from 'react-router-dom';

// Sidebar Component (reused)
const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-white shadow-md">
      <div className="p-4">

      <Link to="/"><h1 className="text-2xl font-bold text-blue-600">GetJob</h1></Link>
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

// JobCard Component (reused from previous conversation)
const JobCard = ({ role, company, status }) => {
  return (
    <div className="border rounded p-4 m-2 flex justify-between items-center">
      <div>
        <h3 className="text-lg font-bold">{role}</h3>
        <p className="text-gray-600">{company}</p>
      </div>
      <span className={`px-4 py-1 rounded ${status === 'Accepted' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
        {status}
      </span>
    </div>
  );
};

// SavedJobs Component
const SavedJobs = () => {
  const jobs = [
    { role: "Software Engineer", company: "Datage Difect Jor • Full Time", status: "Search Job" },
    { role: "Data Analyst", company: "Datage Jor • Full Time", status: "Princing" },
    { role: "Product Manager", company: "Datage Jor • Full Time", status: "Accepted" },
  ];

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4">
        <h2 className="text-2xl font-bold">Saved Jobs</h2>
        <div className="mt-4">
          {jobs.map((job, index) => (
            <JobCard
              key={index}
              role={job.role}
              company={job.company}
              status={job.status}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SavedJobs;