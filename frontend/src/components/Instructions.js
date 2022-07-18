import React, { useState } from "react";
import Navbar from "./Navbar";

export default function Instructions() {
  return (
    <>
      <div className="absolute w-full h-full">
        <Navbar />
        <div className="container mx-auto">
          <div className="">
            <h1 className="text-2xl text-center py-4">How to Use this App</h1>
            <div className="flex flex-row">
              <p className="text-center">
                <br />
                In the search bar, enter the abbreviated name of all
                your courses this term and their id's:
                <img
                  src="./images/instructions/search.png"
                  className="w-full"
                />
                For example, For Computing and Informatics Design 1, you would
                enter: <b>CI 103</b>, and the search bar will autocomplete the
                search as you enter.
                <br />
                <br />
                After all your courses are entered, you have three constraints,
                that must all add up to 100%, to customize based on your
                preferences for how you want your schedule to look like. The{" "}
                <b>no classes during time interval</b> option is a measure of
                how much you don't want your classes to overlap during your
                selected time intervals that you create in the calendar below so
                that the algorithm will favor classes that don't overlap with
                the busy time intervals. The <b>prefer longer classes</b> option
                will make the algorithm prioritize choosing longer or shorter
                sections of courses, say a 2 hour twice a week class versus a
                one hour 4 times a week class, with a checkbox to select a
                prefer shorter classes option. The third constraint involves{" "}
                <b>prioritizing how much time the gaps</b> between classes
                should be.
                <img
                  src="./images/instructions/constraints.png"
                  className="w-full"
                />
                <br />
                <br />
                Then, click the button today at the top left of the calendar to update it to today's date. Pressing the arrow buttons will allow you to navigate between days, weeks or months depending on which of the 3 buttons on the top right of the calendar are pressed will give different views. Click and drag on the calendar to add the times in which you're busy for other commitments such as work, clubs, sports, etc.
                you're busy for other commitments such as work, clubs, sports,
                etc.
                <br />
                <br />
                <img src="./images/instructions/busy.png" className="w-full" />
                <br />
                <br />
                Then click the submit button to see your calendar!
                <br /> <br />
                <img
                  src="./images/instructions/schedule.png"
                  className="w-full"
                />
              </p>
            </div>
            <br /> <br />
            <br /> <br />
            <p className="text-xl">Contact</p>
            <br />
            If an undocumented question arises, feel free to contact me:
            <ul>
              <li>- Alex Zavalny: az548@drexel.edu</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
