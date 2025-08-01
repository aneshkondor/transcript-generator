import React from 'react'
import { Calculator, TrendingUp, Award, BookOpen } from 'lucide-react'
import { 
  calculateGPA, 
  calculateSemesterGPA, 
  calculateYearlyGPA,
  getCourseLevelName
} from '../utils/gpaCalculator'

const GPASummary = ({ courses }) => {
  const weightedGPA = calculateGPA(courses, true)
  const unweightedGPA = calculateGPA(courses, false)
  const semesterGPAs = calculateSemesterGPA(courses, true)
  const yearlyGPAs = calculateYearlyGPA(courses, true)

  // Calculate course distribution by level
  const courseLevelDistribution = courses.reduce((acc, course) => {
    const level = course.hap || ''
    const levelName = getCourseLevelName(level)
    acc[levelName] = (acc[levelName] || 0) + 1
    return acc
  }, {})

  // Calculate grade distribution
  const gradeDistribution = courses.reduce((acc, course) => {
    if (course.grade && !['P', 'IP', 'S', 'H'].includes(course.grade)) {
      acc[course.grade] = (acc[course.grade] || 0) + 1
    }
    return acc
  }, {})

  const getGPAColor = (gpa) => {
    if (gpa >= 4.0) return 'text-green-600'
    if (gpa >= 3.5) return 'text-blue-600'
    if (gpa >= 3.0) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getGPABgColor = (gpa) => {
    if (gpa >= 4.0) return 'bg-green-50 border-green-200'
    if (gpa >= 3.5) return 'bg-blue-50 border-blue-200'
    if (gpa >= 3.0) return 'bg-yellow-50 border-yellow-200'
    return 'bg-red-50 border-red-200'
  }

  if (courses.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <Calculator className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600">Add courses to see GPA calculations</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Main GPA Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className={`border rounded-lg p-6 ${getGPABgColor(weightedGPA.gpa)}`}>
          <div className="flex items-center space-x-3 mb-3">
            <div className={`p-2 rounded-lg ${weightedGPA.gpa >= 4.0 ? 'bg-green-100' : weightedGPA.gpa >= 3.5 ? 'bg-blue-100' : 'bg-yellow-100'}`}>
              <TrendingUp className={`h-5 w-5 ${getGPAColor(weightedGPA.gpa)}`} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Weighted GPA</h3>
          </div>
          <div className={`text-3xl font-bold ${getGPAColor(weightedGPA.gpa)} mb-2`}>
            {weightedGPA.gpa.toFixed(3)}
          </div>
          <div className="text-sm text-gray-600">
            {weightedGPA.totalCredits} credits • {weightedGPA.courseCount} courses
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {weightedGPA.totalPoints.toFixed(2)} total grade points
          </div>
        </div>

        <div className={`border rounded-lg p-6 ${getGPABgColor(unweightedGPA.gpa)}`}>
          <div className="flex items-center space-x-3 mb-3">
            <div className={`p-2 rounded-lg ${unweightedGPA.gpa >= 3.5 ? 'bg-green-100' : unweightedGPA.gpa >= 3.0 ? 'bg-blue-100' : 'bg-yellow-100'}`}>
              <Calculator className={`h-5 w-5 ${getGPAColor(unweightedGPA.gpa)}`} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Unweighted GPA</h3>
          </div>
          <div className={`text-3xl font-bold ${getGPAColor(unweightedGPA.gpa)} mb-2`}>
            {unweightedGPA.gpa.toFixed(3)}
          </div>
          <div className="text-sm text-gray-600">
            Standard 4.0 scale
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {unweightedGPA.totalPoints.toFixed(2)} total grade points
          </div>
        </div>
      </div>

      {/* Academic Performance Insights */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Course Level Distribution */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Award className="h-5 w-5 text-purple-600" />
            <h4 className="font-medium text-gray-900">Course Levels</h4>
          </div>
          <div className="space-y-2">
            {Object.entries(courseLevelDistribution).map(([level, count]) => (
              <div key={level} className="flex justify-between text-sm">
                <span className="text-gray-600">{level}:</span>
                <span className="font-medium">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Grade Distribution */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <BookOpen className="h-5 w-5 text-indigo-600" />
            <h4 className="font-medium text-gray-900">Grade Distribution</h4>
          </div>
          <div className="space-y-1">
            {Object.entries(gradeDistribution)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([grade, count]) => (
                <div key={grade} className="flex justify-between text-sm">
                  <span className="text-gray-600">{grade}:</span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Academic Standing */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <h4 className="font-medium text-gray-900">Academic Standing</h4>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className={`font-medium ${
                weightedGPA.gpa >= 3.5 ? 'text-green-600' : 
                weightedGPA.gpa >= 3.0 ? 'text-blue-600' : 
                weightedGPA.gpa >= 2.0 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {weightedGPA.gpa >= 3.5 ? 'Excellent' : 
                 weightedGPA.gpa >= 3.0 ? 'Good Standing' : 
                 weightedGPA.gpa >= 2.0 ? 'Satisfactory' : 'Needs Improvement'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Honors:</span>
              <span className="font-medium">
                {weightedGPA.gpa >= 4.0 ? 'Summa Cum Laude' :
                 weightedGPA.gpa >= 3.7 ? 'Magna Cum Laude' :
                 weightedGPA.gpa >= 3.5 ? 'Cum Laude' : 'None'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Yearly GPA Breakdown */}
      {Object.keys(yearlyGPAs).length > 1 && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">GPA by Academic Year</h4>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
            {Object.values(yearlyGPAs)
              .sort((a, b) => a.gradeLevel - b.gradeLevel)
              .map((yearData, index) => (
                <div key={index} className="bg-gray-50 rounded p-3 text-center">
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    Grade {yearData.gradeLevel}
                  </div>
                  <div className={`text-xl font-bold ${getGPAColor(yearData.gpa)}`}>
                    {yearData.gpa.toFixed(3)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {yearData.totalCredits} credits
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* GPA Calculation Explanation */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">GPA Calculation Method</h4>
        <div className="text-sm text-blue-800 space-y-1">
          <p>• <strong>Weighted GPA:</strong> Uses enhanced scales for advanced courses (AP: 5.33, Honors: 4.67, Regular: 4.33)</p>
          <p>• <strong>Unweighted GPA:</strong> Uses standard 4.0 scale for all courses</p>
          <p>• <strong>Formula:</strong> (Sum of Grade Points × Credits) ÷ Total Credits</p>
          <p>• <strong>Excluded:</strong> Pass/Fail, In Progress, and non-letter grades</p>
        </div>
      </div>
    </div>
  )
}

export default GPASummary