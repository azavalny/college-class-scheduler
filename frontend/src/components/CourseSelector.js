import React, { useState, useRef, useCallback } from 'react'
import ReactTags from 'react-tag-autocomplete'

async function getAllCourseTitlesFromAPI() {
  const response = await fetch('http://localhost:5000/api/get-all-courses', {
    mode: 'cors',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const allCourseTitles = await response.json();
  const courseTitles = []
  for (let i = 0; i < allCourseTitles.length; i += 1) {
    courseTitles.push(allCourseTitles[i][0].concat(' ', allCourseTitles[i][1]));
  }
  // ['CI 103', 'CS 172',...].map((name, id) => ({ id, name }))
  return [courseTitles.sort().map((name, id) => ({ id, name }))];
}
export default function CourseSelector() {
  const [tags, setTags] = useState([])

  const suggestions = getAllCourseTitlesFromAPI();
  console.log(suggestions);
  console.log(suggestions[0]);
  /*
  useState([
    { id: 1, name: 'CI 101' },
    { id: 2, name: 'MATH 122' },
    { id: 3, name: 'CS 172' },
    { id: 4, name: 'ENGL 101' },
    { id: 5, name: 'UNIV 101' },
    { id: 6, name: 'HONORS 200' },
    { id: 7, name: 'CS 265' }]);
*/
  // console.log(suggestions)
  /*
    [{ id: 1, name: 'CI 101' },
    { id: 2, name: 'MATH 122' },
    { id: 3, name: 'CS 172' },
    { id: 4, name: 'ENGL 101' },
    { id: 5, name: 'UNIV 101' },
    { id: 6, name: 'HONORS 200' },]
  */

  const reactTags = useRef()

  const onDelete = useCallback((tagIndex) => {
    setTags(tags.filter((_, i) => i !== tagIndex))
  }, [tags])

  const onAddition = useCallback((newTag) => {
    setTags([...tags, newTag])
  }, [tags])

  // ReactTags component https://www.npmjs.com/package/react-tag-autocomplete
  return (
    <>
      <div className="container mx-auto mt-5">
        <span className="text-xl">Enter Your Courses:</span>
        <ReactTags
          ref={reactTags}
          tags={tags}
          suggestions={suggestions}
          noSuggestionsText="No matching courses"
          onDelete={onDelete}
          onAddition={onAddition}
          placeholderText="Enter an Abbreviated Course Name"
        />
      </div>
    </>
  )
}
