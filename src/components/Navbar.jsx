import React from 'react'

const Navbar = () => {
  return (
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
  )
}

export default Navbar