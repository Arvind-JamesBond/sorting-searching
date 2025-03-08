import React from 'react';
import { Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} AlgoViz. All rights reserved by Arvind.
            </p>
          </div>
          <div className="flex space-x-6">
              
            <a href="https://www.linkedin.com/in/arvind-kumar-379b3a309/" className="text-gray-400 hover:text-purple-500 transition-colors duration-300">
              <Linkedin className="h-5 w-5" />
            </a>
          </div> 
        </div>
      </div>
    </footer>
  );
};

export default Footer;
