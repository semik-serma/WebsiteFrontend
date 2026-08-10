'use client'
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Send, User, Heart, Share2, Eye, ThumbsUp, ThumbsDown, Code2, Palette, Zap, Smartphone, Shield, RefreshCw, Star, ChevronRight, Mail, MapPin, Award, Briefcase, Users, Clock, Download, Sparkles, ExternalLink, Github, Layers, Monitor, Lightbulb, Search } from "lucide-react";
import axios from "axios";
import { api } from "@/lib/api";
import { FaArrowAltCircleRight } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.12 } },
  viewport: { once: true, margin: "-60px" }
};

const staggerItem = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const offers = [
  {
    icon: <Layers className="w-8 h-8 text-cyan-400" />,
    title: "UI/UX Design",
    desc: "Creating clean, intuitive UI/UX designs that improve usability and enhance user engagement.",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: <Smartphone className="w-8 h-8 text-cyan-400" />,
    title: "Mobile App Design",
    desc: "Designing seamless, user-friendly mobile apps that deliver engaging and intuitive experiences.",
    color: "from-cyan-500 to-teal-500"
  },
  {
    icon: <Monitor className="w-8 h-8 text-cyan-400" />,
    title: "Website Design",
    desc: "Creating clean, responsive websites that offer intuitive navigation and enhance user experience.",
    color: "from-blue-500 to-indigo-500"
  },
  {
    icon: <Code2 className="w-8 h-8 text-cyan-400" />,
    title: "Web Development",
    desc: "Building fast, reliable websites with clean code that deliver smooth, user-friendly experiences.",
    color: "from-indigo-500 to-cyan-500"
  },
  {
    icon: <Lightbulb className="w-8 h-8 text-cyan-400" />,
    title: "Brand Strategy",
    desc: "Developing clear brand strategies that connect with audiences and drive lasting business growth.",
    color: "from-cyan-500 to-blue-500"
  },
  {
    icon: <Search className="w-8 h-8 text-cyan-400" />,
    title: "SEO & Marketing",
    desc: "Optimizing online presence to boost visibility, attract customers, and grow your business effectively.",
    color: "from-teal-500 to-cyan-500"
  }
];

const skills = [
  { name: "Next.js", level: 85, icon: "M8.8 2.6C8.4 2.2 7.6 2.2 7.2 2.6L2 7.8c-.4.4-.4 1.2 0 1.6l5.2 5.2c.4.4 1.2.4 1.6 0L14 9.4c.4-.4.4-1.2 0-1.6L8.8 2.6z", color: "#000" },
  { name: "React", level: 80, icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm-5-9c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm10 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-5 9c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z", color: "#61DAFB" },
  { name: "Django", level: 75, icon: "M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.5l7 3.5v7l-7 3.5-7-3.5v-7l7-3.5z", color: "#092E20" },
  { name: "JavaScript", level: 85, icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c.55 0 1 .45 1 1v3h-2V6c0-.55.45-1 1-1zm0 11c-.55 0-1-.45-1-1v-3h2v3c0 .55-.45 1-1 1z", color: "#F7DF1E" },
  { name: "Tailwind CSS", level: 90, icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm0-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z", color: "#06B6D4" },
  { name: "Node.js", level: 70, icon: "M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.5l7 3.5v7l-7 3.5-7-3.5v-7l7-3.5zM8 9v6h2V9H8zm3 0v6h2l3-4.5V9h-2v6h2l-3-4.5V9h-2zm6 0h-2v6h2V9z", color: "#339933" },
  { name: "MongoDB", level: 65, icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c.55 0 1 .45 1 1v8c0 .55-.45 1-1 1s-1-.45-1-1V6c0-.55.45-1 1-1zm0 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z", color: "#47A248" },
  { name: "Python", level: 72, icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z", color: "#3776AB" }
];

const projects = [
  {
    id: 1,
    title: "SaaS Analytics & AI Platform",
    category: "Apps",
    image: "/projects/saas.png",
    desc: "Fullstack SaaS application with real-time data visualizers, subscription workflows, and automated reporting.",
    tags: ["Next.js", "Django", "Tailwind CSS", "Chart.js"],
    liveUrl: "#",
    githubUrl: "#"
  },
  {
    id: 2,
    title: "E-Commerce Tech Store Platform",
    category: "Websites",
    image: "/projects/ecommerce.png",
    desc: "Feature-rich e-commerce store with dynamic cart state, secure payment integration, and custom admin portal.",
    tags: ["React", "Node.js", "MongoDB", "Tailwind"],
    liveUrl: "#",
    githubUrl: "#"
  },
  {
    id: 3,
    title: "Mobile App Experience Showcase",
    category: "UI/UX",
    image: "/projects/mobile.png",
    desc: "Interactive mobile user interface showcase featuring glassmorphic screens, smooth gestures, and micro-interactions.",
    tags: ["UI/UX", "Figma", "React Native", "Framer Motion"],
    liveUrl: "#",
    githubUrl: "#"
  },
  {
    id: 4,
    title: "Agency & Developer Portfolio",
    category: "Websites",
    image: "/projects/agency.png",
    desc: "Ultra-modern portfolio website built with Next.js, 3D card glows, interactive filters, and custom animations.",
    tags: ["Next.js", "Framer Motion", "Tailwind", "CSS3"],
    liveUrl: "#",
    githubUrl: "#"
  }
];

function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return String(num);
}

function AnimatedCounter({ end, suffix = "", duration = 2 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const startTime = Date.now();
        const tick = () => {
          const elapsed = (Date.now() - startTime) / 1000;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.floor(eased * end));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  const display = formatNumber(count);
  return <span ref={ref}>{display}{suffix}</span>;
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [comment, setComment] = useState("");
  const [visitorCount, setVisitorCount] = useState(0);
  const [isloggedin, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const [data, setData] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [signin, setsignin] = useState(false);
  const commentscroll = useRef(null);
  const [typedText, setTypedText] = useState("");
  const fullText = "Web Developer & UI Enthusiast";
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    setHeroLoaded(true);
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, i + 1));
      i++;
      if (i >= fullText.length) clearInterval(interval);
    }, 60);
    return () => clearInterval(interval);
  }, []);

  const checksignin = async () => {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    setsignin(!!(user && token));
  };

  const backendcall = async () => {
    try {
      setLoading(true);
      const response = await axios.get(api.comment.get);
      setData(response.data || []);
      setCommentCount(response.data?.length || 0);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to load comments');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const commentscrolls = () => {
    commentscroll.current.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const getout = () => {
    backendcall();
    commentscrolls();
  };

  const visitorcountpost = async () => {
    try {
      await axios.post(api.visitcount.visitcount, { visitor: crypto.randomUUID() });
    } catch (error) {
      console.error('Error posting visitor count:', error);
    }
    try {
      const getResult = await axios.get(api.visitcount.visitcountget);
      if (getResult.data?.data) setVisitorCount(getResult.data.data);
    } catch (error) {
      console.error('Error fetching visitor count:', error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (!token || !user) {
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true);
      try { setCurrentUser(JSON.parse(user)); } catch (e) { console.error(e); }
    }
    backendcall();
    visitorcountpost();
  }, []);

  const handleCommentChange = (event) => setComment(event.target.value);

  const handlecomment = async () => {
    try {
      if (!isloggedin) { toast.error('Login required to comment'); router.push('/login'); return; }
      if (!comment.trim()) { toast.error('Please enter a comment'); return; }
      setSubmitting(true);
      const response = await axios.post(api.comment.create, { comment: comment.trim() });
      if (response.data && response.data.success !== false) {
        toast.success('Thank you for your comment!');
        setComment('');
        await backendcall();
      } else {
        toast.error(response.data?.message || 'Failed to post comment');
      }
    } catch (error) {
      if (error.response?.status === 401) { toast.error('Please login again'); router.push('/login'); }
      else if (error.response?.data?.message) toast.error(error.response.data.message);
      else if (error.request) toast.error('Cannot connect to server. Please check your connection.');
      else toast.error('Error: ' + error.message);
    } finally { setSubmitting(false); }
  };

  const formatCommentDate = (dateString) => {
    if (!dateString) return "Just now";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const openWhatsApp = () => {
    window.open("https://wa.me/9779862772457?text=Hey i have visited your website", "_blank");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: 'SemikDev - Web Developer Portfolio', text: 'Check out this amazing web developer portfolio by Semik!', url: window.location.href })
        .catch((error) => console.log('Error sharing:', error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard! Share it with your friends!');
    }
  };

  const handleLike = async (commentId) => {
    if (!isloggedin || !currentUser) { toast.error('Please login to like'); router.push('/login'); return; }
    try { await axios.post(api.comment.like(commentId), { userEmail: currentUser.email }); await backendcall(); }
    catch (error) { console.error('Error liking comment:', error); toast.error('Failed to like comment'); }
  };

  const handleDislike = async (commentId) => {
    if (!isloggedin || !currentUser) { toast.error('Please login to dislike'); router.push('/login'); return; }
    try { await axios.post(api.comment.dislike(commentId), { userEmail: currentUser.email }); await backendcall(); }
    catch (error) { console.error('Error disliking comment:', error); toast.error('Failed to dislike comment'); }
  };

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
        {/* Ambient Background Glows */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500 rounded-full blur-[140px] animate-float-slow" />
          <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-purple-500 rounded-full blur-[160px] animate-float-delayed" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500 rounded-full blur-[200px] opacity-20 animate-pulse" />
        </div>

        {/* Floating background particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => {
            const left = ((i * 37 + 13) % 100);
            const top = ((i * 53 + 7) % 100);
            const dur = 3 + ((i * 7) % 4);
            const del = ((i * 13) % 30) / 10;
            return (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/20 rounded-full"
                style={{ left: `${left}%`, top: `${top}%` }}
                animate={{ y: [0, -30, 0], opacity: [0.2, 0.8, 0.2] }}
                transition={{ duration: dur, repeat: Infinity, delay: del }}
              />
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16 lg:py-20 w-full">
          
          {/* Hero Main Content Grid */}
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-6 items-center">
            
            {/* Left Column: Typography & Info */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8">
              
              {/* Massive Title Block */}
              <div className="relative">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={heroLoaded ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6 }}
                >
                  <h1 className="font-condensed font-black tracking-tight leading-[0.85] uppercase select-none">
                    <span className="block text-6xl sm:text-8xl md:text-9xl lg:text-[125px] xl:text-[140px] text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-200 to-cyan-400 drop-shadow-[0_10px_20px_rgba(34,211,238,0.25)]">
                      SEMIKDEV
                    </span>
                    <span className="block text-6xl sm:text-8xl md:text-9xl lg:text-[125px] xl:text-[140px] text-slate-100 drop-shadow-[0_10px_20px_rgba(255,255,255,0.08)]">
                      DEVELOPER
                    </span>
                  </h1>
                </motion.div>

                {/* Overlaid Script Cursive "Portfolio" */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
                  animate={heroLoaded ? { opacity: 1, scale: 1, rotate: -6 } : {}}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="absolute bottom-[-10px] sm:bottom-[-4px] right-2 sm:right-12 md:right-24 lg:right-10 xl:right-16 pointer-events-none select-none"
                >
                  <span className="font-script text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-cyan-300 drop-shadow-[0_0_18px_rgba(34,211,238,0.8)] block">
                    Portfolio
                  </span>
                </motion.div>
              </div>

              {/* Tagline & Typed text */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={heroLoaded ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6 }}
                className="space-y-3 pt-2"
              >
                <div className="flex items-center gap-2 text-cyan-200/90 text-sm sm:text-base font-medium">
                  <span className="text-cyan-400 font-mono">&lt;/&gt;</span>
                  <span>{typedText}</span>
                  <span className="w-0.5 h-5 bg-cyan-400 animate-blink" />
                </div>
                <p className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed tracking-wide">
                  I DESIGN & CODE DIGITAL EXPERIENCES THAT INSPIRE. SPECIALIZING IN NEXT.JS, DJANGO & MODERN FULLSTACK APPLICATIONS.
                </p>
                <div className="text-xs font-mono tracking-widest text-cyan-400/80 uppercase pt-1">
                  &lt;/ CODE. DESIGN. DEPLOY /&gt;
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={heroLoaded ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.8 }}
                className="flex flex-wrap items-center gap-3 pt-2"
              >
                {isloggedin ? (
                  <Link href="/create-article" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-7 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 hover:scale-105 text-sm">
                    Continue <ChevronRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <>
                    <Link href="/about" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-7 py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-105 text-sm">
                      Get Started <ChevronRight className="w-4 h-4" />
                    </Link>
                    <Link href="/login" className="inline-flex items-center gap-2 bg-white/5 border border-white/15 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 hover:scale-105 text-sm">
                      <User className="h-4 w-4" /> Sign In
                    </Link>
                  </>
                )}

                <button onClick={handleShare} className="inline-flex items-center gap-2 bg-white/5 border border-white/15 text-white px-4 py-3 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 text-sm hover:scale-105" title="Share website">
                  <Share2 className="h-4 w-4" />
                </button>

                <div className="inline-flex items-center gap-1.5 bg-white/5 border border-white/15 text-cyan-200 px-4 py-3 rounded-xl font-semibold text-sm">
                  <Eye className="h-4 w-4 text-cyan-400" /> {formatNumber(visitorCount)}
                </div>
              </motion.div>

            </div>

            {/* Right Column: Image Presentation with Buttons Migrated Underneath & Pushed Right */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={heroLoaded ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="lg:col-span-5 relative mt-8 lg:mt-0 flex flex-col items-center lg:translate-x-6 xl:translate-x-8 space-y-4"
            >
              
              {/* Outer Background Powder Glow */}
              <div className="absolute inset-0 -top-6 bg-gradient-to-tr from-cyan-600/30 via-blue-500/25 to-indigo-600/20 rounded-full blur-[70px] transform scale-110 pointer-events-none" />

              {/* Main Portrait Frame with Orbit lines */}
              <div className="relative w-full max-w-sm sm:max-w-md aspect-[4/5] rounded-[36px] overflow-hidden border border-cyan-500/40 shadow-2xl bg-slate-900/60 backdrop-blur-sm group z-10">
                
                {/* User's Portrait Image */}
                <Image
                  src="/home.png"
                  alt="SemikDev"
                  fill
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  priority
                />

                {/* Smooth Gradient Mask Overlay at Bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80" />

              </div>

              {/* Buttons Migrated Under Photo */}
              <div className="flex items-center justify-center gap-3 w-full max-w-sm sm:max-w-md z-20 pt-1">
                <button 
                  onClick={() => window.open("https://wa.me/9779862772457?text=Hey%20I%20visited%20your%20website", "_blank")} 
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-5 py-3 rounded-2xl text-sm font-semibold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  <span className="text-base">💬</span> Hire Me
                </button>
                <a 
                  href="/cv" 
                  download 
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-slate-900/95 border border-cyan-500/40 hover:border-cyan-400 text-cyan-200 hover:text-white px-5 py-3 rounded-2xl text-sm font-semibold shadow-lg shadow-black/40 hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  <Download className="w-4 h-4 text-cyan-400" /> Download CV
                </a>
              </div>

            </motion.div>

          </div>

          {/* Integrated Stats Bar at Bottom of Hero */}
          <div className="pt-10 mt-12 border-t border-white/10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { end: 4, label: "YEARS EXPERIENCE", suffix: "+" },
                { end: 40, label: "PROJECTS DELIVERED", suffix: "+" },
                { end: 25, label: "HAPPY CLIENTS", suffix: "+" },
                { end: 10, label: "TECHNOLOGIES", suffix: "+" }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={heroLoaded ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 1.0 + i * 0.1 }}
                  className="text-center sm:text-left group"
                >
                  <div className="font-condensed text-4xl sm:text-5xl font-black text-cyan-300 tracking-tight group-hover:scale-105 transition-transform duration-300">
                    <AnimatedCounter end={stat.end} suffix={stat.suffix} />
                  </div>
                  <div className="text-[11px] sm:text-xs font-semibold tracking-wider text-slate-400 uppercase mt-1">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Services / My Specialties Section */}
      <section className="py-24 relative overflow-hidden bg-slate-950 text-white border-t border-slate-800/60">
        {/* Ambient Glows */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-10 right-1/4 w-96 h-96 bg-blue-600 rounded-full blur-[160px]" />
          <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-cyan-600 rounded-full blur-[160px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Header */}
          <motion.div {...fadeInUp} className="text-center mb-16 space-y-3">
            <span className="inline-block text-xs font-extrabold tracking-[0.25em] text-cyan-400 uppercase">
              SERVICES
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              My Specialties
            </h2>
            <div className="w-12 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mx-auto mt-3" />
          </motion.div>

          {/* 2x3 Grid */}
          <motion.div {...staggerContainer} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {offers.map((offer, i) => (
              <motion.div
                key={i}
                variants={staggerItem}
                whileHover={{ y: -6, transition: { duration: 0.3 } }}
                className="group relative bg-slate-900/60 border border-slate-800/80 p-8 rounded-3xl backdrop-blur-sm shadow-xl hover:border-cyan-500/40 hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="mb-6 inline-flex items-center justify-center p-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/20 group-hover:border-cyan-400/50 group-hover:scale-110 transition-all duration-300">
                    {offer.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors duration-300">
                    {offer.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {offer.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* My Recent Works (Projects) Section */}
      <section className="py-24 relative overflow-hidden bg-slate-950 text-white border-t border-slate-800/60">
        {/* Subtle Ambient Background Lighting */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-1/4 left-10 w-96 h-96 bg-blue-600 rounded-full blur-[160px]" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-600 rounded-full blur-[160px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Section Header */}
          <motion.div {...fadeInUp} className="text-center mb-12">
            <span className="inline-block text-xs font-bold tracking-widest text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-4 py-1.5 rounded-full mb-4 uppercase">
              Portfolio
            </span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-200 to-cyan-400">My Recent </span>
              <span className="text-white">Works</span>
            </h2>
            <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Explore some of my featured web applications, fullstack solutions, and digital experiences.
            </p>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap justify-center items-center gap-2 mt-8">
              {["All", "Apps", "Websites", "UI/UX"].map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer ${
                    activeCategory === category
                      ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/30 scale-105"
                      : "bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:border-cyan-500/40"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </motion.div>

          {/* 2x2 Project Cards Grid */}
          <motion.div layout className="grid md:grid-cols-2 gap-8 lg:gap-10">
            <AnimatePresence mode="popLayout">
              {projects
                .filter((p) => activeCategory === "All" || p.category === activeCategory)
                .map((project) => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    className="group relative bg-slate-900/70 border border-slate-800/80 rounded-3xl overflow-hidden shadow-xl hover:border-cyan-500/40 hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-500 flex flex-col"
                  >
                    {/* Project Image Frame */}
                    <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-950">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                      />
                      
                      {/* Dark Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                      {/* Glass Hover Overlay Action Buttons */}
                      <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4 backdrop-blur-xs">
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-cyan-500/30 hover:scale-105 transition-all duration-200"
                        >
                          <ExternalLink className="w-4 h-4" /> Live Demo
                        </a>
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-slate-900 border border-white/20 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:scale-105 transition-all duration-200"
                        >
                          <Github className="w-4 h-4" /> Code
                        </a>
                      </div>
                    </div>

                    {/* Card Information Footer */}
                    <div className="p-6 sm:p-8 space-y-3 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="text-xs font-bold tracking-wider text-cyan-300 bg-cyan-950/80 border border-cyan-500/30 px-3 py-1 rounded-full uppercase">
                            {project.category}
                          </span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors duration-300">
                          {project.title}
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed mt-2 line-clamp-2">
                          {project.desc}
                        </p>
                      </div>

                      {/* Tech Stack Tags */}
                      <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
                        {project.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-xs font-medium text-slate-300 bg-slate-800/80 border border-slate-700/60 px-2.5 py-1 rounded-lg"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
            </AnimatePresence>
          </motion.div>

        </div>
      </section>

      {/* Skills Section */}
      <motion.section {...fadeInUp} className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeInUp}>
              <span className="inline-block text-sm font-semibold text-purple-600 bg-purple-50 px-4 py-1.5 rounded-full mb-4">Skills</span>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-6">
                Technologies I <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">Work With</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                I&apos;ve worked with a variety of technologies in the web development world. From frontend to backend, I love building complete solutions.
              </p>
              <div className="flex flex-wrap gap-4">
                {[
                  { name: "Next.js", icon: "M8.8 2.6C8.4 2.2 7.6 2.2 7.2 2.6L2 7.8c-.4.4-.4 1.2 0 1.6l5.2 5.2c.4.4 1.2.4 1.6 0L14 9.4c.4-.4.4-1.2 0-1.6L8.8 2.6z", color: "#000", bg: "#000" },
                  { name: "React", icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm-5-9c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm10 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-5 9c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z", color: "#61DAFB", bg: "#e6f7ff" },
                  { name: "Django", icon: "M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.5l7 3.5v7l-7 3.5-7-3.5v-7l7-3.5z", color: "#092E20", bg: "#e8f0e6" },
                  { name: "Node.js", icon: "M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.5l7 3.5v7l-7 3.5-7-3.5v-7l7-3.5zM8 9v6h2V9H8zm3 0v6h2l3-4.5V9h-2v6h2l-3-4.5V9h-2zm6 0h-2v6h2V9z", color: "#339933", bg: "#e6f5e6" },
                  { name: "MongoDB", icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c.55 0 1 .45 1 1v8c0 .55-.45 1-1 1s-1-.45-1-1V6c0-.55.45-1 1-1zm0 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z", color: "#47A248", bg: "#e8f5ed" },
                  { name: "Tailwind", icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm0-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z", color: "#06B6D4", bg: "#e6fafd" },
                  { name: "Python", icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z", color: "#3776AB", bg: "#e6eef5" },
                  { name: "JavaScript", icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c.55 0 1 .45 1 1v3h-2V6c0-.55.45-1 1-1zm0 11c-.55 0-1-.45-1-1v-3h2v3c0 .55-.45 1-1 1z", color: "#F7DF1E", bg: "#fffde6" },
                ].map((tech, i) => (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    animate={{ y: [0, -4, 0] }}
                    className="group relative flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-default"
                  >
                    <motion.svg
                      width="22" height="22" viewBox="0 0 24 24"
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 3 + (i % 2), repeat: Infinity, ease: "easeInOut" }}
                    >
                      <path d={tech.icon} fill={tech.color} />
                    </motion.svg>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">{tech.name}</span>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ opacity: 1, scale: 1 }}
                      className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
                      style={{ backgroundColor: tech.color }}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div {...fadeInUp} className="space-y-6">
              {skills.map((skill, i) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="flex justify-between mb-2 items-center">
                    <span className="flex items-center gap-3 text-sm font-semibold text-gray-700">
                      <motion.span
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${skill.color}15` }}
                        animate={{ y: [0, -3, 0] }}
                        transition={{ duration: 2 + (i % 2), repeat: Infinity, ease: "easeInOut" }}
                      >
                        <motion.svg
                          width="22" height="22" viewBox="0 0 24 24"
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 3 + (i % 2), repeat: Infinity, ease: "easeInOut" }}
                        >
                          <path d={skill.icon} fill={skill.color} />
                        </motion.svg>
                      </motion.span>
                      {skill.name}
                    </span>
                    <span className="text-sm font-medium text-gray-500">{skill.level}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: i * 0.1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Comment Section */}
      <section ref={commentscroll} className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 bg-blue-500 rounded-full blur-[100px]" />
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-purple-500 rounded-full blur-[100px]" />
        </div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <span className="inline-block text-sm font-semibold text-cyan-300 bg-white/10 px-4 py-1.5 rounded-full mb-4 border border-white/10">Feedback</span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              What People <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Say</span>
            </h2>
            <p className="text-lg text-blue-200/70 max-w-xl mx-auto">
              Share your thoughts and feedback about my work
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 mb-10 border border-white/10 shadow-2xl"
          >
            <div className="flex gap-4 items-start">
              <textarea
                placeholder="Give your review..."
                value={comment}
                onChange={handleCommentChange}
                disabled={submitting}
                className="flex-1 bg-transparent border-none outline-none resize-none text-gray-100 text-base min-h-[60px] leading-relaxed p-2 placeholder-gray-400"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="submit"
                onClick={handlecomment}
                disabled={submitting || !comment.trim()}
                className="bg-gradient-to-br from-indigo-500 to-pink-500 border-none rounded-full w-12 h-12 flex items-center justify-center cursor-pointer text-white text-lg shadow-lg shadow-indigo-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              >
                {submitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" />
                ) : (
                  <FaArrowAltCircleRight />
                )}
              </motion.button>
            </div>
          </motion.div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-400 mx-auto mb-4" />
              <p className="text-blue-200/60">Loading comments...</p>
            </div>
          ) : data.length > 0 ? (
            <motion.div {...staggerContainer} className="space-y-6">
              {data.slice(0, 5).map((item, idx) => (
                <motion.div
                  key={item._id || idx}
                  variants={staggerItem}
                  whileHover={{ x: 4 }}
                  className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <div className="absolute left-0 top-0 w-1 h-full rounded-l-2xl bg-gradient-to-b from-indigo-500 to-pink-500" />
                  <h3 className="text-lg font-bold text-white mb-1">
                    {idx === 0 ? "Comments" : ""}
                  </h3>
                  <p className="text-gray-200 text-base leading-relaxed mb-4 ml-1">
                    {item.comment.length > 150 ? `${item.comment.substring(0, 150)}...` : item.comment}
                  </p>
                  <Link href={`/comment/${item._id}?type=before`} className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-sm font-medium mb-4 transition-colors">
                    Read More <ChevronRight className="w-3 h-3" />
                  </Link>
                  {item.createdAt && (
                    <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
                      <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full text-xs text-gray-300">
                        <User size={12} className="text-cyan-400" />
                        {item.userName || item.userEmail?.split('@')[0] || "Anonymous"}
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => handleLike(item._id)}
                        className="flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/30 px-3 py-1.5 rounded-full text-xs text-blue-400 hover:bg-blue-500/20 transition-all"
                      >
                        <ThumbsUp size={12} fill={currentUser && item.likes?.includes(currentUser.email) ? "currentColor" : "none"} />
                        {item.likes?.length || 0}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => handleDislike(item._id)}
                        className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/30 px-3 py-1.5 rounded-full text-xs text-red-400 hover:bg-red-500/20 transition-all"
                      >
                        <ThumbsDown size={12} fill={currentUser && item.dislikes?.includes(currentUser.email) ? "currentColor" : "none"} />
                        {item.dislikes?.length || 0}
                      </motion.button>
                      <span className="ml-auto text-xs text-gray-500">{formatCommentDate(item.createdAt)}</span>
                    </div>
                  )}
                </motion.div>
              ))}
              {data.length > 5 && (
                <motion.div {...fadeInUp} className="text-center pt-4">
                  <Link href="/comment" className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors">
                    View all {data.length} comments <ChevronRight className="w-3 h-3" />
                  </Link>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center py-16 bg-white/5 backdrop-blur-sm rounded-2xl border border-dashed border-white/10"
            >
              <div className="text-5xl mb-4">💬</div>
              <h3 className="text-lg font-semibold text-white mb-2">No comments yet</h3>
              <p className="text-sm text-blue-200/60">
                {isloggedin ? "Be the first to share your thoughts!" : "Login to post the first comment!"}
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* About Section */}
      <motion.section {...fadeInUp} className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeInUp}>
              <span className="inline-block text-sm font-semibold text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full mb-4">About</span>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-6">
                About <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Semik</span>
              </h2>
              <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                I am an experienced developer with about 2 years of experience. I want to learn Flutter and create mobile applications. I want to succeed in my life and make my mom and dad proud of me.
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Whether you&apos;re looking for a simple website or a complex web application, I&apos;m here to help you achieve your goals.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-blue-500" /> Nepal
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4 text-blue-500" /> semikserma@gmail.com
                </div>
              </div>
              <Link href="/about" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105">
                Learn More <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
            <motion.div
              {...fadeInUp}
              className="relative group"
            >
              <div className="absolute -inset-4 bg-gradient-to-br from-blue-100 via-cyan-100 to-blue-200 rounded-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
              <div className="relative h-96 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl overflow-hidden shadow-xl">
                <Image src="/mypicture.png" alt="Semik - Web Developer" fill className="object-cover" priority />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white z-10">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/20"
                  >
                    <p className="text-lg font-semibold">Web Developer</p>
                    <p className="text-sm text-white/80">Building the future, one line at a time</p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Testimonials / Quote */}
      <motion.section {...fadeInUp} className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500 rounded-full blur-[200px]" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <Star className="w-12 h-12 text-yellow-400 mx-auto mb-6" />
            <blockquote className="text-2xl md:text-3xl font-light text-white/90 leading-relaxed mb-8">
              &ldquo;The only way to do great work is to love what you do. Every line of code I write is a step toward building something meaningful.&rdquo;
            </blockquote>
            <div className="w-16 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto mb-6" />
            <p className="text-lg font-semibold text-cyan-300">— Semik</p>
            <p className="text-sm text-blue-200/60">Web Developer</p>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      {!isloggedin && (
        <motion.section {...fadeInUp} className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800" />
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-[150px] translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-400 rounded-full blur-[150px] -translate-x-1/2 translate-y-1/2" />
          </div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-blue-100/80 mb-10 max-w-2xl mx-auto leading-relaxed">
                Join us today and take the first step towards your digital success. Let&apos;s build something amazing together.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register" className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:shadow-xl hover:shadow-white/20 transition-all duration-300 hover:scale-105">
                  Create Account <ChevronRight className="w-4 h-4" />
                </Link>
                <Link href="/contact" className="inline-flex items-center gap-2 bg-transparent border-2 border-white/40 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 hover:scale-105">
                  Contact Me
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.section>
      )}

      {/* WhatsApp Floating Button */}
      <div className="fixed bottom-5 right-5 z-50">
        <motion.button
          onClick={openWhatsApp}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="relative flex items-center gap-3 bg-gradient-to-br from-emerald-500 to-green-600 text-white px-5 py-3.5 rounded-full shadow-xl transition-all duration-300 hover:shadow-2xl"
          aria-label="Chat on WhatsApp"
        >
          <div className="absolute -inset-1 bg-emerald-500 rounded-full opacity-30 animate-ping" />
          <svg className="w-6 h-6 relative" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.123-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
          <span className="font-medium relative">तपाईंलाई के सहयोग गर्न सक्छु ?</span>
        </motion.button>
      </div>
    </div>
  );
}
