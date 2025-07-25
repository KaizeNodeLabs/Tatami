"use client";

import { useState, useEffect } from 'react';

export function WebAuthnHelper() {
  const [showHelper, setShowHelper] = useState(false);
  const [isDevelopment, setIsDevelopment] = useState(false);

  useEffect(() => {
    // Check if we're in development environment
    const isDev = process.env.NODE_ENV === 'development' || 
                  window.location.hostname === 'localhost' ||
                  window.location.protocol === 'http:';
    setIsDevelopment(isDev);
  }, []);

  if (!isDevelopment) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {showHelper && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded mb-2 max-w-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium">Development Mode</h3>
              <div className="mt-2 text-sm">
                <p>WebAuthn may not work properly on HTTP. If you encounter authentication errors:</p>
                <ul className="list-disc list-inside mt-1">
                  <li>Try clicking the button again</li>
                  <li>Use HTTPS or localhost</li>
                  <li>Check browser console for details</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
      <button
        onClick={() => setShowHelper(!showHelper)}
        className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 text-sm"
        title="Development Helper"
      >
        {showHelper ? '×' : '?'}
      </button>
    </div>
  );
} 