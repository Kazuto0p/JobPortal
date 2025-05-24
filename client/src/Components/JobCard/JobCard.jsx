import React from 'react';
const JobCard = ({ company, title, salary, location, type }) => {
    return (
      <div className="border rounded-lg p-6 m-2 flex justify-between items-center bg-white shadow-sm hover:shadow-md transition-shadow">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{company}</h3>
          <p className="text-lg font-medium text-gray-700">{title}</p>
          <p className="text-sm text-gray-500">{salary}</p>
          <p className="text-sm text-gray-500">{location} • {type}</p>
        </div>
        <div className="flex space-x-3">
          <button className="border border-gray-300 px-4 py-2 rounded text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
            Save
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-600 transition-colors">
            Apply
          </button>
        </div>
      </div>
    );
  };

export default JobCard;