"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function About() {
  const [isloggedin,setIsLoggedIn]=useState(false)
  const getout=()=>{}
useEffect(()=>{
  const user=localStorage.getItem('user')
  const token=localStorage.getItem('token')
  if(!token||!user){
    setIsLoggedIn(false)
  }
  else{
    setIsLoggedIn(true)
  }
},[])
    

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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              About Semik
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Passionate web developer dedicated to creating exceptional digital experiences
            </p>
          </div>
        </div>
      </section>

      {/* About Me Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Who I Am
              </h2>
              <div className="space-y-4 text-lg text-gray-600">
                <p>
                  My name is <strong className="text-gray-800">Semik-serma</strong>, and I am a passionate developer with a love for creating beautiful, functional, and user-friendly web sites.
                </p>
                <p>
                  I want to be successfull in my life i have to learn at least 10 programming lamnguages and become the global person for the entire world.
                </p>
                <p>
                  I am currently doing next js and in the previous year i ahev done html,css,javascript,python and django.
                </p>
                <p>
                  When I'm not coding,i do physical execises like running,jumping,throwing and pushups. 
                </p>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative h-96 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden">
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src="/mypicture.png"
                    alt="Semik - Web Developer"
                    fill
                    className="object-cover rounded-2xl"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute bottom-6 text-center text-white z-10">
                    <p className="text-2xl font-semibold">Web devloper</p>
                    <p className="text-gray-200">Building the websites with django,next and others.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="max-w-4xl mx-auto mb-20">
          <div className="text-2xl ml-70">
      How i learned to make website 
    </div>
  <div className="bg-white rounded-2xl shadow-md p-8 md:p-10">
    
    <div className="text-gray-700 text-lg leading-relaxed space-y-5">
      <p>I am studying in class 7.</p>

      <p>
        In the morning and in the evening after the homework and in the holidays, I learn full stack website development. This website I make it.
      </p>

      <p>
        If you give me a documentation, I can also make this website for you: portfolio website, news website, e-commerce website, official website, organization website, etc.
      </p>

      <p>
        I will use MongoDB database for now. My main goal is SaaS product application and Android OS, mac OS, etc.
      </p>

      <p>I am trying to learn all of that.</p>
    </div>
  </div>
</div>


          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              My Skills
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Technologies and tools I work with to bring ideas to life
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {skills.map((skill, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-semibold text-gray-800">{skill.name}</span>
                  <span className="text-sm font-medium text-blue-600">{skill.level}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-blue-700 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Technologies Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {technologies.map((category, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4">{category.name}</h3>
                <ul className="space-y-2">
                  {category.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-gray-600 flex items-center">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Me Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Why Choose Me?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              What sets me apart as a web developer
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl shadow-md hover:shadow-xl transition duration-200">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Focus on Quality</h3>
              <p className="text-gray-600">
                I prioritize clean code, best practices, and attention to detail in every project I work on.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl shadow-md hover:shadow-xl transition duration-200">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Modern Technologies</h3>
              <p className="text-gray-600">
                I stay up-to-date with the latest web technologies and frameworks to deliver cutting-edge solutions.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl shadow-md hover:shadow-xl transition duration-200">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Creative Solutions</h3>
              <p className="text-gray-600">
                I approach each project with creativity and innovation to solve problems in unique ways.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl shadow-md hover:shadow-xl transition duration-200">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Client-Focused</h3>
              <p className="text-gray-600">
                Your success is my priority. I work closely with clients to understand their vision and deliver beyond expectations.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl shadow-md hover:shadow-xl transition duration-200">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Fast & Efficient</h3>
              <p className="text-gray-600">
                I deliver projects on time without compromising quality, ensuring you get results quickly.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl shadow-md hover:shadow-xl transition duration-200">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Responsive Design</h3>
              <p className="text-gray-600">
                Every website I build is fully responsive and works perfectly on all devices and screen sizes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {isloggedin?(
        <></>
      ):(
        <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Let's Work Together
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Have a project in mind? Let's discuss how we can bring your ideas to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition duration-200 shadow-lg"
            >
              Get In Touch
            </Link>
            <Link
              href="/register"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition duration-200"
            >
              Start a Project
            </Link>
          </div>
        </div>
      </section>
      )
      
}
    </div>
  );
}

