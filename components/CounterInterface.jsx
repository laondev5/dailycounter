"use client";

import React, { useState, useEffect } from "react";
import {
  format,
  parse,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  startOfDay,
  isAfter,
  isBefore,
} from "date-fns";
import { Calendar, Filter, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Define the structure for our count data
// type CountData = {
//   [key: string]: number,
// };

// Function to generate a random number between 100 and 235
function getRandomNumber() {
  return Math.floor(Math.random() * (235 - 100 + 1)) + 100;
}

// Function to simulate data for the current month
function simulateData() {
  const data = {};
  const today = new Date();
  const startDate = startOfMonth(today);
  const endDate = endOfMonth(today);

  // Generate data for each day of the month up to yesterday
  const daysInMonth = eachDayOfInterval({ start: startDate, end: endDate });
  daysInMonth.forEach((day) => {
    if (isBefore(day, today)) {
      const dateString = format(day, "EEEE, MMMM d, yyyy");
      data[dateString] = getRandomNumber();
    }
  });

  // Calculate and add the monthly total
  const monthTotal = Object.values(data).reduce((sum, count) => sum + count, 0);
  data[format(today, "MMMM yyyy")] = monthTotal;

  return data;
}

export default function CounterApp() {
  // State variables
  const [data, setData] = useState({});
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentCount, setCurrentCount] = useState(null);
  const [lastCountDate, setLastCountDate] = useState(null);
  const [isCountVisible, setIsCountVisible] = useState(false);

  useEffect(() => {
    // Function to check time and update count if necessary
    const checkTimeAndUpdateCount = () => {
      const now = new Date();
      const midnight = startOfDay(now);
      const isAfterMidnight = isAfter(now, midnight);
      setIsCountVisible(isAfterMidnight);

      const todayString = format(now, "EEEE, MMMM d, yyyy");

      // Check if it's a new day and update count if necessary
      if (!isSameDay(now, lastCountDate)) {
        if (isAfterMidnight && data[todayString] === undefined) {
          startNewDayCount(now);
        } else if (data[todayString] !== undefined) {
          setCurrentCount(data[todayString]);
          setLastCountDate(now);
        }
      }
    };

    // Load data from localStorage or generate new data
    const storedData = localStorage.getItem("counterData");
    const storedLastCountDate = localStorage.getItem("lastCountDate");

    if (storedData && storedLastCountDate) {
      const parsedData = JSON.parse(storedData);
      const parsedLastCountDate = new Date(storedLastCountDate);

      setData(parsedData);
      setLastCountDate(parsedLastCountDate);

      const today = new Date();
      const todayString = format(today, "EEEE, MMMM d, yyyy");
      if (parsedData[todayString] !== undefined) {
        setCurrentCount(parsedData[todayString]);
      } else {
        setCurrentCount(null);
      }
    } else {
      const simulatedData = simulateData();
      setData(simulatedData);
      const today = new Date();
      setLastCountDate(today);
      setCurrentCount(null);
      localStorage.setItem("counterData", JSON.stringify(simulatedData));
      localStorage.setItem("lastCountDate", today.toISOString());
    }

    // Initial check and set up interval for periodic checks
    checkTimeAndUpdateCount();
    const interval = setInterval(checkTimeAndUpdateCount, 60000); // Check every minute

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, [data, lastCountDate]);

  // Function to start a new day's count
  function startNewDayCount(date) {
    const newCount = getRandomNumber();
    const dateString = format(date, "EEEE, MMMM d, yyyy");
    const monthString = format(date, "MMMM yyyy");

    setCurrentCount(newCount);
    setLastCountDate(date);
    setData((prevData) => {
      const newData = { ...prevData, [dateString]: newCount };
      // Recalculate monthly total
      const monthTotal = Object.entries(newData)
        .filter(
          ([key]) =>
            key.includes(format(date, "MMMM yyyy")) && key !== monthString
        )
        .reduce((sum, [_, count]) => sum + count, 0);
      newData[monthString] = monthTotal;
      return newData;
    });

    // Persist data to localStorage
    localStorage.setItem("counterData", JSON.stringify(data));
    localStorage.setItem("lastCountDate", date.toISOString());
  }

  // Filter and search data
  const filteredData = Object.entries(data).filter(([key, _]) => {
    const matchesFilter =
      filter === "all"
        ? true
        : filter === "days"
        ? key.includes(",")
        : !key.includes(",");

    const matchesSearch = key.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Daily Counter Dashboard
        </h1>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Filter buttons */}
          <div
            className="flex rounded-md shadow-sm"
            role="group"
            aria-label="Filter options"
          >
            <Button
              onClick={() => setFilter("all")}
              variant={filter === "all" ? "default" : "outline"}
            >
              All
            </Button>
            <Button
              onClick={() => setFilter("days")}
              variant={filter === "days" ? "default" : "outline"}
            >
              Days
            </Button>
            <Button
              onClick={() => setFilter("months")}
              variant={filter === "months" ? "default" : "outline"}
            >
              Months
            </Button>
          </div>
          {/* Search input */}
          <div className="relative w-full md:w-64">
            <Input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
            <Filter
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              aria-hidden="true"
            />
          </div>
        </div>
      </header>
      <main>
        {/* Today's count card */}
        <Card className="mb-6 bg-blue-100">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Todays Count
              <Clock className="text-gray-500" size={20} aria-hidden="true" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isCountVisible && currentCount !== null ? (
              <p className="text-4xl font-bold">{currentCount}</p>
            ) : (
              <p className="text-2xl font-semibold text-gray-600">
                {isCountVisible
                  ? "Generating today's count..."
                  : "Count will be visible after 12:00 AM"}
              </p>
            )}
            <p className="text-sm text-gray-600 mt-2">
              Last updated:{" "}
              {lastCountDate ? format(lastCountDate, "PPpp") : "N/A"}
            </p>
          </CardContent>
        </Card>
        {/* Grid of count cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredData.map(([date, count]) => (
            <Card
              key={date}
              className="bg-yellow-100 transform transition-transform hover:scale-105"
            >
              <CardHeader className="flex justify-between items-start pb-2">
                <CardTitle className="text-lg font-semibold text-gray-800">
                  {date}
                </CardTitle>
                <Calendar
                  className="text-gray-500"
                  size={20}
                  aria-hidden="true"
                />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-gray-900">{count}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      {/* Message for no results */}
      {filteredData.length === 0 && (
        <p className="text-center text-gray-500 mt-8">
          No results found. Try adjusting your search or filter.
        </p>
      )}
    </div>
  );
}
