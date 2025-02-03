import React, { useState, useEffect } from "react";

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 25,
    hours: 23,
    minutes: 59,
    seconds: 28,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return {
            ...prev,
            days: prev.days - 1,
            hours: 23,
            minutes: 59,
            seconds: 59,
          };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="container mx-auto flex flex-col md:flex-row justify-between items-center p-4 space-y-6 md:space-y-0">
      {/* Left Section */}
      <div className="w-full flex flex-col space-y-4 text-start md:text-left">
      <div className="flex items-baseline space-x-2">
          <h1 className="text-4xl font-bold text-primary">Day Of The</h1>
          <span className="text-4xl font-bold text-secondary">Deal</span>
        </div>
        <p className="text-sm text-primary/80 ">
          Don't wait. The time will never be just right.
        </p>
      </div>

      {/* Right Section */}
      <div className="w-full md:w-auto flex justify-start">
        <div className="bg-base flex items-center  space-x-4  font-bold text-primary rounded-md p-2">
          <div className="flex items-baseline">
            <span className="text-[15px]">
              {timeLeft.days.toString().padStart(2, "0")}
            </span>
            <span className="text-[15px] ml-1">Days</span>
          </div>
          <span className="text-[15px]">:</span>
          <div className="flex items-baseline">
            <span className="text-[15px]">
              {timeLeft.hours.toString().padStart(2, "0")}
            </span>
            <span className="text-[15px] ml-1">:</span>
          </div>
          <div className="flex items-baseline">
            <span className="text-[15px]">
              {timeLeft.minutes.toString().padStart(2, "0")}
            </span>
            <span className="text-lg ml-1">:</span>
          </div>
          <div className="flex items-baseline">
            <span className="text-[15px]">
              {timeLeft.seconds.toString().padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
