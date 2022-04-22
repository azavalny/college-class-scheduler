import React, { useState, useRef } from 'react'
import FullCalendar from '@fullcalendar/react' // must go before plugins
import rrulePlugin from '@fullcalendar/rrule'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
// import moment from 'moment'
import Navbar from './Navbar'

// TODO - in order of importance
// - make sure request does not timeout
// - add fuzzy finding for courses
// - input validation and error messages
// - fix css

export default function Index() {
  const [events, setEvents] = useState([]);
  const [constraints, setConstraints] = useState({
    no_classes_during_time_interval: [80, []],
    prefer_longer_classes: [10, false],
    preferred_class_gap_interval: [10, 60],
  });
  const [courses, setCourses] = useState('CS 171,CI 102,CS 164,ENGL 103,MATH 123');
  const calendarRef = useRef(null);

  const handleSubmit = async () => {
    // Convert to floats
    const parsedConstraints = JSON.parse(JSON.stringify(constraints))
    let total = 0
    Object.keys(parsedConstraints).forEach((key) => {
      parsedConstraints[key][0] = parseFloat(parsedConstraints[key][0]) / 100
      total += parsedConstraints[key][0]
    })
    if (total !== 1) {
      // eslint-disable-next-line
      window.alert('Constraints must add up to 100%')
      return
    }
    parsedConstraints.no_classes_during_time_interval[1] = events.filter((event) => event.title === 'Busy').map((a) => [a.start, a.end])

    const userData = {
      courses: courses.split(','),
      constraints: parsedConstraints,
    }

    const rruleDays = {
      Su: 'su',
      M: 'mo',
      T: 'tu',
      W: 'we',
      Th: 'th',
      F: 'fr',
      S: 'sa',
    }

    const formatDate = (MyDate) => `${MyDate.getFullYear()}-${(`0${MyDate.getMonth() + 1}`).slice(-2)}-${(`0${MyDate.getDate()}`).slice(-2)}`

    try {
      const response = await fetch('http://localhost:5000/api/get-schedule', {
        mode: 'cors',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })
      const data = await response.json()
      const events = data.schedule.map((course) => {
        course.start_date = new Date(course.start_date)
        course.end_date = new Date(course.end_date)
        const start = new Date(`2022-04-01T${course.start_time}`)
        const end = new Date(`2022-04-01T${course.end_time}`)
        const duration = (end.getTime() - start.getTime()) || 0
        return {
        title: `${course.subject} ${course.course_number}-${course.section} ${course.course_title}`,
        start: course.start_date, // '2022-04-16T12:30:00',
        end: course.end_date, // '2022-04-16T13:30:00',
        allDay: false, // will make the time show
        extendedProps: {
          description: `Instruction Type: ${course.instruction_type}\nInstruction Method: ${course.instruction_method}\nCRN: ${course.crn}\nInstructor: ${course.instructor}`,
        },
        backgroundColor: '#FBBC04',
        duration,
        rrule: {
          freq: 'weekly',
          interval: 1,
          byweekday: course.days.match(/([A-Z]?[^A-Z]*)/g).slice(0, -1).map((day) => rruleDays[day]),
          dtstart: `${formatDate(course.start_date)}T${course.start_time}`,
          until: formatDate(course.end_date),
        },
      }})
      setEvents(events);
      let calendarApi = calendarRef.current.getApi()
      // calendarApi.gotoDate(data.schedule[0].start_date) // TODO
    } catch (error) {
      console.log(error);
    }
  }

  const handleEventClick = (info) => {
    if (info.event.extendedProps.description) {
      console.log('Part of schedule')
      return
    }
    if (info.event.title === 'Busy') {
      // eslint-disable-next-line
      const result = window.prompt('Delete this event?', 'yes')
      if (result === 'yes') info.event.remove()
    }
  }

  const renderEventContent = (eventInfo) => {
    const { timeText, event } = eventInfo
    return (
      <>
        <b>{timeText}</b>
        <i> {event.title}</i>
      </>
    )
  }

  const handleChange = (e, key, index, value) => {
    e.preventDefault();
    if (index === 0) value = parseInt(value, 10)
    setConstraints({
      ...constraints,
      [key]: [
        ...constraints[key].slice(0, index),
        value,
        ...constraints[key].slice(index + 1),
      ],
    });
  }

  const handleSelect = (info) => {
    const { start, end } = info;
    setEvents([
      ...events,
      {
        id: Date.now().toString(),
        title: 'Busy',
        start,
        end,
        allDay: false,
      },
    ]);
  }

  const inputStyles = 'bg-gray-200 appearance-none border-2 border-gray-200 rounded py-2 px-4 m-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'

  return (
    <>
      <div className="">
        <Navbar />
        <div className="container mx-auto mt-4">
          <span className="text-2xl">
            Preferences
          </span>
          <div className="w-auto lg:w-6/12">
            <div className="md:flex md:items-center mt-4">
              <div className="md:w-1/3">
                <label> Courses </label>
              </div>
              <div className="md:w-2/3">
                <input
                  type="text"
                  className={inputStyles}
                  value={courses}
                  onChange={(e) => setCourses(e.target.value)}
                />
              </div>
            </div>
            <hr />
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label> No Classes During Time Interval </label>
              </div>
              <div className="md:w-2/3 ">
                Weight: <input
                  type="number"
                  step="1"
                  min="0"
                  max="100"
                  value={constraints.no_classes_during_time_interval[0]}
                  onChange={(e) => handleChange(e, 'no_classes_during_time_interval', 0, e.target.value)}
                  className={inputStyles}
                />%
                <br />
              </div>
              <hr />
              <div className="md:w-1/3">
                <label> Prefer Longer Classes </label>
              </div>
              <div className="md:w-2/3 ">
                Weight: <input
                  type="number"
                  step="1"
                  min="0"
                  max="100"
                  value={constraints.prefer_longer_classes[0]}
                  onChange={(e) => handleChange(e, 'prefer_longer_classes', 0, e.target.value)}
                  className={inputStyles}
                />%
                <br />
                <input
                  type="checkbox"
                  defaultChecked={constraints.prefer_longer_classes[1]}
                  onChange={(e) => handleChange(e, 'prefer_longer_classes', 1, !constraints.prefer_longer_classes[1])}
                  className="mr-2"
                /> Enabled?
              </div>
            </div>
            <hr />
            <div className="md:flex md:items-center">
              <div className="md:w-1/3">
                <label> Preferred Class Gap Interval </label>
              </div>
              <div className="md:w-2/3 ">
                Weight: <input
                  type="number"
                  step="1"
                  min="0"
                  max="100"
                  value={constraints.preferred_class_gap_interval[0]}
                  onChange={(e) => handleChange(e, 'preferred_class_gap_interval', 0, e.target.value)}
                  className={inputStyles}
                />%
                <br />
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="5"
                  value={constraints.preferred_class_gap_interval[1]}
                  onChange={(e) => handleChange(e, 'preferred_class_gap_interval', 1, e.target.value)}
                  className={inputStyles}
                /> Minutes
              </div>
            </div>
            <hr />
            <div className="md:flex md:items-center my-10">
              <div className="md:w-1/3" />
              <div className="md:w-2/3">
                <button onClick={handleSubmit} className="shadow bg-gray-500 hover:bg-gray-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="button">
                  Submit
                </button>
              </div>
            </div>
          </div>
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, rrulePlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay',
            }}
            editable
            droppable
            selectable
            selectMirror
            eventContent={renderEventContent}
            eventClick={handleEventClick}
            events={events}
            select={handleSelect}
            eventColor="#808080"
            scrollTime="06:00:00"
            initialDate={new Date("2021-10-01")}
          />
        </div>
      </div>
    </>
  );
}
