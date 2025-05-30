import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../UserContext";

const RecruiterPortal = () => {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const { userData } = useUser();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);

  const email = isAuthenticated ? user?.email : userData?.email;
  const role = userData?.role;

  useEffect(() => {
    if (isLoading) return;

    if (!email) {
      toast.error("Please log in.");
      return navigate("/login");
    }

    if (role !== "recruiter") {
      toast.error("Access denied.");
      return navigate("/");
    }

    const fetchApplications = async () => {
      try {
        setLoading(true);
        const token = await getAccessTokenSilently();
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/applications/recruiter/${email}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setApplications(res.data.applications || []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch applications.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [email, isAuthenticated, isLoading, role]);

  const updateStatus = async (id, status) => {
    let accessToken;
    try {
      accessToken = await getAccessTokenSilently();
      console.log('Token obtained:', accessToken ? 'Yes' : 'No');
      console.log('Token length:', accessToken?.length);
      console.log('Request URL:', `${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/applications/${id}/status`);
      
      if (!accessToken) {
        console.error('No token available');
        toast.error("Authentication failed. Please log in again.");
        navigate('/auth');
        return;
      }

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/applications/${id}/status`,
        { status },
        { 
          headers: { 
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      if (response.status === 200) {
        setApplications((apps) =>
          apps.map((app) => (app._id === id ? { ...app, status } : app))
        );
        toast.success(`Application ${status.toLowerCase()}!`);
      }
    } catch (error) {
      console.error('Error updating status:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
        message: error.message,
        hasToken: !!accessToken
      });

      if (error.response?.status === 403) {
        toast.error(error.response?.data?.message || "You don't have permission to update this application.");
      } else if (error.response?.status === 401) {
        console.error('Auth headers:', error.config?.headers);
        toast.error(error.response?.data?.message || "Authentication failed. Please try logging in again.");
        navigate('/auth');
      } else {
        toast.error(error.response?.data?.message || "Failed to update status.");
      }
    }
  };

  if (isLoading || loading) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Recruiter Portal</h2>
      {applications.length === 0 ? (
        <p className="text-gray-600">No applications found.</p>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => {
            const status = app.status?.toLowerCase();
            return (
              <div
                key={app._id}
                className="border rounded-lg p-4 bg-white shadow-sm flex justify-between items-center"
              >
                <div>
                  <h3 className="text-lg font-semibold">
                    {app.jobId.jobTitle} at {app.jobId.company}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Applicant: {app.jobSeekerEmail}
                  </p>
                  <p className="text-sm text-gray-600">
                    Location: {app.jobId.location}
                  </p>
                  <p className="text-sm text-gray-600">
                    Applied: {new Date(app.appliedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-4 py-1 rounded ${
                      status === "accepted"
                        ? "bg-green-100 text-green-600"
                        : status === "rejected"
                        ? "bg-red-100 text-red-600"
                        : "bg-orange-100 text-orange-600"
                    }`}
                  >
                    {app.status}
                  </span>
                  {status === "pending" && (
                    <>
                      <button
                        onClick={() => updateStatus(app._id, "Accepted")}
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => updateStatus(app._id, "Rejected")}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecruiterPortal;
