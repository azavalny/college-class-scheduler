import React from 'react'

export default function CourseSelector({ courses, setCourses, inputStyles }) {
  return (
    <>
      <div className="p-4">
      </div>
      <div className="">
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
