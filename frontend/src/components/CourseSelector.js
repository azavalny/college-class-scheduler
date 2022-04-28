import React from 'react'

export default function CourseSelector({ courses, setCourses, inputStyles }) {
  return (
    <>
      <div className="m-4">
        Courses:
        <input
          type="text"
          className={inputStyles}
          value={courses}
          onChange={(e) => setCourses(e.target.value)}
        />
      </div>
    </>
  )
}
