import React, { useState } from 'react';
import Navbar from './Navbar';

export default function About() {
  return (
    <>
      <div className="absolute bg-gray-200 w-full h-full">
        <Navbar />
        <div className="container mx-auto">
          <div className="">
            <h1 className="text-2xl text-left p-4">About</h1>

            <div className="flex flex-row">
              {people.map((person) => (
                <div key={person.email} className="m-8">
                  <div className="w-40">
                    <img className="rounded-full" src={person.image} alt={person.name} />
                  </div>
                  <div className="text-center float-left">
                    <p className="font-medium text-gray-900">{person.name}</p>
                    <p className="text-gray-500"><a href={`mailto:${person.email}`}>{person.email}</a></p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

const people = [
  {
    name: 'Alex Zavalny',
    email: 'az548@drexel.edu',
    image: './images/headshots/alex.jpg',
  },
  {
    name: 'Shivang Patel',
    email: 'sp3699@drexel.edu',
    image: './images/headshots/shivang.png',
  },
  {
    name: 'Ryen Ling',
    email: 'rl826@drexel.edu',
    image: './images/headshots/ryen.jpg',
  },
  {
    name: 'Siddarth Kampalli',
    email: 'sk3999@drexel.edu',
    image: './images/headshots/sid.jpg',
  },
]
