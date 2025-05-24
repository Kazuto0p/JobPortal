import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './Pages/Home/Home';
import Dashboard from './Pages/Dashboard/Dashboard';
import Applications from './Pages/Application/Applications';
import SavedJobs from './Pages/Saved/SavedJobs';
import Profile from './Pages/Profile/Profile';
// import Dashboard from './Components/Pages/Dashboard/Dashboard';

const App = () => {
  return (

    <Routes>
      <Route path="/" element={<HomePage />} /> 
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/applications" element={<Applications /> }/>
      <Route path='/savedjobs' element={<SavedJobs />} />
      <Route path='/profile' element={<Profile />}/>
    </Routes>
  );
};

export default App;
