import React from 'react';
import { Link } from 'react-router-dom';

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
  const profileDetails = [
    { label: "Name", value: "John Doe" },
    { label: "Email", value: "john.doe@gmail.com" },
    { label: "Resume", value: "Uploaded on 1st Apr 2025" },
    { label: "Account Created", value: "15th Mar 2024" },
  ];

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4">
        <h2 className="text-2xl font-bold">Profile</h2>
        <div className="mt-4 flex flex-col items-center">
          <img
            src="/mercedes_amg_gt_track_series_2022_5k-5120x2880.jpg"
            alt="User Profile"
            className="w-32 h-32 rounded-full mb-4 border-2 border-blue-600"
          />
          <div className="w-full max-w-lg">
            {profileDetails.map((detail, index) => (
              <ProfileCard
                key={index}
                label={detail.label}
                value={detail.value}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;