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

function getRandomNumber() {
  return Math.floor(Math.random() * (235 - 100 + 1)) + 100;
}

function simulateData() {
  const data = {};
  const today = new Date();
  const startDate = startOfMonth(today);
  const endDate = endOfMonth(today);

  const daysInMonth = eachDayOfInterval({ start: startDate, end: endDate });
  daysInMonth.forEach((day) => {
    if (isBefore(day, today)) {
      const dateString = format(day, "EEEE, MMMM d, yyyy");
      data[dateString] = getRandomNumber();
    }
  });

  return data;
}

// let sumCalculated = false;
// let result = 0;
// let previousData = JSON.parse(localStorage.getItem("previousData")) || [];
// let previousSum = localStorage.getItem("previousSum");

// function calculateMonthTotal(data, monthString) {
//   const monthData = Object.entries(data);
//   if (JSON.stringify(data) !== JSON.stringify(previousData)) {
//     const sum = monthData
//       .flatMap((subArray) =>
//         subArray.filter((element) => typeof element === "number")
//       )
//       .reduce((acc, current) => acc + current, 0);
//     localStorage.setItem("previousData", JSON.stringify(monthData));
//     localStorage.setItem("previousSum", sum);
//     return sum;
//   } else {
//     return previousSum;
//   }

// let previousData = {};
// let previousSum = 0;

// function calculateMonthTotal(data, monthString) {
//   // Check if a new day has been added
//   const newDayAdded = Object.keys(data).some((day) => !previousData[day]);

//   if (newDayAdded) {
//     //Calculate the sum of the new data
//     const sum = Object.values(data).reduce((acc, current) => acc + current, 0);

//     // Update the previous data and sum
//     previousData = { ...previousData, ...data };
//     previousSum = sum;

//     // Store the updated data and sum in local storage
//     localStorage.setItem("previousData", JSON.stringify(previousData));
//     localStorage.setItem("previousSum", previousSum);
//     //const sum = 0;
//     return sum;
//   } else {
//     // If no new day has been added, return the previous sum
//     return previousSum;
//   }
// }

function calculateMonthTotal(data, monthString) {
  const storedTotal = localStorage.getItem(`monthTotal_${monthString}`);
  if (storedTotal) {
    return parseInt(storedTotal, 10);
  }

  const monthData = Object.entries(data);
  const sum = monthData
    .filter(([key]) => key.includes(monthString))
    .reduce(
      (acc, [_, value]) => acc + (typeof value === "number" ? value : 0),
      0
    );

  localStorage.setItem(`monthTotal_${monthString}`, sum.toString());
  return sum;
}

// if (!sumCalculated) {
//   //console.log("Data: ", data, "monthString", monthString);
//   const monthData = Object.entries(data);
//   //const result = monthData.filter((key) => key.includes(monthString));
//   result = monthData
//     .flatMap((subArray) =>
//       subArray.filter((element) => typeof element === "number")
//     )
//     .reduce((acc, current) => acc + current, 0);
//   //const result = monthData.find((item) => item[0] === monthString);
//   console.log("result: ", result);
//   // .filter(([key]) => key.includes(monthString) && key.includes(","))
//   // .reduce((sum, [_, count]) => sum + count, 0);
//   // console.log("monthData", monthData);
//   sumCalculated = true;
// }

// return result;
// }

// function calculateMonthTotal(monthString) {
//   const storedData = localStorage.getItem("counterData");
//   if (storedData) {
//     const data = JSON.parse(storedData);
//     //console.log("Data: ", data, "monthString", monthString);
//     const monthData = Object.entries(data)
//       .filter(([key]) => key.includes(monthString) && key.includes(","))
//       .reduce((sum, [_, count]) => sum + count, 0);
//     //console.log("monthData", monthData);
//     return monthData;
//   } else {
//     return 0;
//   }
// }

// function calculateTotalCounts() {
//   const storedData = localStorage.getItem("counterData");
//   if (storedData) {
//     const data = JSON.parse(storedData);
//     const months = [
//       ...new Set(Object.keys(data).map((key) => key.split(", ")[1])),
//     ];
//     months.forEach((month) => {
//       const monthCounts = Object.entries(data)
//         .filter(([key]) => key.includes(month) && key.includes(","))
//         .map(([, count]) => count);
//       const totalMonthCount = monthCounts.reduce(
//         (sum, count) => sum + count,
//         0
//       );
//       data[month] = totalMonthCount;
//     });
//     localStorage.setItem("counterData", JSON.stringify(data));
//   }
// }

export default function CounterApp() {
  const [data, setData] = useState({});
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentCount, setCurrentCount] = useState(null);
  const [lastCountDate, setLastCountDate] = useState(null);
  const [isCountVisible, setIsCountVisible] = useState(false);
  const [monthString, setMonthString] = useState(null);

  // useEffect(() => {
  //   const checkTimeAndUpdateCount = () => {
  //     const now = new Date();
  //     const midnight = startOfDay(now);
  //     const isAfterMidnight = isAfter(now, midnight);
  //     setIsCountVisible(isAfterMidnight);

  //     const todayString = format(now, "EEEE, MMMM d, yyyy");
  //     const monthString = format(now, "MMMM yyyy");

  //     if (!isSameDay(now, lastCountDate)) {
  //       if (isAfterMidnight && !data[todayString]) {
  //         const newCount = getRandomNumber();
  //         setData((prevData) => {
  //           const newData = { ...prevData, [todayString]: newCount };
  //           const monthTotal = calculateMonthTotal(newData, monthString);
  //           newData[monthString] = monthTotal;
  //           localStorage.setItem("counterData", JSON.stringify(newData));
  //           return newData;
  //         });
  //         setCurrentCount(newCount);
  //         setLastCountDate(now);
  //         localStorage.setItem("lastCountDate", now.toISOString());
  //       } else if (data[todayString]) {
  //         setCurrentCount(data[todayString]);
  //         setLastCountDate(now);
  //       }
  //     }
  //   };

  //   const storedData = localStorage.getItem("counterData");
  //   const storedLastCountDate = localStorage.getItem("lastCountDate");

  //   if (storedData && storedLastCountDate) {
  //     const parsedData = JSON.parse(storedData);
  //     const parsedLastCountDate = new Date(storedLastCountDate);

  //     const today = new Date();
  //     const todayString = format(today, "EEEE, MMMM d, yyyy");
  //     const monthString = format(today, "MMMM yyyy");

  //     if (!parsedData[todayString] && isAfter(today, parsedLastCountDate)) {
  //       const newCount = getRandomNumber();
  //       parsedData[todayString] = newCount;
  //       setCurrentCount(newCount);
  //       setLastCountDate(today);
  //       localStorage.setItem("lastCountDate", today.toISOString());
  //     } else if (parsedData[todayString]) {
  //       setCurrentCount(parsedData[todayString]);
  //       setLastCountDate(parsedLastCountDate);
  //     }

  //     const monthTotal = calculateMonthTotal(parsedData, monthString);
  //     parsedData[monthString] = monthTotal;

  //     setData(parsedData);
  //     localStorage.setItem("counterData", JSON.stringify(parsedData));
  //   } else {
  //     const simulatedData = simulateData();
  //     const today = new Date();
  //     const monthString = format(today, "MMMM yyyy");
  //     const monthTotal = calculateMonthTotal(simulatedData, monthString);
  //     simulatedData[monthString] = monthTotal;

  //     setData(simulatedData);
  //     setLastCountDate(today);
  //     setCurrentCount(null);
  //     localStorage.setItem("counterData", JSON.stringify(simulatedData));
  //     localStorage.setItem("lastCountDate", today.toISOString());
  //   }

  //   checkTimeAndUpdateCount();
  //   const interval = setInterval(checkTimeAndUpdateCount, 60000);

  //   return () => clearInterval(interval);
  // }, []);

  // useEffect(() => {
  //   const storedData = localStorage.getItem("counterData");
  //   const storedLastCountDate = localStorage.getItem("lastCountDate");
  //   //console.log(storedData);
  //   if (storedData && storedLastCountDate) {
  //     const parsedData = JSON.parse(storedData);
  //     //console.log("parse data:", parsedData);
  //     const parsedLastCountDate = new Date(storedLastCountDate);

  //     const today = new Date();
  //     const todayString = format(today, "EEEE, MMMM d, yyyy");
  //     const monthString = format(today, "MMMM yyyy");
  //     setMonthString(monthString);
  //     const monthTotal = calculateMonthTotal(parsedData, monthString);
  //     console.log(monthTotal);
  //     parsedData[monthString] = monthTotal;
  //     if (parsedData[todayString]) {
  //       //console.log(parsedData[todayString]);
  //       setCurrentCount(parsedData[todayString]);
  //       setLastCountDate(parsedLastCountDate);
  //     } else {
  //       const newCount = getRandomNumber();
  //       parsedData[todayString] = newCount;
  //       setCurrentCount(newCount);
  //       setLastCountDate(today);
  //       localStorage.setItem("lastCountDate", today.toISOString());
  //     }

  //     setData(parsedData);
  //     localStorage.setItem("counterData", JSON.stringify(parsedData));
  //   } else {
  //     const simulatedData = simulateData();
  //     const today = new Date();
  //     const monthString = format(today, "MMMM yyyy");
  //     const monthTotal = calculateMonthTotal(simulatedData, monthString);
  //     simulatedData[monthString] = monthTotal;

  //     setData(simulatedData);
  //     setLastCountDate(today);
  //     setCurrentCount(null);
  //     localStorage.setItem("counterData", JSON.stringify(simulatedData));
  //     localStorage.setItem("lastCountDate", today.toISOString());
  //   }
  // }, []); // empty dependency array

  useEffect(() => {
    const storedData = localStorage.getItem("counterData");
    const storedLastCountDate = localStorage.getItem("lastCountDate");

    if (storedData && storedLastCountDate) {
      const parsedData = JSON.parse(storedData);
      const parsedLastCountDate = new Date(storedLastCountDate);

      const today = new Date();
      const todayString = format(today, "EEEE, MMMM d, yyyy");
      const monthString = format(today, "MMMM yyyy");
      setMonthString(monthString);

      const monthTotal = calculateMonthTotal(parsedData, monthString);
      parsedData[monthString] = monthTotal;

      if (parsedData[todayString]) {
        setCurrentCount(parsedData[todayString]);
        setLastCountDate(parsedLastCountDate);
      } else {
        const newCount = getRandomNumber();
        parsedData[todayString] = newCount;
        setCurrentCount(newCount);
        setLastCountDate(today);
        localStorage.setItem("lastCountDate", today.toISOString());

        // Recalculate month total with the new day's count
        const updatedMonthTotal = calculateMonthTotal(parsedData, monthString);
        parsedData[monthString] = updatedMonthTotal;
      }

      setData(parsedData);
      localStorage.setItem("counterData", JSON.stringify(parsedData));
    } else {
      const simulatedData = simulateData();
      const today = new Date();
      const monthString = format(today, "MMMM yyyy");
      const monthTotal = calculateMonthTotal(simulatedData, monthString);
      simulatedData[monthString] = monthTotal;

      setData(simulatedData);
      setLastCountDate(today);
      setCurrentCount(null);
      localStorage.setItem("counterData", JSON.stringify(simulatedData));
      localStorage.setItem("lastCountDate", today.toISOString());
    }
  }, []);

  // const monthTotal = calculateMonthTotal(data);
  // console.log(monthTotal);
  //parsedData[monthString] = monthTotal;
  // console.log(data);
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
  // console.log(filteredData);
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Rsh Dashboard
        </h1>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
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
        <Card className="mb-6 bg-blue-100">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Todays total
              <Clock className="text-gray-500" size={20} aria-hidden="true" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{currentCount}</p>

            <p className="text-sm text-gray-600 mt-2">
              Last updated:{" "}
              {lastCountDate ? format(lastCountDate, "PPpp") : "N/A"}
            </p>
          </CardContent>
        </Card>
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
                <p className="text-3xl font-bold text-gray-900">
                  {date.includes(",")
                    ? count
                    : localStorage.getItem(`monthTotal_${date}`) || count}
                </p>
                {!date.includes(",") && (
                  <p className="text-sm text-gray-600 mt-1">
                    Total for the month
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
          {/* {filteredData.map(([date, count]) => (
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
                {date.includes(",") ? (
                  <p className="text-3xl font-bold text-gray-900">{count}</p>
                ) : (
                  <p className="text-3xl font-bold text-gray-900">
                    {calculateMonthTotal(data, date)}
                  </p>
                )}
                {!date.includes(",") && (
                  <p className="text-sm text-gray-600 mt-1">
                    Total for the month
                  </p>
                )}
              </CardContent>
            </Card>
          ))} */}

          {/* {filteredData.map(([date, count]) => (
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
                {date.includes(",") ? (
                  <p className="text-3xl font-bold text-gray-900">{count}</p>
                ) : (
                  <p className="text-3xl font-bold text-gray-900">
                    {calculateMonthTotal(monthString)}
                  </p>
                )}
                {!date.includes(",") && (
                  <p className="text-sm text-gray-600 mt-1">
                    Total for the month
                  </p>
                )}
              </CardContent>
            </Card>
          ))} */}
        </div>
      </main>
      {filteredData.length === 0 && (
        <p className="text-center text-gray-500 mt-8">
          No results found. Try adjusting your search or filter.
        </p>
      )}
    </div>
  );
}
