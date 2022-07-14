import React, { useState } from 'react';
import Navbar from './Navbar';

export default function ReportBug() {
  return (
    <>
      <Navbar />
      <br />
      <br />
      <div className="container mx-auto">
        <button className="bg-slate-300">
          <h1 className="text-3xl text-center p-4"> <a target="_blank" rel="noopener noreferrer" href="https://forms.gle/8YtVjkPudtnhQHiL9">Click Me to Report Any Issues You're Having </a> </h1>
        </button>
      </div>
    </>
  );
}
