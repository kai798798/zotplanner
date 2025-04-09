import React from 'react';

const CourseContainer = ({
  courseObj,
  index,
  context,
  termKey,
  calendarCourses,
  setCalendarCourses,
  courses,
  setCourses,
  draggedCourse,
  setDraggedCourse,
  hoverIndex,
  setHoverIndex,
  setErrorMsg,
  setErrorActive
}) => {
  const handleDragStart = (e) => {
    setDraggedCourse(courseObj);
    e.dataTransfer.setData('course', JSON.stringify(courseObj));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (!draggedCourse) return;

    if (context === 'calendar' && termKey) {
      const currentList = calendarCourses[termKey] || [];
      const filtered = currentList.filter((c) => c.name !== draggedCourse.name);
      filtered.splice(index, 0, draggedCourse);
      setCalendarCourses((prev) => ({ ...prev, [termKey]: filtered }));
      setCourses((prev) => prev.filter((c) => c.name !== draggedCourse.name));
    } else if (context === 'bank') {
      const filtered = courses.filter((c) => c.name !== draggedCourse.name);
      filtered.splice(index, 0, draggedCourse);
      setCourses(filtered);
      setCalendarCourses((prev) => {
        const updated = { ...prev };
        for (const key in updated) {
          updated[key] = updated[key].filter((c) => c.name !== draggedCourse.name);
        }
        return updated;
      });
    }

    setDraggedCourse(null);
    setHoverIndex(null);
  };

  const handleDoubleClick = () => {
    if (context === 'calendar' && termKey) {
      setCalendarCourses((prev) => ({
        ...prev,
        [termKey]: prev[termKey].filter((c) => c.name !== courseObj.name),
      }));
      setCourses((prev) => [...prev, courseObj]);
    } else if (context === 'bank') {
      setCourses((prev) => prev.filter((c) => c.name !== courseObj.name));
    }
  };

  return (
    <div
      className="flex justify-between items-center px-3 py-2 bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg shadow hover:bg-gray-300 dark:hover:bg-gray-500 transition-all"
      draggable
      onDragStart={handleDragStart}
      onDragOver={(e) => {
        e.preventDefault();
        setHoverIndex({ key: context === 'calendar' ? termKey : 'bank', index });
      }}
      onDrop={handleDrop}
      onDragLeave={() => setHoverIndex(null)}
      onDoubleClick={handleDoubleClick}
    >
      <span className="text-sm font-medium truncate">{courseObj.name}</span>

      <select
        value={courseObj.tag || ''}
        onChange={(e) => {
          const tag = e.target.value;
          if (context === 'calendar') {
            setCalendarCourses((prev) => {
              const updated = { ...prev };
              updated[termKey] = updated[termKey].map((c) =>
                c.name === courseObj.name ? { ...c, tag } : c
              );
              return updated;
            });
          } else {
            setCourses((prev) =>
              prev.map((c) => (c.name === courseObj.name ? { ...c, tag } : c))
            );
          }
        }}
        className={`ml-auto mr-2 px-2 py-1 rounded-md border border-gray-300 dark:border-gray-400 text-xs
          ${courseObj.tag === 'Major' ? 'bg-blue-100 text-blue-800' : ''}
          ${courseObj.tag === 'Minor' ? 'bg-green-100 text-green-800' : ''}
          ${courseObj.tag === 'Elec' ? 'bg-yellow-100 text-yellow-800' : ''}
          ${courseObj.tag === 'GE' ? 'bg-purple-100 text-purple-800' : ''}
          ${!courseObj.tag ? 'bg-white dark:bg-gray-700 text-black dark:text-white' : ''}
        `}
      >
        <option value="">--</option>
        <option value="GE">GE</option>
        <option value="Major">Major</option>
        <option value="Minor">Minor</option>
        <option value="Elec">Elec</option>
      </select>

      <input
        type="text"
        value={courseObj.value}
        onChange={(e) => {
          const value = e.target.value;
          if (context === 'calendar') {
            setCalendarCourses((prev) => {
              const updated = { ...prev };
              updated[termKey] = updated[termKey].map((c) =>
                c.name === courseObj.name ? { ...c, value } : c
              );
              return updated;
            });
          } else {
            setCourses((prev) =>
              prev.map((c) => (c.name === courseObj.name ? { ...c, value } : c))
            );
          }
        }}
        className="w-10 text-xs px-1 py-0.5 rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-400 text-center"
      />
    </div>
  );
};

export default CourseContainer;
