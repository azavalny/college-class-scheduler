import React, { useState } from 'react';
import Navbar from './Navbar';

export default function About() {
  return (
    <>
      <div className="absolute bg-gray-200 w-full h-full">
        <Navbar />
        <div className="container mx-auto">
          <div className="w-full h-64">
            
          <h1 class="text-2xl">About</h1>
          <div aboutDevs class="flex justify-center ...">
            {people.map((person) => (
              <li key={person.email} className="py-4 flex">
                <img className="scale-50 rounded-full" src={person.image} alt="" />
                <div className="ml-3">
                  <p className="text-m font-medium text-gray-900">{person.name}</p>
                  <p className="text-m text-gray-500"><a href={"mailto:"+person.email}>{person.email}</a></p>
                </div>
              </li>
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
    image:
      'https://media-exp1.licdn.com/dms/image/C4E03AQGv7JrjtI5wpA/profile-displayphoto-shrink_800_800/0/1649010036102?e=1654732800&v=beta&t=JwtUUBqsu7_NwgF-s-0mJwAoP2vAiu627BwtU7NMzgo',
  },
  {
      name: 'Shivang Patel',
      email: 'sp3699@drexel.edu',
      image:
        'https://media-exp1.licdn.com/dms/image/C4D03AQFYyUGjbLkA-A/profile-displayphoto-shrink_800_800/0/1640570806299?e=1654732800&v=beta&t=aqls6yzJjE2YqjjPJKkZ9r0_TDNrUAjKZTMGhBj_Apo',
    },
  {
    name: 'Ryen Ling',
    email: 'rl826@drexel.edu',
    image:
      'https://media-exp1.licdn.com/dms/image/C4E03AQFJXjRAQD-35A/profile-displayphoto-shrink_800_800/0/1625248068593?e=1654732800&v=beta&t=WB2zr7lzT3yDReguoIORA791aVeCXw2oZ4SNtsqpoYQ',
  },
  {
      name: 'Siddarth Kampalli',
      email: 'sk3999@drexel.edu',
      image:'https://media-exp1.licdn.com/dms/image/C4D03AQH7yDhZpTDjNQ/profile-displayphoto-shrink_400_400/0/1594709657208?e=1654732800&v=beta&t=wJ72jZTLfY0C8cuzb9oKTJj3G5TypgIO3QYFeIlC2Bg',
  }
]