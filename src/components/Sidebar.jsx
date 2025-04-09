import React from 'react';
import CourseContainer from './CourseContainer';

const Sidebar = ({
  courses,
  calendarCourses,
  setCalendarCourses,
  setCourses,
  draggedCourse,
  setDraggedCourse,
  hoverIndex,
  setHoverIndex,
  setErrorMsg,
  setErrorActive
}) => {
  return (
    <div className="w-[340px] ml-auto border-l-2 border-gray-300 dark:border-gray-500 pl-6 shadow-lg h-[calc(100vh-120px)] overflow-y-auto pr-2">
      <h2 className="text-2xl font-semibold mb-4">🧱 Course Bank</h2>
      <p className="text-gray-500 dark:text-gray-400 text-base mb-2">You’ll drag from here later</p>
      <button
        onClick={() => {
          const name = prompt("Enter course name:");
          if (name) {
            setCourses((prev) => [...prev, { name, value: '0' }]);
          }
        }}
        className="mb-3 text-left text-blue-600 hover:underline"
      >
        + insert class
      </button>
      <div className="space-y-2">
        {courses.map((courseObj, index) => (
          <div key={courseObj.name + index}>
            {hoverIndex?.key === 'bank' && hoverIndex?.index === index && (
              <div className="h-1 bg-blue-500 rounded-sm mb-1" />
            )}
            <CourseContainer
              courseObj={courseObj}
              index={index}
              context="bank"
              termKey={null}
              calendarCourses={calendarCourses}
              setCalendarCourses={setCalendarCourses}
              courses={courses}
              setCourses={setCourses}
              draggedCourse={draggedCourse}
              setDraggedCourse={setDraggedCourse}
              hoverIndex={hoverIndex}
              setHoverIndex={setHoverIndex}
              setErrorMsg={setErrorMsg}
              setErrorActive={setErrorActive}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
