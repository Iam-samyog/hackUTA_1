import React, { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const About = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      {/* Navbar */}
      <Navbar />

      <div className="min-h-screen relative font-inter bg-gradient-to-b from-white to-blue-50 text-gray-700">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-6 pt-32 pb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-800 font-poppins mb-12">
            About Gist
          </h1>

          {/* ===== Full Description Section ===== */}
          <div className="space-y-16 text-gray-700 leading-relaxed font-inter">
            {/* Inspiration */}
            <section>
              <h2 className="text-3xl font-semibold text-blue-700 font-poppins mb-4">
                Inspiration
              </h2>
              <p>
                The inspiration for this project came from a common frustration among
                students: the difficulty of sharing and accessing quality study
                materials. We noticed that students often struggle to find
                well-organized notes for their courses, and valuable handwritten notes
                are difficult to digitize and share. There was no centralized platform
                where students could collaborate, share, and discover educational
                content. We wanted to leverage OCR technology to bridge the gap between
                physical handwritten notes and digital accessibility. Our goal was to
                create a comprehensive note-sharing ecosystem that not only allows
                students to upload and share notes but also makes them searchable,
                discoverable, and accessible through modern AI-powered OCR technology
                with a beautiful, intuitive user interface.
              </p>
            </section>

            {/* What It Does */}
            <section>
              <h2 className="text-3xl font-semibold text-blue-700 font-poppins mb-4">
                What It Does
              </h2>
              <p className="mb-4">
                Gist is a full-stack, feature-complete note-sharing platform designed
                for students. Its core functionality includes:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>AI-Powered OCR:</strong> Users can upload images or PDFs of
                  handwritten notes, and our platform uses Google Gemini AI to convert
                  them into searchable, digital Markdown text, complete with LaTeX
                  support for mathematical equations.
                </li>
                <li>
                  <strong>Centralized Note Hub:</strong> Provides a central place to
                  upload, store, and organize materials.
                </li>
                <li>
                  <strong>Advanced Search and Discovery:</strong> Powerful filtering by
                  tags, courses, and popularity.
                </li>
                <li>
                  <strong>Smart Recommendations:</strong> Suggests relevant notes based
                  on course enrollment, social connections, and tag-based similarities.
                </li>
                <li>
                  <strong>Social Collaboration:</strong> Enables following, commenting,
                  reactions, and bookmarking to foster a learning community.
                </li>
                <li>
                  <strong>User Dashboards:</strong> Personal dashboards show uploaded
                  notes, bookmarks, and engagement stats.
                </li>
              </ul>
            </section>

            {/* How We Built It */}
            <section>
              <h2 className="text-3xl font-semibold text-blue-700 font-poppins mb-4">
                How We Built It
              </h2>
              <p>
                We built Gist as a full-stack web app with React and Flask, connected
                via a RESTful API. The backend handles authentication, file processing,
                and AI-powered OCR via Google Gemini API. Uploaded PDFs are converted to
                images, processed for text extraction, and stored in a PostgreSQL
                database.
              </p>
            </section>

            {/* Technology Stack */}
            <section>
              <h2 className="text-3xl font-semibold text-blue-700 font-poppins mb-4">
                Technology Stack
              </h2>

              <h3 className="text-xl font-semibold text-blue-600 mt-6 mb-2">Frontend</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>React 18 + React Router v6</li>
                <li>Axios for API calls</li>
                <li>Tailwind CSS for styling</li>
                <li>React Markdown + LaTeX rendering</li>
                <li>Vite for fast builds</li>
              </ul>

              <h3 className="text-xl font-semibold text-blue-600 mt-6 mb-2">Backend</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Flask + Flask-RESTX</li>
                <li>SQLAlchemy ORM</li>
                <li>PostgreSQL database</li>
                <li>JWT Authentication</li>
              </ul>

              <h3 className="text-xl font-semibold text-blue-600 mt-6 mb-2">
                AI & File Processing
              </h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Google Gemini AI for OCR</li>
                <li>PyMuPDF (fitz) for PDF to image conversion</li>
                <li>Pillow (PIL) for image processing</li>
              </ul>
            </section>

            {/* Development Process */}
            <section>
              <h2 className="text-3xl font-semibold text-blue-700 font-poppins mb-4">
                Development Process
              </h2>
              <p className="mb-4">Development was structured in 24-hour phases:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Phase 1:</strong> Frontend foundation, routing, authentication
                  UI.
                </li>
                <li>
                  <strong>Phase 2:</strong> Backend setup, database schema, JWT
                  authentication.
                </li>
                <li>
                  <strong>Phase 3:</strong> OCR integration with Google Gemini API.
                </li>
                <li>
                  <strong>Phase 4:</strong> Feature integration, dashboards, search,
                  tagging.
                </li>
                <li>
                  <strong>Phase 5:</strong> Smart recommendations, polish, mobile
                  responsiveness.
                </li>
              </ul>
            </section>

            {/* Challenges */}
            <section>
              <h2 className="text-3xl font-semibold text-blue-700 font-poppins mb-4">
                Challenges We Faced
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>OCR resource limits – solved via Google Gemini API.</li>
                <li>CORS issues – fixed with Flask configuration.</li>
                <li>
                  Slow OCR feedback – added progress bars and loading states for better
                  UX.
                </li>
                <li>
                  Complex database relationships – handled with SQLAlchemy association
                  tables.
                </li>
                <li>
                  Inconsistent AI Markdown – fixed via backend parsing and fallbacks.
                </li>
              </ul>
            </section>

            {/* Accomplishments */}
            <section>
              <h2 className="text-3xl font-semibold text-blue-700 font-poppins mb-4">
                Accomplishments We're Proud Of
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Modern and responsive UI with 15+ reusable components.</li>
                <li>Fully functional AI-powered OCR pipeline.</li>
                <li>Smart recommendation engine for personalized content.</li>
                <li>Comprehensive Flask API with Swagger documentation.</li>
                <li>
                  Seamless frontend-backend integration with real-time feedback and
                  smooth UX.
                </li>
              </ul>
            </section>

            {/* What We Learned */}
            <section>
              <h2 className="text-3xl font-semibold text-blue-700 font-poppins mb-4">
                What We Learned
              </h2>
              <p>
                We gained hands-on experience in full-stack development, including
                modern React, Flask REST APIs, database design, JWT authentication, AI
                integration, and algorithmic recommendations. We learned adaptability —
                pivoting from local OCR to cloud-based solutions taught us practical
                problem-solving under constraints.
              </p>
            </section>

            {/* What's Next */}
            <section>
              <h2 className="text-3xl font-semibold text-blue-700 font-poppins mb-4">
                What's Next for Gist
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Real-time collaborative note editing using WebSockets.</li>
                <li>AI-generated flashcards, summaries, and quizzes.</li>
                <li>Mobile apps with React Native.</li>
                <li>Integration with LMS platforms like Canvas and Blackboard.</li>
                <li>Advanced analytics dashboard for engagement insights.</li>
                <li>Versioning system for tracking note history.</li>
              </ul>
            </section>

            {/* Built With */}
            <section>
              <h2 className="text-3xl font-semibold text-blue-700 font-poppins mb-4">
                Built With
              </h2>
              <div className="flex flex-wrap gap-4 text-blue-700 font-semibold">
                <span className="border-2 border-blue-300 rounded-lg px-3 py-1">
                  Flask
                </span>
                <span className="border-2 border-blue-300 rounded-lg px-3 py-1">
                  React
                </span>
                <span className="border-2 border-blue-300 rounded-lg px-3 py-1">
                  Tailwind CSS
                </span>
                <span className="border-2 border-blue-300 rounded-lg px-3 py-1">
                  Python
                </span>
                <span className="border-2 border-blue-300 rounded-lg px-3 py-1">
                  JavaScript
                </span>
              </div>
            </section>

            {/* Try It Out */}
            <section>
              <h2 className="text-3xl font-semibold text-blue-700 font-poppins mb-4">
                Try It Out
              </h2>
              <a
                href="https://github.com/Iam-samyog/hackUTA_1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-700 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg transition-all"
              >
                GitHub Repo
              </a>
            </section>
          </div>
        </div>
      </div>
        <div className="absolute top-8 left-4 sm:top-20 sm:left-15 w-32 h-32 sm:w-72 sm:h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-8 right-4 sm:bottom-20 sm:right-10 w-32 h-32 sm:w-72 sm:h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="absolute bottom-8 left-4 sm:bottom-20 sm:left-15 w-32 h-32 sm:w-72 sm:h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-8 right-4 sm:top-20 sm:right-10 w-32 h-32 sm:w-72 sm:h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default About;
