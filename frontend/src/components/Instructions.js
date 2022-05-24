import React, { useState } from "react";
import Navbar from "./Navbar";

export default function Instructions() {
  return (
    <>
      <div className="absolute w-full h-full">
        <Navbar />
        <div className="container mx-auto">
          <div className="">
            <h1 className="text-2xl text-left py-4">User Guide</h1>
            <div className="flex flex-row">
              <p className="text-left">
                <br />
                Go to the url where the project is hosted, and enter the home
                page. Then in the search bar, enter the abbreviated name of all
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
            <h1 className="text-2xl text-left py-4">System Manual</h1>
            <div className="flex flex-row">
              <p className="text-left">
                <p className="text-xl">Installation Guide</p>
                <br />
                Node.js must be installed on the user's machine in order to run
                Node Package Manager commands (npm)
                <br />
                Once Node is installed, run the following command to install
                react.js and all its dependencies > npx create-react-app my-app
                <br />
                Make sure the latest version of Python is installed, and to
                confirm run this command on the command line to confirm the
                version: > python
                <br />
                With python installed, run the following command to install
                flask: > pip install flask
                <br />
                Download or clone the project repository onto your machine, and
                in the root directory navigate to the frontend directory and
                run: > npm run start
                <br />
                If the above command does not work, then it means you are on a
                windows machine and will instead run: > npm run winStart
                <br />
                Then, open another terminal and go to the backend directory and
                run: > flask run
                <br />
                Navigate to: <b>http://localhost:3000/</b> to view the project
                <br /> <br />
                <p className="text-xl"> Error messages and Troubleshooting </p>
                <br />
                If the{" "}
                <b>
                  'GENERATE_SOURCEMAP' is not recognized as an internal or
                  external command, operable program or batch file.
                </b>{" "}
                error is thrown, then the user should run the frontend via the{" "}
                <b>winStart</b> command.
                <br /> <br />
                If any errors occur in running the application in either the
                frontend or backend, double check to make sure you are in the
                correct directory (/frontend) for frontend and (/backend) for
                backend.
                <br /> <br />
                If any issues occur during installation, double check that both
                node and python are included in your environment variables and
                that they can be run via the terminal from any folder.
                <br /> <br />
                <p className="text-xl">Contact</p>
                <br />
                If an undocumented question arises, feel free to contact the
                developers of this software:
                <ul>
                  <li>- Shivang Patel: sp3699@drexel.edu</li>
                  <li>- Alex Zavalny: az548@drexel.edu</li>
                  <li>- Ryen Ling: rl826@drexel.edu</li>
                  <li>- Siddarth Kampalli: sk3999@drexel.edu</li>
                </ul>
              </p>
            </div>
            <br /> <br />
            <br /> <br />
          </div>
        </div>
      </div>
    </>
  );
}
