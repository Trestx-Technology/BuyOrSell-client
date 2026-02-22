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
      </div>
    </div>
  );
}
