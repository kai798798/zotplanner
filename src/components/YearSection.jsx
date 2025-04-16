import React from 'react';
import CourseContainer from './CourseContainer';

const YearSection = ({
  year,
  baseYear,
  setBaseYear,
  calendarType,
  calendarCourses,
  setCalendarCourses,
  setCourses,
  draggedCourse,
  setDraggedCourse,
  hoverIndex,
  setHoverIndex,
  setErrorMsg,
  setErrorActive,
  onDrop,
  allowDrop,
}) => {
  const semesterTerms = ['Fall', 'Spring', 'Summer'];
  const quarterTerms = ['Fall', 'Winter', 'Spring', 'Summer'];
  const currentTerms = calendarType === 'Quarter' ? quarterTerms : semesterTerms;

  console.log("Rendering YearSection with terms:", currentTerms);
  console.log('📥 Received calendarCourses:', calendarCourses);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">
        {year === 1 ? (
          <>
            Year {year} -{' '}
            <input
              type="number"
              value={baseYear}
              onChange={(e) => setBaseYear(parseInt(e.target.value))}
              className="w-24 text-base px-3 py-1.5 border rounded dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
            />
          </>
        ) : (
          <>Year {year} - {baseYear + (year - 1)}</>
        )}
      </h2>
      <div className="flex gap-4">
        {currentTerms.map((term) => {
          const termKey = `${year}-${term}`;
          console.log("Render courses in", termKey, calendarCourses[termKey]);

          return (
            <div
              key={termKey}
              onDrop={(e) => {
                e.preventDefault();
                const courseObj = JSON.parse(e.dataTransfer.getData('course'));
                const course = courseObj.name;
                const fromBank = hoverIndex?.key === 'bank';

                let dropSuccess = false;

                setCalendarCourses((prev) => {
                  const updated = { ...prev };
                  for (const key in updated) {
                    updated[key] = updated[key].filter((c) => c.name !== course);
                  }

                  const count = (updated[termKey] || []).length;
                  const already = (updated[termKey] || []).some((c) => c.name === course);

                  if (!already && count < 6) {
                    updated[termKey] = [...(updated[termKey] || []), courseObj];
                    dropSuccess = true;
                  } else {
                    setErrorMsg('Course limit of 6 reached');
                    setErrorActive(true);
                    setTimeout(() => {
                      setErrorMsg('');
                      setErrorActive(false);
                    }, 3000);
                  }

                  return updated;
                });
                setTimeout(() => {
                  if (fromBank && dropSuccess) {
                    setCourses((prev) => prev.filter((c) => c.name !== course));
                  } else if (fromBank && !dropSuccess) {
                    setCourses((prev) => {
                      if (!prev.some((c) => c.name === course)) {
                        return [...prev, courseObj];
                      }
                      return prev;
                    });
                  }
                }, 0);
              }}
              onDragOver={allowDrop}
              className="bg-gray-200 dark:bg-gray-700 rounded-xl p-4 border border-gray-300 dark:border-gray-600"
              style={{ flex: 1, minWidth: calendarType === 'Quarter' ? '23%' : '16%' }}
            >
              <div className="text-center">{term}</div>
              <div className="border-b border-gray-400 my-2" />
              {Array.isArray(calendarCourses[termKey]) && calendarCourses[termKey].length > 0 ? (
                calendarCourses[termKey].map((courseObj, index) => {
                  console.log("📌 Rendering", termKey, "with", calendarCourses[termKey].length, "courses");
                  return (
                    <CourseContainer
                      key={courseObj.name + index}
                      courseObj={courseObj}
                      index={index}
                      context="calendar"
                      termKey={termKey}
                      calendarCourses={calendarCourses}
                      setCalendarCourses={setCalendarCourses}
                      courses={[]}
                      setCourses={setCourses}
                      draggedCourse={draggedCourse}
                      setDraggedCourse={setDraggedCourse}
                      hoverIndex={hoverIndex}
                      setHoverIndex={setHoverIndex}
                      setErrorMsg={setErrorMsg}
                      setErrorActive={setErrorActive}
                    />
                  );
                })
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default YearSection;