import React from 'react';
import { SignUp } from '@clerk/clerk-react';

function Signup() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Get Started</h1>
          <p className="text-gray-600">Create your IntSchool Interview Tutor account</p>
        </div>
        <SignUp 
          routing="path" 
          path="/signup"
          signInUrl="/login"
          afterSignUpUrl={window.location.origin}
        />
      </div>
    </div>
  );
}

export default Signup;
