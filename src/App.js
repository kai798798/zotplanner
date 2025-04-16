import React, { useState, useRef, useEffect } from 'react';
import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';
import YearSection from './components/YearSection';
import Sidebar from './components/Sidebar';

const years = [1, 2, 3, 4];
const quarters = ['Fall', 'Winter', 'Spring', 'Summer'];
const semesterTerms = ['Fall', 'Spring', 'Summer'];

const generateInitialCalendarCourses = (years, terms) => {
  const result = {};
  years.forEach((year) => {
    terms.forEach((term) => {
      const termKey = `${year}-${term}`;
      result[termKey] = [];
    });
  });
  return result;
};

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [calendarType, setCalendarType] = useState('Quarter');
  const [courses, setCourses] = useState([
    { name: 'CS 161', value: '0' },
    { name: 'MATH 2B', value: '0' },
    { name: 'PHYS 7C', value: '0' },
  ]);
  const [calendarCourses, setCalendarCourses] = useState(
    generateInitialCalendarCourses(years, calendarType === 'Quarter' ? quarters : semesterTerms)
  );
  useEffect(() => {
    console.log('📦 calendarCourses updated:', calendarCourses);
  }, [calendarCourses]);
  const [newCourse, setNewCourse] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [errorActive, setErrorActive] = useState(false);
  const [baseYear, setBaseYear] = useState(2026);
  const [draggedCourse, setDraggedCourse] = useState(null);
  const [hoverIndex, setHoverIndex] = useState(null);
  const sidebarRef = useRef(null);

  const currentTerms = calendarType === 'Quarter' ? quarters : semesterTerms;

  const onDrop = (e) => {
    const courseObj = JSON.parse(e.dataTransfer.getData('course'));
    const course = courseObj.name;
    if (!course) return;

    const sidebarX = sidebarRef.current?.getBoundingClientRect().left || 0;
    if (e.clientX >= sidebarX) {
      const droppedInSidebar = e.target.closest('#sidebar');
      if (!droppedInSidebar) return;

      setCourses((prev) => [...prev.filter((c) => c.name !== course), courseObj]);
      setCalendarCourses((prev) => {
        const updated = { ...prev };
        for (const key in updated) {
          updated[key] = updated[key].filter((c) => c.name !== course);
        }
        return updated;
      });
    }
  };

  return (
    <div
      className={darkMode ? 'dark' : ''}
      onDrop={onDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <div className="min-h-screen bg-gray-100 dark:bg-[#121212] text-gray-900 dark:text-white transition-all duration-300 p-6">
        {errorMsg && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg z-50">
            {errorMsg}
          </div>
        )}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-300 dark:border-gray-700 shadow-[0_12px_20px_-10px_rgba(0,0,0,0.15)] dark:shadow-[0_12px_20px_-10px_rgba(255,255,255,0.08)]">
          <div className="flex items-center gap-6">
            <h1 className="text-3xl font-bold">ZotPlanner</h1>
            <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setCalendarType('Quarter')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-300 ease-in-out ${
                  calendarType === 'Quarter'
                    ? 'bg-white dark:bg-gray-600 text-black dark:text-white'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                Quarter
              </button>
              <button
                onClick={() => setCalendarType('Semester')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-300 ease-in-out ${
                  calendarType === 'Semester'
                    ? 'bg-white dark:bg-gray-600 text-black dark:text-white'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                Semester
              </button>
            </div>
          </div>
          <div className="ml-auto">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-10 h-10 flex items-center justify-center bg-gray-300 dark:bg-gray-700 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition-all"
            >
              {darkMode ? (
                <SunIcon className="w-6 h-6 text-yellow-300" />
              ) : (
                <MoonIcon className="w-6 h-6 text-gray-800" />
              )}
            </button>
          </div>
        </div>
        <div className="flex gap-6">
          <div className="w-full pr-6">
            <div className="space-y-6 transition-all duration-500 ease-in-out">
              {years.map((year) => (
                <div key={year} className="transition-all duration-500 ease-in-out transform">
                  {console.log('🔥 Passing to YearSection:', calendarCourses)}
                  <YearSection
                    year={year}
                    baseYear={baseYear}
                    setBaseYear={setBaseYear}
                    calendarType={calendarType}
                    currentTerms={currentTerms}
                    calendarCourses={calendarCourses}
                    setCalendarCourses={setCalendarCourses}
                    setCourses={setCourses}
                    draggedCourse={draggedCourse}
                    setDraggedCourse={setDraggedCourse}
                    hoverIndex={hoverIndex}
                    setHoverIndex={setHoverIndex}
                    setErrorMsg={setErrorMsg}
                    setErrorActive={setErrorActive}
                    onDrop={onDrop}
                    allowDrop={(e) => e.preventDefault()}
                  />
                </div>
              ))}
            </div>
          </div>
          <Sidebar
            ref={sidebarRef}
            courses={courses}
            setCourses={setCourses}
            calendarCourses={calendarCourses}
            setCalendarCourses={setCalendarCourses}
            newCourse={newCourse}
            setNewCourse={setNewCourse}
            draggedCourse={draggedCourse}
            setDraggedCourse={setDraggedCourse}
            hoverIndex={hoverIndex}
            setHoverIndex={setHoverIndex}
            setErrorMsg={setErrorMsg}
            setErrorActive={setErrorActive}
          />
        </div>
      </div>
    </div>
  );
};

export default App;