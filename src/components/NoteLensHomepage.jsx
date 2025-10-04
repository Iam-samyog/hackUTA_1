import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileAlt } from "@fortawesome/free-solid-svg-icons";

const NoteLensHomepage = () => {


    const [isVisible, setIsVisible] = useState({
        hero: false,
        features: false,
        steps: false,
        cta: false
    });

    const featuresRef = useRef(null);
    const stepsRef = useRef(null);
    const ctaRef = useRef(null);

    useEffect(() => {
        // Trigger hero animations on mount
        setIsVisible(prev => ({ ...prev, hero: true }));

        // Intersection Observer for scroll-triggered animations
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (entry.target === featuresRef.current) {
                        setIsVisible(prev => ({ ...prev, features: true }));
                    } else if (entry.target === stepsRef.current) {
                        setIsVisible(prev => ({ ...prev, steps: true }));
                    } else if (entry.target === ctaRef.current) {
                        setIsVisible(prev => ({ ...prev, cta: true }));
                    }
                }
            });
        }, observerOptions);

        if (featuresRef.current) observer.observe(featuresRef.current);
        if (stepsRef.current) observer.observe(stepsRef.current);
        if (ctaRef.current) observer.observe(ctaRef.current);

        return () => {
            observer.disconnect();
        };
    }, []);

  // Typed effect state for hero headline
  const [typedText, setTypedText] = useState("");
  const fullText = "Handwritten Brilliance";
  useEffect(() => {
    if (isVisible.hero) {
      let i = 0;
      const interval = setInterval(() => {
        setTypedText(fullText.slice(0, i + 1));
        i++;
        if (i === fullText.length) clearInterval(interval);
      }, 70);
      return () => clearInterval(interval);
    } else {
      setTypedText("");
    }
  }, [isVisible.hero]);
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap');
        
        * {
          font-family: 'Inter', sans-serif;
        }
        
        .font-poppins {
          font-family: 'Poppins', sans-serif;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(-10px);
          }
          50% {
            transform: translateY(10px);
          }
        }
        
        @keyframes rotateIn {
          from {
            opacity: 0;
            transform: rotate(-180deg) scale(0);
          }
          to {
            opacity: 1;
            transform: rotate(0) scale(1);
          }
        }
        
        .animate-hero-title {
          animation: fadeInUp 1s ease-out forwards;
        }
        
        .animate-hero-subtitle {
          animation: fadeInUp 0.9s ease-out 0.3s forwards;
          opacity: 0;
        }
        
        .animate-hero-cta {
          animation: scaleIn 0.8s ease-out 0.5s forwards;
          opacity: 0;
        }
        
        .animate-hero-visual {
          animation: fadeInUp 1s ease-out 0.6s forwards, float 3s ease-in-out 1.6s infinite;
          opacity: 0;
        }
        
        .animate-feature {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .animate-feature-icon {
          animation: rotateIn 1s ease-out forwards;
        }
        
        .animate-step-left {
          animation: fadeInLeft 1s ease-out forwards;
          opacity: 0;
        }
        
        .animate-step-right {
          animation: fadeInRight 1s ease-out forwards;
          opacity: 0;
        }
        
        .animate-cta {
          animation: scaleIn 1s ease-out forwards;
          opacity: 0;
        }
        
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-600 { animation-delay: 0.6s; }
      `}</style>

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 py-2 ">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </div>
                        <span className="text-xl font-poppins font-bold text-blue-900">NoteLens</span>
                    </div>
                    <div className="hidden md:flex items-center space-x-8">
                        <a href="#features" className="text-gray-600 hover:text-blue-600 hover:border-b-3  transition-colors font-semibold">Features</a>
                        <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors font-semibold hover:border-b-3">How it Works</a>
                        <button className="px-6 py-2 bg-blue-600 font-bold text-white rounded-lg hover:bg-blue-700 transition-all hover:scale-105 hover:border-b-3">
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden mt-5 md:mt-10">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-4xl mx-auto">
                        <h1 className={`text-5xl md:text-7xl font-poppins font-bold text-blue-900 leading-[1] mb-6 ${isVisible.hero ? 'animate-hero-title' : 'opacity-0'}`}>
              Transform Your Notes Into
              <span className="block text-transparent font-bold bg-clip-text bg-gradient-to-r from-blue-500 to-blue-700">
                {typedText}
                <span className="inline-block w-2 h-8 align-middle bg-blue-700 animate-pulse ml-1" style={{opacity: typedText.length < fullText.length ? 1 : 0}}></span>
              </span>
                        </h1>
                        <p className={`text-lg md:text-xl text-gray-600 mb-10 leading-tight ${isVisible.hero ? 'animate-hero-subtitle' : 'opacity-0'}`}>
                            AI-powered note conversion and summarization designed for students and researchers who demand clarity, organization, and effortless collaboration.
                        </p>

                        <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 ${isVisible.hero ? 'animate-hero-cta' : 'opacity-0'}`}>
                            <button className="px-8 py-4 bg-blue-600 text-white rounded-xl font-poppins font-semibold text-lg hover:bg-blue-700 transition-all hover:scale-105 hover:shadow-2xl">
                                Start Creating Notes
                            </button>
                            <button className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-xl font-poppins font-semibold text-lg hover:bg-blue-50 transition-all hover:scale-105">
                                Watch Demo
                            </button>
                        </div>
                    </div>

                    {/* Hero Visual */}
                    <div className={`mt-16 relative ${isVisible.hero ? 'animate-hero-visual' : 'opacity-0'}`}>
                        <div className="max-w-4xl mx-auto">
                            <div className="relative bg-gradient-to-br from-blue-50 to-white rounded-3xl shadow-2xl border border-blue-100 overflow-hidden p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
                                        <div className="flex items-center mb-4">
                                            <div className="w-3 h-3 rounded-full bg-red-400 mr-2"></div>
                                            <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
                                            <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="h-3 bg-blue-100 rounded w-3/4"></div>
                                            <div className="h-3 bg-blue-100 rounded w-full"></div>
                                            <div className="h-3 bg-blue-100 rounded w-5/6"></div>
                                            <div className="h-3 bg-blue-50 rounded w-2/3"></div>
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100 transform rotate-2">
                                        <div className="space-y-2">
                                            <div className="h-4 bg-gradient-to-r from-blue-600 to-blue-400 rounded w-2/3"></div>
                                            <div className="h-2 bg-blue-100 rounded w-full"></div>
                                            <div className="h-2 bg-blue-100 rounded w-5/6"></div>
                                            <div className="h-2 bg-blue-50 rounded w-3/4"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-20 left-15 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
           
            </section>

           <section
  id="features"
  ref={featuresRef}
  className="py-24 px-6 bg-gradient-to-b from-white to-blue-50"
>
  <div className="max-w-7xl mx-auto">
    <div className="text-center mb-16">
      <h2 className="text-4xl md:text-5xl font-poppins font-bold text-blue-900 mb-4">
        Powerful Features for Modern Note-Taking
      </h2>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Everything you need to capture, transform, and share your ideas with precision and style.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Feature 1 */}
      <div
        className={`bg-white rounded-2xl p-8 shadow-lg border border-blue-100 cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
          isVisible.features ? 'animate-feature' : 'opacity-0'
        }`}
      >
        <div
          className={`w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500`}
        >
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-poppins font-semibold text-blue-900 mb-4">
          AI Handwriting
        </h3>
        <p className="text-gray-600 leading-relaxed">
          Transform typed notes into authentic handwritten format with advanced AI that preserves your personal style and readability.
        </p>
      </div>

      {/* Feature 2 */}
      <div
        className={`bg-white rounded-2xl p-8 shadow-lg border border-blue-100 cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
          isVisible.features ? 'animate-feature delay-200' : 'opacity-0'
        }`}
      >
        <div
          className={`w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500`}
        >
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-poppins font-semibold text-blue-900 mb-4">
          Smart Summaries
        </h3>
        <p className="text-gray-600 leading-relaxed">
          Get instant AI-powered summaries that distill complex information into clear, actionable insights for faster comprehension.
        </p>
      </div>

      {/* Feature 3 */}
      <div
        className={`bg-white rounded-2xl p-8 shadow-lg border border-blue-100 cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
          isVisible.features ? 'animate-feature delay-400' : 'opacity-0'
        }`}
      >
        <div
          className={`w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500`}
        >
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-poppins font-semibold text-blue-900 mb-4">
          Easy Sharing
        </h3>
        <p className="text-gray-600 leading-relaxed">
          Collaborate effortlessly with peers and colleagues through secure, one-click sharing that keeps everyone in sync.
        </p>
      </div>
    </div>
  </div>
</section>

            {/* How It Works Section */}
            <section id="how-it-works" ref={stepsRef} className="py-24 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-poppins font-bold text-blue-900 mb-4">
                            Three Simple Steps to Better Notes
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            From capture to collaboration in seconds. NoteLens streamlines your workflow so you can focus on what matters.
                        </p>
                    </div>

                    <div className="space-y-12">
                        {/* Step 1 */}
                        <div className={`flex flex-col md:flex-row items-center gap-8 ${isVisible.steps ? 'animate-step-left' : 'opacity-0'}`}>
                            <div className="flex-1 md:text-right">
                                <div className="inline-block w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-poppins font-bold text-2xl mb-4">
                                    1
                                </div>
                                <h3 className="text-3xl font-poppins font-semibold text-blue-900 mb-4">Input Your Notes</h3>
                                <p className="text-gray-600 leading-relaxed text-lg">
                                    Type or paste your lecture notes, research findings, or meeting minutes directly into NoteLens. Our intuitive editor makes capturing information effortless.
                                </p>
                            </div>
                            <div className="flex-shrink-0">
                                <div className="w-64 h-64 bg-gradient-to-br from-blue-100 to-blue-50 rounded-3xl shadow-xl flex items-center justify-center border border-blue-200">
                                    <svg className="w-32 h-32 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className={`flex flex-col md:flex-row-reverse items-center gap-8 ${isVisible.steps ? 'animate-step-right delay-200' : 'opacity-0'}`}>
                            <div className="flex-1 md:text-left">
                                <div className="inline-block w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-poppins font-bold text-2xl mb-4">
                                    2
                                </div>
                                <h3 className="text-3xl font-poppins font-semibold text-blue-900 mb-4">AI Transforms</h3>
                                <p className="text-gray-600 leading-relaxed text-lg">
                                    Watch as our AI instantly converts your notes into beautiful handwritten format and generates concise summaries that highlight key points.
                                </p>
                            </div>
                            <div className="flex-shrink-0">
                                <div className="w-64 h-64 bg-gradient-to-br from-blue-100 to-blue-50 rounded-3xl shadow-xl flex items-center justify-center border border-blue-200">
                                    <svg className="w-32 h-32 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className={`flex flex-col md:flex-row items-center gap-8 ${isVisible.steps ? 'animate-step-left delay-400' : 'opacity-0'}`}>
                            <div className="flex-1 md:text-right">
                                <div className="inline-block w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-poppins font-bold text-2xl mb-4">
                                    3
                                </div>
                                <h3 className="text-3xl font-poppins font-semibold text-blue-900 mb-4">Share & Collaborate</h3>
                                <p className="text-gray-600 leading-relaxed text-lg">
                                    Share your processed notes with classmates, research partners, or study groups with a single click. Keep everyone aligned and informed.
                                </p>
                            </div>
                            <div className="flex-shrink-0">
                                <div className="w-64 h-64 bg-gradient-to-br from-blue-100 to-blue-50 rounded-3xl shadow-xl flex items-center justify-center border border-blue-200">
                                    <svg className="w-32 h-32 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section ref={ctaRef} className="py-24 px-6 bg-gradient-to-br from-blue-600 to-blue-700 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
                </div>

                <div className={`max-w-4xl mx-auto text-center relative z-10 ${isVisible.cta ? 'animate-cta' : 'opacity-0'}`}>
                    <h2 className="text-4xl md:text-6xl font-poppins font-bold text-white mb-6">
                        Ready to Revolutionize Your Note-Taking?
                    </h2>
                    <p className="text-xl text-blue-100 mb-10 leading-relaxed">
                        Join thousands of students and researchers who are already experiencing the future of notes.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button className="px-10 py-5 bg-white text-blue-600 rounded-xl font-poppins font-semibold text-lg hover:bg-blue-50 transition-all hover:scale-105 hover:shadow-2xl">
                            Get Started Free
                        </button>
                        <button className="px-10 py-5 border-2 border-white text-white rounded-xl font-poppins font-semibold text-lg hover:bg-white/10 transition-all hover:scale-105">
                            Schedule a Demo
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 bg-blue-900 text-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </div>
                                <span className="text-xl font-poppins font-bold">NoteLens</span>
                            </div>
                            <p className="text-blue-200">Transforming notes into handwritten brilliance.</p>
                        </div>
                        <div>
                            <h4 className="font-poppins font-semibold mb-4">Product</h4>
                            <ul className="space-y-2 text-blue-200">
                                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-poppins font-semibold mb-4">Company</h4>
                            <ul className="space-y-2 text-blue-200">
                                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-poppins font-semibold mb-4">Legal</h4>
                            <ul className="space-y-2 text-blue-200">
                                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-blue-800 pt-8 text-center text-blue-200">
                        <p>&copy; 2025 NoteLens. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default NoteLensHomepage;