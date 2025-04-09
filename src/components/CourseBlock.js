import React from 'react';

const CourseBlock = ({
  courseObj,
  termKey,
  calendarCourses,
  setCalendarCourses,
  courses,
  setCourses,
  draggedCourse,
  setDraggedCourse,
  index,
  hoverIndex,
  setHoverIndex,
  setErrorMsg,
  setErrorActive,
  context,
}) => {
  const isCalendar = context === 'calendar';

  const handleDrop = () => {
    if (!draggedCourse) return;

    if (isCalendar) {
      const list = calendarCourses[termKey] || [];
      const alreadyIn = list.some((c) => c.name === draggedCourse.name);
      if (!alreadyIn && list.length >= 6) {
        setErrorMsg('Course limit of 6 reached');
        setErrorActive(true);
        setTimeout(() => {
          setErrorMsg('');
          setErrorActive(false);
        }, 3000);
        return;
      }

      const filtered = list.filter((c) => c.name !== draggedCourse.name);
      filtered.splice(index, 0, draggedCourse);
      setCalendarCourses({ ...calendarCourses, [termKey]: filtered });
      setCourses(courses.filter((c) => c.name !== draggedCourse.name));
    } else {
      const filtered = courses.filter((c) => c.name !== draggedCourse.name);
      filtered.splice(index, 0, draggedCourse);
      setCourses(filtered);
      const updated = { ...calendarCourses };
      for (const key in updated) {
        updated[key] = updated[key].filter((c) => c.name !== draggedCourse.name);
      }
      setCalendarCourses(updated);
    }

    setDraggedCourse(null);
    setHoverIndex(null);
  };

  return (
    <div
      className="flex justify-between items-center px-3 py-2 bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg shadow hover:bg-gray-300 dark:hover:bg-gray-500 transition-all"
      draggable
      onDragStart={(e) => {
        setDraggedCourse(courseObj);
        e.dataTransfer.setData('course', JSON.stringify(courseObj));
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setHoverIndex({ key: context === 'bank' ? 'bank' : termKey, index });
      }}
      onDrop={(e) => {
        e.preventDefault();
        handleDrop();
      }}
      onDragLeave={() => setHoverIndex(null)}
      onDoubleClick={() => {
        if (isCalendar) {
          setCalendarCourses({
            ...calendarCourses,
            [termKey]: calendarCourses[termKey].filter((c) => c.name !== courseObj.name),
          });
          setCourses([...courses, courseObj]);
        } else {
          setCourses(courses.filter((c) => c.name !== courseObj.name));
        }
      }}
    >
      <div className="flex items-center justify-between w-full gap-2">
        <span className="w-1/3 truncate">{courseObj.name}</span>
        <select
          value={courseObj.type || ''}
          onChange={(e) => {
            const newType = e.target.value;
            const updater = (list) =>
              list.map((c) =>
                c.name === courseObj.name ? { ...c, type: newType } : c
              );

            if (isCalendar) {
              setCalendarCourses({
                ...calendarCourses,
                [termKey]: updater(calendarCourses[termKey]),
              });
            } else {
              setCourses(updater(courses));
            }
          }}
          className={`w-1/3 text-xs px-1 py-0.5 rounded border border-gray-300 dark:border-gray-400 focus:outline-none text-center ${
            courseObj.type === 'GE'
              ? 'bg-blue-200'
              : courseObj.type === 'Major'
              ? 'bg-green-200'
              : courseObj.type === 'Minor'
              ? 'bg-yellow-200'
              : courseObj.type === 'Elec'
              ? 'bg-purple-200'
              : 'bg-white dark:bg-gray-700'
          }`}
        >
          <option value=""> </option>
          <option value="GE">GE</option>
          <option value="Major">Major</option>
          <option value="Minor">Minor</option>
          <option value="Elec">Elec</option>
        </select>
        <input
          type="text"
          value={courseObj.value}
          onChange={(e) => {
            const val = e.target.value;
            const updater = (list) =>
              list.map((c) =>
                c.name === courseObj.name ? { ...c, value: val } : c
              );

            if (isCalendar) {
              setCalendarCourses({
                ...calendarCourses,
                [termKey]: updater(calendarCourses[termKey]),
              });
            } else {
              setCourses(updater(courses));
            }
          }}
          className="w-8 text-xs px-1 py-0.5 rounded bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-400 text-center"
        />
      </div>
    </div>
  );
};

export default CourseBlock;