// App.js
import React, { useState } from 'react';

// uC.]{6hz@OiB
// injfbzag_game
const SendMessage = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [status, setStatus] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);

  const sendOTP = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber })
      });
      
      const data = await response.json();
      if (data.success) {
        setStatus('OTP sent successfully');
        setIsOtpSent(true);
      } else {
        setStatus('Failed to send OTP');
      }
    } catch (error) {
      setStatus('Error sending OTP');
    }
  };

  const verifyOTP = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, otp })
      });
      
      const data = await response.json();
      setStatus(data.message);
      
      if (data.success) {
        // Handle successful verification
        setIsOtpSent(false);
        setOtp('');
      }
    } catch (error) {
      setStatus('Error verifying OTP');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">OTP Verification</h1>
        
        {status && (
          <div className="mb-4">
            <p>{status}</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="+1234567890"
              disabled={isOtpSent}
            />
          </div>

          {!isOtpSent ? (
            <button
              onClick={sendOTP}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            >
              Send OTP
            </button>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enter OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                />
              </div>
              <button
                onClick={verifyOTP}
                className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
              >
                Verify OTP
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SendMessage;