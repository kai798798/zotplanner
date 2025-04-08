import React, { useState, useRef } from 'react';
import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';

const years = [1, 2, 3, 4];
const quarters = ['Fall', 'Winter', 'Spring', 'Summer'];

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [calendarType, setCalendarType] = useState('Quarter');
  const [courses, setCourses] = useState([
    { name: 'CS 161', value: '0' },
    { name: 'MATH 2B', value: '0' },
    { name: 'PHYS 7C', value: '0' },
  ]);
  const [calendarCourses, setCalendarCourses] = useState({});
  const [newCourse, setNewCourse] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [errorActive, setErrorActive] = useState(false);
  const [baseYear, setBaseYear] = useState(2026);
  const [draggedCourse, setDraggedCourse] = useState(null);
  const [hoverIndex, setHoverIndex] = useState(null);
  const sidebarRef = useRef(null);

  const semesterTerms = ['Fall', 'Spring', 'Summer'];
  const currentTerms = calendarType === 'Quarter' ? quarters : semesterTerms;

  const onDragStart = (e, courseObj) => {
    setDraggedCourse(courseObj);
    e.dataTransfer.setData('course', JSON.stringify(courseObj));
  };

  const onDrop = (e, termKey) => {
    const courseObj = JSON.parse(e.dataTransfer.getData('course'));
    const course = courseObj.name;
    setCalendarCourses((prev) => {
      const already = (prev[termKey] || []).some((c) => c.name === course);
      const count = (prev[termKey] || []).length;

      if (already) return prev;

      if (count >= 6) {
        setErrorMsg('Course limit of 6 reached');
        setErrorActive(true);
        setTimeout(() => {
          setErrorMsg('');
          setErrorActive(false);
        }, 3000);
        setCourses((prev) => [...prev.filter((c) => c.name !== course), courseObj]);
        return prev;
      }

      const updated = { ...prev };
      for (const key in updated) {
        updated[key] = updated[key].filter((c) => c.name !== course);
      }
      updated[termKey] = [...(updated[termKey] || []), courseObj];
      return updated;
    });
    setCourses((prev) => prev.filter((c) => c.name !== course));
  };

  const allowDrop = (e) => {
    e.preventDefault();
  };

  const onDropCourse = (index, termKey = null) => {
    if (!draggedCourse) return;

    if (termKey) {
      setCalendarCourses((prev) => {
        const updated = { ...prev };
        const list = updated[termKey] || [];
        const filtered = list.filter((c) => c.name !== draggedCourse.name);
        filtered.splice(index, 0, draggedCourse);
        updated[termKey] = filtered;
        return updated;
      });
      setCourses((prev) => prev.filter((c) => c.name !== draggedCourse.name));
    } else {
      setCourses((prev) => {
        const filtered = prev.filter((c) => c.name !== draggedCourse.name);
        filtered.splice(index, 0, draggedCourse);
        return filtered;
      });
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

  return (
    <div
      className={darkMode ? 'dark' : ''}
      onDrop={(e) => {
        const courseObj = JSON.parse(e.dataTransfer.getData('course'));
        const course = courseObj.name;
        if (!course) return;

        const sidebarX = sidebarRef.current?.getBoundingClientRect().left || 0;
        if (e.clientX >= sidebarX) {
          setCourses((prev) => [...prev.filter((c) => c.name !== course), courseObj]);
          setCalendarCourses((prev) => {
            const updated = { ...prev };
            for (const key in updated) {
              updated[key] = updated[key].filter((c) => c.name !== course);
            }
            return updated;
          });
        }
      }}
      onDragOver={(e) => e.preventDefault()}
    >
      <div className="min-h-screen bg-gray-100 dark:bg-[#121212] text-gray-900 dark:text-white transition-all duration-300 p-6">
        {errorMsg && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg z-50">
            {errorMsg}
          </div>
        )}
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-300 dark:border-gray-700 shadow-[0_12px_20px_-10px_rgba(0,0,0,0.15)] dark:shadow-[0_12px_20px_-10px_rgba(255,255,255,0.08)]">
          <div className="flex items-center gap-6">
            <h1 className="text-3xl font-bold">ZotPlanner</h1>

            {/* Calendar Type Switch */}
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

          {/* Dark Mode Toggle */}
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
          {/* Calendar Section */}
          <div className="w-full pr-6">
            <div className="space-y-6">
              {years.map((year) => (
                <div key={year}>
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
                  <div className="grid grid-cols-4 gap-4">
                    {currentTerms.map((term) => {
                      const termKey = `${year}-${term}`;
                      return (
                        <div
                          key={termKey}
                          onDrop={(e) => onDrop(e, termKey)}
                          onDragOver={allowDrop}
                          className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl shadow p-4 h-66 relative transition-all"
                        >
                          <div className="text-center text-base font-semibold text-gray-600 dark:text-gray-300 border-b border-gray-300 dark:border-gray-600 pb-1 mb-2">
                            {term}
                          </div>
                          <div className="space-y-1">
                            {(calendarCourses[termKey] || []).map((courseObj, index) => (
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
                                  onDrop={(e) => {
                                    e.preventDefault();
                                    if (!draggedCourse) return;
 
                                    const currentList = calendarCourses[termKey] || [];
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
                                      const list = updated[termKey] || [];
                                      const filtered = list.filter((c) => c.name !== draggedCourse.name);
                                      filtered.splice(index, 0, draggedCourse);
                                      updated[termKey] = filtered;
                                      return updated;
                                    });
 
                                    setCourses((prev) => prev.filter((c) => c.name !== draggedCourse.name));
                                    setDraggedCourse(null);
                                    setHoverIndex(null);
                                  }}
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
                                setHoverIndex({ key: termKey, index: (calendarCourses[termKey] || []).length });
                              }}
                              onDrop={(e) => {
                                e.preventDefault();
                                if (!draggedCourse) return;
 
                                const currentList = calendarCourses[termKey] || [];
                                const isAlreadyIn = currentList.some((c) => c.name === draggedCourse.name);
                                const isAtLimit = currentList.length >= 6;
 
                                if (!isAlreadyIn && isAtLimit) {
                                  setErrorMsg('Course limit of 6 reached');
                                  setTimeout(() => setErrorMsg(''), 2000);
                                  return;
                                }
 
                                setCalendarCourses((prev) => {
                                  const updated = { ...prev };
                                  const list = updated[termKey] || [];
                                  const filtered = list.filter((c) => c.name !== draggedCourse.name);
                                  filtered.push(draggedCourse);
                                  updated[termKey] = filtered;
                                  return updated;
                                });
 
                                setCourses((prev) => prev.filter((c) => c.name !== draggedCourse.name));
                                setDraggedCourse(null);
                                setHoverIndex(null);
                              }}
                              style={{
                                visibility:
                                  draggedCourse &&
                                  hoverIndex?.key === termKey &&
                                  hoverIndex?.index === (calendarCourses[termKey] || []).length &&
                                  (
                                    (calendarCourses[termKey] || []).some((c) => c.name === draggedCourse.name) ||
                                    (calendarCourses[termKey] || []).length < 6
                                  )
                                    ? 'visible'
                                    : 'hidden',
                                height: '0.25rem',
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar Placeholder */}
          <div
            ref={sidebarRef}
            className="w-[340px] ml-auto border-l-2 border-gray-300 dark:border-gray-500 pl-6 shadow-lg"
          >
            <h2 className="text-2xl font-semibold mb-4">🧱 Course Bank</h2>
            <p className="text-gray-500 dark:text-gray-400 text-base">You’ll drag from here later</p>
            <div
              className="space-y-2 max-h-[calc(100vh-220px)] overflow-y-auto pr-1"
              onDrop={(e) => {
                const courseObj = JSON.parse(e.dataTransfer.getData('course'));
                setCourses((prev) => [...prev.filter((c) => c.name !== courseObj.name), courseObj]);

                // Remove from calendar
                setCalendarCourses((prev) => {
                  const updated = { ...prev };
                  for (const key in updated) {
                    updated[key] = updated[key].filter((c) => c.name !== courseObj.name);
                  }
                  return updated;
                });
              }}
              onDragOver={(e) => e.preventDefault()}
            >
              {courses.map((courseObj, index) => (
                <div key={courseObj.name + index}>
                  {hoverIndex?.key === 'bank' && hoverIndex?.index === index && (
                    <div className="h-1 bg-blue-500 rounded-sm mb-1" />
                  )}
                  <div
                    className="flex justify-between items-center px-3 py-2 bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg shadow hover:bg-gray-300 dark:hover:bg-gray-500 transition-all"
                    draggable
                    onDragStart={(e) => {
                      setDraggedCourse(courseObj);
                      e.dataTransfer.setData('course', JSON.stringify(courseObj));
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setHoverIndex({ key: 'bank', index });
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (!draggedCourse) return;
                      setCourses((prev) => {
                        const filtered = prev.filter((c) => c.name !== draggedCourse.name);
                        filtered.splice(index, 0, draggedCourse);
                        return filtered;
                      });
                      setCalendarCourses((prev) => {
                        const updated = { ...prev };
                        for (const key in updated) {
                          updated[key] = updated[key].filter((c) => c.name !== draggedCourse.name);
                        }
                        return updated;
                      });
                      setDraggedCourse(null);
                      setHoverIndex(null);
                    }}
                    onDragLeave={() => setHoverIndex(null)}
                    onDoubleClick={() => {
                      setCourses((prev) => prev.filter((c) => c.name !== courseObj.name));
                    }}
                  >
                    <span>{courseObj.name}</span>
                    <input
                      type="text"
                      value={courseObj.value}
                      onChange={(e) => {
                        setCourses((prev) =>
                          prev.map((c) =>
                            c.name === courseObj.name ? { ...c, value: e.target.value } : c
                          )
                        );
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
                  setHoverIndex({ key: 'bank', index: courses.length });
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  if (!draggedCourse) return;
                  setCourses((prev) => {
                    const filtered = prev.filter((c) => c.name !== draggedCourse.name);
                    filtered.push(draggedCourse);
                    return filtered;
                  });
                  setCalendarCourses((prev) => {
                    const updated = { ...prev };
                    for (const key in updated) {
                      updated[key] = updated[key].filter((c) => c.name !== draggedCourse.name);
                    }
                    return updated;
                  });
                  setDraggedCourse(null);
                  setHoverIndex(null);
                }}
                style={{
                  visibility:
                    hoverIndex?.key === 'bank' && hoverIndex?.index === courses.length
                      ? 'visible'
                      : 'hidden',
                }}
              />
            </div>
            <div className="mt-4">
              <input
                type="text"
                placeholder="Add course"
                className="w-full px-3 py-2 mb-2 border rounded dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none"
                value={newCourse}
                onChange={(e) => setNewCourse(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newCourse.trim()) {
                    setCourses((prev) => [...prev, { name: newCourse.trim(), value: '0' }]);
                    setNewCourse('');
                  }
                }}
              />
              <button
                onClick={() => {
                  if (newCourse.trim()) {
                    setCourses((prev) => [...prev, { name: newCourse.trim(), value: '0' }]);
                    setNewCourse('');
                  }
                }}
                className="w-full px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all"
              >
                Add Course
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;