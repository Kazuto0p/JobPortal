import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "react-toastify";
import { useUser } from "../../UserContext";

// Sidebar Component
const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-white shadow-md">
      <div className="p-4">
        <Link to="/">
          <h1 className="text-2xl font-bold text-blue-600">GetJob</h1>
        </Link>
      </div>
      <nav className="mt-4">
        <Link
          to="/dashboard"
          className="flex items-center p-4 text-gray-600 hover:text-blue-600"
        >
          <span className="mr-2">🏠</span> Dashboard
        </Link>
        <Link
          to="/savedjobs"
          className="flex items-center p-4 text-gray-600 hover:text-blue-600"
        >
          <span className="mr-2">💼</span> Saved Jobs
        </Link>
        <Link
          to="/profile"
          className="flex items-center p-4 text-gray-600 hover:text-blue-600"
        >
          <span className="mr-2">👤</span> Profile
        </Link>
      </nav>
    </div>
  );
};

// ApplicationCard Component
const ApplicationCard = ({ jobTitle, company, location, status }) => {
  return (
    <div className="border rounded p-4 m-2 flex justify-between items-center">
      <div>
        <h3 className="text-lg font-bold">
          {jobTitle} at {company}
        </h3>
        <p className="text-gray-600">{location}</p>
      </div>
      <span
        className={`px-4 py-1 rounded ${
          status === "Accepted"
            ? "bg-green-100 text-green-600"
            : status === "Rejected"
            ? "bg-red-100 text-red-600"
            : "bg-orange-100 text-orange-600"
        }`}
      >
        {status}
      </span>
    </div>
  );
};

// Applications Component
const Applications = () => {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const { userData } = useUser();
  const [applications, setApplications] = useState([]);
  const [fetching, setFetching] = useState(false);
  const navigate = useNavigate();

  const email = isAuthenticated ? user?.email : userData?.email;

  useEffect(() => {
    if (isLoading) return;
    if (!email) {
      toast.error("Please log in to view applications.");
      navigate("/login");
      return;
    }

    const fetchApplications = async () => {
      setFetching(true);
      try {
        const token = await getAccessTokenSilently();
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/applications/jobseeker/${email}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Jobseeker applications:", res.data);
        setApplications(res.data.applications || []);
      } catch (error) {
        console.error("Error fetching applications:", error.response?.data || error.message);
        toast.error("Failed to fetch applications.");
      } finally {
        setFetching(false);
      }
    };

    fetchApplications();
  }, [email, isAuthenticated, isLoading, navigate]);

  if (isLoading || fetching) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4">
        <h2 className="text-2xl font-bold">Applications View</h2>
        <div className="mt-4">
          {applications.length === 0 ? (
            <p className="text-gray-600">No applications found.</p>
          ) : (
            applications.map((app) => (
              <ApplicationCard
                key={app._id}
                jobTitle={app.jobId.jobTitle}
                company={app.jobId.company}
                location={app.jobId.location}
                status={app.status}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Applications;