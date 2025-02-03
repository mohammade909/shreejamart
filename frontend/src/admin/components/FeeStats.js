import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASEURL } from "../../baseurl";

const FeeStats = () => {
  const [summaryData, setSummaryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await axios.get(`${BASEURL}/api/v1/fees/summary`);
        setSummaryData(response.data.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch summary data.");
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  // Calculate Totals
  const totalEnrollments = summaryData.reduce(
    (total, course) => total + (course.enrollment_count || 0),
    0
  );
  const totalFees = summaryData.reduce(
    (total, course) => total + parseFloat(course.total_fee || 0),
    0
  );
  const totalPaid = summaryData.reduce(
    (total, course) => total + parseFloat(course.total_paid || 0),
    0
  );
  const totalDue = summaryData.reduce(
    (total, course) => total + parseFloat(course.total_due || 0),
    0
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Course Statistics</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white shadow-md rounded p-4 text-center">
          <h3 className="text-lg font-semibold text-gray-700">Total Enrollments</h3>
          <p className="text-2xl font-bold text-blue-500">{totalEnrollments}</p>
        </div>
        <div className="bg-white shadow-md rounded p-4 text-center">
          <h3 className="text-lg font-semibold text-gray-700">Total Fees</h3>
          <p className="text-2xl font-bold text-green-500">${totalFees.toFixed(2)}</p>
        </div>
        <div className="bg-white shadow-md rounded p-4 text-center">
          <h3 className="text-lg font-semibold text-gray-700">Total Paid</h3>
          <p className="text-2xl font-bold text-indigo-500">${totalPaid.toFixed(2)}</p>
        </div>
        <div className="bg-white shadow-md rounded p-4 text-center">
          <h3 className="text-lg font-semibold text-gray-700">Total Due</h3>
          <p className="text-2xl font-bold text-red-500">${totalDue.toFixed(2)}</p>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="mt-6">
        <h3 className="text-xl font-bold mb-4">Detailed Course Summary</h3>
        <table className="table-auto w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Course Name</th>
              <th className="border border-gray-300 px-4 py-2">Enrollments</th>
              <th className="border border-gray-300 px-4 py-2">Fee Amount</th>
              <th className="border border-gray-300 px-4 py-2">Total Paid</th>
              <th className="border border-gray-300 px-4 py-2">Total Due</th>
            </tr>
          </thead>
          <tbody>
            {summaryData.map((course) => (
              <tr key={course.course_id}>
                <td className="border border-gray-300 px-4 py-2">
                  {course.course_name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {course.enrollment_count || 0}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  ${parseFloat(course.total_fee || 0).toFixed(2)}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  ${parseFloat(course.total_paid || 0).toFixed(2)}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  ${parseFloat(course.total_due || 0).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeeStats;
