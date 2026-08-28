"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { motion } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 50 },
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
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function Contact() {
  const [isloggedin, setIsLoggedIn] = useState('');
  const [name, setname] = useState('');
  const [sub, setssub] = useState('');
  const [message, setmessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!(user && token));
  }, []);

  const usersname = (event) => {
    setname(event.target.value);
  };
  const userssub = (event) => {
    setssub(event.target.value);
  };
  const usersmessage = (event) => {
    setmessage(event.target.value);
  };

  const handlecontact = async () => {
    try {
      setSending(true);
      const data = { name, sub, message };
      await axios.post(api.Contact.contact, data);
      toast.success('Successfully sent message! We promise we will reply within 24 hours');
      setname('');
      setssub('');
      setmessage('');
    } catch (error) {
      toast.error('Error sending message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-gray-50">
      <section className="section-dark py-20 lg:py-24 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <span className="section-label">Get in Touch</span>
            <h1 className="section-title mt-3 mb-4">Contact Me</h1>
            <p className="section-subtitle">
              Have a project in mind? I&apos;d love to hear from you.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <div className="text-sm text-gray-600 bg-white border border-gray-200 px-3 py-1.5 rounded-lg">
                Response within 24 hours
              </div>
              <div className="text-sm text-gray-600 bg-white border border-gray-200 px-3 py-1.5 rounded-lg">
                Mon–Fri, 9AM–6PM
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="portfolio-card p-8"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Send a message</h2>
              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handlecontact(); }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                >
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                  <input
                    type="text" id="name" name="name" value={name} onChange={usersname} required
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-300 transition-all"
                    placeholder="Type your name"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <input
                    type="text" id="subject" name="subject" value={sub} onChange={userssub} required
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-300 transition-all"
                    placeholder="Type your subject"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    id="message" name="message" value={message} onChange={usersmessage} required rows={5}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-300 transition-all resize-none"
                    placeholder="Tell me about your project or question..."
                  />
                </motion.div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  disabled={sending}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors disabled:opacity-60"
                >
                  {sending ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                      Sending...
                    </span>
                  ) : "Send Message"}
                </motion.button>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="portfolio-card p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact Info</h2>
                <div className="space-y-6">
                  {[
                    { icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", title: "Email", value: "semikserma@gmail.com", sub: "We respond within 24 hours" },
                    { icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", title: "Business Hours", value: "Monday - Friday: 9AM - 6PM", sub: "Saturday - Sunday: Closed" },
                    { icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z", title: "Location", value: "Phidim, Nepal", sub: "" },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + i * 0.15 }}
                      className="flex items-start space-x-4"
                    >
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 text-sm">{item.title}</h3>
                        <p className="text-gray-600 text-sm">{item.value}</p>
                        {item.sub && <p className="text-xs text-gray-500 mt-1">{item.sub}</p>}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="portfolio-card p-8"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-6">FAQ</h2>
                <div className="space-y-4">
                  {[
                    { q: "How quickly do you respond?", a: "I typically respond within 24 hours on business days." },
                    { q: "What should I include in my message?", a: "Project details, timeline, budget, and any specific requirements help me assist you better." },
                    { q: "Do you offer consultations?", a: "Yes — mention it in your message and we can schedule a call." },
                  ].map((faq, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className="border-b border-gray-200 pb-4 last:border-b-0"
                    >
                      <h3 className="font-medium text-gray-900 text-sm">{faq.q}</h3>
                      <p className="text-gray-600 mt-1 text-sm">{faq.a}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="portfolio-card overflow-hidden"
              >
                <h3 className="text-lg font-semibold text-gray-900 p-6 pb-4">Location</h3>
                <div className="relative h-56 w-full">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3432.3432!2d87.717848!3d27.611058!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb5c09270e40a1%3A0x79586f1139c4207a!2sPhidim%2C%20Nepal!5e0!3m2!1sen!2s!4v1703894400000!5m2!1sen!2s"
                    width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade" title="Location Map"
                  />
                </div>
                <div className="p-5">
                  <p className="text-gray-600 text-sm text-center">Phidim, Panchthar, Nepal</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {!isloggedin && (
        <motion.section {...fadeInUp} className="section-dark py-16 border-t border-gray-200">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="portfolio-card p-10"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Ready to start your project?</h3>
              <p className="text-gray-600 mb-6">
                Let&apos;s work together to bring your ideas to life.
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Get Started
              </Link>
            </motion.div>
          </div>
        </motion.section>
      )}
    </div>
  );
}
