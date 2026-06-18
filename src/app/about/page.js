"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 50 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1 } },
  viewport: { once: true, margin: "-60px" }
};

const staggerItem = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

function SkillBar({ name, level, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="bg-white p-5 sm:p-6 rounded-xl shadow-md"
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-base sm:text-lg font-semibold text-gray-800">{name}</span>
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: delay + 0.3 }}
          className="text-xs sm:text-sm font-medium text-blue-600"
        >
          {level}%
        </motion.span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: delay + 0.2, ease: "easeOut" }}
          className="bg-gradient-to-r from-blue-600 to-cyan-500 h-full rounded-full"
        />
      </div>
    </motion.div>
  );
}

export default function About() {
  const [isloggedin, setIsLoggedIn] = useState(() => {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    return !!(token && user);
  });
  const getout = () => {};

  const skills = [
    { name: "React", level: 90 },
    { name: "Next.js", level: 85 },
    { name: "JavaScript", level: 95 },
    { name: "TypeScript", level: 80 },
    { name: "Tailwind CSS", level: 90 },
    { name: "Node.js", level: 75 },
  ];

  const technologies = [
    { name: "Frontend", items: ["React", "Next.js", "Vue.js", "HTML5", "CSS3", "Tailwind CSS", "JavaScript", "TypeScript"] },
    { name: "Backend", items: ["Node.js", "Express", "REST APIs", "GraphQL"] },
    { name: "Tools", items: ["Git", "GitHub", "VS Code", "Figma", "Webpack", "Vite"] },
    { name: "Others", items: ["Responsive Design", "SEO", "Performance Optimization", "Testing"] },
  ];

  const whyChoose = [
    { icon: "🎯", title: "Focus on Quality", desc: "I prioritize clean code, best practices, and attention to detail in every project I work on." },
    { icon: "🚀", title: "Modern Technologies", desc: "I stay up-to-date with the latest web technologies and frameworks to deliver cutting-edge solutions." },
    { icon: "💡", title: "Creative Solutions", desc: "I approach each project with creativity and innovation to solve problems in unique ways." },
    { icon: "🤝", title: "Client-Focused", desc: "Your success is my priority. I work closely with clients to understand their vision and deliver beyond expectations." },
    { icon: "⚡", title: "Fast & Efficient", desc: "I deliver projects on time without compromising quality, ensuring you get results quickly." },
    { icon: "📱", title: "Responsive Design", desc: "Every website I build is fully responsive and works perfectly on all devices and screen sizes." },
  ];

  return (
    <div className="min-h-screen overflow-hidden">
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 right-10 w-72 h-72 bg-blue-500 rounded-full blur-[128px] animate-float-slow" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-500 rounded-full blur-[128px] animate-float-delayed" />
        </div>
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => {
            const left = ((i * 37 + 13) % 100);
            const top = ((i * 53 + 7) % 100);
            return (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/20 rounded-full"
                style={{ left: `${left}%`, top: `${top}%` }}
                animate={{ y: [0, -25, 0], opacity: [0.2, 0.7, 0.2] }}
                transition={{ duration: 3 + ((i * 7) % 4), repeat: Infinity, delay: ((i * 13) % 30) / 10 }}
              />
            );
          })}
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center space-y-4"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-block text-sm font-semibold text-cyan-300 bg-white/10 px-4 py-1.5 rounded-full border border-white/20"
            >
              About Me
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold"
            >
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Semik</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-lg sm:text-xl md:text-2xl text-blue-100/80 max-w-3xl mx-auto px-4"
            >
              Passionate web developer dedicated to creating exceptional digital experiences
            </motion.p>
          </motion.div>
        </div>
      </section>

      <motion.section {...fadeInUp} className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <motion.div {...fadeInUp} className="order-2 lg:order-1">
              <span className="inline-block text-sm font-semibold text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full mb-4">Who I Am</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">
                Hi, I&apos;m <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Semik-serma</span>
              </h2>
              <div className="space-y-4 text-base sm:text-lg text-gray-600 leading-relaxed">
                <p>I am a passionate developer with a love for creating beautiful, functional, and user-friendly websites.</p>
                <p>I want to be successful in my life. I have to learn at least 10 programming languages and become a global person for the entire world.</p>
                <p>I am currently doing Next.js and in the previous year I have done HTML, CSS, JavaScript, Python, and Django.</p>
                <p>When I&apos;m not coding, I do physical exercises like running, jumping, throwing, and pushups.</p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="order-1 lg:order-2"
            >
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-br from-blue-100 via-cyan-100 to-blue-200 rounded-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                <div className="relative h-64 sm:h-80 md:h-96 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl overflow-hidden shadow-xl">
                  <Image src="/mypicture.png" alt="Semik - Web Developer" fill className="object-cover" priority />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="absolute bottom-4 sm:bottom-6 left-4 right-4 text-white z-10"
                  >
                    <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/20">
                      <p className="text-xl sm:text-2xl font-semibold">Web Developer</p>
                      <p className="text-sm text-white/80">Building websites with Django, Next.js and others.</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <motion.section {...fadeInUp} className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="max-w-4xl mx-auto mb-12">
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 text-center lg:text-left">
              How I learned to make websites
            </h3>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-md p-6 md:p-10"
            >
              <div className="text-gray-700 text-base sm:text-lg leading-relaxed space-y-4">
                <p>I am studying in class 7.</p>
                <p>In the morning and in the evening after the homework and in the holidays, I learn full stack website development. This website I made it.</p>
                <p>If you give me a documentation, I can also make this website for you: portfolio website, news website, e-commerce website, official website, organization website, etc.</p>
                <p>I will use MongoDB database for now. My main goal is SaaS product application and Android OS, mac OS, etc.</p>
                <p>I am trying to learn all of that.</p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div {...fadeInUp} className="text-center mb-12">
            <span className="inline-block text-sm font-semibold text-purple-600 bg-purple-50 px-4 py-1.5 rounded-full mb-4">Skills</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">
              My <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">Skills</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Technologies and tools I work with to bring ideas to life
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {skills.map((skill, index) => (
              <SkillBar key={skill.name} name={skill.name} level={skill.level} delay={index * 0.1} />
            ))}
          </div>

          <motion.div {...staggerContainer} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-10">
            {technologies.map((category, index) => (
              <motion.div
                key={index}
                variants={staggerItem}
                whileHover={{ y: -5 }}
                className="bg-white p-5 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              >
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">{category.name}</h3>
                <ul className="space-y-1 sm:space-y-2">
                  {category.items.map((item, itemIndex) => (
                    <motion.li
                      key={itemIndex}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: itemIndex * 0.05 }}
                      className="text-sm sm:text-base text-gray-600 flex items-center"
                    >
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-600 rounded-full mr-2"></span>
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <motion.section {...fadeInUp} className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <span className="inline-block text-sm font-semibold text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full mb-4">Why Me</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">
              Why <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">Choose Me?</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              What sets me apart as a web developer
            </p>
          </motion.div>

          <motion.div {...staggerContainer} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChoose.map((item, i) => (
              <motion.div
                key={i}
                variants={staggerItem}
                whileHover={{ y: -6 }}
                className="group bg-gradient-to-br from-blue-50 to-blue-100 p-6 sm:p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
              >
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  className="text-3xl sm:text-4xl mb-3 sm:mb-4"
                >
                  {item.icon}
                </motion.div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {!isloggedin && (
        <motion.section {...fadeInUp} className="py-16 relative overflow-hidden">
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
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Let&apos;s Work Together</h2>
              <p className="text-lg sm:text-xl text-blue-100/80 mb-8 max-w-2xl mx-auto">
                Have a project in mind? Let&apos;s discuss how we can bring your ideas to life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:shadow-xl hover:shadow-white/20 transition-all duration-300 hover:scale-105"
                >
                  Get In Touch
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 bg-transparent border-2 border-white/40 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 hover:scale-105"
                >
                  Start a Project
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.section>
      )}
    </div>
  );
}
