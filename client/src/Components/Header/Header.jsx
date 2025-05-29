

import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

const Header = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth0();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  // Auth0 signup
  const authsignup = async () => {
    console.log('Authentication to db');
    const username = user?.name || user?.email.split('@')[0];
    const email = user?.email;
    try {
      const res = await axios.post('http://localhost:3000/api/authsignup', { username, email });
      if (res.status === 201) navigate('/role');
      setUserData(res.data);
    } catch (error) {
      console.error('Error during authentication:', error.response?.data || error.message);
      toast.error('Authentication failed. Please try again.');
    }
  };

  // Fetch user data using token
  const fetchUserData = async () => {
    const token = localStorage.getItem('token');
    if (token && !isAuthenticated) {
      try {
        const decoded = jwtDecode(token);
        const email = decoded.email;
        if (!email) {
          throw new Error('Email not found in token');
        }
        const res = await axios.post('http://localhost:3000/api/getUser', { email });
        setUserData(res.data);
      } catch (error) {
        console.error('Error fetching user data:', error.response?.data || error.message);
        if (error.response?.status === 401 || error.response?.status === 404) {
          localStorage.removeItem('token');
          setUserData(null);
        }
      }
    }
  };

  // Handle Post Job button click
  const handlePostJobClick = async () => {
    const email = isAuthenticated ? user?.email : userData?.email;
    if (!email) {
      toast.error('Please log in to post a job.');
      return;
    }
    try {
      const res = await axios.post('http://localhost:3000/api/getUser', { email });
      const userRole = res.data.role;
      if (userRole === 'recruiter') {
        navigate('/postjob');
      } else {
        toast.error('You are not a recruiter');
      }
    } catch (error) {
      console.error('Error checking user role:', error.response?.data || error.message);
      toast.error('Something went wrong. Please try again.');
    }
  };

  const handleLogout = () => {
    setShowProfileDropdown(false);
    if (isAuthenticated) {
      logout({ returnTo: window.location.origin });
    } else {
      localStorage.removeItem('token');
      setUserData(null);
      navigate('/');
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showProfileDropdown &&
        !event.target.closest('.profile-dropdown') &&
        !event.target.closest('.profile-button')
      ) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileDropdown]);

  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('Authenticated user detected:', user);
      authsignup();
    } else {
      fetchUserData();
    }
  }, [isAuthenticated, user]);

  if (isLoading) {
    return (
      <header className="bg-white shadow-sm">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-primary">GetJob</div>
          <div className="text-gray-600">Loading...</div>
        </nav>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-primary hover:text-primaryHover transition-colors">
          GetJob
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link
            to="/"
            className="bg-primary text-gray-600 px-4 py-2 rounded-lg hover:bg-primaryHover transition-all transform hover:scale-105"
          >
            Home
          </Link>

          {(isAuthenticated || userData) ? (
            <>
              <button
                onClick={handlePostJobClick}
                className="bg-primary text-gray-600 px-4 py-2 rounded-lg hover:bg-primaryHover transition-all transform hover:scale-105"
              >
                Post Job
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowProfileDropdown((prev) => !prev)}
                  className="profile-button flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors"
                >
                  <img
                    src={userData?.profilpicture || user?.picture || '/reshot-icon-user-profile-68ZR2F7VPJ.svg'}
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                  />
                  <span>{userData?.username || user?.name || user?.email?.split('@')[0] || 'User'}</span>
                </button>
                {showProfileDropdown && (
                  <div className="profile-dropdown absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
                    <div className="flex flex-col items-center mb-4">
                      <img
                        src={userData?.profilpicture || user?.picture || '/reshot-icon-user-profile-68ZR2F7VPJ.svg'}
                        alt="Profile"
                        className="w-12 h-12 rounded-full mb-2"
                      />
                      <p className="font-semibold text-gray-800">
                        {userData?.username || user?.name || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-600">{userData?.email || user?.email || 'N/A'}</p>
                    </div>
                    <hr className="my-2" />
                    <button
                      onClick={handleLogout}
                      className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/auth?mode=signup')}
                className="bg-primary text-gray-600 px-4 py-2 rounded-lg hover:bg-primaryHover transition-all transform hover:scale-105"
              >
                Sign Up
              </button>
              <button
                onClick={() => navigate('/auth?mode=login')}
                className="bg-primary text-gray-600 px-4 py-2 rounded-lg hover:bg-primaryHover transition-all transform hover:scale-105"
              >
                Login
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-gray-600 hover:text-primary" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link
              to="/"
              className="text-gray-600 hover:text-primary transition-colors"
              onClick={toggleMobileMenu}
            >
              Home
            </Link>
            {(isAuthenticated || userData) ? (
              <>
                <button
                  onClick={() => {
                    handlePostJobClick();
                    toggleMobileMenu();
                  }}
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primaryHover transition-all"
                >
                  Post Job
                </button>
                <div className="flex flex-col items-start">
                  <button
                    onClick={() => setShowProfileDropdown((prev) => !prev)}
                    className="profile-button flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors"
                  >
                    <img
                      src={userData?.profilpicture || user?.picture || '/reshot-icon-user-profile-68ZR2F7VPJ.svg'}
                      alt="Profile"
                      className="w-8 h-8 rounded-full"
                    />
                    <span>{userData?.username || user?.name || user?.email?.split('@')[0] || 'User'}</span>
                  </button>
                  {showProfileDropdown && (
                    <div className="profile-dropdown mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg p-4">
                      <div className="flex flex-col items-center mb-4">
                        <img
                          src={userData?.profilpicture || user?.picture || '/reshot-icon-user-profile-68ZR2F7VPJ.svg'}
                          alt="Profile"
                          className="w-12 h-12 rounded-full mb-2"
                        />
                        <p className="font-semibold text-gray-800">
                          {userData?.username || user?.name || 'N/A'}
                        </p>
                        <p className="text-sm text-gray-600">{userData?.email || user?.email || 'N/A'}</p>
                      </div>
                      <hr className="my-2" />
                      <button
                        onClick={() => {
                          handleLogout();
                          toggleMobileMenu();
                        }}
                        className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    navigate('/auth?mode=signup');
                    toggleMobileMenu();
                  }}
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Sign Up
                </button>
                <button
                  onClick={() => {
                    navigate('/auth?mode=login');
                    toggleMobileMenu();
                  }}
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primaryHover transition-all"
                >
                  Login
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;