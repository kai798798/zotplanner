import React from 'react';

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
}) => {
  const semesterTerms = ['Fall', 'Spring', 'Summer'];
  const quarterTerms = ['Fall', 'Winter', 'Spring', 'Summer'];
  const currentTerms = calendarType === 'Quarter' ? quarterTerms : semesterTerms;

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
          return (
            <div key={termKey} 
              className={`bg-gray-200 dark:bg-gray-700 rounded-xl p-4`} 
              style={{ flex: 1, minWidth: calendarType === 'Quarter' ? '23%' : '16%' }}
            >
              <div className="text-center">{term}</div>
              <div className="placeholder">Calendar term block</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default YearSection;
