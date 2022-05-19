import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="font-sans flex flex-col text-center sm:flex-row sm:text-left sm:justify-between py-4 px-6 bg-white shadow sm:items-baseline w-full">
      <div className="mb-2 sm:mb-0">
        <a
          href="/"
          className="text-2xl no-underline text-grey-darkest hover:text-blue-dark"
        >
          Class Scheduler
        </a>
      </div>
      <div>
        <NavLink
          to="/about"
          className="text-lg no-underline text-grey-darkest hover:text-blue-dark ml-2"
        >
          About Us
        </NavLink>
      {/*<NavLink
          to="/report-bug"
          className="text-lg no-underline text-grey-darkest hover:text-blue-dark ml-2"
        >
          Report a Bug
        </NavLink>*/}
      </div>
    </nav>
  );
}
