import React, { useState } from "react";

export default function Navbar() {
  const [show, setShow] = useState(false);
  const [product, setProduct] = useState(false);
  const [deliverables, setDeliverables] = useState(false);
  const [profile, setProfile] = useState(false);
  return (
    <nav className="font-sans flex flex-col text-center sm:flex-row sm:text-left sm:justify-between py-4 px-6 bg-white shadow sm:items-baseline w-full">
      <div className="mb-2 sm:mb-0">
        <a
          href="/"
          className="text-2xl no-underline text-grey-darkest hover:text-blue-dark"
        >
          Class Scheduling App
        </a>
      </div>
      <div>
        <a
          href="/one"
          className="text-lg no-underline text-grey-darkest hover:text-blue-dark ml-2"
        >
          About Us
        </a>
        <a
          href="/two"
          className="text-lg no-underline text-grey-darkest hover:text-blue-dark ml-2"
        >
          Report a Bug
        </a>
      </div>
    </nav>
  );
}
