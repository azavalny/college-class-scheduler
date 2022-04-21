import React, { useState } from 'react'
import FullCalendar from '@fullcalendar/react' // must go before plugins
import rrulePlugin from '@fullcalendar/rrule'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction' // needed for dayClick
// import moment from 'moment'
import Navbar from './Navbar'

// TODO - in order of importance
// - fix backend to return parsed data
// - make sure request does not timeout
// - add fuzzy finding for courses
// - fix css

export default function Index() {
  const [events, setEvents] = useState([]);
  const [constraints, setConstraints] = useState({
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
      window.alert('Constraints must add up to 100%')
      // return
    }
    parsedConstraints.preferred_class_gap_interval[1] *= 60
    parsedConstraints.no_classes_during_time_interval[1] = events.filter((event) => event.title === 'Busy').map((event) => [event.start, event.end])
    console.log(parsedConstraints)

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
      // body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.schedule);
        const events = data.schedule.map((course) => ({
          title: `${course.subject} ${course.course_number}-${course.section_number}`,
          start: course.start, // '2022-04-16T12:30:00',
          end: course.end, // '2022-04-16T13:30:00',
          allDay: false, // will make the time show
          extendedProps: {
            // TODO: Format description better
            description: `${course.subject} ${course.course_number}-${course.section_number} ${course.instructor} ${course.location} ${course.start_time}-${course.end_time}`,
          },
          rrule: {
            freq: 'weekly',
            interval: 1,
            byweekday: ['mo', 'sa'], // TODO: read course.days and populate here
            dtstart: '2022-04-16T12:30:00', // TODO
            until: '2022-06-01',
          },
        }))
        // const events = [
        //   {
        //     title: 'Event 3',
        //     start: '2022-04-16T12:30:00',
        //     end: '2022-04-16T13:30:00',
        //     allDay: false, // will make the time show
        //     extendedProps: {
        //       description: 'Test',
        //     },
        //     rrule: {
        //       freq: 'weekly',
        //       interval: 1,
        //       byweekday: ['mo', 'sa'],
        //       dtstart: '2022-04-16T12:30:00',
        //       until: '2022-06-01',
        //     },
        //   },
        // ]
        setEvents(events);
      });
  }

  const handleEventClick = (info) => {
    console.log(info.event.start instanceof Date);
    if (info.event.extendedProps.description) {
      console.log('Part of schedule')
      return
    }
    // TODO: show popup menu to allow deleting "Busy" event
    if (info.event.title === 'Busy') {
      // eslint-disable-next-line
      const result = window.prompt('Delete this event?', 'yes')
      if (result === 'yes') info.event.remove()
    }
  }

  const renderEventContent = (eventInfo) => {
    // console.log(eventInfo)
    const { event } = eventInfo
    return (
      <>
        <b>{eventInfo.timeText}</b>
        <i> {eventInfo.event.title}</i>
      </>
    )
  }

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
        // backgroundColor: '#808080',
      },
    ]);
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
            events={events}
            select={handleSelect}
            eventColor="#808080"
          />
        </div>
      </div>
    </>
  );
}
