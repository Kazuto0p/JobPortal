import React from 'react';
import { Link } from 'react-router-dom';

// Sidebar Component (reused)
const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-white shadow-md">
      <div className="p-4">

      <Link to="/"><h1 className="text-2xl font-bold text-blue-600">GetJob</h1></Link>      </div>
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

// ApplicationCard Component
const ApplicationCard = ({ name, role, status }) => {
  return (
    <div className="border rounded p-4 m-2 flex justify-between items-center">
      <div>
        <h3 className="text-lg font-bold">{name}</h3>
        <p className="text-gray-600">{role}</p>
      </div>
      <span className={`px-4 py-1 rounded ${status === 'Accepted' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
        {status}
      </span>
    </div>
  );
};

// Applications Component
const Applications = () => {
  const applications = [
    { name: "Alice Smith", role: "Upstos • Upstaged", status: "Accepted" },
    { name: "Bob Johnson", role: "Siatias • Full Time", status: "Recovered" },
    { name: "Carol White", role: "Upstos • So snad", status: "Jobended" },
  ];

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4">
        <h2 className="text-2xl font-bold">Applications View</h2>
        <div className="mt-4">
          {applications.map((app, index) => (
            <ApplicationCard
              key={index}
              name={app.name}
              role={app.role}
              status={app.status}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Applications;

