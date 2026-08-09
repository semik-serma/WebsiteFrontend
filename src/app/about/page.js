"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowUpRight, Code2, Zap, Shield, Target, Cpu, Layers, CheckCircle2, Award, Terminal, Rocket } from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1 } },
  viewport: { once: true, margin: "-60px" }
};

const staggerItem = {
  initial: { opacity: 0, y: 25 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

function SkillBar({ name, level, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl backdrop-blur-sm"
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-base font-semibold text-slate-200">{name}</span>
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: delay + 0.3 }}
          className="text-xs font-bold text-cyan-400"
        >
          {level}%
        </motion.span>
      </div>
      <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: delay + 0.2, ease: "easeOut" }}
          className="bg-gradient-to-r from-blue-600 via-cyan-400 to-teal-300 h-full rounded-full shadow-sm shadow-cyan-500/50"
        />
      </div>
    </motion.div>
  );
}

export default function About() {
  const [isloggedin] = useState(() => {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    return !!(token && user);
  });

  const skills = [
    { name: "JavaScript / ES6+", level: 95 },
    { name: "React / Next.js", level: 90 },
    { name: "Tailwind CSS", level: 90 },
    { name: "Python / Django", level: 80 },
    { name: "Node.js & APIs", level: 75 },
    { name: "MongoDB / Databases", level: 75 },
  ];

  const technologies = [
    { name: "Frontend", items: ["Next.js (App Router)", "React.js", "Tailwind CSS", "HTML5 & CSS3", "JavaScript", "Framer Motion"] },
    { name: "Backend", items: ["Node.js", "Express.js", "Django", "REST APIs", "MongoDB", "Auth & JWT"] },
    { name: "Tools", items: ["Git & GitHub", "VS Code", "Vercel", "Figma", "Postman", "npm / Yarn"] },
    { name: "Specialties", items: ["Responsive UI", "SEO Best Practices", "Performance Optimization", "Clean Architecture"] },
  ];

  const whyChoose = [
    { icon: <Target className="w-7 h-7 text-cyan-400" />, title: "Focus on Quality", desc: "Prioritizing clean code structure, modern standards, and smooth responsive design in every project." },
    { icon: <Zap className="w-7 h-7 text-cyan-400" />, title: "Modern Tech Stack", desc: "Building applications using Next.js 16, React, Django, and Tailwind CSS for max performance." },
    { icon: <Cpu className="w-7 h-7 text-cyan-400" />, title: "Creative Problem Solving", desc: "Translating complex ideas into intuitive user experiences with high visual excellence." },
    { icon: <Shield className="w-7 h-7 text-cyan-400" />, title: "Secure & Scalable", desc: "Designing backend APIs and authentication with robust security best practices." },
    { icon: <Layers className="w-7 h-7 text-cyan-400" />, title: "Fast Delivery", desc: "Efficient workflow ensuring prompt project completion without sacrificing code quality." },
    { icon: <Code2 className="w-7 h-7 text-cyan-400" />, title: "Fully Responsive", desc: "Seamless layout adaptation across desktop, tablet, and mobile displays." },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">

      {/* HERO SECTION WITH USER'S PLANET ARC IMAGE (aboutpagebg.png) */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-24 pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden bg-slate-950">
        
        {/* Full Cover Background Image: aboutpagebg.png */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <Image
            src="/aboutpagebg.png"
            alt="About Page Background"
            fill
            className="object-cover object-center w-full h-full opacity-70"
            priority
          />
          {/* Smooth Dark Gradient Overlays for contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-transparent to-slate-950" />
          <div className="absolute inset-0 bg-slate-950/20" />
        </div>

        {/* Ambient Cyan Lighting */}
        <div className="absolute inset-0 pointer-events-none opacity-20 z-10">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-cyan-600 rounded-full blur-[180px]" />
        </div>

        {/* Centered Quantum Hero Content */}
        <div className="relative z-30 max-w-5xl mx-auto text-center space-y-6">

          {/* Glowing Quantum Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="font-condensed text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] font-black tracking-widest leading-none text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-blue-300 drop-shadow-[0_0_40px_rgba(34,211,238,0.5)]"
          >
            SEMIKDEV
          </motion.h1>

          {/* Subheadline Tagline */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-base sm:text-xl md:text-2xl font-bold tracking-[0.3em] uppercase text-cyan-200/90"
          >
            STOP GUESSING — START SCALING
          </motion.h2>

          {/* Sub-description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed px-4"
          >
            Crafting high-performance web applications, modern interactive interfaces, and intelligent digital infrastructure.
          </motion.p>

          {/* Action CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="pt-4"
          >
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold text-sm sm:text-base px-8 py-3.5 rounded-2xl shadow-xl shadow-cyan-500/30 hover:scale-105 transition-all duration-300 group"
            >
              Get In Touch <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </motion.div>

        </div>
      </section>

      {/* WHO I AM SECTION */}
      <motion.section {...fadeInUp} className="py-24 relative bg-slate-950 border-t border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Story Text */}
            <motion.div {...fadeInUp} className="lg:col-span-7 space-y-6">
              <span className="inline-block text-xs font-bold tracking-widest text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-4 py-1.5 rounded-full uppercase">
                Who I Am
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                Hi, I&apos;m <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Semik Serma</span>
              </h2>
              <div className="space-y-4 text-slate-300 text-base leading-relaxed">
                <p>
                  I am a passionate web developer dedicated to creating intuitive, high-performance, and visually striking web applications.
                </p>
                <p>
                  My goal is to push the boundaries of digital engineering, master core technologies, and deliver impactful solutions globally.
                </p>
                <p>
                  I specialize in modern fullstack development using <strong className="text-cyan-300">Next.js</strong>, <strong className="text-cyan-300">React</strong>, <strong className="text-cyan-300">JavaScript</strong>, <strong className="text-cyan-300">Python</strong>, and <strong className="text-cyan-300">Django</strong>.
                </p>
                <p>
                  Outside of coding, I stay physically disciplined with regular fitness routines including running, pushups, and athletic exercises.
                </p>
              </div>
            </motion.div>

            {/* Feature Stat Cards */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-5 grid sm:grid-cols-2 gap-4"
            >
              <div className="bg-slate-900/80 border border-cyan-500/30 p-6 rounded-3xl shadow-xl backdrop-blur-md">
                <Terminal className="w-8 h-8 text-cyan-400 mb-3" />
                <h3 className="text-3xl font-extrabold text-white font-condensed tracking-wider">4+ YEARS</h3>
                <p className="text-xs font-semibold text-slate-400 uppercase mt-1">Coding Experience</p>
              </div>

              <div className="bg-slate-900/80 border border-blue-500/30 p-6 rounded-3xl shadow-xl backdrop-blur-md">
                <Rocket className="w-8 h-8 text-blue-400 mb-3" />
                <h3 className="text-3xl font-extrabold text-white font-condensed tracking-wider">40+ PROJECTS</h3>
                <p className="text-xs font-semibold text-slate-400 uppercase mt-1">Delivered Worldwide</p>
              </div>

              <div className="bg-slate-900/80 border border-teal-500/30 p-6 rounded-3xl shadow-xl backdrop-blur-md sm:col-span-2">
                <Award className="w-8 h-8 text-teal-400 mb-3" />
                <h3 className="text-xl font-bold text-white">Fullstack Engineering</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Building SaaS platforms, custom enterprise web portals, interactive media apps, and responsive digital solutions.
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </motion.section>

      {/* HOW I LEARNED TO CODE */}
      <motion.section {...fadeInUp} className="py-20 bg-slate-900/60 border-t border-slate-800/60 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <span className="inline-block text-xs font-bold tracking-widest text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-4 py-1.5 rounded-full uppercase mb-3">
                Journey
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                How I Learned To Build Websites
              </h2>
            </div>
            
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl backdrop-blur-md space-y-5 text-slate-300 text-base leading-relaxed">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 mt-1 shrink-0" />
                <p>Currently studying in class 8 at Phidim 4, Gadi Phidim Mavhi School.</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 mt-1 shrink-0" />
                <p>In the mornings, evenings, and holidays, I dedicate focused hours to mastering fullstack web development.</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 mt-1 shrink-0" />
                <p>Given project requirements or designs, I craft tailored web applications: portfolio platforms, news portals, e-commerce stores, and official organization websites.</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 mt-1 shrink-0" />
                <p>My primary focus spans SaaS product applications, database architecture with MongoDB, and expanding into cross-platform software environments.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* SKILLS SECTION */}
      <motion.section {...fadeInUp} className="py-24 bg-slate-950 border-t border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <motion.div {...fadeInUp} className="text-center mb-14">
            <span className="inline-block text-xs font-bold tracking-widest text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-4 py-1.5 rounded-full uppercase mb-3">
              Capabilities
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white">
              My Technical <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Skills</span>
            </h2>
            <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mt-2">
              Technologies and tools I leverage to engineer robust web solutions
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {skills.map((skill, index) => (
              <SkillBar key={skill.name} name={skill.name} level={skill.level} delay={index * 0.1} />
            ))}
          </div>

          <motion.div {...staggerContainer} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {technologies.map((category, index) => (
              <motion.div
                key={index}
                variants={staggerItem}
                whileHover={{ y: -6 }}
                className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-2xl backdrop-blur-sm shadow-xl hover:border-cyan-500/40 transition-all duration-300"
              >
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full" />
                  {category.name}
                </h3>
                <ul className="space-y-2">
                  {category.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-sm text-slate-300 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </motion.section>

      {/* WHY CHOOSE ME SECTION */}
      <motion.section {...fadeInUp} className="py-24 bg-slate-900/40 border-t border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <motion.div {...fadeInUp} className="text-center mb-16">
            <span className="inline-block text-xs font-bold tracking-widest text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-4 py-1.5 rounded-full uppercase mb-3">
              Advantages
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white">
              Why <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Choose Me?</span>
            </h2>
            <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mt-2">
              What sets my web engineering approach apart
            </p>
          </motion.div>

          <motion.div {...staggerContainer} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {whyChoose.map((item, i) => (
              <motion.div
                key={i}
                variants={staggerItem}
                whileHover={{ y: -6 }}
                className="group bg-slate-900/70 border border-slate-800/80 p-8 rounded-3xl backdrop-blur-sm shadow-xl hover:border-cyan-500/40 hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300"
              >
                <div className="mb-6 inline-flex p-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/20 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </motion.section>

      {/* LET'S WORK TOGETHER CTA BANNER */}
      {!isloggedin && (
        <section className="py-24 relative overflow-hidden bg-slate-950 border-t border-slate-800/60">
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="absolute top-10 right-10 w-96 h-96 bg-cyan-600 rounded-full blur-[180px]" />
            <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-600 rounded-full blur-[180px]" />
          </div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <motion.div {...fadeInUp} className="space-y-6">
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Let&apos;s Build Something Incredible
              </h2>
              <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                Have a project or web application in mind? Let&apos;s turn your vision into a reality.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold px-8 py-4 rounded-2xl shadow-xl shadow-cyan-500/25 hover:scale-105 transition-all duration-300 text-sm"
                >
                  Get In Touch <ArrowUpRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 bg-slate-900 border border-slate-800 text-slate-200 font-bold px-8 py-4 rounded-2xl hover:border-cyan-500/40 hover:bg-slate-850 transition-all duration-300 text-sm"
                >
                  Start a Project
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      )}

    </div>
  );
}
