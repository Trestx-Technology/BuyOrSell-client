import React from "react";

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <div className="max-w-md w-full text-center space-y-6 animate-in fade-in zoom-in duration-700">
        <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 tracking-tight">
          COMING SOON
        </h1>
        <div className="h-1 w-24 bg-purple-600 mx-auto rounded-full" />
        <p className="text-gray-600 text-lg md:text-xl font-medium">
          We're preparing something special for you.
          <br />
          The marketplace will be live shortly.
        </p>
        <div className="pt-8">
            <div className="inline-flex items-center space-x-2 text-sm text-purple-600 font-semibold uppercase tracking-widest bg-purple-50 px-4 py-2 rounded-full border border-purple-100">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                </span>
                <span>Work in progress</span>
            </div>
        </div>
      </div>
    </div>
  );
}
