import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';

function Billing() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleManageSubscription = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/customer-portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user?.primaryEmailAddress?.emailAddress,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || 'Unable to access subscription portal');
      }
    } catch (err) {
      setError('Failed to load subscription portal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-2xl mx-auto pt-12">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Manage Subscription</h1>
          
          <div className="mb-8">
            <p className="text-gray-600 mb-4">
              Manage your billing, update payment methods, view invoices, or cancel your subscription.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <button
            onClick={handleManageSubscription}
            disabled={loading}
            className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Open Stripe Customer Portal'}
          </button>

          <div className="mt-6">
            <a href="/" className="text-indigo-600 hover:text-indigo-700 font-medium">
              ← Back to Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Billing;
