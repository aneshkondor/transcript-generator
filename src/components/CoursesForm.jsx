import React, { useState, useEffect } from 'react'
import { useTranscript } from '../context/TranscriptContext'
import { Plus, Trash2, Edit2, Calculator } from 'lucide-react'
import { 
  calculateGPA, 
  calculateSemesterGPA, 
  calculateYearlyGPA,
  calculateCoursePoints,
  getGradePoints,
  validateCourse,
  COURSE_LEVELS,
  getCourseLevelName,
  isGradeCountedForGPA,
  isGradeCountedForCredits
} from '../utils/gpaCalculator'

const CoursesForm = () => {
  const { transcriptData, addCourse, updateCourse, deleteCourse, updateTranscriptData } = useTranscript()
  const [isAdding, setIsAdding] = useState(false)
  const [editingCourse, setEditingCourse] = useState(null)
  const [courseForm, setCourseForm] = useState({
    gradeLevel: '',
    schoolYear: '',
    courseTitle: '',
    hap: '',
    grade: '',
    credits: '',
    school: '',
    semester: '1st'
  })
  const [gpaData, setGpaData] = useState({
    weighted: { gpa: 0, totalCredits: 0 },
    unweighted: { gpa: 0, totalCredits: 0 }
  })

  // Calculate GPA whenever courses change
  useEffect(() => {
    const weightedGPA = calculateGPA(transcriptData.courses, true)
    const unweightedGPA = calculateGPA(transcriptData.courses, false)
    
    setGpaData({
      weighted: weightedGPA,
      unweighted: unweightedGPA
    })

    // Update transcript data with calculated GPA
    updateTranscriptData({
      cumulativeGPA: weightedGPA.gpa.toFixed(3),
      totalCredits: weightedGPA.totalCredits.toString()
    })
  }, [transcriptData.courses, updateTranscriptData])

  const resetForm = () => {
    setCourseForm({
      gradeLevel: '',
      schoolYear: '',
      courseTitle: '',
      hap: '',
      grade: '',
      credits: '',
      school: '',
      semester: '1st'
    })
    setIsAdding(false)
    setEditingCourse(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Check if it's an IP grade
    const isIPGrade = courseForm.grade === 'IP'
    
    // For IP grades, create a version with empty credits for validation
    const courseToValidate = isIPGrade ? { ...courseForm, credits: '0' } : courseForm
    
    // Validate course data
    const validation = validateCourse(courseToValidate)
    if (!validation.isValid) {
      alert('Please fix the following errors:\n' + validation.errors.join('\n'))
      return
    }

    // For IP grades, ensure credits is empty string in the final course
    const finalCourse = isIPGrade ? { ...courseForm, credits: '' } : courseForm

    if (editingCourse) {
      updateCourse(editingCourse.id, finalCourse)
    } else {
      addCourse(finalCourse)
    }
    resetForm()
  }

  const handleEdit = (course) => {
    setCourseForm(course)
    setEditingCourse(course)
    setIsAdding(true)
  }

  const gradeOptions = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F', 'P', 'IP', 'S', 'H']

  // Calculate weighted points for current form
  const getCurrentCoursePoints = () => {
    if (courseForm.grade && courseForm.credits && courseForm.hap !== undefined) {
      return calculateCoursePoints(courseForm.grade, courseForm.credits, courseForm.hap, true)
    }
    return 0
  }

  const getCurrentGradePoints = () => {
    if (courseForm.grade && courseForm.hap !== undefined) {
      return getGradePoints(courseForm.grade, courseForm.hap, true)
    }
    return 0
  }

  // Group courses by semester for display
  const groupCoursesBySemester = () => {
    const grouped = {}
    transcriptData.courses.forEach(course => {
      const key = `${course.semester}`
      if (!grouped[key]) {
        grouped[key] = {
          semester: course.semester,
          courses: []
        }
      }
      grouped[key].courses.push(course)
    })
    return Object.values(grouped).sort((a, b) => {
      return a.semester.localeCompare(b.semester)
    })
  }

  const semesterGroups = groupCoursesBySemester()
  const semesterGPAs = calculateSemesterGPA(transcriptData.courses, true)
  const yearlyGPAs = calculateYearlyGPA(transcriptData.courses, true)

  // Check if current grade is IP to make credits optional
  const isIPGrade = courseForm.grade === 'IP'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Courses & Grades</h3>
        <button
          onClick={() => setIsAdding(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Course</span>
        </button>
      </div>

      {/* GPA Summary */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Calculator className="h-5 w-5 text-blue-600" />
            <h4 className="font-medium text-blue-900">Weighted GPA</h4>
          </div>
          <div className="text-2xl font-bold text-blue-900">{gpaData.weighted.gpa.toFixed(3)}</div>
          <div className="text-sm text-blue-700">
            {gpaData.weighted.totalCredits} total credits • {gpaData.weighted.courseCount} courses
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Calculator className="h-5 w-5 text-green-600" />
            <h4 className="font-medium text-green-900">Unweighted GPA</h4>
          </div>
          <div className="text-2xl font-bold text-green-900">{gpaData.unweighted.gpa.toFixed(3)}</div>
          <div className="text-sm text-green-700">
            Standard 4.0 scale
          </div>
        </div>
      </div>

      {/* Add/Edit Course Form */}
      {isAdding && (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <h4 className="text-md font-medium text-gray-900 mb-4">
            {editingCourse ? 'Edit Course' : 'Add New Course'}
          </h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Grade Level *
                </label>
                <select
                  value={courseForm.gradeLevel}
                  onChange={(e) => setCourseForm(prev => ({ ...prev, gradeLevel: e.target.value }))}
                  className="input-field"
                  required
                >
                  <option value="">Select Grade</option>
                  {[9, 10, 11, 12].map(grade => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  School Year *
                </label>
                <input
                  type="text"
                  value={courseForm.schoolYear}
                  onChange={(e) => setCourseForm(prev => ({ ...prev, schoolYear: e.target.value }))}
                  className="input-field"
                  placeholder="e.g., '16-17"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Semester *
                </label>
                <select
                  value={courseForm.semester}
                  onChange={(e) => setCourseForm(prev => ({ ...prev, semester: e.target.value }))}
                  className="input-field"
                  required
                >
                  <option value="1st">1st Semester</option>
                  <option value="2nd">2nd Semester</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course Title *
                </label>
                <input
                  type="text"
                  value={courseForm.courseTitle}
                  onChange={(e) => setCourseForm(prev => ({ ...prev, courseTitle: e.target.value }))}
                  className="input-field"
                  placeholder="e.g., AP Calculus BC"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course Level
                </label>
                <select
                  value={courseForm.hap}
                  onChange={(e) => setCourseForm(prev => ({ ...prev, hap: e.target.value }))}
                  className="input-field"
                >
                  {COURSE_LEVELS.map(level => (
                    <option key={level.value} value={level.value}>{level.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Grade *
                </label>
                <select
                  value={courseForm.grade}
                  onChange={(e) => setCourseForm(prev => ({ ...prev, grade: e.target.value }))}
                  className="input-field"
                  required
                >
                  <option value="">Select Grade</option>
                  {gradeOptions.map(grade => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Credits {!isIPGrade && '*'}
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={courseForm.credits}
                  onChange={(e) => setCourseForm(prev => ({ ...prev, credits: e.target.value }))}
                  className="input-field"
                  placeholder={isIPGrade ? 'Optional for IP grades' : 'e.g., 5'}
                  required={!isIPGrade}
                />
                {isIPGrade && (
                  <p className="text-xs text-orange-600 mt-1">
                    Credits are optional for In Progress (IP) courses
                  </p>
                )}
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  School Name *
                </label>
                <input
                  type="text"
                  value={courseForm.school}
                  onChange={(e) => setCourseForm(prev => ({ ...prev, school: e.target.value }))}
                  className="input-field"
                  placeholder="e.g., Legend College Preparatory, Leigh High School, etc."
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter the full name of the school where this course was taken
                </p>
              </div>
            </div>

            {/* Real-time calculation preview */}
            {courseForm.grade && (courseForm.credits || isIPGrade) && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="text-sm text-blue-900">
                  <strong>Course Preview:</strong> {getCourseLevelName(courseForm.hap)} • 
                  Grade Points: {getCurrentGradePoints().toFixed(2)} • 
                  Weighted Points: {getCurrentCoursePoints().toFixed(2)}
                  {!isGradeCountedForGPA(courseForm.grade) && (
                    <span className="text-red-600 font-bold"> • NOT COUNTED IN GPA (IP/Special Grade)</span>
                  )}
                  {!isGradeCountedForCredits(courseForm.grade) && (
                    <span className="text-red-600 font-bold"> • NOT COUNTED FOR CREDITS</span>
                  )}
                </div>
              </div>
            )}

            <div className="flex space-x-3">
              <button type="submit" className="btn-primary">
                {editingCourse ? 'Update Course' : 'Add Course'}
              </button>
              <button type="button" onClick={resetForm} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Courses List by Semester */}
      {transcriptData.courses.length > 0 ? (
        <div className="space-y-6">
          {semesterGroups.map((semesterGroup, index) => {
            // Group courses by grade level within semester
            const gradeGroups = {}
            semesterGroup.courses.forEach(course => {
              const gradeKey = `${course.gradeLevel}-${course.schoolYear}`
              if (!gradeGroups[gradeKey]) {
                gradeGroups[gradeKey] = {
                  gradeLevel: course.gradeLevel,
                  schoolYear: course.schoolYear,
                  courses: []
                }
              }
              gradeGroups[gradeKey].courses.push(course)
            })

            return (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h4 className="font-medium text-gray-900">
                    {semesterGroup.semester} Semester:
                  </h4>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Grade Level
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          School Year
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Course Title
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          H/AP
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Grade
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Credits
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          School
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Object.values(gradeGroups)
                        .sort((a, b) => a.gradeLevel - b.gradeLevel)
                        .map((gradeGroup, gradeIndex) => {
                          const gradeKey = `${gradeGroup.gradeLevel}-${gradeGroup.schoolYear}-${semesterGroup.semester}`
                          const gradeGPA = semesterGPAs[gradeKey]
                          
                          return (
                            <React.Fragment key={gradeIndex}>
                              {gradeGroup.courses.map((course, courseIndex) => {
                                const weightedPoints = calculateCoursePoints(course.grade, course.credits, course.hap, true)
                                const countsForGPA = isGradeCountedForGPA(course.grade)
                                const countsForCredits = isGradeCountedForCredits(course.grade)
                                
                                return (
                                  <tr key={course.id} className={`hover:bg-gray-50 ${!countsForGPA ? 'bg-yellow-50' : ''}`}>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                      {course.gradeLevel}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                      '{course.schoolYear}
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-900">
                                      {course.courseTitle}
                                      {!countsForGPA && (
                                        <div className="text-xs text-red-600 font-medium">Not counted in GPA</div>
                                      )}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                      {getCourseLevelName(course.hap)}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                        ['A+', 'A', 'A-'].includes(course.grade) ? 'bg-green-100 text-green-800' :
                                        ['B+', 'B', 'B-'].includes(course.grade) ? 'bg-blue-100 text-blue-800' :
                                        ['C+', 'C', 'C-'].includes(course.grade) ? 'bg-yellow-100 text-yellow-800' :
                                        course.grade === 'IP' ? 'bg-orange-100 text-orange-800' :
                                        course.grade === 'P' ? 'bg-purple-100 text-purple-800' :
                                        'bg-red-100 text-red-800'
                                      }`}>
                                        {course.grade}
                                      </span>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                      {course.grade === 'IP' ? '' : course.credits}
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-900">
                                      {course.school}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                                      <div className="flex space-x-2">
                                        <button
                                          onClick={() => handleEdit(course)}
                                          className="text-primary-600 hover:text-primary-900"
                                        >
                                          <Edit2 className="h-4 w-4" />
                                        </button>
                                        <button
                                          onClick={() => deleteCourse(course.id)}
                                          className="text-red-600 hover:text-red-900"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                )
                              })}
                              {/* Semester GPA Row for this grade level */}
                              {gradeGPA && (
                                <tr className="bg-blue-50">
                                  <td colSpan="8" className="px-4 py-2 text-sm font-medium text-blue-900">
                                    Sem. GPA (Weighted) for Grade {gradeGroup.gradeLevel}: {gradeGPA.gpa.toFixed(2)}
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          )
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          })}

          {/* Yearly GPA Summary */}
          {Object.keys(yearlyGPAs).length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-md font-medium text-gray-900 mb-3">Academic Year Summary</h4>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.values(yearlyGPAs).map((yearData, index) => (
                  <div key={index} className="bg-white rounded border p-3">
                    <div className="text-sm font-medium text-gray-900">
                      Grade {yearData.gradeLevel} ({yearData.schoolYear})
                    </div>
                    <div className="text-lg font-bold text-primary-600">
                      {yearData.gpa.toFixed(3)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {yearData.totalCredits} credits • {yearData.courseCount} courses
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Special Grades Legend */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Grade Legend</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <p>• <strong>IP (In Progress):</strong> Course is ongoing - NOT counted in GPA or credits</p>
              <p>• <strong>P (Pass):</strong> Passing grade - counts for credits and GPA (4.0 points)</p>
              <p>• <strong>F (Fail):</strong> Failing grade - counts for credits but 0.0 GPA points</p>
              <p>• <strong>NC:</strong> Not Counted - shown in parentheses for excluded grades</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <div className="text-gray-400 mb-4">
            <Plus className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses added yet</h3>
          <p className="text-gray-600 mb-4">Add courses to build the academic record and calculate GPA.</p>
          <button
            onClick={() => setIsAdding(true)}
            className="btn-primary"
          >
            Add First Course
          </button>
        </div>
      )}
    </div>
  )
}

export default CoursesForm