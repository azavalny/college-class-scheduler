import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="font-sans flex flex-col text-center sm:flex-row sm:text-left sm:justify-between py-4 px-6 bg-white shadow sm:items-baseline w-full">
      <div className="mb-2 sm:mb-2">
        <a
          href="/"
          className="text-2xl no-underline text-grey-darkest hover:text-blue-dark"
        >
          Drexel Class Scheduler
        </a>
      </div>
      <div>
        <NavLink
          to="/"
          className="text-lg no-underline text-grey-darkest hover:text-blue-dark ml-2"
        >
          Home
        </NavLink>
        <NavLink
          to="/instructions"
          className="text-lg no-underline text-grey-darkest hover:text-blue-dark ml-2"
        >
          Instructions
        </NavLink>
        <NavLink
          to="/issues"
          className="text-lg no-underline text-grey-darkest hover:text-blue-dark ml-2"
        >
          Report Issues
        </NavLink>
        <NavLink
          to="/about"
          className="text-lg no-underline text-grey-darkest hover:text-blue-dark ml-2"
        >
          About and FAQ
        </NavLink>
      </div>
    </nav>
  );
}
