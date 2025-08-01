// GPA Calculation Utilities

// Grade point scales for different course levels
export const GRADE_SCALES = {
  REGULAR: {
    'A+': 4.33, 'A': 4.00, 'A-': 3.67,
    'B+': 3.33, 'B': 3.00, 'B-': 2.67,
    'C+': 2.33, 'C': 2.00, 'C-': 1.67,
    'D+': 1.33, 'D': 1.00, 'D-': 0.67,
    'F': 0.00
  },
  H: { // Honors
    'A+': 4.67, 'A': 4.33, 'A-': 4.00,
    'B+': 3.67, 'B': 3.33, 'B-': 3.00,
    'C+': 2.67, 'C': 2.33, 'C-': 2.00,
    'D+': 1.67, 'D': 1.33, 'D-': 1.00,
    'F': 0.00
  },
  AP: { // Advanced Placement
    'A+': 5.33, 'A': 5.00, 'A-': 4.67,
    'B+': 4.33, 'B': 4.00, 'B-': 3.67,
    'C+': 3.33, 'C': 3.00, 'C-': 2.67,
    'D+': 2.33, 'D': 2.00, 'D-': 1.67,
    'F': 0.00
  },
  CL: { // College Level
    'A+': 5.33, 'A': 5.00, 'A-': 4.67,
    'B+': 4.33, 'B': 4.00, 'B-': 3.67,
    'C+': 3.33, 'C': 3.00, 'C-': 2.67,
    'D+': 2.33, 'D': 2.00, 'D-': 1.67,
    'F': 0.00
  }
}

// Unweighted 4.0 scale for all courses
export const UNWEIGHTED_SCALE = {
  'A+': 4.00, 'A': 4.00, 'A-': 3.67,
  'B+': 3.33, 'B': 3.00, 'B-': 2.67,
  'C+': 2.33, 'C': 2.00, 'C-': 1.67,
  'D+': 1.33, 'D': 1.00, 'D-': 0.67,
  'F': 0.00
}

// Course level options
export const COURSE_LEVELS = [
  { value: '', label: 'None' },
  { value: 'H', label: 'H' },
  { value: 'AP', label: 'AP' },
  { value: 'CL', label: 'CL' }
]

// Updated school options
export const SCHOOL_OPTIONS = [
  'Dublin High School',
  'Happy Academy', 
  'Fallon Middle School',
  'Las Positas College',
  'Legend College Preparatory',
  'Leigh High School',
  'Foothill College',
  'De Anza College'
]

/**
 * Check if a grade should be included in GPA calculations
 * @param {string} grade - Letter grade
 * @returns {boolean} Whether grade counts for GPA
 */
export const isGradeCountedForGPA = (grade) => {
  // IP (In Progress) and P (Pass) grades should NOT be counted in GPA
  // S (Satisfactory) and H (Honors non-letter) also excluded
  const excludedGrades = ['IP', 'P', 'S', 'H']
  return grade && !excludedGrades.includes(grade)
}

/**
 * Check if a grade should be included in credit calculations
 * @param {string} grade - Letter grade
 * @returns {boolean} Whether grade counts for credits
 */
export const isGradeCountedForCredits = (grade) => {
  // Only IP (In Progress) is excluded from credits
  // P (Pass) grades count for credits but not GPA
  const excludedGrades = ['IP']
  return grade && !excludedGrades.includes(grade)
}

/**
 * Get grade points for a specific grade and course level
 * @param {string} grade - Letter grade (A+, A, A-, etc.)
 * @param {string} courseLevel - Course level (REGULAR, H, AP, CL)
 * @param {boolean} weighted - Whether to use weighted or unweighted scale
 * @returns {number} Grade points
 */
export const getGradePoints = (grade, courseLevel = '', weighted = true) => {
  if (!grade || !isGradeCountedForGPA(grade)) return 0
  
  // Handle special grades
  if (grade === 'P') return 0 // P grades are excluded from GPA calculation
  if (grade === 'F') return 0.00 // Fail = 0.0 points
  
  if (!weighted) {
    return UNWEIGHTED_SCALE[grade] || 0
  }
  
  const level = courseLevel || 'REGULAR'
  const scale = GRADE_SCALES[level] || GRADE_SCALES.REGULAR
  return scale[grade] || 0
}

/**
 * Calculate weighted points for a single course
 * @param {string} grade - Letter grade
 * @param {number} credits - Course credits
 * @param {string} courseLevel - Course level
 * @param {boolean} weighted - Whether to use weighted scale
 * @returns {number} Weighted points
 */
export const calculateCoursePoints = (grade, credits, courseLevel = '', weighted = true) => {
  if (!isGradeCountedForGPA(grade)) return 0
  
  const gradePoints = getGradePoints(grade, courseLevel, weighted)
  const courseCredits = parseFloat(credits) || 0
  return gradePoints * courseCredits
}

/**
 * Calculate GPA from an array of courses
 * @param {Array} courses - Array of course objects
 * @param {boolean} weighted - Whether to calculate weighted or unweighted GPA
 * @returns {Object} GPA calculation results
 */
export const calculateGPA = (courses, weighted = true) => {
  if (!courses || courses.length === 0) {
    return {
      gpa: 0,
      totalCredits: 0,
      totalPoints: 0,
      courseCount: 0
    }
  }

  let totalPoints = 0
  let totalCredits = 0
  let validCourses = 0
  let gpaCredits = 0 // Credits that count toward GPA calculation

  courses.forEach(course => {
    const credits = parseFloat(course.credits) || 0
    const grade = course.grade
    const courseLevel = course.hap || ''

    // Skip courses without valid grades or credits
    if (!grade || credits <= 0) {
      return
    }

    // Count credits for courses that should be counted (excludes IP)
    if (isGradeCountedForCredits(grade)) {
      totalCredits += credits
      validCourses++
    }

    // Only count points and credits for GPA calculation (excludes IP and P)
    if (isGradeCountedForGPA(grade)) {
      const points = calculateCoursePoints(grade, credits, courseLevel, weighted)
      totalPoints += points
      gpaCredits += credits // Only these credits count for GPA calculation
    }
  })

  // GPA calculation uses only credits from courses that count for GPA
  const gpa = gpaCredits > 0 ? totalPoints / gpaCredits : 0

  return {
    gpa: Math.round(gpa * 1000) / 1000, // Round to 3 decimal places
    totalCredits, // All credits (including P grades, excluding IP)
    totalPoints: Math.round(totalPoints * 1000) / 1000,
    courseCount: validCourses,
    gpaCredits // Credits used in GPA calculation (excluding P and IP)
  }
}

/**
 * Calculate semester-wise GPA
 * @param {Array} courses - Array of course objects
 * @param {boolean} weighted - Whether to calculate weighted or unweighted GPA
 * @returns {Object} Semester GPA breakdown
 */
export const calculateSemesterGPA = (courses, weighted = true) => {
  const semesterGroups = {}
  
  courses.forEach(course => {
    const key = `${course.gradeLevel}-${course.schoolYear}-${course.semester}`
    if (!semesterGroups[key]) {
      semesterGroups[key] = {
        gradeLevel: course.gradeLevel,
        schoolYear: course.schoolYear,
        semester: course.semester,
        courses: []
      }
    }
    semesterGroups[key].courses.push(course)
  })

  const semesterGPAs = {}
  Object.keys(semesterGroups).forEach(key => {
    const semesterCourses = semesterGroups[key].courses
    const gpaData = calculateGPA(semesterCourses, weighted)
    semesterGPAs[key] = {
      ...semesterGroups[key],
      ...gpaData
    }
  })

  return semesterGPAs
}

/**
 * Calculate yearly GPA
 * @param {Array} courses - Array of course objects
 * @param {boolean} weighted - Whether to calculate weighted or unweighted GPA
 * @returns {Object} Yearly GPA breakdown
 */
export const calculateYearlyGPA = (courses, weighted = true) => {
  const yearGroups = {}
  
  courses.forEach(course => {
    const key = `${course.gradeLevel}-${course.schoolYear}`
    if (!yearGroups[key]) {
      yearGroups[key] = {
        gradeLevel: course.gradeLevel,
        schoolYear: course.schoolYear,
        courses: []
      }
    }
    yearGroups[key].courses.push(course)
  })

  const yearlyGPAs = {}
  Object.keys(yearGroups).forEach(key => {
    const yearCourses = yearGroups[key].courses
    const gpaData = calculateGPA(yearCourses, weighted)
    yearlyGPAs[key] = {
      ...yearGroups[key],
      ...gpaData
    }
  })

  return yearlyGPAs
}

/**
 * Validate course data for GPA calculation
 * @param {Object} course - Course object
 * @returns {Object} Validation result
 */
export const validateCourse = (course) => {
  const errors = []
  
  if (!course.grade) {
    errors.push('Grade is required')
  } else if (!Object.keys(UNWEIGHTED_SCALE).includes(course.grade) && !['P', 'IP', 'S', 'H'].includes(course.grade)) {
    errors.push('Invalid grade')
  }
  
  // For IP grades, credits are optional
  if (course.grade !== 'IP') {
    const credits = parseFloat(course.credits)
    if (!course.credits || isNaN(credits) || credits <= 0) {
      errors.push('Valid credits are required')
    }
  }
  
  if (!course.courseTitle) {
    errors.push('Course title is required')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Get course level display name
 * @param {string} level - Course level code
 * @returns {string} Display name
 */
export const getCourseLevelName = (level) => {
  const levelNames = {
    '': 'Regular',
    'H': 'Honors',
    'AP': 'Advanced Placement',
    'CL': 'College Level'
  }
  return levelNames[level] || 'Regular'
}

/**
 * Group courses by school and semester for transcript display
 * @param {Array} courses - Array of course objects
 * @returns {Object} Grouped courses by school
 */
export const groupCoursesBySchoolAndSemester = (courses) => {
  const schoolGroups = {}
  
  courses.forEach(course => {
    const school = course.school || 'Unknown School'
    if (!schoolGroups[school]) {
      schoolGroups[school] = {}
    }
    
    const semesterKey = `${course.gradeLevel}-${course.schoolYear}-${course.semester}`
    if (!schoolGroups[school][semesterKey]) {
      schoolGroups[school][semesterKey] = {
        gradeLevel: course.gradeLevel,
        schoolYear: course.schoolYear,
        semester: course.semester,
        courses: []
      }
    }
    
    schoolGroups[school][semesterKey].courses.push(course)
  })
  
  return schoolGroups
}