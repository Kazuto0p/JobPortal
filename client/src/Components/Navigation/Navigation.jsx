import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <div className="flex space-x-4 p-4 border-b">
      <a href="#" className="text-blue-600 border-b-2 border-blue-600 pb-1">Home</a>
      {/* <a href="/dashboard" className="text-gray-600 hover:text-blue-600">Dashboard</a> */}

<Link to="/dashboard" className="text-gray-600 hover:text-blue-600">
  Dashboard
</Link>

<Link to="/applications" className="text-gray-600 hover:text-blue-600">
  Applications
</Link>

<Link to="/savedjobs" className="text-gray-600 hover:text-blue-600">
  Saved Jobs
</Link>
      {/* <a href="#" className="text-gray-600 hover:text-blue-600">Applications</a> */}
      {/* <a href="#" className="text-gray-600 hover:text-blue-600">Saved Jobs</a> */}
    </div>
  );
};

export default Navigation;
