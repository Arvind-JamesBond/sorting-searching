import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, Settings, BarChart } from "lucide-react";

interface ArrayBarProps {
  value: number;
  index: number;
  isComparing: boolean;
  isSorted: boolean;
  isSwapping: boolean;
  maxValue: number;
  totalBars: number;
}

const ArrayBar: React.FC<ArrayBarProps> = ({
  value,
  index,
  isComparing,
  isSorted,
  isSwapping,
  maxValue,
  totalBars,
}) => {
  let bgColor = "bg-blue-500";

  if (isSwapping) {
    bgColor = "bg-red-500";
  } else if (isComparing) {
    bgColor = "bg-purple-500";
  } else if (isSorted) {
    bgColor = "bg-green-500";
  }

  const height = `${(value / maxValue) * 100}%`;

  // Dynamically adjust width based on number of bars
  const getBarWidth = () => {
    if (totalBars <= 10) return "w-6 md:w-8";
    if (totalBars <= 15) return "w-4 md:w-6";
    if (totalBars <= 20) return "w-3 md:w-4";
    if (totalBars <= 25) return "w-2 md:w-3";
    return "w-1 md:w-2";
  };

  // Dynamically show/hide value text based on number of bars
  const showValue = totalBars <= 20;

  return (
    <motion.div
      className="flex flex-col items-center justify-end h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      layout
    >
      <motion.div
        className={`${bgColor} ${getBarWidth()} rounded-t-md transition-all duration-300`}
        style={{ height }}
        layout
      ></motion.div>
      {showValue && (
        <div
          className={`text-xs mt-1 ${totalBars > 15 ? "hidden sm:block" : ""}`}
        >
          {value}
        </div>
      )}
    </motion.div>
  );
};

const SortingAlgorithms: React.FC = () => {
  const [array, setArray] = useState<number[]>([]);
  const [initialArray, setInitialArray] = useState<number[]>([]);
  const [currentAlgo, setCurrentAlgo] = useState<string>("bubble");
  const [speed, setSpeed] = useState<number>(500);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [comparingIndices, setComparingIndices] = useState<number[]>([]);
  const [swappingIndices, setSwappingIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [steps, setSteps] = useState<any[]>([]);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [arraySize, setArraySize] = useState<number>(15);

  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    generateRandomArray();
  }, [arraySize]);

  const generateRandomArray = () => {
    const newArray = Array.from(
      { length: arraySize },
      () => Math.floor(Math.random() * 50) + 1
    );
    setArray(newArray);
    setInitialArray([...newArray]); // Store the initial array
    resetSort();
  };

  const resetSort = () => {
    setIsRunning(false);
    setComparingIndices([]);
    setSwappingIndices([]);
    setSortedIndices([]);
    setCurrentStep(0);
    setSteps([]);
    setArray([...initialArray]); // Reset to initial array state
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const startSort = () => {
    resetSort();

    let sortSteps: any[] = [];

    if (currentAlgo === "bubble") {
      sortSteps = bubbleSortSteps([...array]);
    } else if (currentAlgo === "selection") {
      sortSteps = selectionSortSteps([...array]);
    } else if (currentAlgo === "insertion") {
      sortSteps = insertionSortSteps([...array]);
    }

    setSteps(sortSteps);
    setIsRunning(true);
  };

  const bubbleSortSteps = (arr: number[]) => {
    const steps = [];
    const n = arr.length;
    const sortedIndices: number[] = [];

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        // Comparing step
        steps.push({
          array: [...arr],
          comparing: [j, j + 1],
          swapping: [],
          sorted: [...sortedIndices],
          message: `Comparing ${arr[j]} and ${arr[j + 1]}`,
        });

        if (arr[j] > arr[j + 1]) {
          // Swapping step
          steps.push({
            array: [...arr],
            comparing: [],
            swapping: [j, j + 1],
            sorted: [...sortedIndices],
            message: `Swapping ${arr[j]} and ${arr[j + 1]}`,
          });

          // Perform the swap
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];

          // After swap
          steps.push({
            array: [...arr],
            comparing: [],
            swapping: [],
            sorted: [...sortedIndices],
            message: `Swapped ${arr[j]} and ${arr[j + 1]}`,
          });
        }
      }

      // Mark the last element as sorted
      sortedIndices.push(n - i - 1);
      steps.push({
        array: [...arr],
        comparing: [],
        swapping: [],
        sorted: [...sortedIndices],
        message: `Element ${arr[n - i - 1]} is now in its sorted position`,
      });
    }

    return steps;
  };

  const selectionSortSteps = (arr: number[]) => {
    const steps = [];
    const n = arr.length;
    const sortedIndices: number[] = [];

    for (let i = 0; i < n - 1; i++) {
      let minIndex = i;

      // Initial step for each outer loop
      steps.push({
        array: [...arr],
        comparing: [i],
        swapping: [],
        sorted: [...sortedIndices],
        message: `Finding minimum element starting from index ${i}`,
      });

      for (let j = i + 1; j < n; j++) {
        // Comparing step
        steps.push({
          array: [...arr],
          comparing: [minIndex, j],
          swapping: [],
          sorted: [...sortedIndices],
          message: `Comparing current minimum ${arr[minIndex]} with ${arr[j]}`,
        });

        if (arr[j] < arr[minIndex]) {
          minIndex = j;
          steps.push({
            array: [...arr],
            comparing: [minIndex],
            swapping: [],
            sorted: [...sortedIndices],
            message: `New minimum found: ${arr[minIndex]} at index ${minIndex}`,
          });
        }
      }

      if (minIndex !== i) {
        // Swapping step
        steps.push({
          array: [...arr],
          comparing: [],
          swapping: [i, minIndex],
          sorted: [...sortedIndices],
          message: `Swapping ${arr[i]} and ${arr[minIndex]}`,
        });

        // Perform the swap
        [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
      }

      // Mark the element as sorted
      sortedIndices.push(i);
      steps.push({
        array: [...arr],
        comparing: [],
        swapping: [],
        sorted: [...sortedIndices],
        message: `Element ${arr[i]} is now in its sorted position`,
      });
    }

    // Mark the last element as sorted
    sortedIndices.push(n - 1);
    steps.push({
      array: [...arr],
      comparing: [],
      swapping: [],
      sorted: [...sortedIndices],
      message: `Element ${arr[n - 1]} is now in its sorted position`,
    });

    return steps;
  };

  const insertionSortSteps = (arr: number[]) => {
    const steps = [];
    const n = arr.length;
    const sortedIndices: number[] = [0]; // First element is already sorted

    steps.push({
      array: [...arr],
      comparing: [],
      swapping: [],
      sorted: [...sortedIndices],
      message: `Starting with first element ${arr[0]} already sorted`,
    });

    for (let i = 1; i < n; i++) {
      const key = arr[i];
      let j = i - 1;

      // Current element to be inserted
      steps.push({
        array: [...arr],
        comparing: [i],
        swapping: [],
        sorted: [...sortedIndices],
        message: `Current element to insert: ${key}`,
      });

      while (j >= 0 && arr[j] > key) {
        // Comparing step
        steps.push({
          array: [...arr],
          comparing: [j, j + 1],
          swapping: [],
          sorted: [...sortedIndices],
          message: `Comparing ${arr[j]} with ${key}`,
        });

        // Shifting step
        steps.push({
          array: [...arr],
          comparing: [],
          swapping: [j, j + 1],
          sorted: [...sortedIndices],
          message: `Shifting ${arr[j]} to the right`,
        });

        arr[j + 1] = arr[j];
        j--;
      }

      arr[j + 1] = key;

      // After insertion
      sortedIndices.push(i);
      steps.push({
        array: [...arr],
        comparing: [],
        swapping: [],
        sorted: [...sortedIndices],
        message: `Inserted ${key} at position ${j + 1}`,
      });
    }

    return steps;
  };

  useEffect(() => {
    if (isRunning && currentStep < steps.length) {
      const timer = setTimeout(() => {
        const step = steps[currentStep];
        setArray(step.array);
        setComparingIndices(step.comparing);
        setSwappingIndices(step.swapping);
        setSortedIndices(step.sorted);
        setCurrentStep(currentStep + 1);
      }, speed);

      return () => clearTimeout(timer);
    } else if (isRunning && currentStep >= steps.length) {
      setIsRunning(false);
    }
  }, [isRunning, currentStep, steps, speed]);

  const toggleRunning = () => {
    if (steps.length === 0) {
      startSort();
    } else {
      setIsRunning(!isRunning);
    }
  };

  const getAlgorithmDescription = () => {
    switch (currentAlgo) {
      case "bubble":
        return {
          title: "Bubble Sort",
          description:
            "Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
          timeComplexity: "O(n²)",
          spaceComplexity: "O(1)",
          bestCase: "O(n)",
          worstCase: "O(n²)",
        };
      case "selection":
        return {
          title: "Selection Sort",
          description:
            "Divides the input list into a sorted and an unsorted region, and repeatedly selects the smallest element from the unsorted region and moves it to the sorted region.",
          timeComplexity: "O(n²)",
          spaceComplexity: "O(1)",
          bestCase: "O(n²)",
          worstCase: "O(n²)",
        };
      case "insertion":
        return {
          title: "Insertion Sort",
          description:
            "Builds the sorted array one item at a time by comparing each new element to the already-sorted elements and inserting it into the correct position.",
          timeComplexity: "O(n²)",
          spaceComplexity: "O(1)",
          bestCase: "O(n)",
          worstCase: "O(n²)",
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
  const maxValue = Math.max(...array);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
      <motion.div
        className="text-center mb-6 sm:mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          Sorting Algorithm Visualizer
        </h1>
        <p className="text-gray-300 max-w-3xl mx-auto text-sm sm:text-base">
          Visualize how different sorting algorithms organize data in ascending
          order.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8 mb-8">
        <motion.div
          className="lg:col-span-2 bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex flex-col h-full">
            <div className="flex flex-wrap justify-between items-center mb-4 sm:mb-6 gap-2">
              <div className="flex flex-wrap gap-2 sm:gap-4">
                <button
                  onClick={toggleRunning}
                  className="flex items-center bg-purple-600 hover:bg-purple-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors duration-300 text-sm sm:text-base"
                >
                  {isRunning ? (
                    <Pause className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  ) : (
                    <Play className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  )}
                  {isRunning ? "Pause" : "Start"}
                </button>
                <button
                  onClick={resetSort}
                  className="flex items-center bg-gray-600 hover:bg-gray-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors duration-300 text-sm sm:text-base"
                >
                  <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Reset
                </button>
              </div>
              <button
                onClick={toggleSettings}
                className="flex items-center bg-gray-700 hover:bg-gray-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors duration-300 text-sm sm:text-base"
              >
                <Settings className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Settings
              </button>
            </div>

            {showSettings && (
              <motion.div
                className="bg-gray-700 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                      Algorithm
                    </label>
                    <select
                      value={currentAlgo}
                      onChange={(e) => {
                        setCurrentAlgo(e.target.value);
                        resetSort();
                      }}
                      className="w-full bg-gray-800 border border-gray-600 rounded-md py-1 sm:py-2 px-2 sm:px-3 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="bubble">Bubble Sort</option>
                      <option value="selection">Selection Sort</option>
                      <option value="insertion">Insertion Sort</option>
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
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Fast</span>
                      <span>Slow</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                      Array Size
                    </label>
                    <div className="flex items-center">
                      <input
                        type="range"
                        min="5"
                        max="30"
                        value={arraySize}
                        onChange={(e) => setArraySize(parseInt(e.target.value))}
                        className="w-full mr-2"
                      />
                      <span className="text-gray-300 w-8 text-center text-sm">
                        {arraySize}
                      </span>
                    </div>
                  </div>
                  <div className="sm:col-span-2 md:col-span-3">
                    <button
                      onClick={generateRandomArray}
                      className="w-full bg-gray-600 hover:bg-gray-500 text-white px-4 py-1.5 sm:py-2 rounded-lg transition-colors duration-300 text-sm sm:text-base"
                    >
                      Generate New Array
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="flex-grow flex flex-col">
              <div className="mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-medium text-gray-200 mb-1 sm:mb-2">
                  Current Status:
                </h3>
                <div className="bg-gray-700 rounded-lg p-3 sm:p-4 text-gray-300 text-sm sm:text-base">
                  {currentStep > 0 && currentStep <= steps.length ? (
                    <p>{steps[currentStep - 1].message}</p>
                  ) : (
                    <p>Click "Start" to begin the visualization</p>
                  )}
                </div>
              </div>

              <div className="flex-grow flex items-end justify-center p-2 sm:p-4 bg-gray-900 rounded-lg">
                <div className="flex items-end justify-between w-full h-48 sm:h-64 px-1 sm:px-2">
                  {array.map((value, index) => (
                    <ArrayBar
                      key={index}
                      value={value}
                      index={index}
                      isComparing={comparingIndices.includes(index)}
                      isSwapping={swappingIndices.includes(index)}
                      isSorted={sortedIndices.includes(index)}
                      maxValue={maxValue}
                      totalBars={array.length}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center mb-3 sm:mb-4">
            <BarChart className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500 mr-2" />
            <h2 className="text-lg sm:text-xl font-bold text-purple-400">
              {algoInfo.title}
            </h2>
          </div>
          <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">
            {algoInfo.description}
          </p>

          <div className="space-y-3 sm:space-y-4">
            <div className="bg-gray-700 rounded-lg p-3 sm:p-4">
              <h3 className="text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                Time Complexity
              </h3>
              <p className="text-base sm:text-lg font-bold text-purple-400">
                {algoInfo.timeComplexity}
              </p>
            </div>

            <div className="bg-gray-700 rounded-lg p-3 sm:p-4">
              <h3 className="text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                Space Complexity
              </h3>
              <p className="text-base sm:text-lg font-bold text-purple-400">
                {algoInfo.spaceComplexity}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-gray-700 rounded-lg p-3 sm:p-4">
                <h3 className="text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                  Best Case
                </h3>
                <p className="text-base sm:text-lg font-bold text-green-400">
                  {algoInfo.bestCase}
                </p>
              </div>

              <div className="bg-gray-700 rounded-lg p-3 sm:p-4">
                <h3 className="text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                  Worst Case
                </h3>
                <p className="text-base sm:text-lg font-bold text-red-400">
                  {algoInfo.worstCase}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-700">
            <h3 className="text-base sm:text-lg font-medium text-gray-200 mb-2 sm:mb-4">
              Color Legend
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-2 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded mr-2"></div>
                <span className="text-gray-300 text-xs sm:text-sm">
                  Unsorted Element
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-purple-500 rounded mr-2"></div>
                <span className="text-gray-300 text-xs sm:text-sm">
                  Currently Comparing
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded mr-2"></div>
                <span className="text-gray-300 text-xs sm:text-sm">
                  Swapping Elements
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded mr-2"></div>
                <span className="text-gray-300 text-xs sm:text-sm">
                  Sorted Element
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SortingAlgorithms;