import React, { useState } from 'react';
import Navbar from './Navbar';

export default function About() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto">
        <div className="container mx-auto">
          <h1 className="text-3xl text-center p-4">The Developers</h1>

          <div className="flex flex-row">
            {people.map((person) => (
              <div key={person.email} className="m-8">
                <div className="text-center float-center">
                  <p className="font-medium text-gray-900">{person.name}</p>
                  <p className="text-gray-500"><a href={`mailto:${person.email}`}>{person.email}</a></p>
                  <p clasName="font-small text-gray-900">{person.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <h1 className="text-3xl text-center p-4">Frequenty Asked Questions:</h1>
          <br />
          <p className="text-xl text-center p-4 font-bold">How do you create a schedule with Fridays/Mondays off? Is the algorithm prevented from picking a class during my selected busy periods?</p>
          <p className="text text-center p-4">There is no way to enforce the algorithm to not go over some busy times because then someone could mark every time busy and it would be impossible to compute a schedule. It uses the busy slots as guidelines, so even with the example of Fridays off, it might me necessary to have a Friday class if the only section is offered on that day</p>
          <p className="text-xl text-center p-4 font-bold">How do you update the courses for each term/deal with changing courses during registration week? </p>
          <p className="text text-center p-4">During registration week, our databased of courses for each term is updated every 30 minutes while outside of registration period it's automatically updated every day</p>
          <p className="text-xl text-center p-4 font-bold">Can I save my schedules to an account?</p>
          <p className="text text-center p-4">For privacy reasons, we don't have an account system, because we only would want current Drexel students, not former or non students, to be able to view and possibly track down where a student could be during the school day which poses a liability for us</p>
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
    desc: 'Product Owner & Promoter, Developed Course Search Bar & Backend API Endpoints',
  },
  {
    name: 'Shivang Patel',
    email: 'sp3699@drexel.edu',
    image: './images/headshots/shivang.png',
    desc: 'Fullstack Developer, Creator of Course Generator Algorithm, Calendar UI',
  },
  {
    name: 'Ryen Ling',
    email: 'rl826@drexel.edu',
    image: './images/headshots/ryen.jpg',
    desc: 'Backend Developer, Database Administrator, Project Management, Fuzzy Finding Search',
  },
  {
    name: 'Siddarth Kampalli',
    email: 'sk3999@drexel.edu',
    image: './images/headshots/sid.jpg',
    desc: 'Frontend Developer, Created Preference Selectors, Bug Fixing, Unit Testing',
  },
]
