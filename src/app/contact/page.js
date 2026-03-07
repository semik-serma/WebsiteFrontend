"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function Contact() {
  const [isloggedin,setIsLoggedIn]=useState('')
  useEffect(()=>{
    const user=localStorage.getItem('user')
    const token=localStorage.getItem('token')
    if(!user||!token){
      setIsLoggedIn(false)
    }
    else{
      setIsLoggedIn(true)
    }
  })
  const [name,setname]=useState('')
  const [sub,setssub]=useState('')
  const [message,setmessage]=useState('')
  const usersname=(event)=>{
    console.log(event.target.value)
    setname(event.target.value)
  }
  const userssub=(event)=>{
    console.log(event.target.value)
    setssub(event.target.value)
  }
  const usersmessage=(event)=>{
    console.log(event.target.value)
    setmessage(event.target.value)
  }
  const handlecontact=async()=>{
    try {
      const data={name,sub,message}
      console.log('this is data',data)
      const process=await axios.post(api.Contact.contact,data)
      console.log(process)
    toast.success('successfully send message we promise that we will reply untill 24 hours')
    
    } catch (error) {
      toast.error('error at handle contact')
    }
    
  }



    // Reset form
 

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Get in touch with us. We'd love to hear from you!
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <span className="text-sm text-blue-200">Response time:</span>
                <span className="ml-2 font-semibold">Within 24 hours</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <span className="text-sm text-blue-200">Support hours:</span>
                <span className="ml-2 font-semibold">Mon-Fri, 9AM-6PM</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">

            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
              <form  className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                    onChange={usersname}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                    placeholder=" Type Your name" 
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={sub}
                    onChange={userssub}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                    placeholder=" Type Your subject"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={message}
                    onChange={usersmessage}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition resize-none"
                    placeholder="Tell us more about your project or question..."
                  />
                </div>



                <button
                  type="submit"
                  onClick={handlecontact}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Email</h3>
                      <p className="text-gray-600">semikserma@gmail.com</p>
                      <p className="text-sm text-gray-500 mt-1">We respond within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Business Hours</h3>
                      <p className="text-gray-600">Monday - Friday: 9AM - 6PM</p>
                      <p className="text-gray-600">Saturday - Sunday: Closed</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Location</h3>
                      <p className="text-gray-600">Phidim, Nepal</p>
                    </div>
                  </div>


                </div>
              </div>

              {/* FAQ Section */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>

                <div className="space-y-4">
                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="font-semibold text-gray-900">How quickly do you respond to inquiries?</h3>
                    <p className="text-gray-600 mt-1">We typically respond to all inquiries within 24 hours during business days. For urgent matters, please mention it in your message.</p>
                  </div>
                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="font-semibold text-gray-900">What information should I include in my message?</h3>
                    <p className="text-gray-600 mt-1">Please include details about your project, timeline, budget, and any specific requirements. The more information you provide, the better we can assist you.</p>
                  </div>
                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="font-semibold text-gray-900">Do you offer phone consultations?</h3>
                    <p className="text-gray-600 mt-1">Yes, we offer phone consultations for complex projects. Please mention this in your initial message, and we{'\'ll'} schedule a call at your convenience.</p>
                  </div>
                </div>
              </div>

              {/* Map Section */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <h3 className="text-xl font-bold text-gray-900 p-6 pb-4">Find Us Here</h3>
                <div className="relative h-64 w-full">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3432.3432!2d87.717848!3d27.611058!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb5c09270e40a1%3A0x79586f1139c4207a!2sPhidim%2C%20Nepal!5e0!3m2!1sen!2s!4v1703894400000!5m2!1sen!2s"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Location Map"
                  ></iframe>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="relative">
                      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-6 h-2 bg-black/20 rounded-full blur-sm"></div>

                      <div className="relative z-10 w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center shadow-2xl border-2 border-white animate-bounce">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 14 7 14s7-8.75 7-14c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>

                        <div className="absolute top-1/2 left-1/2 w-16 h-16 -mt-8 -ml-8 rounded-full border-2 border-red-500/50 animate-ping"></div>
                        <div className="absolute top-1/2 left-1/2 w-20 h-20 -mt-10 -ml-10 rounded-full border border-red-500/30 animate-ping"></div>
                      </div>

                      <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[12px] border-t-red-600"></div>
                    </div>
                  </div>
                </div>
                <div className="p-6 pt-4">
                  <p className="text-gray-600 text-center">Phidim, Panchthar, Nepal</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
    
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Don{'\'t'} just take our word for it - hear from some of our satisfied clients.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold mr-3">
                  JS
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">raj khadka</h4>
                  <div className="flex text-yellow-400">
                    {'★'.repeat(5)}
                  </div>
                </div>
              </div>
              <p className="text-gray-600">{'"The team was incredibly responsive and delivered exactly what we needed. Communication was clear throughout the entire process."'}</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-semibold mr-3">
                  MS
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Ram </h4>
                  <div className="flex text-yellow-400">
                    {'★'.repeat(5)}
                  </div>
                </div>
              </div>
              <p className="text-gray-600">{'"Professional service with attention to detail. They understood our requirements perfectly and delivered on time."'}</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-semibold mr-3">
                  RT
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Anjali</h4>
                  <div className="flex text-yellow-400">
                    {'★'.repeat(5)}
                  </div>
                </div>
              </div>
              <p className="text-gray-600">{'"Outstanding support and quality of work. Will definitely work with them again on future projects."'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      {isloggedin?(
        <></>
      ):(<section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to start your project?</h3>
            <p className="text-blue-100 max-w-2xl mx-auto mb-8">
              Let{'\'s'} work together to bring your ideas to life. Get in touch today and let{'\'s'} discuss how we can help you achieve your goals.
            </p>
            <Link
              href="/register"
              className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition duration-200 shadow-lg"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </section>)
      
      }
    </div>
  );
}