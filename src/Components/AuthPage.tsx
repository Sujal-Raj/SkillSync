"use client"
import Link from 'next/link';
import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useRouter } from 'next/navigation';


interface FormData {
  name?: string;
  email: string;
  password: string;
  rememberMe?: boolean;
}

// interface AuthProps {
//     initialView?: 'login' | 'signup';
//   }

// const initialView = 'signup' // or 'login'

function AuthPage({ initialView = 'signup' }: { initialView?: 'login' | 'signup' }) {
  const [view, setView] = useState<'login' | 'signup'>(initialView);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    rememberMe: false
  });
  const router = useRouter();

  // Check system preference for dark mode on component mount
  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkModeMediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    darkModeMediaQuery.addEventListener('change', handleChange);
    
    return () => darkModeMediaQuery.removeEventListener('change', handleChange);
  }, []);

//   const toggleDarkMode = () => {
//     setIsDarkMode(!isDarkMode);
//   };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSignUp = async  (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sign Up Form Data:', {
      name: formData.name,
      email: formData.email,
      password: formData.password
    });

    try {
        const response = await axios.post('/api/auth/signup', {
            name: formData.name,
            email: formData.email,
            password: formData.password
        });
        // console.log("Sign Up Response:", response.data);
        alert(response.data.message);
        router.push('/login'); // Redirect to login page after successful sign up

        
    } catch (error:unknown) {
        console.error("Error during sign up:", error);
    }
  };

  const handleLogin = async  (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login Form Data:', {
      email: formData.email,
      password: formData.password,
      rememberMe: formData.rememberMe
    });

    try {
        const response = await axios.post('/api/auth/login', {
            email: formData.email,
            password: formData.password
        });
        // console.log("Login Response:", response.data);
        alert(response.data.message);
        router.push('/dashboard'); // Redirect to dashboard after successful login
        
    } catch (error:unknown) {
        console.error("Error during login:", error);
        
    }
  };

  // Dynamic classes based on dark/light mode
  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-gray-100';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-800';
  const inputBgColor = isDarkMode ? 'bg-gray-800' : 'bg-gray-100';
  const inputBorderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const focusRingColor = 'focus:ring-emerald-500';
  const secondaryTextColor = isDarkMode ? 'text-gray-300' : 'text-gray-600';
  const cardBgColor = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const inputIconColor = isDarkMode ? 'text-gray-400' : 'text-gray-500';

  return (
    <div className={`flex h-[85vh] mt-10 shadow-2xl dark:shadow-xl dark:shadow-white w-[80%] mx-auto ${bgColor} transition-colors duration-300`}>
      {/* Theme toggle button */}
      {/* <button 
        onClick={toggleDarkMode}
        className="absolute top-4 right-4 z-50 p-2 rounded-full bg-opacity-50 hover:bg-opacity-70 transition-all"
      >
        {isDarkMode ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button> */}
      
      {/* Left colored sections for desktop */}
      <div className="hidden md:block relative w-1/2 bg-emerald-500">
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-300 rounded-tr-full" />
        <div className="h-full w-full flex flex-col justify-center items-center p-8 text-center">
          <div className="mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded flex items-center justify-center mr-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="black" strokeWidth="2" />
                  <path d="M2 17L12 22L22 17" stroke="black" strokeWidth="2" />
                  <path d="M2 12L12 17L22 12" stroke="black" strokeWidth="2" />
                </svg>
              </div>
              <span className="text-white text-xl font-medium">SkillSync</span>
            </div>
          </div>
          
          {view === 'login' ? (
            <>
              <h2 className="text-white text-4xl font-bold mb-6">Welcome Back!</h2>
              <p className="text-white text-lg opacity-90 mb-10 max-w-md">
                To keep connected with us please login with your personal info
              </p>
              <Link href={"/sign-up"}>
              <button 
                // onClick={() => setView('signup')}
                className="border-2 border-white text-white py-3 px-10 rounded-full text-lg font-medium hover:bg-white hover:text-black hover:bg-opacity-10 hover:border-black hover:cursor-pointer transition-all"
              >
                SIGN UP
              </button>
              </Link>
            </>
          ) : (
            <>
              <h2 className="text-white text-4xl font-bold mb-6">Hello, Friend!</h2>
              <p className="text-white text-lg opacity-90 mb-10 max-w-md">
                Enter your personal details and start your journey with us
              </p>
              <Link href={"/login"}>

              <button 
                // onClick={() => setView('login')}
                className="border-2 border-white text-white py-3 px-10 rounded-full text-lg font-medium hover:bg-white hover:text-black hover:bg-opacity-10 hover:border-black hover:cursor-pointer transition-all"
              >
                LOGIN
              </button>
                </Link>
            </>
          )}
        </div>
      </div>

      {/* Right form section */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative">
        {/* Red corner decorator */}
        <div className="absolute top-0 right-0 w-24 h-24 md:w-40 md:h-40 bg-red-400 rounded-bl-full" />
        
        {/* Mobile header - only visible on small screens */}
        <div className="absolute top-0 left-0 w-full md:hidden p-6 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-emerald-500 bg-opacity-20 rounded flex items-center justify-center mr-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke={isDarkMode ? "white" : "#047857"} strokeWidth="2" />
                <path d="M2 17L12 22L22 17" stroke={isDarkMode ? "white" : "#047857"} strokeWidth="2" />
                <path d="M2 12L12 17L22 12" stroke={isDarkMode ? "white" : "#047857"} strokeWidth="2" />
              </svg>
            </div>
            <span className={`${textColor} text-lg font-medium`}>SkillSync</span>
          </div>
        </div>
        
        <div className={`w-full max-w-md z-10 ${isDarkMode ? 'shadow-xl' : 'shadow-lg'} rounded-xl ${cardBgColor} p-6 md:p-8`}>
          {view === 'login' ? (
            <>
              <h2 className={`text-2xl md:text-3xl font-bold text-center ${textColor} mb-8`}>Login</h2>
              
              <div className="flex justify-center space-x-4 mb-6">
                <button className={`w-10 h-10 rounded-full ${inputBgColor} flex items-center justify-center border ${inputBorderColor} hover:bg-opacity-80 transition-all`}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill={isDarkMode ? "#d1d5db" : "#333333"} xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.84 8.182C15.84 7.636 15.792 7.09 15.696 6.545H8.16V9.636H12.48C12.288 10.636 11.712 11.454 10.848 12V14H13.44C14.976 12.6 15.84 10.6 15.84 8.182Z" />
                    <path d="M8.16 16C10.32 16 12.144 15.272 13.44 14L10.848 12C10.128 12.488 9.216 12.8 8.16 12.8C6.048 12.8 4.248 11.4 3.6 9.509H0.96V11.564C2.256 14.24 5.04 16 8.16 16Z" />
                    <path d="M3.6 9.6C3.36 8.8 3.36 7.92 3.6 7.2V5.145H0.96C0 7.345 0 9.455 0.96 11.655L3.6 9.6Z" />
                    <path d="M8.16 3.2C9.312 3.2 10.368 3.6 11.184 4.4L13.44 2.11C12 0.8 10.16 0 8.16 0C5.04 0 2.256 1.76 0.96 4.436L3.6 6.491C4.248 4.6 6.048 3.2 8.16 3.2Z" />
                  </svg>
                </button>
              </div>
              
              <div className={`text-center text-sm ${secondaryTextColor} mb-6`}>
                or use your email account:
              </div>
              
              <form onSubmit={handleLogin}>
                <div className="mb-4">
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded ${inputBgColor} border ${inputBorderColor} focus:outline-none focus:ring-2 ${focusRingColor} focus:border-transparent transition-colors ${textColor}`}
                    placeholder="Email"
                    required
                  />
                </div>
                <div className="mb-6">
                  <input 
                    type="password" 
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded ${inputBgColor} border ${inputBorderColor} focus:outline-none focus:ring-2 ${focusRingColor} focus:border-transparent transition-colors ${textColor}`}
                    placeholder="Password"
                    required
                  />
                </div>
                <div className="flex justify-between mb-6">
                  <label className={`flex items-center text-sm ${secondaryTextColor}`}>
                    <input 
                      type="checkbox" 
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      className={`mr-2 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0 focus:ring-1 rounded`}
                    />
                    Remember me
                  </label>
                  <a href="#" className={`text-sm ${secondaryTextColor} hover:text-emerald-500`}>Forgot password?</a>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-emerald-500 text-white py-3 rounded hover:bg-emerald-600 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                >
                  LOGIN
                </button>
              </form>
              
              {/* Mobile version of toggle */}
              <div className="md:hidden mt-8 text-center">
                <p className={secondaryTextColor}>
                  Don{`&apos`}t have an account?{' '}
                  <button 
                    onClick={() => setView('signup')} 
                    className="text-emerald-500 hover:underline"
                  >
                    Sign Up
                  </button>
                </p>
              </div>
            </>
          ) : (
            <>
              <h2 className={`text-2xl md:text-3xl font-bold text-center ${textColor} mb-8`}>Create Account</h2>
              
              <div className="flex justify-center space-x-4 mb-6">
                <button className={`w-10 h-10 rounded-full ${inputBgColor} flex items-center justify-center border ${inputBorderColor} hover:bg-opacity-80 transition-all`}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill={isDarkMode ? "#d1d5db" : "#333333"} xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.84 8.182C15.84 7.636 15.792 7.09 15.696 6.545H8.16V9.636H12.48C12.288 10.636 11.712 11.454 10.848 12V14H13.44C14.976 12.6 15.84 10.6 15.84 8.182Z" />
                    <path d="M8.16 16C10.32 16 12.144 15.272 13.44 14L10.848 12C10.128 12.488 9.216 12.8 8.16 12.8C6.048 12.8 4.248 11.4 3.6 9.509H0.96V11.564C2.256 14.24 5.04 16 8.16 16Z" />
                    <path d="M3.6 9.6C3.36 8.8 3.36 7.92 3.6 7.2V5.145H0.96C0 7.345 0 9.455 0.96 11.655L3.6 9.6Z" />
                    <path d="M8.16 3.2C9.312 3.2 10.368 3.6 11.184 4.4L13.44 2.11C12 0.8 10.16 0 8.16 0C5.04 0 2.256 1.76 0.96 4.436L3.6 6.491C4.248 4.6 6.048 3.2 8.16 3.2Z" />
                  </svg>
                </button>
              </div>
              
              <div className={`text-center text-sm ${secondaryTextColor} mb-6`}>
                or use your email for registration:
              </div>
              
              <form onSubmit={handleSignUp}>
                <div className="mb-4">
                  <div className={`flex items-center px-4 py-3 rounded ${inputBgColor} border ${inputBorderColor} focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-transparent transition-colors`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${inputIconColor} mr-3`}>
                      <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`bg-transparent  w-full focus:outline-none ${textColor}`}
                      placeholder="Name"
                      required
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <div className={`flex items-center px-4 py-3 rounded ${inputBgColor} border ${inputBorderColor} focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-transparent transition-colors`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${inputIconColor} mr-3`}>
                      <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`bg-transparent w-full focus:outline-none ${textColor}`}
                      placeholder="Email"
                      required
                    />
                  </div>
                </div>
                <div className="mb-6">
                  <div className={`flex items-center px-4 py-3 rounded ${inputBgColor} border ${inputBorderColor} focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-transparent transition-colors`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${inputIconColor} mr-3`}>
                      <path d="M19 11H5V21H19V11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M17 9V8C17 5.23858 14.7614 3 12 3C9.23858 3 7 5.23858 7 8V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <input 
                      type="password" 
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`bg-transparent w-full focus:outline-none ${textColor}`}
                      placeholder="Password"
                      required
                    />
                  </div>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-emerald-500 text-white py-3 rounded hover:bg-emerald-600 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                >
                  SIGN UP
                </button>
              </form>
              
              {/* Mobile version of toggle */}
              <div className="md:hidden mt-8 text-center">
                <p className={secondaryTextColor}>
                  Already have an account?{' '}
                  <button 
                    onClick={() => setView('login')} 
                    className="text-emerald-500 hover:underline"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default AuthPage