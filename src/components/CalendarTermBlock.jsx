import React from 'react';

const CalendarTermBlock = ({
  term,
  termKey,
  calendarCourses,
  setCalendarCourses,
  draggedCourse,
  setDraggedCourse,
  hoverIndex,
  setHoverIndex,
  setCourses,
  setErrorMsg,
  setErrorActive
}) => {
  const currentList = calendarCourses[termKey] || [];

  const onDrop = (e, index = currentList.length) => {
    e.preventDefault();
    if (!draggedCourse) return;

    const isAlreadyIn = currentList.some((c) => c.name === draggedCourse.name);
    const isAtLimit = currentList.length >= 6;

    if (!isAlreadyIn && isAtLimit) {
      setErrorMsg('Course limit of 6 reached');
      setErrorActive(true);
      setTimeout(() => {
        setErrorMsg('');
        setErrorActive(false);
      }, 3000);
      return;
    }

    setCalendarCourses((prev) => {
      const updated = { ...prev };
      const filtered = currentList.filter((c) => c.name !== draggedCourse.name);
      filtered.splice(index, 0, draggedCourse);
      updated[termKey] = filtered;
      return updated;
    });

    setCourses((prev) => prev.filter((c) => c.name !== draggedCourse.name));
    setDraggedCourse(null);
    setHoverIndex(null);
  };

  return (
    <div
      onDrop={(e) => onDrop(e)}
      onDragOver={(e) => e.preventDefault()}
      className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl shadow p-4 h-66 relative transition-all"
    >
      <div className="text-center text-base font-semibold text-gray-600 dark:text-gray-300 border-b border-gray-300 dark:border-gray-600 pb-1 mb-2">
        {term}
      </div>
      <div className="space-y-1">
        {currentList.map((courseObj, index) => (
          <div key={courseObj.name + index}>
            {hoverIndex?.key === termKey && hoverIndex?.index === index && (
              <div className="h-1 bg-blue-500 rounded-sm mb-1" />
            )}
            <div
              className="flex justify-between items-center px-2 py-1 bg-gray-100 dark:bg-gray-500 text-sm text-gray-900 dark:text-white rounded"
              draggable
              onDragStart={(e) => {
                setDraggedCourse(courseObj);
                e.dataTransfer.setData('course', JSON.stringify(courseObj));
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setHoverIndex({ key: termKey, index });
              }}
              onDrop={(e) => onDrop(e, index)}
              onDragLeave={() => setHoverIndex(null)}
              onDoubleClick={() => {
                setCalendarCourses((prev) => ({
                  ...prev,
                  [termKey]: prev[termKey].filter((c) => c.name !== courseObj.name),
                }));
                setCourses((prev) => [...prev, courseObj]);
              }}
            >
              <span>{courseObj.name}</span>
              <input
                type="text"
                value={courseObj.value}
                onChange={(e) => {
                  setCalendarCourses((prev) => {
                    const updated = { ...prev };
                    updated[termKey] = updated[termKey].map((c) =>
                      c.name === courseObj.name ? { ...c, value: e.target.value } : c
                    );
                    return updated;
                  });
                }}
                className="ml-2 w-8 text-xs px-1 py-0.5 rounded bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-400 text-center focus:outline-none"
              />
            </div>
          </div>
        ))}
        <div
          className="h-1 bg-blue-500 rounded-sm mt-1"
          onDragOver={(e) => {
            e.preventDefault();
            setHoverIndex({ key: termKey, index: currentList.length });
          }}
          onDrop={(e) => onDrop(e, currentList.length)}
          style={{
            visibility:
              draggedCourse &&
              hoverIndex?.key === termKey &&
              hoverIndex?.index === currentList.length &&
              (currentList.some((c) => c.name === draggedCourse.name) || currentList.length < 6)
                ? 'visible'
                : 'hidden',
            height: '0.25rem',
          }}
        />
      </div>
    </div>
  );
};

export default CalendarTermBlock;
