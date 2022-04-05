import React, { useState } from 'react';
import Navbar from './Navbar';

export default function Index() {
  return (
    <>
      <div className="absolute bg-gray-200 w-full h-full">
        <Navbar />
        <div className="container mx-auto">
          <div className="w-full h-64">
            Hi
          </div>
        </div>
      </div>
    </>
  );
}
