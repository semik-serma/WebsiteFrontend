"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { FaGithub, FaYoutube, FaFacebook, FaLinkedin, FaWhatsappSquare } from "react-icons/fa";
import axios from 'axios'
import Countvisitor from "./Countvisitor";
import { toast } from "sonner";
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [search, setSearch] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [flagurl,setflagurl]=useState('')
  const [country,setcountry]=useState('')
  const [nepalTime, setNepalTime] = useState("");
  const [visitorTime, setVisitorTime] = useState("");
  const countrydetect=async()=>{
  const response =await axios.get("/apicountry/country")
  console.log(response)
  setflagurl(response.data.data)
}

// Handle scroll effect
  useEffect(() => {
    countrydetect()
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Nepal Time and Local Time Clock
  useEffect(() => {
    const updateTime = () => {
      // Nepal Time
      const nTime = new Date().toLocaleTimeString("en-US", {
        timeZone: "Asia/Kathmandu",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      setNepalTime(nTime);

      // Local Time (Visitor's Time)
      const vTime = new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      setVisitorTime(vTime);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Check auth status
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, [pathname]);

  // Close mobile menu when route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Animation effect for website text
  useEffect(() => {
    const startAnimation = () => {
      setShowAnimation(true);
      setTimeout(() => {
        setShowAnimation(false);
      }, 2500);
    };

    const initialTimeout = setTimeout(startAnimation, 3000);
    const interval = setInterval(startAnimation, 20000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  const handlelogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("storage"));
    router.push("/login");
  };

  const searchToGoogle = (e) => {
    e.preventDefault();
    if (search.trim() !== '') {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(search)}`, "_blank");
      setSearch('');
    }
  };

  const isDashboardArea = pathname.startsWith("/dashboard") || 
                          pathname.startsWith("/create-article") || 
                          pathname.startsWith("/update-article");

  const navLinks = (isLoggedIn && isDashboardArea)
    ? [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/create-article", label: "Create Article" },
        { href: "/update-article/id", label: "Update Article" },
      ]
    : [
        { href: "/", label: "Home" },
        { href: "/about", label: "About" },
        { href: "/contact", label: "Contact" },
        {href:"/calculator",label:"Calculator"}
      ];

  const isActive = (href) => pathname === href;

  return (
    <>
      {/* Top Bar */}
      <div className="sticky top-0 w-full z-50 px-[200px] bg-gradient-to-r from-yellow-400 via-yellow-400 to-yellow-300 h-12 flex items-center justify-between shadow-lg border-b-2 border-yellow-500/30 backdrop-blur-sm relative overflow-hidden">    
        <div className="flex items-center gap-4 relative z-10">
          <Image src={`https://flagcdn.com/${flagurl}.svg`} height={20} width={25} alt="image"/>
          <span className="text-xs sm:text-sm font-semibold text-gray-800 hidden sm:inline-block">
            Welcome for visiting my website
          </span>
        </div>

        {/* Centered Times */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden lg:flex items-center gap-[70px]">
          <span className="text-xs sm:text-sm font-bold text-blue-700 bg-white/40 px-3 py-0.5 rounded-md shadow-sm">
            NP Time: {nepalTime}
          </span>
          <span className="text-xs sm:text-sm font-bold text-green-700 bg-white/40 px-3 py-0.5 rounded-md shadow-sm">
            Local Time: {visitorTime}
          </span>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-gray-800">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-xs font-medium">semikserma@gmail.com</span>
            <Link href='https://github.com/semik-serma/frontent'><FaGithub /></Link>
            <Link href='https://www.facebook.com/dhanraj.serma.14'><FaFacebook /></Link>
            <Link href='https://www.youtube.com/@digitalmediacenterphidim6022'><FaYoutube /></Link>
            <Link href='https://www.linkedin.com/in/semik-serma-8263a3391/'><FaLinkedin /></Link>
            <Link href='https://wa.me/9817926978'><FaWhatsappSquare /></Link>
          </div>
          <div className="h-4 w-px bg-gray-800/30"></div>
          <div className="flex items-center gap-1.5 text-gray-800">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs font-medium">Mon - Fri: 9AM - 6PM</span>
          </div>
        </div>

        <div className="md:hidden flex items-center">
          <span className="text-xs font-medium text-gray-800">Nepal 🇳🇵</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className={`sticky top-12 w-full bg-white shadow-md z-50 transition-all duration-300 ${scrolled ? 'shadow-lg' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            {isLoggedIn ? (
              <Link href={pathname === "/" ? "/dashboard" : "/"} className="flex items-center space-x-2 group">
                <span className="text-2xl font-bold text-blue-600 group-hover:text-blue-700 transition">
                  {pathname === "/" ? "Back to Dashboard" : "Back to Home"}
                </span>
              </Link>
            ) : (
              <div className="flex items-center space-x-2 group">
                <span className="text-2xl font-bold text-blue-600 cursor-default">
                  SemikDev
                </span>
              </div>
            )}

            {/* Search Bar - Desktop */}
            <form
              onSubmit={searchToGoogle}
              className="hidden lg:flex flex-1 max-w-md mx-8"
            >
              <div className="relative w-full">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search Google..."
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition text-sm"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-blue-600 transition"
                  aria-label="Search"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>

            {/* Nav Links - Desktop */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-base font-medium transition-colors relative ${isActive(link.href)
                    ? 'text-blue-600 bg-blue-50 buttonborderrunnercolor'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></span>
                  )}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-6">
              {/* Auth Buttons - Desktop */}
              <div className="hidden md:flex items-center gap-4">
                {!isLoggedIn ? (
                  <Link
                    href="/login"
                    className="relative inline-flex items-center justify-center px-6 py-2.5 rounded-xl group"
                  >
                    <span className="absolute inset-0 rounded-xl p-[2px] bg-[linear-gradient(120deg,rgba(34,211,238,1),rgba(168,85,247,1),rgba(236,72,153,1),rgba(34,211,238,1))] bg-[length:300%_300%] animate-[borderMove_4s_linear_infinite]"></span>
                    <span className="absolute inset-[2px] rounded-xl bg-[#020617]"></span>
                    <span className="relative z-10 bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent font-semibold tracking-wide">
                      Login
                    </span>
                  </Link>
                ) : (
                  <button
                    onClick={handlelogout}
                    className="px-5 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition"
                  >
                    Logout
                  </button>
                )}
              </div>
              <div className="flex items-center">
                <Countvisitor />
              </div>
            </div>
            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="py-4 border-t border-gray-200 space-y-2">
              {/* Mobile Nav Links */}
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${isActive(link.href)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile Auth Buttons */}
              <div className="px-4 py-2 space-y-2 border-t border-gray-200 pt-4 mt-2">
                {!isLoggedIn ? (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setOpen(false)}
                      className="block w-full text-center px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium border-2 border-transparent bg-clip-border animate-gradient-border rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setOpen(false)}
                      className="block w-full text-center px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
                    >
                      Sign Up
                    </Link>
                  </>
                ) : (
                  <button 
                    onClick={() => {
                      handlelogout();
                      setOpen(false);
                    }}
                    className="block w-full text-center px-4 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition"
                  >
                    Logout
                  </button>
                )}
              </div>

              {/* Mobile Search */}
              <div className="px-4 pt-2 border-t border-gray-200 mt-2">
                <form onSubmit={searchToGoogle} className="flex gap-2">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search Google..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    aria-label="Search"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}