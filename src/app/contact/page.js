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
    <div className="min-h-screen overflow-hidden">
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500 rounded-full blur-[128px] animate-float-slow" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500 rounded-full blur-[128px] animate-float-delayed" />
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
            className="text-center"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-block text-sm font-semibold text-cyan-300 bg-white/10 px-4 py-1.5 rounded-full border border-white/20 mb-4"
            >
              Get in Touch
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-6xl font-bold mb-4"
            >
              Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Us</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xl text-blue-100/80 max-w-2xl mx-auto mb-8"
            >
              We&apos;d love to hear from you! Get in touch with us.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/10">
                <span className="text-sm text-blue-200">Response time:</span>
                <span className="ml-2 font-semibold">Within 24 hours</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/10">
                <span className="text-sm text-blue-200">Support hours:</span>
                <span className="ml-2 font-semibold">Mon-Fri, 9AM-6PM</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-300"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-300"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-300 resize-none"
                    placeholder="Tell us more about your project or question..."
                  />
                </motion.div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  disabled={sending}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg disabled:opacity-60"
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
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
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
                      <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{item.title}</h3>
                        <p className="text-gray-600">{item.value}</p>
                        {item.sub && <p className="text-sm text-gray-500 mt-1">{item.sub}</p>}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  {[
                    { q: "How quickly do you respond to inquiries?", a: "We typically respond to all inquiries within 24 hours during business days. For urgent matters, please mention it in your message." },
                    { q: "What information should I include in my message?", a: "Please include details about your project, timeline, budget, and any specific requirements. The more information you provide, the better we can assist you." },
                    { q: "Do you offer phone consultations?", a: "Yes, we offer phone consultations for complex projects. Please mention this in your initial message, and we'll schedule a call at your convenience." },
                  ].map((faq, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + i * 0.15 }}
                      className="border-b border-gray-200 pb-4 last:border-b-0"
                    >
                      <h3 className="font-semibold text-gray-900">{faq.q}</h3>
                      <p className="text-gray-600 mt-1 text-sm">{faq.a}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                <h3 className="text-xl font-bold text-gray-900 p-6 pb-4">Find Us Here</h3>
                <div className="relative h-64 w-full">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3432.3432!2d87.717848!3d27.611058!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb5c09270e40a1%3A0x79586f1139c4207a!2sPhidim%2C%20Nepal!5e0!3m2!1sen!2s!4v1703894400000!5m2!1sen!2s"
                    width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade" title="Location Map"
                  />
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center shadow-2xl border-2 border-white"
                    >
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 14 7 14s7-8.75 7-14c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                      </svg>
                    </motion.div>
                  </div>
                </div>
                <div className="p-6 pt-4">
                  <p className="text-gray-600 text-center">Phidim, Panchthar, Nepal</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <motion.section {...fadeInUp} className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <span className="inline-block text-sm font-semibold text-yellow-600 bg-yellow-50 px-4 py-1.5 rounded-full mb-4">Testimonials</span>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500">Clients Say</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Don&apos;t just take our word for it — hear from some of our satisfied clients.</p>
          </motion.div>

          <motion.div {...staggerContainer} className="grid md:grid-cols-3 gap-8">
            {[
              { initials: "RK", color: "bg-blue-100 text-blue-600", name: "Raj Khadka", stars: 5, text: "The team was incredibly responsive and delivered exactly what we needed. Communication was clear throughout the entire process." },
              { initials: "RS", color: "bg-green-100 text-green-600", name: "Ram", stars: 5, text: "Professional service with attention to detail. They understood our requirements perfectly and delivered on time." },
              { initials: "AN", color: "bg-purple-100 text-purple-600", name: "Anjali", stars: 5, text: "Outstanding support and quality of work. Will definitely work with them again on future projects." },
            ].map((t, i) => (
              <motion.div
                key={i}
                variants={staggerItem}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className={`w-10 h-10 ${t.color} rounded-full flex items-center justify-center font-semibold mr-3`}>
                    {t.initials}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{t.name}</h4>
                    <div className="flex text-yellow-400 text-sm">{'★'.repeat(t.stars)}</div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{t.text}</p>
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to start your project?</h3>
              <p className="text-blue-100/80 max-w-2xl mx-auto mb-8 text-lg">
                Let&apos;s work together to bring your ideas to life. Get in touch today and let&apos;s discuss how we can help you achieve your goals.
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:shadow-xl hover:shadow-white/20 transition-all duration-300 hover:scale-105"
              >
                Get Started Now
              </Link>
            </motion.div>
          </div>
        </motion.section>
      )}
    </div>
  );
}
