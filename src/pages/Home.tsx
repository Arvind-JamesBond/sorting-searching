import React from 'react';
import { Link } from 'react-router-dom';
import { Search, SortAsc, Code } from 'lucide-react';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div 
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
          Algorithm Visualizer
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Explore and understand searching and sorting algorithms through interactive visualizations.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <motion.div 
          className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 hover:border-purple-500 transition-all duration-300"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ scale: 1.03 }}
        >
          <div className="p-6">
            <div className="flex items-center mb-4">
              <Search className="h-8 w-8 text-purple-500 mr-3" />
              <h2 className="text-2xl font-bold">Search Algorithms</h2>
            </div>
            <p className="text-gray-300 mb-6">
              Visualize how different search algorithms work to find elements in data structures.
            </p>
            <ul className="mb-6 space-y-2">
              <li className="flex items-center">
                <span className="h-2 w-2 bg-purple-500 rounded-full mr-2"></span>
                <span>Linear Search</span>
              </li>
              <li className="flex items-center">
                <span className="h-2 w-2 bg-pink-500 rounded-full mr-2"></span>
                <span>Binary Search</span>
              </li>
              <li className="flex items-center">
                <span className="h-2 w-2 bg-red-500 rounded-full mr-2"></span>
                <span>Exponential Search</span>
              </li>
            </ul>
            <Link 
              to="/search" 
              className="inline-block bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300"
            >
              Explore Search Algorithms
            </Link>
          </div>
        </motion.div>

        <motion.div 
          className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 hover:border-purple-500 transition-all duration-300"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ scale: 1.03 }}
        >
          <div className="p-6">
            <div className="flex items-center mb-4">
              <SortAsc className="h-8 w-8 text-purple-500 mr-3" />
              <h2 className="text-2xl font-bold">Sorting Algorithms</h2>
            </div>
            <p className="text-gray-300 mb-6">
              See how different sorting algorithms organize data in ascending or descending order.
            </p>
            <ul className="mb-6 space-y-2">
              <li className="flex items-center">
                <span className="h-2 w-2 bg-purple-500 rounded-full mr-2"></span>
                <span>Bubble Sort</span>
              </li>
              <li className="flex items-center">
                <span className="h-2 w-2 bg-pink-500 rounded-full mr-2"></span>
                <span>Selection Sort</span>
              </li>
              <li className="flex items-center">
                <span className="h-2 w-2 bg-red-500 rounded-full mr-2"></span>
                <span>Insertion Sort</span>
              </li>
            </ul>
            <Link 
              to="/sort" 
              className="inline-block bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300"
            >
              Explore Sorting Algorithms
            </Link>
          </div>
        </motion.div>
      </div>

      <motion.div 
        className="bg-gray-800 rounded-xl p-8 border border-gray-700"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="flex items-center mb-4">
          <Code className="h-8 w-8 text-purple-500 mr-3" />
          <h2 className="text-2xl font-bold">Why Visualize Algorithms?</h2>
        </div>
        <p className="text-gray-300 mb-4">
          Algorithm visualization is a powerful educational tool that helps in understanding complex computational processes. By seeing algorithms in action, you can:
        </p>
        <ul className="list-disc pl-6 text-gray-300 space-y-2">
          <li>Understand the step-by-step execution of algorithms</li>
          <li>Compare the efficiency of different algorithms</li>
          <li>Identify patterns and behaviors in algorithmic operations</li>
          <li>Develop intuition for algorithm design and analysis</li>
        </ul>
      </motion.div>
    </div>
  );
};

export default Home;