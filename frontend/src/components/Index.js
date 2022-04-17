import React, { useState } from 'react'
import FullCalendar from '@fullcalendar/react' // must go before plugins
import rrulePlugin from '@fullcalendar/rrule'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction' // needed for dayClick
// import moment from 'moment'
import Navbar from './Navbar'

// TODO - in order of importance
// - fix backend to return parsed dates
// - add no classes during time interval date picker
// - parse backend response into calendar events
// - make sure request does not timeout
// - add multiple boxes for courses
// - add fuzzy finding for courses
// - fix css

export default function Index() {
  const [schedule, setSchedule] = useState([]);
  const [constraints, setConstraints] = useState({
    // TODO:
    no_classes_during_time_interval: [0, []],
    prefer_longer_classes: [0, false],
    preferred_class_gap_interval: [0, 1 * 60],
  });
  const [courses, setCourses] = useState('CS 171,CI 102,CS 164,ENGL 103,MATH 123');

  const handleSubmit = () => {
    // Convert to floats
    const parsedConstraints = constraints
    let total = 0
    Object.keys(parsedConstraints).forEach((key) => {
      parsedConstraints[key][0] = parseFloat(parsedConstraints[key][0]) / 100
      total += parsedConstraints[key][0]
    })
    if (total !== 1) {
      // eslint-disable-next-line
      alert('Constraints must add up to 100%')
      return
    }
    parsedConstraints.preferred_class_gap_interval[1] *= 60

    // const courses = ['CS 171', 'CI 102', 'CS 164', 'ENGL 103', 'MATH 123']
    // const constraints = {
    //   // constraint_name : [weight, data],
    //   // no_classes_during_time_interval: [0.8, [[busy1, busy2], [busy3, busy4]]],
    //   prefer_longer_classes: [0.1, true],
    //   preferred_class_gap_interval: [0.1, 1 * 60],
    // }
    const data = {
      courses: courses.split(','),
      constraints: parsedConstraints,
    }

    fetch('http://localhost:5000/api/get-schedule', {
      mode: 'cors',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.schedule);
        const events = [
          {
            title: 'Event 3',
            start: '2022-04-16T12:30:00',
            end: '2022-04-16T13:30:00',
            allDay: false, // will make the time show
            extendedProps: {
              description: 'Test',
            },
            rrule: {
              freq: 'weekly',
              interval: 1,
              byweekday: ['mo', 'sa'],
              dtstart: '2022-04-16T12:30:00',
              until: '2022-06-01',
            },
          },
        ]
        setSchedule(events);
      });
  }

  const handleEventClick = (info) => {
    console.log(info.event.title);
    console.log(info.event.extendedProps.description);
  }

  const renderEventContent = (eventInfo) => (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  )

  const handleChange = (e, key, index, value) => {
    e.preventDefault();
    setConstraints({
      ...constraints,
      [key]: [
        ...constraints[key].slice(0, index),
        value,
        ...constraints[key].slice(index + 1),
      ],
    });
    console.log({
      ...constraints,
      [key]: [
        ...constraints[key].slice(0, index),
        value,
        ...constraints[key].slice(index + 1),
      ],
    });
  }

  return (
    <>
      <div className="">
        <Navbar />
        <div className="container mx-auto">
          <label>
            Courses
            <input
              type="text"
              value={courses}
              onChange={(e) => setCourses(e.target.value)}
            />
          </label>
          <label>
            Prefer Longer Classes?
            <input
              type="number"
              step="1"
              min="0"
              max="100"
              value={constraints.prefer_longer_classes[0]}
              onChange={(e) => handleChange(e, 'prefer_longer_classes', 0, e.target.value)}
            />
            <input
              type="checkbox"
              defaultChecked={constraints.prefer_longer_classes[1]}
              onChange={(e) => handleChange(e, 'prefer_longer_classes', 1, e.target.checked)}
            />
          </label>
          <label>
            Preferred Class Gap Interval
            <input
              type="number"
              step="1"
              min="0"
              max="100"
              value={constraints.preferred_class_gap_interval[0]}
              onChange={(e) => handleChange(e, 'preferred_class_gap_interval', 0, e.target.value)}
            />
            <input
              type="number"
              step="0.5"
              min="0"
              max="5"
              value={constraints.preferred_class_gap_interval[1]}
              onChange={(e) => handleChange(e, 'preferred_class_gap_interval', 1, e.target.value)}
            />
          </label>
          <button onClick={handleSubmit}>Submit</button>
          <br />
          <br />
          <br />
          <br />
          <FullCalendar
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
            events={schedule}
          />
        </div>
      </div>
    </>
  );
}
