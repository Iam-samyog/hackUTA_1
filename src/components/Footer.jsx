import React from 'react'
import { Link } from 'react-router-dom'
const Footer = () => {
  return (
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
                                <span className="text-xl font-poppins font-bold">GIST</span>
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
                                <li><Link to='About'><a  className="hover:text-white transition-colors">About</a></Link></li>
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
  )
}

export default Footer