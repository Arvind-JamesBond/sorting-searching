import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, Settings } from "lucide-react";

interface ArrayBarProps {
  value: number;
  index: number;
  isTarget: boolean;
  isComparing: boolean;
  isFound: boolean;
}

const ArrayBar: React.FC<ArrayBarProps> = ({
  value,
  index,
  isTarget,
  isComparing,
  isFound,
}) => {
  let bgColor = "bg-blue-500";

  if (isTarget) {
    bgColor = "bg-yellow-500";
  } else if (isComparing) {
    bgColor = "bg-purple-500";
  } else if (isFound) {
    bgColor = "bg-green-500";
  }

  return (
    <motion.div
      className="flex flex-col items-center mx-0.5 sm:mx-1"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <div
        className={`${bgColor} rounded-t-md w-5 sm:w-8 md:w-10 transition-all duration-300`}
        style={{ height: `${value * 2 + 20}px` }}
      ></div>
      <div className="text-xs mt-1 hidden sm:block">{value}</div>
      <div className="text-[8px] mt-0.5 sm:hidden">{value}</div>
    </motion.div>
  );
};

const SearchAlgorithms: React.FC = () => {
  const [array, setArray] = useState<number[]>([]);
  const [target, setTarget] = useState<number>(0);
  const [currentAlgo, setCurrentAlgo] = useState<string>("linear");
  const [speed, setSpeed] = useState<number>(500);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [comparingIndices, setComparingIndices] = useState<number[]>([]);
  const [foundIndex, setFoundIndex] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [steps, setSteps] = useState<any[]>([]);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    generateRandomArray();
  }, []);

  const generateRandomArray = () => {
    // Adjust array size based on screen width
    const width = window.innerWidth;
    let size = 15;

    if (width < 640) {
      // Small screens
      size = 10;
    } else if (width < 768) {
      // Medium screens
      size = 12;
    }

    const newArray = Array.from(
      { length: size },
      () => Math.floor(Math.random() * 50) + 1
    ).sort((a, b) => a - b);
    setArray(newArray);
    setTarget(newArray[Math.floor(Math.random() * size)]);
    resetSearch();
  };

  // Listen for window resize events
  useEffect(() => {
    const handleResize = () => {
      generateRandomArray();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const resetSearch = () => {
    setIsRunning(false);
    setComparingIndices([]);
    setFoundIndex(null);
    setCurrentStep(0);
    setSteps([]);
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const startSearch = () => {
    resetSearch();

    let searchSteps: any[] = [];

    if (currentAlgo === "linear") {
      searchSteps = linearSearchSteps(array, target);
    } else if (currentAlgo === "binary") {
      searchSteps = binarySearchSteps(array, target);
    } else if (currentAlgo === "exponential") {
      searchSteps = exponentialSearchSteps(array, target);
    }

    setSteps(searchSteps);
    setIsRunning(true);
  };

  const linearSearchSteps = (arr: number[], target: number) => {
    const steps = [];

    for (let i = 0; i < arr.length; i++) {
      steps.push({
        comparing: [i],
        found: arr[i] === target ? i : null,
        message: `Checking if ${arr[i]} equals ${target}...`,
      });

      if (arr[i] === target) {
        break;
      }
    }

    return steps;
  };

  const binarySearchSteps = (arr: number[], target: number) => {
    const steps = [];
    let left = 0;
    let right = arr.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);

      steps.push({
        comparing: [mid],
        found: arr[mid] === target ? mid : null,
        message: `Checking middle element at index ${mid}: ${arr[mid]}`,
      });

      if (arr[mid] === target) {
        break;
      } else if (arr[mid] < target) {
        left = mid + 1;
        steps.push({
          comparing: [],
          found: null,
          message: `${arr[mid]} < ${target}, so search in right half (${left} to ${right})`,
        });
      } else {
        right = mid - 1;
        steps.push({
          comparing: [],
          found: null,
          message: `${arr[mid]} > ${target}, so search in left half (${left} to ${right})`,
        });
      }
    }

    if (steps[steps.length - 1].found === null) {
      steps.push({
        comparing: [],
        found: null,
        message: `${target} not found in the array`,
      });
    }

    return steps;
  };

  const exponentialSearchSteps = (arr: number[], target: number) => {
    const steps = [];

    if (arr[0] === target) {
      steps.push({
        comparing: [0],
        found: 0,
        message: `First element ${arr[0]} equals ${target}`,
      });
      return steps;
    }

    let i = 1;
    while (i < arr.length && arr[i] <= target) {
      steps.push({
        comparing: [i],
        found: arr[i] === target ? i : null,
        message: `Checking bound at index ${i}: ${arr[i]}`,
      });

      if (arr[i] === target) {
        break;
      }

      i = i * 2;
    }

    if (arr[i] !== target && i < arr.length) {
      const left = i / 2;
      const right = Math.min(i, arr.length - 1);

      steps.push({
        comparing: [],
        found: null,
        message: `Performing binary search between indices ${left} and ${right}`,
      });

      // Binary search between i/2 and min(i, arr.length-1)
      const binarySteps = binarySearchSteps(
        arr.slice(i / 2, Math.min(i, arr.length)),
        target
      ).map((step) => ({
        ...step,
        comparing: step.comparing.map((idx) => idx + i / 2),
        found: step.found !== null ? step.found + i / 2 : null,
      }));

      steps.push(...binarySteps);
    }

    return steps;
  };

  useEffect(() => {
    if (isRunning && currentStep < steps.length) {
      const timer = setTimeout(() => {
        const step = steps[currentStep];
        setComparingIndices(step.comparing);
        setFoundIndex(step.found);
        setCurrentStep(currentStep + 1);
      }, speed);

      return () => clearTimeout(timer);
    } else if (isRunning && currentStep >= steps.length) {
      setIsRunning(false);
    }
  }, [isRunning, currentStep, steps, speed]);

  const toggleRunning = () => {
    if (steps.length === 0) {
      startSearch();
    } else {
      setIsRunning(!isRunning);
    }
  };

  const getAlgorithmDescription = () => {
    switch (currentAlgo) {
      case "linear":
        return {
          title: "Linear Search",
          description:
            "Sequentially checks each element of the list until a match is found or the whole list has been searched.",
          timeComplexity: "O(n)",
          spaceComplexity: "O(1)",
          bestCase: "O(1)",
          worstCase: "O(n)",
        };
      case "binary":
        return {
          title: "Binary Search",
          description:
            "Finds the position of a target value within a sorted array by repeatedly dividing the search interval in half.",
          timeComplexity: "O(log n)",
          spaceComplexity: "O(1)",
          bestCase: "O(1)",
          worstCase: "O(log n)",
        };
      case "exponential":
        return {
          title: "Exponential Search",
          description:
            "Finds a range where the target might be and then uses binary search within that range.",
          timeComplexity: "O(log n)",
          spaceComplexity: "O(1)",
          bestCase: "O(1)",
          worstCase: "O(log n)",
        };
      default:
        return {
          title: "",
          description: "",
          timeComplexity: "",
          spaceComplexity: "",
          bestCase: "",
          worstCase: "",
        };
    }
  };

  const algoInfo = getAlgorithmDescription();

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-6 md:py-12">
      <motion.div
        className="text-center mb-4 md:mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 md:mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          Search Algorithm Visualizer
        </h1>
        <p className="text-sm md:text-base text-gray-300 max-w-3xl mx-auto">
          Visualize how different search algorithms work to find elements in a
          sorted array.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8 mb-4 md:mb-8">
        <motion.div
          className="lg:col-span-2 bg-gray-800 rounded-xl p-3 sm:p-4 md:p-6 border border-gray-700"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex flex-col h-full">
            <div className="flex flex-wrap justify-between items-center mb-4 md:mb-6 gap-2">
              <div className="flex flex-wrap gap-2 sm:space-x-4">
                <button
                  onClick={toggleRunning}
                  className="flex items-center bg-purple-600 hover:bg-purple-700 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg transition-colors duration-300 text-sm sm:text-base"
                >
                  {isRunning ? (
                    <Pause className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  ) : (
                    <Play className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  )}
                  {isRunning ? "Pause" : "Start"}
                </button>
                <button
                  onClick={resetSearch}
                  className="flex items-center bg-gray-600 hover:bg-gray-700 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg transition-colors duration-300 text-sm sm:text-base"
                >
                  <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Reset
                </button>
              </div>
              <button
                onClick={toggleSettings}
                className="flex items-center bg-gray-700 hover:bg-gray-600 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg transition-colors duration-300 text-sm sm:text-base"
              >
                <Settings className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Settings
              </button>
            </div>

            {showSettings && (
              <motion.div
                className="bg-gray-700 rounded-lg p-3 sm:p-4 mb-4 md:mb-6"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                      Algorithm
                    </label>
                    <select
                      value={currentAlgo}
                      onChange={(e) => {
                        setCurrentAlgo(e.target.value);
                        resetSearch();
                      }}
                      className="w-full bg-gray-800 border border-gray-600 rounded-md py-1 sm:py-2 px-2 sm:px-3 text-xs sm:text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="linear">Linear Search</option>
                      <option value="binary">Binary Search</option>
                      <option value="exponential">Exponential Search</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                      Speed (ms)
                    </label>
                    <input
                      type="range"
                      min="100"
                      max="1000"
                      step="100"
                      value={speed}
                      onChange={(e) => setSpeed(parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-[10px] sm:text-xs text-gray-400">
                      <span>Fast</span>
                      <span>Slow</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                      Target Value
                    </label>
                    <select
                      value={target}
                      onChange={(e) => {
                        setTarget(parseInt(e.target.value));
                        resetSearch();
                      }}
                      className="w-full bg-gray-800 border border-gray-600 rounded-md py-1 sm:py-2 px-2 sm:px-3 text-xs sm:text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {array.map((value, index) => (
                        <option key={index} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                      Generate New Array
                    </label>
                    <button
                      onClick={generateRandomArray}
                      className="w-full bg-gray-600 hover:bg-gray-500 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg transition-colors duration-300 text-xs sm:text-sm"
                    >
                      Generate
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="flex-grow flex flex-col">
              <div className="mb-3 sm:mb-6">
                <h3 className="text-sm sm:text-lg font-medium text-gray-200 mb-1 sm:mb-2">
                  Current Status:
                </h3>
                <div className="bg-gray-700 rounded-lg p-2 sm:p-4 text-xs sm:text-sm md:text-base text-gray-300">
                  {currentStep > 0 && currentStep <= steps.length ? (
                    <p>{steps[currentStep - 1].message}</p>
                  ) : (
                    <p>Click "Start" to begin the visualization</p>
                  )}
                </div>
              </div>

              <div className="flex-grow flex items-end justify-center p-2 sm:p-4 bg-gray-900 rounded-lg">
                <div className="flex items-end h-40 sm:h-64">
                  {array.map((value, index) => (
                    <ArrayBar
                      key={index}
                      value={value}
                      index={index}
                      isTarget={value === target}
                      isComparing={comparingIndices.includes(index)}
                      isFound={foundIndex === index}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-gray-800 rounded-xl p-3 sm:p-4 md:p-6 border border-gray-700"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4 text-purple-400">
            {algoInfo.title}
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-gray-300 mb-3 sm:mb-6">
            {algoInfo.description}
          </p>

          <div className="space-y-2 sm:space-y-4">
            <div className="bg-gray-700 rounded-lg p-2 sm:p-4">
              <h3 className="text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                Time Complexity
              </h3>
              <p className="text-sm sm:text-lg font-bold text-purple-400">
                {algoInfo.timeComplexity}
              </p>
            </div>

            <div className="bg-gray-700 rounded-lg p-2 sm:p-4">
              <h3 className="text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                Space Complexity
              </h3>
              <p className="text-sm sm:text-lg font-bold text-purple-400">
                {algoInfo.spaceComplexity}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              <div className="bg-gray-700 rounded-lg p-2 sm:p-4">
                <h3 className="text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                  Best Case
                </h3>
                <p className="text-sm sm:text-lg font-bold text-green-400">
                  {algoInfo.bestCase}
                </p>
              </div>

              <div className="bg-gray-700 rounded-lg p-2 sm:p-4">
                <h3 className="text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                  Worst Case
                </h3>
                <p className="text-sm sm:text-lg font-bold text-red-400">
                  {algoInfo.worstCase}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-3 sm:mt-6 pt-3 sm:pt-6 border-t border-gray-700">
            <h3 className="text-sm sm:text-lg font-medium text-gray-200 mb-2 sm:mb-4">
              Color Legend
            </h3>
            <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded mr-2"></div>
                <span className="text-gray-300">Regular Element</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-yellow-500 rounded mr-2"></div>
                <span className="text-gray-300">Target Element</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-purple-500 rounded mr-2"></div>
                <span className="text-gray-300">Currently Comparing</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded mr-2"></div>
                <span className="text-gray-300">Element Found</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SearchAlgorithms;
