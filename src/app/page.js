'use client'
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Send, User, Share2, Eye, ThumbsUp, ThumbsDown, Code2, Smartphone, ChevronRight, Mail, MapPin, Download, ExternalLink, Github, Layers, Monitor, Lightbulb, Search } from "lucide-react";
import axios from "axios";
import { api } from "@/lib/api";
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
    icon: <Layers className="w-8 h-8 text-blue-600" />,
    title: "UI/UX Design",
    desc: "Creating clean, intuitive UI/UX designs that improve usability and enhance user engagement.",
    color: "from-blue-500 to-blue-600"
  },
  {
    icon: <Smartphone className="w-8 h-8 text-blue-600" />,
    title: "Mobile App Design",
    desc: "Designing seamless, user-friendly mobile apps that deliver engaging and intuitive experiences.",
    color: "from-blue-500 to-teal-500"
  },
  {
    icon: <Monitor className="w-8 h-8 text-blue-600" />,
    title: "Website Design",
    desc: "Creating clean, responsive websites that offer intuitive navigation and enhance user experience.",
    color: "from-blue-500 to-indigo-500"
  },
  {
    icon: <Code2 className="w-8 h-8 text-blue-600" />,
    title: "Web Development",
    desc: "Building fast, reliable websites with clean code that deliver smooth, user-friendly experiences.",
    color: "from-indigo-500 to-blue-600"
  },
  {
    icon: <Lightbulb className="w-8 h-8 text-blue-600" />,
    title: "Brand Strategy",
    desc: "Developing clear brand strategies that connect with audiences and drive lasting business growth.",
    color: "from-blue-500 to-blue-500"
  },
  {
    icon: <Search className="w-8 h-8 text-blue-600" />,
    title: "SEO & Marketing",
    desc: "Optimizing online presence to boost visibility, attract customers, and grow your business effectively.",
    color: "from-teal-500 to-blue-600"
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
  const [expandedComments, setExpandedComments] = useState(false);
  const [replyOpen, setReplyOpen] = useState({});
  const [replyTexts, setReplyTexts] = useState({});
  const [submittingReply, setSubmittingReply] = useState({});

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

  const toggleReply = (commentId) => {
    setReplyOpen(prev => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  const handleReplyTextChange = (commentId, text) => {
    setReplyTexts(prev => ({ ...prev, [commentId]: text }));
  };

  const handleReplySubmit = async (commentId) => {
    if (!isloggedin || !currentUser) {
      toast.error('Please login to reply');
      router.push('/login');
      return;
    }
    const text = replyTexts[commentId]?.trim();
    if (!text) {
      toast.error('Please enter a reply');
      return;
    }
    try {
      setSubmittingReply(prev => ({ ...prev, [commentId]: true }));
      const response = await axios.post(api.comment.reply(commentId), {
        comment: text,
        userEmail: currentUser.email,
        userName: currentUser.name || currentUser.firstname || currentUser.email.split('@')[0],
        userAvatar: currentUser.avatar || ''
      });
      if (response.data && response.data.success !== false) {
        toast.success('Reply posted!');
        setReplyTexts(prev => ({ ...prev, [commentId]: '' }));
        await backendcall();
      } else {
        toast.error(response.data?.message || 'Failed to post reply');
      }
    } catch (error) {
      console.error('Error posting reply:', error);
      toast.error(error.response?.data?.message || 'Failed to post reply');
    } finally {
      setSubmittingReply(prev => ({ ...prev, [commentId]: false }));
    }
  };

  const handleLikeReply = async (commentId, replyId) => {
    if (!isloggedin || !currentUser) {
      toast.error('Please login to like');
      router.push('/login');
      return;
    }
    try {
      await axios.post(api.comment.likeReply(commentId, replyId), {
        userEmail: currentUser.email
      });
      await backendcall();
    } catch (error) {
      console.error('Error liking reply:', error);
      toast.error('Failed to like reply');
    }
  };

  const handleShareComment = async (item) => {
    const url = `${window.location.origin}/comment/${item._id}?type=before`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Comment by ${item.userName || 'Visitor'}`,
          text: item.comment,
          url: url
        });
      } catch (err) {
        if (err.name !== 'AbortError') console.error(err);
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success('Comment link copied to clipboard!');
    }
    try {
      await axios.post(api.comment.share(item._id));
      await backendcall();
    } catch (e) {
      // silent
    }
  };

  const visibleComments = expandedComments ? data : data.slice(0, 1);
  const hasMoreComments = data.length > 1;

  return (
    <div className="min-h-screen overflow-hidden bg-gray-50">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gray-50">
        {/* Subtle ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px]" />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000006_1px,transparent_1px),linear-gradient(to_bottom,#00000006_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16 lg:py-20 w-full">
          
          {/* Hero Main Content Grid */}
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-6 items-center">
            
            {/* Left Column: Typography & Info */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8">
              
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={heroLoaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
              >
                
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-[1.1]">
                  Hi, I&apos;m{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-500">
                    Semik
                  </span>
                </h1>
              </motion.div>

              {/* Tagline & Typed text */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={heroLoaded ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6 }}
                className="space-y-3 pt-2"
              >
                <div className="flex items-center gap-2 text-gray-700 text-base sm:text-lg font-medium">
                  <span className="text-blue-600 font-mono text-sm">&lt;/&gt;</span>
                  <span>{typedText}</span>
                  <span className="w-0.5 h-5 bg-blue-600 animate-blink" />
                </div>
                <p className="text-gray-600 text-sm sm:text-base max-w-xl leading-relaxed">
                  I design and build clean, modern web experiences with Next.js, React, and Django — focused on performance, usability, and polished UI.
                </p>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={heroLoaded ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.8 }}
                className="flex flex-wrap items-center gap-3 pt-2"
              >
                {isloggedin ? (
                  <Link href="/create-article" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 text-sm">
                    Continue <ChevronRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <>
                    <Link href="/about" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 text-sm">
                      View My Work <ChevronRight className="w-4 h-4" />
                    </Link>
                    <Link href="/login" className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200 text-sm">
                      <User className="h-4 w-4" /> Sign In
                    </Link>
                  </>
                )}

                <button onClick={handleShare} className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200 text-sm" title="Share website">
                  <Share2 className="h-4 w-4" />
                </button>

                <div className="inline-flex items-center gap-1.5 bg-white border border-gray-300 text-gray-600 px-4 py-3 rounded-lg text-sm">
                  <Eye className="h-4 w-4 text-blue-600" /> {formatNumber(visitorCount)} views
                </div>
              </motion.div>

            </div>

            {/* Right Column: Image Presentation with Buttons Migrated Underneath & Pushed Right */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={heroLoaded ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="lg:col-span-5 relative mt-8 lg:mt-0 flex flex-col items-center space-y-4"
            >
              <div className="relative w-full max-w-sm aspect-[4/5] rounded-2xl overflow-hidden border border-gray-200 shadow-2xl bg-white group z-10">
                <Image
                  src="/home.png"
                  alt="SemikDev"
                  fill
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 via-transparent to-transparent" />
              </div>

              <div className="flex items-center justify-center gap-3 w-full max-w-sm z-20">
                <button 
                  onClick={() => window.open("https://wa.me/9779862772457?text=Hey%20I%20visited%20your%20website", "_blank")} 
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  Hire Me
                </button>
                <a 
                  href="/cv" 
                  download 
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-100 border border-gray-300 hover:border-blue-300 text-gray-800 px-5 py-3 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  <Download className="w-4 h-4" /> CV
                </a>
              </div>

            </motion.div>

          </div>

          {/* Integrated Stats Bar at Bottom of Hero */}
          <div className="pt-10 mt-12 border-t border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { end: 4, label: "Years Experience", suffix: "+" },
                { end: 40, label: "Projects Delivered", suffix: "+" },
                { end: 25, label: "Happy Clients", suffix: "+" },
                { end: 10, label: "Technologies", suffix: "+" }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={heroLoaded ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.8 + i * 0.08 }}
                  className="text-center sm:text-left"
                >
                  <div className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                    <AnimatedCounter end={stat.end} suffix={stat.suffix} />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Services Section */}
      <section className="section-dark py-24 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div {...fadeInUp} className="mb-14 space-y-3">
            <span className="section-label">Services</span>
            <h2 className="section-title">What I Do</h2>
            <p className="section-subtitle">
              Full-stack development and design services tailored for modern digital products.
            </p>
          </motion.div>

          <motion.div {...staggerContainer} className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {offers.map((offer, i) => (
              <motion.div
                key={i}
                variants={staggerItem}
                className="portfolio-card p-6 flex flex-col"
              >
                <div className="mb-4 inline-flex items-center justify-center p-2.5 rounded-xl bg-blue-50 border border-blue-200 w-fit">
                  {offer.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {offer.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {offer.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="section-dark py-24 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div {...fadeInUp} className="mb-12 space-y-3">
            <span className="section-label">Portfolio</span>
            <h2 className="section-title">Recent Work</h2>
            <p className="section-subtitle">
              Selected projects showcasing web applications and digital experiences.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-4">
              {["All", "Apps", "Websites", "UI/UX"].map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 cursor-pointer ${
                    activeCategory === category
                      ? "bg-blue-600 text-white"
                      : "bg-white border border-gray-300 text-gray-600 hover:text-blue-600 hover:border-blue-300"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div layout className="grid md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {projects
                .filter((p) => activeCategory === "All" || p.category === activeCategory)
                .map((project) => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 16 }}
                    transition={{ duration: 0.3 }}
                    className="portfolio-card overflow-hidden flex flex-col group"
                  >
                    <div className="relative w-full aspect-[16/10] overflow-hidden bg-white">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover object-top group-hover:scale-[1.03] transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gray-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" /> Live Demo
                        </a>
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-gray-100 border border-gray-300 hover:border-blue-300 text-gray-800 px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                        >
                          <Github className="w-4 h-4" /> Code
                        </a>
                      </div>
                    </div>

                    <div className="p-5 sm:p-6 space-y-3 flex-1 flex flex-col">
                      <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                        {project.category}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {project.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                        {project.desc}
                      </p>
                      <div className="flex flex-wrap gap-2 pt-3 mt-auto border-t border-gray-200">
                        {project.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-xs text-gray-600 bg-white border border-gray-200 px-2 py-0.5 rounded-md"
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
      <motion.section {...fadeInUp} className="section-dark py-24 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <motion.div {...fadeInUp}>
              <span className="section-label">Skills</span>
              <h2 className="section-title mt-3 mb-4">
                Technologies I Work With
              </h2>
              <p className="section-subtitle mb-8">
                From frontend to backend, I build complete solutions with modern tools and clean architecture.
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: "Next.js", icon: "M8.8 2.6C8.4 2.2 7.6 2.2 7.2 2.6L2 7.8c-.4.4-.4 1.2 0 1.6l5.2 5.2c.4.4 1.2.4 1.6 0L14 9.4c.4-.4.4-1.2 0-1.6L8.8 2.6z", color: "#fff" },
                  { name: "React", icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm-5-9c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm10 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-5 9c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z", color: "#61DAFB" },
                  { name: "Django", icon: "M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.5l7 3.5v7l-7 3.5-7-3.5v-7l7-3.5z", color: "#44B78B" },
                  { name: "Node.js", icon: "M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.5l7 3.5v7l-7 3.5-7-3.5v-7l7-3.5zM8 9v6h2V9H8zm3 0v6h2l3-4.5V9h-2v6h2l-3-4.5V9h-2zm6 0h-2v6h2V9z", color: "#339933" },
                  { name: "MongoDB", icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c.55 0 1 .45 1 1v8c0 .55-.45 1-1 1s-1-.45-1-1V6c0-.55.45-1 1-1zm0 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z", color: "#47A248" },
                  { name: "Tailwind", icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm0-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z", color: "#06B6D4" },
                  { name: "Python", icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z", color: "#3776AB" },
                  { name: "JavaScript", icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c.55 0 1 .45 1 1v3h-2V6c0-.55.45-1 1-1zm0 11c-.55 0-1-.45-1-1v-3h2v3c0 .55-.45 1-1 1z", color: "#F7DF1E" },
                ].map((tech) => (
                  <div
                    key={tech.name}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path d={tech.icon} fill={tech.color} />
                    </svg>
                    {tech.name}
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div {...fadeInUp} className="space-y-5">
              {skills.map((skill, i) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                >
                  <div className="flex justify-between mb-2 items-center">
                    <span className="flex items-center gap-2 text-sm font-medium text-gray-800">
                      <span
                        className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-100 border border-gray-300"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24">
                          <path d={skill.icon} fill={skill.color} />
                        </svg>
                      </span>
                      {skill.name}
                    </span>
                    <span className="text-sm text-gray-500">{skill.level}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: i * 0.06, ease: "easeOut" }}
                      className="h-full bg-blue-500 rounded-full"
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Comment Section */}
      <section ref={commentscroll} className="section-dark py-24 border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div {...fadeInUp} className="mb-10 space-y-3">
            <span className="section-label">Feedback</span>
            <h2 className="section-title">What People Say</h2>
            <p className="section-subtitle">
              Share your thoughts and feedback about my work
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="portfolio-card p-5 mb-8"
          >
            <div className="flex gap-3 items-start">
              <textarea
                placeholder="Write your review..."
                value={comment}
                onChange={handleCommentChange}
                disabled={submitting}
                className="flex-1 bg-transparent border-none outline-none resize-none text-gray-800 text-sm min-h-[56px] leading-relaxed placeholder-gray-400"
              />
              <button
                type="button"
                onClick={handlecomment}
                disabled={submitting || !comment.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg w-10 h-10 flex items-center justify-center text-white transition-colors flex-shrink-0"
              >
                {submitting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </motion.div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-7 w-7 border-t-2 border-b-2 border-blue-600 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Loading comments...</p>
            </div>
          ) : data.length > 0 ? (
            <div className="space-y-4">
              <AnimatePresence initial={false}>
                {visibleComments.map((item, idx) => (
                  <motion.div
                    key={item._id || idx}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="portfolio-card p-5"
                  >
                    <p className="text-gray-700 text-sm leading-relaxed mb-4">
                      {item.comment.length > 200 && !expandedComments
                        ? `${item.comment.substring(0, 200)}...`
                        : item.comment}
                    </p>
                    {item.comment.length > 200 && idx === 0 && !expandedComments && (
                      <Link href={`/comment/${item._id}?type=before`} className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-500 text-sm font-medium mb-4 transition-colors">
                        Read full comment <ChevronRight className="w-3 h-3" />
                      </Link>
                    )}
                    {item.createdAt && (
                      <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-gray-200">
                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                          {item.userAvatar ? (
                            <img src={item.userAvatar} alt="" className="w-4 h-4 rounded-full object-cover" />
                          ) : (
                            <User size={12} className="text-blue-600" />
                          )}
                          <span className="font-medium">{item.userName || item.userEmail?.split('@')[0] || "Anonymous"}</span>
                        </div>
                        <button
                          onClick={() => handleLike(item._id)}
                          className={`flex items-center gap-1 text-xs transition-colors px-2 py-1 rounded-md ${
                            currentUser && item.likes?.includes(currentUser.email)
                              ? "text-blue-600 bg-blue-50 font-medium"
                              : "text-gray-600 hover:text-blue-600 hover:bg-gray-100"
                          }`}
                          title="Like comment"
                        >
                          <ThumbsUp size={12} fill={currentUser && item.likes?.includes(currentUser.email) ? "currentColor" : "none"} />
                          {item.likes?.length || 0}
                        </button>
                        <button
                          onClick={() => handleDislike(item._id)}
                          className={`flex items-center gap-1 text-xs transition-colors px-2 py-1 rounded-md ${
                            currentUser && item.dislikes?.includes(currentUser.email)
                              ? "text-red-600 bg-red-50 font-medium"
                              : "text-gray-600 hover:text-red-500 hover:bg-gray-100"
                          }`}
                          title="Dislike comment"
                        >
                          <ThumbsDown size={12} fill={currentUser && item.dislikes?.includes(currentUser.email) ? "currentColor" : "none"} />
                          {item.dislikes?.length || 0}
                        </button>
                        <button
                          onClick={() => toggleReply(item._id)}
                          className={`flex items-center gap-1 text-xs transition-colors px-2 py-1 rounded-md ${
                            replyOpen[item._id]
                              ? "text-blue-600 bg-blue-50 font-medium"
                              : "text-gray-600 hover:text-blue-600 hover:bg-gray-100"
                          }`}
                          title="Reply to comment"
                        >
                          <MessageCircle size={12} />
                          <span>Reply {item.replies?.length > 0 ? `(${item.replies.length})` : ''}</span>
                        </button>
                        <button
                          onClick={() => handleShareComment(item)}
                          className="flex items-center gap-1 text-xs text-gray-600 hover:text-blue-600 transition-colors px-2 py-1 rounded-md hover:bg-gray-100"
                          title="Share comment"
                        >
                          <Share2 size={12} />
                          <span>Share {item.shares > 0 ? `(${item.shares})` : ''}</span>
                        </button>
                        <span className="ml-auto text-xs text-gray-500">{formatCommentDate(item.createdAt)}</span>
                      </div>
                    )}

                    {/* Replies list and reply input */}
                    {replyOpen[item._id] && (
                      <div className="mt-4 pt-3 border-t border-gray-100 space-y-3">
                        {item.replies && item.replies.length > 0 && (
                          <div className="space-y-2.5">
                            {item.replies.map((reply) => (
                              <div
                                key={reply._id}
                                className="flex gap-2.5 pl-3 border-l-2 border-blue-500/40 bg-gray-50/70 rounded-r-lg p-2.5"
                              >
                                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 text-xs font-semibold overflow-hidden">
                                  {reply.userAvatar ? (
                                    <img src={reply.userAvatar} alt="" className="w-full h-full object-cover" />
                                  ) : (
                                    reply.userName ? reply.userName.charAt(0).toUpperCase() : <User size={12} />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="text-xs font-medium text-gray-800 truncate">
                                      {reply.userName || reply.userEmail?.split('@')[0] || "Anonymous"}
                                    </span>
                                    <span className="text-[10px] text-gray-400">
                                      {formatCommentDate(reply.createdAt)}
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-700 mt-1 whitespace-pre-wrap leading-relaxed">
                                    {reply.comment}
                                  </p>
                                  <div className="mt-1.5 flex items-center gap-2">
                                    <button
                                      onClick={() => handleLikeReply(item._id, reply._id)}
                                      className={`inline-flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded transition-colors ${
                                        currentUser && reply.likes?.includes(currentUser.email)
                                          ? "text-blue-600 bg-blue-100/60 font-medium"
                                          : "text-gray-500 hover:text-blue-600 hover:bg-gray-100"
                                      }`}
                                    >
                                      <ThumbsUp size={11} fill={currentUser && reply.likes?.includes(currentUser.email) ? "currentColor" : "none"} />
                                      <span>{reply.likes?.length || 0}</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Inline Reply input */}
                        <div className="flex gap-2 items-center pt-1">
                          <input
                            type="text"
                            placeholder="Write a reply..."
                            value={replyTexts[item._id] || ''}
                            onChange={(e) => handleReplyTextChange(item._id, e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleReplySubmit(item._id);
                              }
                            }}
                            className="flex-1 text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                          />
                          <button
                            onClick={() => handleReplySubmit(item._id)}
                            disabled={submittingReply[item._id]}
                            className="px-3 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 transition-colors flex items-center gap-1"
                          >
                            {submittingReply[item._id] ? 'Posting...' : <><Send size={11} /> Reply</>}
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {hasMoreComments && (
                <motion.div {...fadeInUp} className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setExpandedComments(!expandedComments)}
                    className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-500 text-sm font-medium transition-colors px-4 py-2 rounded-lg border border-gray-300 hover:border-blue-300 hover:bg-gray-50"
                  >
                    {expandedComments ? (
                      <>Show less <ChevronRight className="w-3 h-3 rotate-90" /></>
                    ) : (
                      <>Read more ({data.length - 1} more) <ChevronRight className="w-3 h-3" /></>
                    )}
                  </button>
                </motion.div>
              )}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center py-14 portfolio-card border-dashed"
            >
              <MessageCircle className="w-10 h-10 text-gray-500 mx-auto mb-3" />
              <h3 className="text-base font-medium text-gray-900 mb-1">No comments yet</h3>
              <p className="text-sm text-gray-500">
                {isloggedin ? "Be the first to share your thoughts!" : "Login to post the first comment!"}
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* About Section */}
      <motion.section {...fadeInUp} className="section-dark py-24 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div {...fadeInUp}>
              <span className="section-label">About</span>
              <h2 className="section-title mt-3 mb-4">
                About Semik
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                I am an experienced developer with about 2 years of experience. I want to learn Flutter and create mobile applications. I want to succeed in my life and make my mom and dad proud of me.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Whether you&apos;re looking for a simple website or a complex web application, I&apos;m here to help you achieve your goals.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-blue-600" /> Nepal
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4 text-blue-600" /> semikserma@gmail.com
                </div>
              </div>
              <Link href="/about" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200">
                Learn More <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
            <motion.div {...fadeInUp} className="relative">
              <div className="relative h-80 sm:h-96 rounded-2xl overflow-hidden border border-gray-200 shadow-xl">
                <Image src="/mypicture.png" alt="Semik - Web Developer" fill className="object-cover" priority />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/30 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5">
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
                    <p className="text-base font-medium text-white">Web Developer</p>
                    <p className="text-sm text-gray-600">Building the future, one line at a time</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Quote Section */}
      <motion.section {...fadeInUp} className="section-dark py-20 border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <blockquote className="text-xl md:text-2xl font-light text-gray-700 leading-relaxed mb-6">
              &ldquo;The only way to do great work is to love what you do. Every line of code I write is a step toward building something meaningful.&rdquo;
            </blockquote>
            <p className="text-sm font-medium text-blue-600">— Semik, Web Developer</p>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      {!isloggedin && (
        <motion.section {...fadeInUp} className="section-dark py-24 border-t border-gray-200">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="portfolio-card p-10 sm:p-12"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Join today and take the first step toward your digital success. Let&apos;s build something amazing together.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/register" className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                  Create Account <ChevronRight className="w-4 h-4" />
                </Link>
                <Link href="/contact" className="inline-flex items-center justify-center gap-2 bg-gray-100 border border-gray-300 hover:border-blue-300 text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors">
                  Contact Me
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.section>
      )}

      {/* WhatsApp Floating Button */}
      <div className="fixed bottom-5 right-5 z-50">
        <button
          onClick={openWhatsApp}
          className="flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-3 rounded-full shadow-lg transition-colors duration-200"
          aria-label="Chat on WhatsApp"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.123-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
          <span className="text-sm font-medium hidden sm:inline">तपाईंलाई के सहयोग गर्न सक्छु ?</span>
        </button>
      </div>
    </div>
  );
}
