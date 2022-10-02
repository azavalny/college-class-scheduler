// eslint-disable-next-line object-curly-newline
import React, { useState, useRef, useCallback, useEffect } from 'react'
import ReactTags from 'react-tag-autocomplete'

export default function CourseSelector({ courses: tags, setCourses: setTags }) {
  // const [tags, setTags] = useState([])
  const [courseTitles, setCourseTitles] = useState([])

  const getCourseTitles = async () => {
    const response = await fetch('http://localhost:5000/api/courses', {
      mode: 'cors',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const allCourseTitles = await response.json();
    const courseTitles = allCourseTitles.map((courseTitle, i) => ({
      id: i,
      name: `${allCourseTitles[i][0]} ${allCourseTitles[i][1]}: ${allCourseTitles[i][2]}`,
    }))
    return courseTitles
  }

  useEffect(() => {
    (async () => {
      const data = await getCourseTitles()
      setCourseTitles(data)
    })()
  }, [])

  const reactTags = useRef()

  const onDelete = useCallback((tagIndex) => {
    setTags(tags.filter((_, i) => i !== tagIndex))
  }, [tags])

  const onAddition = useCallback((newTag) => {
    setTags([...tags, newTag])
  }, [tags])

  return (
    <>
      <div className="container mx-auto mt-5">
        <ReactTags
          ref={reactTags}
          tags={tags}
          suggestions={courseTitles}
          noSuggestionsText="No matching courses"
          onDelete={onDelete}
          onAddition={onAddition}
          placeholderText="Enter abbreviated name"
        />
      </div>
    </>
  )
}
