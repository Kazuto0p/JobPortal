import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth0 } from "@auth0/auth0-react";

const JobCard = ({ _id, company, jobTitle, salary, location, experiencelvl, role}) => {
  const { user, isAuthenticated } = useAuth0();
  const userData = JSON.parse(localStorage.getItem("userData")) || null;

  const handleSaveJob = async () => {
    const email = isAuthenticated ? user?.email : userData?.email;
    if (!email) {
      toast.error("Please log in to save jobs.");
      return;
    }

    const jobData = {
      _id,
      company,
      title: jobTitle, // Align with jobSchema's jobTitle
      salary,
      location,
      type: experiencelvl, // Align with jobSchema's experiencelvl
      role,
    };

    try {
      const res = await axios.post("http://localhost:3000/api/savedJobs", {
        email,
        jobId: jobData._id ,
        data: jobData,
      });
      console.log('Job Saved ', res.data)
      toast.success("Job saved successfully!");
    } catch (error) {
      console.error("Error saving job:", error.response?.data || error.message);
      toast.error("Failed to save job. Please try again.");
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
        <button className="bg-blue-500 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-600 transition-colors">
          Apply
        </button>
      </div>
    </div>
  );
};

export default JobCard;