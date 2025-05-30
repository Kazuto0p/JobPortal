import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth0 } from "@auth0/auth0-react";
import { useUser } from "../../UserContext";

const JobCard = ({ _id, company, jobTitle, salary, location, experiencelvl, role }) => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const { userData } = useUser();

  const handleSaveJob = async () => {
    const email = isAuthenticated ? user?.email : userData?.email;
    if (!email) {
      toast.error("Please log in to save jobs.");
      return;
    }

    const jobData = {
      _id,
      company,
      title: jobTitle,
      salary,
      location,
      type: experiencelvl,
      role,
    };

    try {
      const res = await axios.post("http://localhost:3000/api/savedJobs", {
        email,
        jobId: jobData._id,
        data: jobData,
      });
      console.log("Job Saved:", res.data);
      toast.success("Job saved successfully!");
    } catch (error) {
      console.error("Error saving job:", error.response?.data || error.message);
      toast.error("Failed to save job. Please try again.");
    }
  };

  const handleApplyJob = async () => {
    const email = isAuthenticated ? user?.email : userData?.email;
    if (!email) {
      toast.error("Please log in to apply for jobs.");
      return;
    }

    try {
      // Check if user has a role set
      if (!userData?.role) {
        toast.error("Please set your role before applying for jobs.");
        return;
      }

      // Check if user is a job seeker
      if (userData.role !== "jobSeeker") {
        toast.error("Only job seekers can apply for jobs.");
        return;
      }

      const token = await getAccessTokenSilently();
      const res = await axios.post(
        "http://localhost:3000/api/applications/apply",
        {
          jobId: _id,
          jobSeekerEmail: email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log("Job Application Submitted:", res.data);
      toast.success("Application submitted successfully!");
    } catch (error) {
      console.error("Error applying for job:", error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || "Failed to apply for job. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="border rounded-lg p-6 m-2 flex justify-between items-center bg-white shadow-sm hover:shadow-md transition-shadow">
      <div>
        <h3 className="text-xl font-semibold text-gray-900">{company}</h3>
        <p className="text-lg font-medium text-gray-700">{jobTitle}</p>
        <p className="text-sm text-gray-500">{salary}</p>
        <p className="text-sm text-gray-500">
          {location} • {experiencelvl}
        </p>
      </div>
      <div className="flex space-x-3">
        <button
          onClick={handleSaveJob}
          className="border border-gray-300 px-4 py-2 rounded text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
        >
          Save
        </button>
        <button
          onClick={handleApplyJob}
          className="bg-blue-500 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-600 transition-colors"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default JobCard;