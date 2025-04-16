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
  const handleDrop = (e, termKey) => {
    e.preventDefault();
    const courseObj = JSON.parse(e.dataTransfer.getData('course'));
    const course = courseObj.name;
    const fromBank = hoverIndex?.key === 'bank';
    const originalTermKey = hoverIndex?.key;

    let dropSucceeded = false;

    setCalendarCourses((prev) => {
      const updated = { ...prev };

      for (const key in updated) {
        updated[key] = updated[key].filter((c) => c.name !== course);
      }

      const count = (updated[termKey] || []).length;
      const already = (updated[termKey] || []).some((c) => c.name === course);

      if (!already && count < 6) {
        updated[termKey] = [...(updated[termKey] || []), courseObj];
        dropSucceeded = true;
      } else {
        setErrorMsg('Course limit of 6 reached');
        setErrorActive(true);
        setTimeout(() => {
          setErrorMsg('');
          setErrorActive(false);
        }, 3000);

        if (!fromBank && originalTermKey && originalTermKey !== termKey) {
          updated[originalTermKey] = [...(updated[originalTermKey] || []), courseObj];
        }
      }

      return updated;
    });

    setTimeout(() => {
      if (fromBank && dropSucceeded) {
        setCourses((prev) => prev.filter((c) => c.name !== course));
      } else if (!dropSucceeded && !fromBank && originalTermKey && originalTermKey !== termKey) {
        setCalendarCourses((prev) => {
          const updated = { ...prev };
          updated[originalTermKey] = [...(updated[originalTermKey] || []), courseObj];
          return updated;
        });
      } else if (fromBank && !dropSucceeded) {
        setCourses((prev) => {
          if (!prev.some((c) => c.name === course)) {
            return [...prev, courseObj];
          }
          return prev;
        });
      }
    }, 0);
  };

  return (
    <div id="sidebar" className="w-[340px] ml-auto border-l-2 border-gray-300 dark:border-gray-500 pl-6 shadow-lg h-[calc(100vh-120px)] overflow-y-auto pr-2">
      <h2 className="text-2xl font-semibold mb-4">🧱 Course Bank</h2>
      <p className="text-gray-500 dark:text-gray-400 text-base mb-2">You’ll drag from here later</p>
      <div className="flex justify-between items-center mb-3">
        <button
          onClick={() => {
            const name = prompt("Enter course name:");
            if (name) {
              setCourses((prev) => [...prev, { name, value: '0' }]);
            }
          }}
          className="text-blue-600 hover:underline"
        >
          + insert class
        </button>
        <button
          onClick={() => {
            const allCalendarCourses = Object.values(calendarCourses).flat();
            setCourses((prev) => {
              const merged = [...prev];
              allCalendarCourses.forEach((course) => {
                if (!merged.some((c) => c.name === course.name)) {
                  merged.push(course);
                }
              });
              return merged;
            });

            const clearedCalendar = {};
            for (const key in calendarCourses) {
              clearedCalendar[key] = [];
            }
            setCalendarCourses(clearedCalendar);
          }}
          className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition-all"
        >
          Reset
        </button>
      </div>
      <div className="space-y-2">
        {courses
          .filter((courseObj) => {
            const inCalendar = Object.values(calendarCourses).some((list) =>
              list.some((c) => c.name === courseObj.name)
            );
            return !inCalendar;
          })
          .map((courseObj, index) => (
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
      <div className="mt-6">
        <button
          onClick={() => setCourses([])}
          className="w-full text-center px-3 py-2 bg-gray-300 dark:bg-gray-600 text-black dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition-all"
        >
          Delete All Classes
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
