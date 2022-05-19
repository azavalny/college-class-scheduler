import React, { useState, useRef } from 'react'
import { RRule } from 'rrule'
import FullCalendar from '@fullcalendar/react'
import rrulePlugin from '@fullcalendar/rrule'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import Navbar from './Navbar'
import CourseSelector from './CourseSelector'
import { Bars } from 'react-loading-icons'

const ics = require('ics')

export default function Index() {
  const [events, setEvents] = useState([]);
  const [constraints, setConstraints] = useState({
    no_classes_during_time_interval: [80, []],
    prefer_longer_classes: [10, false],
    preferred_class_gap_interval: [10, 60],
  });
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const calendarRef = useRef(null);

  const exportEvents = () => {
    const icsFormattedEvents = events.map((event) => {
      const { title, extendedProps, rrule } = event
      rrule.dtstart = new Date(rrule.dtstart)
      rrule.until = new Date(rrule.until)
      const formatDate = (date) => [date.getFullYear(), date.getMonth()+1, date.getDate(), date.getHours(), date.getMinutes()]
      const start = formatDate(new Date(extendedProps.startTime))
      const end = formatDate(new Date(extendedProps.endTime))
      return {
        title,
        description: extendedProps.description,
        start,
        end,
        recurrenceRule: (new RRule(rrule)).toString()
      }
    })
    const { error: e, value: icsContents } = ics.createEvents(icsFormattedEvents)
    if (e) {
      console.log(e)
      return e
    }
    const blob = new Blob([icsContents], { type: 'text/calendar;charset=utf-8' });
    const filename = 'class-scheduler'
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `${filename}-${+new Date()}.ics`;
    link.click();
  }

  const handleSubmit = async () => {
    setLoading(true);
    // Convert to floats
    const parsedConstraints = JSON.parse(JSON.stringify(constraints))
    let total = 0
    Object.keys(parsedConstraints).forEach((key) => {
      parsedConstraints[key][0] = parseFloat(parsedConstraints[key][0]) / 100
      if (Number.isNaN(parsedConstraints[key][0])) {
        setLoading(false);
        alert(`Please enter a valid number for ${key}`) // eslint-disable-line no-alert
        return
      }
      if (parsedConstraints[key][0] < 0) {
        setLoading(false);
        alert(`Please enter a positive number for ${key}`) // eslint-disable-line no-alert
        return
      }
      total += parsedConstraints[key][0]
    })
    if (total !== 1) {
      setLoading(false);
      // eslint-disable-next-line
      window.alert('Constraints must add up to 100%')
      return
    }
    parsedConstraints.no_classes_during_time_interval[1] = events.filter((event) => event.title === 'Busy').map((a) => [a.start, a.end])
    // Validate preferred_class_gap_interval
    if (parsedConstraints.preferred_class_gap_interval[1] > inputs[2].max || parsedConstraints.preferred_class_gap_interval[1] < inputs[2].min) {
      setLoading(false);
      // eslint-disable-next-line
      window.alert('Preferred class gap interval must be between ' + inputs[2].min + ' and ' + inputs[2].max)
      return
    }
    // Parse courses
    const formattedCourses = courses.map((course) => (course.name.split(":")[0])).join(",")
    // Validate at least 1 course
    if (formattedCourses === '') {
      setLoading(false);
      // eslint-disable-next-line
      window.alert('Please select at least 1 course')
      return
    }

    const userData = {
      courses: formattedCourses.split(','),
      constraints: parsedConstraints,
    }

    // const rruleDays = {
    //   Su: 'su',
    //   M: 'mo',
    //   T: 'tu',
    //   W: 'we',
    //   R: 'th',
    //   F: 'fr',
    //   S: 'sa',
    // }

    const rruleDays = {
      Su: RRule.SU,
      M:  RRule.MO,
      T:  RRule.TU,
      W:  RRule.WE,
      R:  RRule.TH,
      F:  RRule.FR,
      S:  RRule.SA,
    }

    const formatDate = (date) => `${date.getFullYear()}-${(`0${date.getMonth() + 1}`).slice(-2)}-${(`0${date.getDate()}`).slice(-2)}`

    try {
      const response = await fetch('http://localhost:5000/api/schedule', {
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
          editable: false,
          extendedProps: {
            description: `Instruction Type: ${course.instruction_type}\nInstruction Method: ${course.instruction_method}\nCRN: ${course.crn}\nInstructor: ${course.instructor}`,
            startTime: `${formatDate(course.start_date)}T${course.start_time}`,
            endTime: `${formatDate(course.start_date)}T${course.end_time}`,
          },
          backgroundColor: '#FBBC04',
          duration,
          rrule: {
            freq: RRule.WEEKLY,
            interval: 1,
            byweekday: course.days.match(/([A-Z]?[^A-Z]*)/g).slice(0, -1).map((day) => rruleDays[day]),
            dtstart: `${formatDate(course.start_date)}T${course.start_time}`,
            until: formatDate(course.end_date),
          },
        }
      })
      setEvents(events);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  }

  const handleEventClick = (info) => {
    if (info.event.extendedProps.description) {
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
    if (key !== 'prefer_longer_classes') e.preventDefault();
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

  const inputs = [
    {
      key: 'no_classes_during_time_interval',
      label: 'No classes during time interval',
      min: 0,
      max: 100,
      step: 1,
      weightValue: constraints.no_classes_during_time_interval[0],
      weightOnChange: (e) => handleChange(e, 'no_classes_during_time_interval', 0, e.target.value),
    },
    {
      key: 'prefer_longer_classes',
      label: 'Prefer longer classes',
      type: 'checkbox',
      weightValue: constraints.prefer_longer_classes[0],
      weightOnChange: (e) => handleChange(e, 'prefer_longer_classes', 0, e.target.value),
      inputLabel: 'Enabled?',
      inputValue: constraints.prefer_longer_classes[1],
      inputOnChange: (e) => handleChange(e, 'prefer_longer_classes', 1, e.target.checked),
    },
    {
      key: 'preferred_class_gap_interval',
      label: 'Preferred class gap interval',
      type: 'number',
      min: 0,
      max: 180,
      step: 1,
      weightValue: constraints.preferred_class_gap_interval[0],
      weightOnChange: (e) => handleChange(e, 'preferred_class_gap_interval', 0, e.target.value),
      inputValue: constraints.preferred_class_gap_interval[1],
      inputOnChange: (e) => handleChange(e, 'preferred_class_gap_interval', 1, e.target.value),
    },
  ]

  return (
    <>
      <div>
        <Navbar />
        {loading && (
          <div className="my-2">
              <Bars fill="#06bcee" className="mx-auto" />
            <p className="p-2 text-xl">Loading...</p>
          </div>
        )}
        {!loading && (
        <div className="container mx-auto mt-4">
          <span className="text-2xl">
            Preferences
          </span>
          <div> {/* Inputs Container */}
            <CourseSelector courses={courses} setCourses={setCourses} />
            <table className="table-auto border-solid mx-auto">
              <thead>
                <tr>
                  <th>Constraint</th>
                  <th>Weight</th>
                </tr>
              </thead>
              <tbody>
                {inputs.map((input, i) => (
                  <tr key={i}>
                    <td>{input.label}</td>
                    <td>
                      <input
                        type="number"
                        className={inputStyles}
                        value={input.weightValue}
                        onChange={input.weightOnChange}
                      />%
                    </td>
                    <td>
                      {input.type === 'checkbox' && (
                        <>
                          <input
                            type="checkbox"
                            checked={input.inputValue}
                            onChange={input.inputOnChange}
                          /> Enabled?
                        </>
                      )}
                      {input.type === 'number' && (
                        <>
                          <input
                            type="number"
                            className={inputStyles}
                            min={input.min}
                            max={input.max}
                            step={input.step}
                            value={input.inputValue}
                            onChange={input.inputOnChange}
                          /> Minutes
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={handleSubmit} className="shadow bg-gray-500 hover:bg-gray-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 m-2 rounded" type="button">
              Submit
            </button>
            <button onClick={exportEvents} className="shadow bg-gray-500 hover:bg-gray-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 m-2 rounded" type="button">
              Export as ICS File
            </button>
          </div>
          <div className="p-8">
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
              initialDate={new Date('2021-10-01')}
            />
          </div>
        </div>
        )}
      </div>
    </>
  );
}
