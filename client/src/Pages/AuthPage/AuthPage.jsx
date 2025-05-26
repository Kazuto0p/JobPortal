import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Facebook, Twitter, Instagram } from 'lucide-react';

const AuthPage = () => {
  const [isSignIn, setIsSignIn] = useState(false);

  // Toggle between sign-in and sign-up
  const toggle = () => {
    setIsSignIn((prev) => !prev);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSignIn(true);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`relative min-h-screen overflow-hidden font-['Poppins'] ${isSignIn ? 'sign-in' : 'sign-up'}`}>
      {/* Background Effect */}
      <div
        className={`absolute top-0 right-0 h-screen w-[300vw] transition-all duration-1000 ease-in-out z-10 shadow-2xl ${
          isSignIn 
            ? 'translate-x-0 right-1/2' 
            : 'translate-x-full right-1/2'
        } bg-gradient-to-br from-[#4EA685] to-[#57B894] rounded-tl-[max(50vw,50vh)] rounded-br-[max(50vw,50vh)]`}
        style={{ transform: isSignIn ? 'translate(0, 0)' : 'translate(100%, 0)' }}
      />

      <div className="flex flex-wrap h-screen">
        {/* SIGN UP FORM */}
        <div className={`w-1/2 flex items-center justify-center text-center flex-col transition-transform duration-500 ease-in-out z-20 
          md:w-1/2 md:static md:bg-transparent md:rounded-none md:p-0
          ${!isSignIn ? 'translate-y-0' : 'translate-y-full md:translate-y-0'}
          absolute bottom-0 w-full p-8 bg-white rounded-t-3xl`}>
          
          {/* Mobile Label */}
          <div className="md:hidden mb-4 w-full">
            <h3 className="text-2xl font-bold text-gray-800">Sign Up</h3>
            <div className="w-16 h-1 bg-[#4EA685] mx-auto mt-2 rounded-full"></div>
          </div>
          
          <div className="w-full max-w-md flex items-center justify-center">
            <div
              className={`p-4 bg-white rounded-3xl shadow-2xl transform transition-all duration-500 ease-in-out ${
                !isSignIn ? 'scale-100 delay-1000' : 'scale-0'
              } w-full md:shadow-none md:p-0 md:rounded-none`}
            >
              <div className="relative mb-4">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-6 h-6" />
                <input
                  type="text"
                  placeholder="Username"
                  className="w-full p-4 pl-12 bg-gray-100 rounded-lg border-2 border-white focus:border-[#4EA685] outline-none text-gray-700"
                />
              </div>
              <div className="relative mb-4">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-6 h-6" />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full p-4 pl-12 bg-gray-100 rounded-lg border-2 border-white focus:border-[#4EA685] outline-none text-gray-700"
                />
              </div>
              <div className="relative mb-4">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-6 h-6" />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full p-4 pl-12 bg-gray-100 rounded-lg border-2 border-white focus:border-[#4EA685] outline-none text-gray-700"
                />
              </div>
              <div className="relative mb-4">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-6 h-6" />
                <input
                  type="password"
                  placeholder="Confirm password"
                  className="w-full p-4 pl-12 bg-gray-100 rounded-lg border-2 border-white focus:border-[#4EA685] outline-none text-gray-700"
                />
              </div>
              <button className="w-full py-3 bg-[#4EA685] text-white rounded-lg hover:bg-[#57B894] transition-colors text-lg font-medium cursor-pointer">
                Sign up
              </button>
              <label>OR</label>
              
              {/* Continue with Google Button */}
              <button className="w-full py-3 mt-3 bg-white text-gray-700 rounded-lg border-2 border-gray-200 hover:border-gray-300 hover:shadow-md transition-all text-lg font-medium cursor-pointer flex items-center justify-center gap-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
              
              <p className="mt-4 text-xs text-gray-600">
                <span>Already have an account? </span>
                <b onClick={toggle} className="text-[#4EA685] cursor-pointer hover:underline">
                  Sign in here
                </b>
              </p>
            </div>
          </div>

          {/* Social Media Icons for Sign Up */}
          <div className={`mt-8 p-4 bg-white rounded-3xl shadow-2xl transform transition-all duration-500 ease-in-out ${
            !isSignIn ? 'scale-100 delay-[1200ms]' : 'scale-0'
          } w-full max-w-md social-container md:shadow-2xl`}>
            <div className="flex justify-center space-x-2">
              <div className={`bg-[#4267B2] text-white p-3 rounded-lg cursor-pointer transform transition-all duration-500 ease-in-out hover:scale-110 ${
                !isSignIn ? 'scale-100 delay-[1400ms]' : 'scale-0'
              }`}>
                <Facebook className="w-6 h-6" />
              </div>
              <div className={`bg-[#DB4437] text-white p-3 rounded-lg cursor-pointer transform transition-all duration-500 ease-in-out hover:scale-110 ${
                !isSignIn ? 'scale-100 delay-[1600ms]' : 'scale-0'
              }`}>
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </div>
              <div className={`bg-[#1DA1F2] text-white p-3 rounded-lg cursor-pointer transform transition-all duration-500 ease-in-out hover:scale-110 ${
                !isSignIn ? 'scale-100 delay-[1800ms]' : 'scale-0'
              }`}>
                <Twitter className="w-6 h-6" />
              </div>
              <div className={`bg-[#E1306C] text-white p-3 rounded-lg cursor-pointer transform transition-all duration-500 ease-in-out hover:scale-110 ${
                !isSignIn ? 'scale-100 delay-[2000ms]' : 'scale-0'
              }`}>
                <Instagram className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* SIGN IN FORM */}
        <div className={`w-1/2 flex items-center justify-center text-center flex-col transition-transform duration-500 ease-in-out z-20
          md:w-1/2 md:static md:bg-transparent md:rounded-none md:p-0
          ${isSignIn ? 'translate-y-0' : 'translate-y-full md:translate-y-0'}
          absolute bottom-0 w-full p-8 bg-white rounded-t-3xl`}>
          
          {/* Mobile Label */}
          <div className="md:hidden mb-4 w-full">
            <h3 className="text-2xl font-bold text-gray-800">Login</h3>
            <div className="w-16 h-1 bg-[#4EA685] mx-auto mt-2 rounded-full"></div>
          </div>
          
          <div className="w-full max-w-md flex items-center justify-center">
            <div
              className={`p-4 bg-white rounded-3xl shadow-2xl transform transition-all duration-500 ease-in-out ${
                isSignIn ? 'scale-100 delay-1000' : 'scale-0'
              } w-full md:shadow-none md:p-0 md:rounded-none`}
            >
              <div className="relative mb-4">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-6 h-6" />
                <input
                  type="text"
                  placeholder="Username"
                  className="w-full p-4 pl-12 bg-gray-100 rounded-lg border-2 border-white focus:border-[#4EA685] outline-none text-gray-700"
                />
              </div>
              <div className="relative mb-4">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-6 h-6" />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full p-4 pl-12 bg-gray-100 rounded-lg border-2 border-white focus:border-[#4EA685] outline-none text-gray-700"
                />
              </div>
              <button className="w-full py-3 bg-[#4EA685] text-white rounded-lg hover:bg-[#57B894] transition-colors text-lg font-medium cursor-pointer">
                Sign in
              </button><br />

              <label>OR</label>
              
              {/* Continue with Google Button */}
              <button className="w-full py-3 mt-3 bg-white text-gray-700 rounded-lg border-2 border-gray-200 hover:border-gray-300 hover:shadow-md transition-all text-lg font-medium cursor-pointer flex items-center justify-center gap-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
              
              <p className="mt-4 text-xs text-gray-600">
                <b className="text-[#4EA685] cursor-pointer hover:underline">
                  Forgot password?
                </b>
              </p>
              <p className="mt-2 text-xs text-gray-600">
                <span>Don't have an account? </span>
                <b onClick={toggle} className="text-[#4EA685] cursor-pointer hover:underline">
                  Sign up here
                </b>
              </p>
            </div>
          </div>

          {/* Social Media Icons for Sign In */}
          <div className={`mt-8 p-4 bg-white rounded-3xl shadow-2xl transform transition-all duration-500 ease-in-out ${
            isSignIn ? 'scale-100 delay-[1200ms]' : 'scale-0'
          } w-full max-w-md social-container md:shadow-2xl`}>
            <div className="flex justify-center space-x-2">
              <div className={`bg-[#4267B2] text-white p-3 rounded-lg cursor-pointer transform transition-all duration-500 ease-in-out hover:scale-110 ${
                isSignIn ? 'scale-100 delay-[1400ms]' : 'scale-0'
              }`}>
                <Facebook className="w-6 h-6" />
              </div>
              <div className={`bg-[#DB4437] text-white p-3 rounded-lg cursor-pointer transform transition-all duration-500 ease-in-out hover:scale-110 ${
                isSignIn ? 'scale-100 delay-[1600ms]' : 'scale-0'
              }`}>
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </div>
              <div className={`bg-[#1DA1F2] text-white p-3 rounded-lg cursor-pointer transform transition-all duration-500 ease-in-out hover:scale-110 ${
                isSignIn ? 'scale-100 delay-[1800ms]' : 'scale-0'
              }`}>
                <Twitter className="w-6 h-6" />
              </div>
              <div className={`bg-[#E1306C] text-white p-3 rounded-lg cursor-pointer transform transition-all duration-500 ease-in-out hover:scale-110 ${
                isSignIn ? 'scale-100 delay-[2000ms]' : 'scale-0'
              }`}>
                <Instagram className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="absolute top-0 left-0 w-full flex pointer-events-none z-20 h-full">
        {/* Sign In Content */}
        <div className="w-1/2 flex items-center justify-center text-center">
          <div className="text-white mx-16">
            <h2 
              className={`text-6xl font-extrabold mb-8 transform transition-all duration-1000 ease-in-out ${
                isSignIn ? 'translate-x-0' : '-translate-x-[250%]'
              }`}
            >
              Welcome
            </h2>
            <p 
              className={`font-semibold text-lg transform transition-all duration-1000 ease-in-out delay-200 content-text-p ${
                isSignIn ? 'translate-x-0' : '-translate-x-[250%]'
              }`}
            >
              Enter your personal details and start your journey with us
            </p>
            <div 
              className={`mt-8 transform transition-all duration-1000 ease-in-out delay-400 ${
                isSignIn ? 'translate-x-0' : '-translate-x-[250%]'
              }`}
            >
              {/* <div className="w-[30vw] h-64 bg-white bg-opacity-20 rounded-3xl mx-auto flex items-center justify-center backdrop-blur-sm">
                <div className="text-8xl opacity-50">👋</div>
              </div> */}
            </div>
          </div>
        </div>

        {/* Sign Up Content */}
        <div className="w-1/2 flex items-center justify-center text-center">
          <div className="text-white mx-16">
            <div 
              className={`mb-8 transform transition-all duration-1000 ease-in-out delay-400 ${
                !isSignIn ? 'translate-x-0' : 'translate-x-[250%]'
              }`}
            >
                <div className="w-[30vw] h-64 bg-white bg-opacity-20 rounded-3xl mx-auto flex items-center justify-center backdrop-blur-sm hidden md:flex">
                  <div className="text-8xl opacity-50">🚀</div>
                </div>
            </div>
            <h2 
              className={`text-6xl font-extrabold mb-8 transform transition-all duration-1000 ease-in-out ${
                !isSignIn ? 'translate-x-0' : 'translate-x-[250%]'
              }`}
            >
              Join with us
            </h2>
            <p 
              className={`font-semibold text-lg transform transition-all duration-1000 ease-in-out delay-200 content-text-p ${
                !isSignIn ? 'translate-x-0' : 'translate-x-[250%]'
              }`}
            >
              Sign up and discover a great amount of new opportunities
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Responsive Styles */}
      <style jsx>{`
        @media only screen and (max-width: 768px) {
          .bg-gradient-to-br {
            height: 100vh !important;
            border-radius: 0 !important;
            z-index: 0 !important;
            transform: none !important;
            right: 0 !important;
            width: 100vw !important;
          }
          
          .text-6xl {
            font-size: 2.5rem !important;
            margin: 0.5rem !important;
          }
          
          .mx-16 {
            margin-left: 1rem !important;
            margin-right: 1rem !important;
          }
          
          .w-[30vw] {
            width: 80vw !important;
            height: 200px !important;
          }
          
          .content-text-p {
            display: none !important;
          }
          
          /* Ensure proper stacking and visibility on mobile */
          .absolute.top-0.left-0 {
            align-items: flex-start !important;
          }
          
          .absolute.top-0.left-0 .w-1/2 {
            background-color: transparent !important;
            transform: translateY(0) !important;
          }
          
          /* Hide social icons container shadow on mobile */
          .social-container {
            box-shadow: none !important;
            margin: 0 !important;
            padding: 0 !important;
          }
        }
        
        @media only screen and (max-width: 425px) {
          .text-6xl {
            font-size: 2rem !important;
          }
          
          .w-[30vw] {
            height: 150px !important;
          }
          
          .text-8xl {
            font-size: 4rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AuthPage;