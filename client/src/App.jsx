import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import HomePage from './Pages/Home/Home';
import Dashboard from './Pages/Dashboard/Dashboard';
import Applications from './Pages/Application/Applications';
import SavedJobs from './Pages/Saved/SavedJobs';
import Profile from './Pages/Profile/Profile';
import AuthPage from './Pages/AuthPage/AuthPage';
import PostJob from './Pages/PostJob/PostJob';
import Role from './Pages/UserDetails/Role/Role';

const App = () => {
  return (
    <>
      {/* Toast container must be here */}
      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>
        <Route path="/" element={<HomePage />} /> 
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/applications" element={<Applications />}/>
        <Route path="/savedjobs" element={<SavedJobs />} />
        <Route path="/profile" element={<Profile />}/>
        <Route path="/auth" element={<AuthPage />}/>
        <Route path="/postjob" element={<PostJob />} />
        <Route path="/role" element={<Role/>} />
      </Routes>
    </>
  );
};

export default App;
