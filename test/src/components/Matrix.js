import React, { useEffect, useState } from "react";
import { Bar, Pie, Line } from "react-chartjs-2"; // Import Line chart from react-chartjs-2
import "chart.js/auto"; // Required for react-chartjs-2
import axios from "axios";
import { BASEURL } from "../baseurl";
import { FaUserTie } from "react-icons/fa";
import { BookOpenIcon, UserGroupIcon } from "@heroicons/react/20/solid";

const Matrix = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from API when the component mounts
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASEURL}/api/v1/auth/matrix`); // Replace with your API endpoint
        if (response.data.success) {
          setDashboardData(response.data.data); // Adjust to match the API response structure
        } else {
          setError("Failed to load data");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching the data", error);
        setError("Failed to load data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // If loading, show a loading message
  if (loading) {
    return <div className="text-center text-lg">Loading...</div>;
  }

  // If there's an error, display it
  if (error) {
    return <div className="text-center text-lg text-red-500">{error}</div>;
  }

  // Prepare data for charts
  const teacherData = {
    labels: ["Total Teachers", "New Teachers"],
    datasets: [
      {
        label: "Teachers",
        backgroundColor: ["#4caf50", "#ff9800"],
        data: [dashboardData?.total_teachers, dashboardData?.new_teachers],
      },
    ],
  };

  const studentData = {
    labels: ["Total Students", "New Students"],
    datasets: [
      {
        label: "Students",
        backgroundColor: ["#3f51b5", "#f44336"],
        data: [dashboardData?.total_students, dashboardData?.new_students],
      },
    ],
  };

  const classData = {
    labels: dashboardData?.classes_with_sections?.map((cls) => cls.class_name),
    datasets: [
      {
        label: "Sections Count",
        backgroundColor: "#2196f3",
        data: dashboardData?.classes_with_sections?.map(
          (cls) => cls.sections_count
        ),
      },
    ],
  };

  // Line chart for total users over time (you can replace this with any relevant data)
  const usersData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
    ], // Example months, replace with real data
    datasets: [
      {
        label: "Total Users Over Time",
        data: [2, 3, 5, 6, 7, 8, 9, 10, 12, 15], // Example data points, replace with actual values
        fill: false,
        borderColor: "#42a5f5",
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="py-8">
      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Total Teachers */}
        <div className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6">
          <dt>
            <div className="absolute rounded-md bg-indigo-500 p-3">
              <FaUserTie aria-hidden="true" className="h-6 w-6 text-white" />
            </div>
            <p className="ml-16 truncate text-sm font-medium text-gray-500">
              Total Teachers
            </p>
          </dt>
          <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
            <p className="text-2xl font-semibold text-gray-900">
              {dashboardData.total_teachers}
            </p>
            {/* <p
              className={classNames(
                item.changeType === "increase"
                  ? "text-green-600"
                  : "text-red-600",
                "ml-2 flex items-baseline text-sm font-semibold"
              )}
            >
              {item.changeType === "increase" ? (
                <ArrowUpIcon
                  aria-hidden="true"
                  className="h-5 w-5 flex-shrink-0 self-center text-green-500"
                />
              ) : (
                <ArrowDownIcon
                  aria-hidden="true"
                  className="h-5 w-5 flex-shrink-0 self-center text-red-500"
                />
              )}

              <span className="sr-only">
                {" "}
                {item.changeType === "increase"
                  ? "Increased"
                  : "Decreased"} by{" "}
              </span>
              {item.change}
            </p> */}
            <div className="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-4 sm:px-6">
              <div className="text-sm">
                <a
                  href="/dashboard/teachers"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  View all<span className="sr-only"> stats</span>
                </a>
              </div>
            </div>
          </dd>
        </div>

        <div className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6">
          <dt>
            <div className="absolute rounded-md bg-indigo-500 p-3">
              <UserGroupIcon
                aria-hidden="true"
                className="h-6 w-6 text-white"
              />
            </div>
            <p className="ml-16 truncate text-sm font-medium text-gray-500">
              Total Students
            </p>
          </dt>
          <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
            <p className="text-2xl font-semibold text-gray-900">
              {dashboardData.total_students}
            </p>
            {/* <p
              className={classNames(
                item.changeType === "increase"
                  ? "text-green-600"
                  : "text-red-600",
                "ml-2 flex items-baseline text-sm font-semibold"
              )}
            >
              {item.changeType === "increase" ? (
                <ArrowUpIcon
                  aria-hidden="true"
                  className="h-5 w-5 flex-shrink-0 self-center text-green-500"
                />
              ) : (
                <ArrowDownIcon
                  aria-hidden="true"
                  className="h-5 w-5 flex-shrink-0 self-center text-red-500"
                />
              )}

              <span className="sr-only">
                {" "}
                {item.changeType === "increase"
                  ? "Increased"
                  : "Decreased"} by{" "}
              </span>
              {item.change}
            </p> */}
            <div className="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-4 sm:px-6">
              <div className="text-sm">
                <a
                  href="/dashboard/students"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  View all<span className="sr-only"> stats</span>
                </a>
              </div>
            </div>
          </dd>
        </div>

        <div className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6">
          <dt>
            <div className="absolute rounded-md bg-indigo-500 p-3">
              <BookOpenIcon aria-hidden="true" className="h-6 w-6 text-white" />
            </div>
            <p className="ml-16 truncate text-sm font-medium text-gray-500">
              Total Classes
            </p>
          </dt>
          <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
            <p className="text-2xl font-semibold text-gray-900">
              {dashboardData.total_classes}
            </p>
            {/* <p
              className={classNames(
                item.changeType === "increase"
                  ? "text-green-600"
                  : "text-red-600",
                "ml-2 flex items-baseline text-sm font-semibold"
              )}
            >
              {item.changeType === "increase" ? (
                <ArrowUpIcon
                  aria-hidden="true"
                  className="h-5 w-5 flex-shrink-0 self-center text-green-500"
                />
              ) : (
                <ArrowDownIcon
                  aria-hidden="true"
                  className="h-5 w-5 flex-shrink-0 self-center text-red-500"
                />
              )}

              <span className="sr-only">
                {" "}
                {item.changeType === "increase"
                  ? "Increased"
                  : "Decreased"} by{" "}
              </span>
              {item.change}
            </p> */}
            <div className="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-4 sm:px-6">
              <div className="text-sm">
                <a
                  href="/dashboard/classes"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  View all<span className="sr-only"> stats</span>
                </a>
              </div>
            </div>
          </dd>
        </div>

        <div className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6">
          <dt>
            <div className="absolute rounded-md bg-indigo-500 p-3">
              <BookOpenIcon aria-hidden="true" className="h-6 w-6 text-white" />
            </div>
            <p className="ml-16 truncate text-sm font-medium text-gray-500">
              Total Subjects
            </p>
          </dt>
          <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
            <p className="text-2xl font-semibold text-gray-900">
              {dashboardData.total_subjects}
            </p>
            {/* <p
              className={classNames(
                item.changeType === "increase"
                  ? "text-green-600"
                  : "text-red-600",
                "ml-2 flex items-baseline text-sm font-semibold"
              )}
            >
              {item.changeType === "increase" ? (
                <ArrowUpIcon
                  aria-hidden="true"
                  className="h-5 w-5 flex-shrink-0 self-center text-green-500"
                />
              ) : (
                <ArrowDownIcon
                  aria-hidden="true"
                  className="h-5 w-5 flex-shrink-0 self-center text-red-500"
                />
              )}

              <span className="sr-only">
                {" "}
                {item.changeType === "increase"
                  ? "Increased"
                  : "Decreased"} by{" "}
              </span>
              {item.change}
            </p> */}
            <div className="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-4 sm:px-6">
              <div className="text-sm">
                <a
                  href="/dashboard/subjects"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  View all<span className="sr-only"> stats</span>
                </a>
              </div>
            </div>
          </dd>
        </div>
        <div className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6">
          <dt>
            <div className="absolute rounded-md bg-indigo-500 p-3">
              <BookOpenIcon aria-hidden="true" className="h-6 w-6 text-white" />
            </div>
            <p className="ml-16 truncate text-sm font-medium text-gray-500">
              Total Users
            </p>
          </dt>
          <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
            <p className="text-2xl font-semibold text-gray-900">
              {dashboardData.total_users}
            </p>
          </dd>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Teachers Bar Chart */}
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-lg font-bold mb-4">Teachers Count</h3>
          <Bar data={teacherData} />
        </div>

        {/* Students Bar Chart */}
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-lg font-bold mb-4">Students Count</h3>
          <Bar data={studentData} />
        </div>

        {/* Class with Sections Chart */}
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-lg font-bold mb-4">Classes and Sections</h3>
          <Pie data={classData} />
        </div>

        {/* Users Line Chart */}
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-lg font-bold mb-4">Total Users Over Time</h3>
          <Line data={usersData} />
        </div>
      </div>
    </div>
  );
};

export default Matrix;
