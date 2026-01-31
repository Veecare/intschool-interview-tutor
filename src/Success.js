import React from 'react';

function Success() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Welcome to IntSchool Interview Tutor!</h1>
        <p className="text-gray-600 mb-4">Your 7-day free trial has started.</p>
        <p className="text-gray-600 mb-6">You now have full access to IntSchool Interview Tutor.</p>
        <a href="/" className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700">
          Go to Dashboard
        </a>
        <p className="text-sm text-gray-500 mt-6">You won't be charged until your trial ends.</p>
      </div>
    </div>
  );
}

export default Success;
