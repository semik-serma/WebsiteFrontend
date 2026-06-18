export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-900 p-5">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header Section */}
        <header className="bg-gradient-to-br from-purple-600 to-purple-900 text-white p-16 text-center">
          <div className="w-32 h-32 bg-white rounded-full mx-auto mb-5 flex items-center justify-center text-6xl text-purple-600 font-bold">
            S
          </div>
          <h1 className="text-5xl font-bold mb-3">Semik</h1>
          <p className="text-xl mb-5 opacity-90">Student Developer | Class 7 | Mechi English School</p>
          <div className="flex justify-center gap-8 flex-wrap">
            <a href="mailto:semikserma@gmail.com" className="hover:opacity-70 transition">
              📧 semikserma@gmail.com
            </a>
            <a href="https://github.com/semik" target="_blank" className="hover:opacity-70 transition">
              💻 GitHub
            </a>
          </div>
        </header>

        {/* Content Section */}
        <main className="p-10">
          {/* About Me */}
          <section className="mb-10">
            <h2 className="text-3xl font-bold text-purple-600 mb-5 pb-3 border-b-4 border-purple-600">
              About Me
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Hi! I'm Semik, a 7th grade student at Mechi English School with a passion for programming and web development. 
              Despite my young age, I've already learned multiple programming languages and frameworks including Django, Python, 
              JavaScript, HTML, CSS, and Tailwind CSS. I love building projects and learning new technologies every day!
            </p>
          </section>

          {/* Education */}
          <section className="mb-10">
            <h2 className="text-3xl font-bold text-purple-600 mb-5 pb-3 border-b-4 border-purple-600">
              Education
            </h2>
            <div className="border-l-4 border-purple-700 pl-5">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Class 7 Student</h3>
              <p className="text-gray-600 italic mb-3">Mechi English School | Present</p>
              <p className="text-gray-700">Balancing academics while pursuing my passion for programming and web development</p>
            </div>
          </section>

          {/* Skills */}
          <section className="mb-10">
            <h2 className="text-3xl font-bold text-purple-600 mb-5 pb-3 border-b-4 border-purple-600">
              Skills
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {['Python', 'Django', 'JavaScript', 'HTML', 'CSS', 'Tailwind CSS'].map((skill) => (
                <div
                  key={skill}
                  className="bg-gradient-to-br from-purple-600 to-purple-900 text-white p-4 rounded-xl text-center font-semibold hover:-translate-y-1 transition"
                >
                  {skill}
                </div>
              ))}
            </div>
          </section>

          {/* Projects */}
          <section className="mb-10">
            <h2 className="text-3xl font-bold text-purple-600 mb-5 pb-3 border-b-4 border-purple-600">
              Featured Projects
            </h2>
            <div className="grid md:grid-cols-2 gap-5">
              <article className="border-2 border-purple-600 rounded-xl p-5 hover:-translate-y-1 hover:shadow-lg transition">
                <h3 className="text-xl font-bold text-purple-600 mb-3">Portfolio Website</h3>
                <p className="text-gray-700 mb-3">
                  Personal portfolio website built with Next.js and Tailwind CSS to showcase my skills and projects.
                </p>
                <p className="text-gray-600">
                  <strong>Tech:</strong> Next.js, Tailwind CSS
                </p>
              </article>
              
              <article className="border-2 border-purple-600 rounded-xl p-5 hover:-translate-y-1 hover:shadow-lg transition">
                <h3 className="text-xl font-bold text-purple-600 mb-3">Django Blog</h3>
                <p className="text-gray-700 mb-3">
                  A blogging platform with user authentication, post creation, and comment functionality.
                </p>
                <p className="text-gray-600">
                  <strong>Tech:</strong> Django, Python, HTML, CSS
                </p>
              </article>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}