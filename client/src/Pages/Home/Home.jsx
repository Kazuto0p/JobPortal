// src/Pages/HomePage.jsx
import React from 'react';
// import Header from '../Components/Header/Header';
// import Title from '../Components/Title/Title';
// import Navigation from '../Components/Navigation/Navigation';
// import SearchBar from '../Components/SearchBar/SearchBar';
// import JobCard from '../Components/JobCard/JobCard';
import Header from '../../Components/Header/Header';
import Title from '../../Components/Title/Title';
import Navigation from '../../Components/Navigation/Navigation';
import SearchBar from '../../Components/SearchBar/SearchBar';
import JobCard from '../../Components/JobCard/JobCard';

const HomePage = () => {
  const jobs = [
    { company: "Stor-#fatter Altans", title: "Software Engineer", salary: "$80K - $105K/year", location: "San Francisco, CA", type: "Full-time" },
    { company: "Marketing Man", title: "Marketing Manager", salary: "$90K - $120K/year", location: "San Angeles, CA", type: "Full-time" },
    { company: "Dutajt Anrt Aagken", title: "Product Manager", salary: "$95K/year", location: "Portland, OR", type: "Full-time" },
    { company: "John Smith", title: "Data Scientist", salary: "$100K - $130K/year", location: "Austin, TX", type: "Full-time" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <Title />
      <Navigation />
      <SearchBar />
      {jobs.length === 0 ? (
        <div className="p-4 text-center text-gray-600">No jobs found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 max-w-7xl mx-auto">
          {jobs.map((job, index) => (
            <JobCard
              key={index}
              company={job.company}
              title={job.title}
              salary={job.salary}
              location={job.location}
              type={job.type}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
