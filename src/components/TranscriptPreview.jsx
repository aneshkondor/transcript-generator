import React from 'react'
import { useTranscript } from '../context/TranscriptContext'
import { 
  calculateSemesterGPA,
  isGradeCountedForGPA 
} from '../utils/gpaCalculator'

const TranscriptPreview = () => {
  const { transcriptData, formatSSNForDisplay } = useTranscript()

  const formatDate = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Group courses by school first, then by semester within each school
  const groupCoursesBySchoolAndSemester = () => {
    const schoolGroups = {}
    
    transcriptData.courses.forEach(course => {
      const school = course.school || 'Unknown School'
      if (!schoolGroups[school]) {
        schoolGroups[school] = {}
      }
      
      const semesterKey = course.semester
      if (!schoolGroups[school][semesterKey]) {
        schoolGroups[school][semesterKey] = {
          semester: course.semester,
          courses: []
        }
      }
      schoolGroups[school][semesterKey].courses.push(course)
    })
    
    return schoolGroups
  }

  const schoolGroups = groupCoursesBySchoolAndSemester()
  const semesterGPAs = calculateSemesterGPA(transcriptData.courses, true)

  // Filter out empty credit summary entries for PDF display
  const getDisplayedCreditSummary = () => {
    return transcriptData.creditSummary.filter(credit => 
      credit.subject && credit.subject.trim() !== ''
    )
  }

  const displayedCreditSummary = getDisplayedCreditSummary()

  // Get credit transfer data for display
  const getDisplayedCreditTransfer = () => {
    return (transcriptData.creditTransfer || []).filter(transfer => 
      transfer.school && transfer.school.trim() !== ''
    )
  }

  const displayedCreditTransfer = getDisplayedCreditTransfer()

  return (
    <div 
      className="transcript-preview" 
      id="transcript-preview" 
      style={{ 
        fontFamily: 'Arial, sans-serif', 
        fontSize: '11px', 
        lineHeight: '1.2', 
        color: '#000',
        maxWidth: '8.5in',
        margin: '0 auto',
        backgroundColor: '#fff',
        padding: '20px',
        minHeight: '11in'
      }}
    >
      {/* Header */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '20px', 
        border: '2px solid #000', 
        padding: '10px',
        fontSize: '14px',
        fontWeight: 'bold',
        backgroundColor: '#f0f0f0'
      }}>
        {transcriptData.institutionName || 'LEGEND COLLEGE PREPARATORY'} TRANSCRIPT
      </div>

      {/* Institution Info - ALL ON ONE LINE */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '20px', 
        fontSize: '10px'
      }}>
        {transcriptData.institutionAddress || '21050 McClellan Road, Cupertino CA 95014'} &nbsp;&nbsp;
        Tel: {transcriptData.institutionPhone || '(408)865-0366'} &nbsp;&nbsp;
        Email: {transcriptData.institutionEmail || 'transcript@legendcp.com'} &nbsp;&nbsp;
        CEEB Code: {transcriptData.ceebCode || '054732'}
      </div>

      {/* Student Information Block - NO GRID LINES */}
      <div style={{ 
        marginBottom: '20px',
        padding: '10px',
        backgroundColor: '#f8f8f8'
      }}>
        <div style={{ display: 'flex', marginBottom: '8px' }}>
          <span style={{ fontWeight: 'bold', width: '20%', fontSize: '10px' }}>Student Name:</span>
          <span style={{ width: '30%', fontSize: '10px' }}>{transcriptData.studentName || 'Kondor, Anirud'}</span>
          <span style={{ fontWeight: 'bold', width: '20%', fontSize: '10px' }}>Student Number:</span>
          <span style={{ width: '30%', fontSize: '10px' }}>{transcriptData.studentNumber || '11807'}</span>
        </div>
        <div style={{ display: 'flex', marginBottom: '8px' }}>
          <span style={{ fontWeight: 'bold', width: '20%', fontSize: '10px' }}>Address:</span>
          <span style={{ width: '80%', fontSize: '10px' }}>{transcriptData.address || '4848 Tilden Dr., San Jose, CA 95124'}</span>
        </div>
        <div style={{ display: 'flex', marginBottom: '8px' }}>
          <span style={{ fontWeight: 'bold', width: '20%', fontSize: '10px' }}>Date of Birth:</span>
          <span style={{ width: '30%', fontSize: '10px' }}>{formatDate(transcriptData.dateOfBirth) || 'April 25, 2002'}</span>
          <span style={{ fontWeight: 'bold', width: '20%', fontSize: '10px' }}>Gender:</span>
          <span style={{ width: '30%', fontSize: '10px' }}>{transcriptData.gender || 'Male'}</span>
        </div>
        <div style={{ display: 'flex' }}>
          <span style={{ fontWeight: 'bold', width: '20%', fontSize: '10px' }}>Guardian:</span>
          <span style={{ width: '30%', fontSize: '10px' }}>{transcriptData.guardian || 'Padman Kondor, Sangeetha Kondor'}</span>
          <span style={{ fontWeight: 'bold', width: '20%', fontSize: '10px' }}>SSN:</span>
          <span style={{ width: '30%', fontSize: '10px' }}>{formatSSNForDisplay(transcriptData.ssn)}</span>
        </div>
      </div>

      {/* CONNECTED BLOCKS LAYOUT - ONE COHESIVE TABLE */}
      <table style={{ 
        width: '100%', 
        borderCollapse: 'collapse', 
        marginBottom: '20px',
        border: '2px solid #000'
      }}>
        <tbody>
          {/* TOP ROW: GPA Summary | Total Credit Completed */}
          <tr>
            <td style={{ 
              border: '1px solid #000',
              padding: '8px', 
              backgroundColor: '#f0f0f0', 
              fontWeight: 'bold',
              fontSize: '10px',
              width: '50%'
            }}>
              GPA Summary
            </td>
            <td style={{ 
              border: '1px solid #000',
              padding: '8px', 
              backgroundColor: '#f0f0f0', 
              fontWeight: 'bold',
              fontSize: '10px',
              width: '50%'
            }}>
              Total Credit Completed
            </td>
          </tr>
          <tr>
            <td style={{ 
              border: '1px solid #000',
              padding: '8px',
              fontSize: '10px',
              verticalAlign: 'top'
            }}>
              Cumulative GPA (Weighted): {transcriptData.cumulativeGPA || '4.33'}
            </td>
            <td style={{ 
              border: '1px solid #000',
              padding: '8px',
              fontSize: '10px',
              verticalAlign: 'top'
            }}>
              {transcriptData.totalCredits || '20'} {transcriptData.institutionName || 'Legend College Preparatory'}
            </td>
          </tr>

          {/* MIDDLE ROW: Enrollment Summary | Total Credit Transferred */}
          <tr>
            <td style={{ 
              border: '1px solid #000',
              padding: '8px', 
              backgroundColor: '#f0f0f0', 
              fontWeight: 'bold',
              fontSize: '10px'
            }}>
              Enrollment Summary
            </td>
            <td style={{ 
              border: '1px solid #000',
              padding: '8px', 
              backgroundColor: '#f0f0f0', 
              fontWeight: 'bold',
              fontSize: '10px'
            }}>
              Total Credit Transferred
            </td>
          </tr>
          <tr>
            <td style={{ 
              border: '1px solid #000',
              padding: '8px',
              fontSize: '9px',
              verticalAlign: 'top'
            }}>
              {/* ✅ ENROLLMENT SUMMARY CONTENT - ABSOLUTELY NO INTERNAL BORDERS */}
              <div style={{ width: '100%' }}>
                {/* Column Headers - NO BORDERS */}
                <div style={{ 
                  display: 'flex', 
                  fontWeight: 'bold',
                  marginBottom: '8px',
                  paddingBottom: '4px',
                  borderBottom: '1px solid #ccc'
                }}>
                  <div style={{ width: '35%', padding: '2px' }}>Start/End Date</div>
                  <div style={{ width: '20%', padding: '2px' }}>Grade</div>
                  <div style={{ width: '45%', padding: '2px' }}>School</div>
                </div>
                
                {/* Data Rows - NO BORDERS */}
                {transcriptData.enrollmentSummary.slice(0, 7).map((enrollment, index) => (
                  <div key={index} style={{ 
                    display: 'flex',
                    marginBottom: '4px'
                  }}>
                    <div style={{ width: '35%', padding: '2px' }}>
                      {enrollment.startEndDate || (index === 0 ? '2016-2017' : index === 1 ? '2016-2017' : index === 2 ? '2017-2018' : index === 3 ? '2017-2018' : index === 4 ? '2017-2018' : index === 5 ? '2016-2017' : '2016-2017')}
                    </div>
                    <div style={{ width: '20%', padding: '2px' }}>
                      {enrollment.grade || (index === 0 ? '9' : index === 1 ? '9' : index === 2 ? '10' : index === 3 ? '10' : index === 4 ? '10' : index === 5 ? '11' : '11')}
                    </div>
                    <div style={{ width: '45%', padding: '2px' }}>
                      {enrollment.school || (index === 0 ? 'Leigh High School' : index === 1 ? 'Foothill College' : index === 2 ? 'Leigh High School' : index === 3 ? 'Foothill College' : index === 4 ? 'De Anza College' : index === 5 ? 'Legend College Preparatory' : 'Leigh High School')}
                    </div>
                  </div>
                ))}
              </div>
            </td>
            <td style={{ 
              border: '1px solid #000',
              padding: '8px',
              fontSize: '9px',
              verticalAlign: 'top',
              textAlign: 'center' // ✅ CENTERED CONTENT
            }}>
              {/* ✅ CREDIT TRANSFER CONTENT - CENTERED */}
              <div style={{ width: '100%' }}>
                {displayedCreditTransfer.length > 0 ? (
                  displayedCreditTransfer.map((transfer, index) => (
                    <div key={index} style={{ marginBottom: '5px' }}>
                      {transfer.credits} {transfer.school}
                    </div>
                  ))
                ) : (
                  // Default entries if none are added
                  <>
                    <div style={{ marginBottom: '5px' }}>150 Leigh High School</div>
                    <div style={{ marginBottom: '5px' }}>30 Foothill College</div>
                    <div style={{ marginBottom: '5px' }}>10 De Anza College</div>
                  </>
                )}
              </div>
            </td>
          </tr>

          {/* BOTTOM ROW: Credit Summary (Full Width) */}
          <tr>
            <td style={{ 
              border: '1px solid #000',
              padding: '8px', 
              backgroundColor: '#f0f0f0', 
              fontWeight: 'bold',
              textAlign: 'center',
              fontSize: '10px'
            }} colSpan="2">
              Credit Summary<br />
              Curriculum Track: College Prep, Honors
            </td>
          </tr>
          <tr>
            <td style={{ 
              border: '1px solid #000',
              padding: '8px',
              fontSize: '9px',
              verticalAlign: 'top'
            }} colSpan="2">
              {/* ✅ CREDIT SUMMARY CONTENT - NO INTERNAL BORDERS EXCEPT CENTER DIVIDER */}
              <div style={{ display: 'flex' }}>
                {/* LEFT BLOCK - NO INTERNAL BORDERS */}
                <div style={{ width: '50%', paddingRight: '10px' }}>
                  {displayedCreditSummary.length > 0 ? (
                    displayedCreditSummary.slice(0, Math.ceil(displayedCreditSummary.length / 2)).map((credit, index) => (
                      <div key={index} style={{ 
                        marginBottom: '5px', 
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        <span style={{ fontWeight: 'bold', width: '50%' }}>{credit.subject}</span>
                        <span style={{ width: '25%' }}>Earned: {credit.earned || 0}</span>
                        <span style={{ width: '25%' }}>Required: {credit.required || 0}</span>
                      </div>
                    ))
                  ) : (
                    <>
                      <div style={{ marginBottom: '5px', display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontWeight: 'bold', width: '50%' }}>History/Social Science</span>
                        <span style={{ width: '25%' }}>Earned: 25</span>
                        <span style={{ width: '25%' }}>Required: 30</span>
                      </div>
                      <div style={{ marginBottom: '5px', display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontWeight: 'bold', width: '50%' }}>English</span>
                        <span style={{ width: '25%' }}>Earned: 25</span>
                        <span style={{ width: '25%' }}>Required: 40</span>
                      </div>
                      <div style={{ marginBottom: '5px', display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontWeight: 'bold', width: '50%' }}>Foreign Language</span>
                        <span style={{ width: '25%' }}>Earned: 10</span>
                        <span style={{ width: '25%' }}>Required: 20</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontWeight: 'bold', width: '50%' }}>Physical Education</span>
                        <span style={{ width: '25%' }}>Earned: 20</span>
                        <span style={{ width: '25%' }}>Required: 10</span>
                      </div>
                    </>
                  )}
                </div>
                
                {/* RIGHT BLOCK - NO INTERNAL BORDERS, ONLY LEFT SEPARATOR */}
                <div style={{ 
                  width: '50%', 
                  paddingLeft: '10px', 
                  borderLeft: '1px solid #000'
                }}>
                  {displayedCreditSummary.length > 0 ? (
                    displayedCreditSummary.slice(Math.ceil(displayedCreditSummary.length / 2)).map((credit, index) => (
                      <div key={index} style={{ 
                        marginBottom: '5px', 
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        <span style={{ fontWeight: 'bold', width: '50%' }}>{credit.subject}</span>
                        <span style={{ width: '25%' }}>Earned: {credit.earned || 0}</span>
                        <span style={{ width: '25%' }}>Required: {credit.required || 0}</span>
                      </div>
                    ))
                  ) : (
                    <>
                      <div style={{ marginBottom: '5px', display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontWeight: 'bold', width: '50%' }}>Mathematics</span>
                        <span style={{ width: '25%' }}>Earned: 45</span>
                        <span style={{ width: '25%' }}>Required: 40</span>
                      </div>
                      <div style={{ marginBottom: '5px', display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontWeight: 'bold', width: '50%' }}>Laboratory Science</span>
                        <span style={{ width: '25%' }}>Earned: 35</span>
                        <span style={{ width: '25%' }}>Required: 30</span>
                      </div>
                      <div style={{ marginBottom: '5px', display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontWeight: 'bold', width: '50%' }}>Arts</span>
                        <span style={{ width: '25%' }}>Earned: 10</span>
                        <span style={{ width: '25%' }}>Required: 20</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontWeight: 'bold', width: '50%' }}>Elective</span>
                        <span style={{ width: '25%' }}>Earned: 60</span>
                        <span style={{ width: '25%' }}>Required: 70</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Course Records by School */}
      {Object.keys(schoolGroups).length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          {Object.entries(schoolGroups)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([school, semesterGroups]) => {
              const semesters = Object.values(semesterGroups).sort((a, b) => a.semester.localeCompare(b.semester))
              
              return (
                <table key={school} style={{ 
                  width: '100%', 
                  borderCollapse: 'collapse', 
                  marginBottom: '15px',
                  border: '2px solid #000',
                  pageBreakInside: 'avoid'
                }}>
                  <tbody>
                    {/* School Header - CENTERED */}
                    <tr>
                      <td style={{ 
                        border: '1px solid #000',
                        backgroundColor: '#e8e8e8', 
                        padding: '8px', 
                        fontWeight: 'bold', 
                        fontSize: '11px',
                        textAlign: 'center'
                      }} colSpan="12">
                        {school}
                      </td>
                    </tr>

                    {/* Semester Headers Side by Side */}
                    {Array.from({ length: Math.ceil(semesters.length / 2) }, (_, rowIndex) => {
                      const leftSemester = semesters[rowIndex * 2]
                      const rightSemester = semesters[rowIndex * 2 + 1]
                      
                      return (
                        <React.Fragment key={rowIndex}>
                          {/* Semester Headers */}
                          <tr>
                            <td style={{ 
                              border: '1px solid #000',
                              backgroundColor: '#f8f8f8',
                              padding: '6px',
                              fontWeight: 'bold',
                              fontSize: '9px'
                            }} colSpan={rightSemester ? "6" : "12"}>
                              {leftSemester.semester} Semester:
                            </td>
                            {rightSemester && (
                              <td style={{ 
                                border: '1px solid #000',
                                backgroundColor: '#f8f8f8',
                                padding: '6px',
                                fontWeight: 'bold',
                                fontSize: '9px'
                              }} colSpan="6">
                                {rightSemester.semester} Semester:
                              </td>
                            )}
                          </tr>

                          {/* Column Headers */}
                          <tr style={{ backgroundColor: '#f5f5f5' }}>
                            <td style={{ border: '1px solid #000', padding: '4px', fontWeight: 'bold', fontSize: '8px' }}>Grade Level</td>
                            <td style={{ border: '1px solid #000', padding: '4px', fontWeight: 'bold', fontSize: '8px' }}>School Year</td>
                            <td style={{ border: '1px solid #000', padding: '4px', fontWeight: 'bold', fontSize: '8px' }}>Course Title</td>
                            <td style={{ border: '1px solid #000', padding: '4px', fontWeight: 'bold', fontSize: '8px' }}>H/AP</td>
                            <td style={{ border: '1px solid #000', padding: '4px', fontWeight: 'bold', fontSize: '8px' }}>Grade</td>
                            <td style={{ border: '1px solid #000', padding: '4px', fontWeight: 'bold', fontSize: '8px' }}>Credits</td>
                            {rightSemester && (
                              <>
                                <td style={{ border: '1px solid #000', padding: '4px', fontWeight: 'bold', fontSize: '8px' }}>Grade Level</td>
                                <td style={{ border: '1px solid #000', padding: '4px', fontWeight: 'bold', fontSize: '8px' }}>School Year</td>
                                <td style={{ border: '1px solid #000', padding: '4px', fontWeight: 'bold', fontSize: '8px' }}>Course Title</td>
                                <td style={{ border: '1px solid #000', padding: '4px', fontWeight: 'bold', fontSize: '8px' }}>H/AP</td>
                                <td style={{ border: '1px solid #000', padding: '4px', fontWeight: 'bold', fontSize: '8px' }}>Grade</td>
                                <td style={{ border: '1px solid #000', padding: '4px', fontWeight: 'bold', fontSize: '8px' }}>Credits</td>
                              </>
                            )}
                          </tr>

                          {/* Course Rows */}
                          {renderSemesterCourseRows(leftSemester, rightSemester, semesterGPAs)}
                        </React.Fragment>
                      )
                    })}
                  </tbody>
                </table>
              )
            })}
        </div>
      )}

      {/* Comments and Signature Section - SIDE BY SIDE AS SHOWN IN IMAGE */}
      <div style={{ 
        display: 'flex',
        gap: '20px',
        marginTop: '30px'
      }}>
        {/* LEFT SIDE: Comments Box with Border and Header */}
        <div style={{ 
          width: '40%',
          border: '2px solid #000'
        }}>
          {/* Comments Header */}
          <div style={{ 
            backgroundColor: '#f0f0f0',
            padding: '8px',
            fontWeight: 'bold',
            fontSize: '10px',
            borderBottom: '1px solid #000'
          }}>
            Comments
          </div>
          
          {/* Comments Content */}
          <div style={{ 
            padding: '10px',
            fontSize: '9px',
            minHeight: '120px',
            display: 'flex'
          }}>
            {/* LEFT SIDE: Grade Legend Text */}
            <div style={{ 
              width: '60%', 
              paddingRight: '10px',
              lineHeight: '1.4'
            }}>
              <div style={{ marginBottom: '8px' }}>
                <strong>UNOFFICIAL TRANSCRIPT</strong>
              </div>
              <div style={{ marginBottom: '4px' }}>
                CL-College Level
              </div>
              <div style={{ marginBottom: '4px' }}>
                IP- In Progress
              </div>
              <div style={{ marginBottom: '4px' }}>
                P- Pass
              </div>
              <div style={{ marginBottom: '4px' }}>
                F- Fail
              </div>
              
              {/* Additional comments if provided */}
              {transcriptData.comments && transcriptData.comments.trim() !== '' && (
                <div style={{ marginTop: '10px', fontSize: '8px' }}>
                  {transcriptData.comments}
                </div>
              )}
            </div>
            
            {/* RIGHT SIDE: Digital Stamp - CENTER ALIGNED */}
            <div style={{ 
              width: '40%', 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center'
            }}>
              {transcriptData.digitalStamp && (
                <img
                  src={transcriptData.digitalStamp.preview}
                  alt="Official Stamp"
                  style={{ 
                    height: '80px', 
                    maxWidth: '120px', 
                    objectFit: 'contain'
                  }}
                />
              )}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Principal Signature Section - NO BORDER, SEPARATE */}
        <div style={{ 
          width: '40%',
          textAlign: 'center',
          fontSize: '9px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {/* Principal Signature */}
          {transcriptData.signature && (
            <div style={{ marginBottom: '15px' }}>
              <img
                src={transcriptData.signature.preview}
                alt="Principal Signature"
                style={{ 
                  height: '60px', 
                  maxWidth: '200px', 
                  margin: '0 auto', 
                  objectFit: 'contain'
                }}
              />
            </div>
          )}
          <div style={{ 
            borderTop: '1px solid #000', 
            paddingTop: '8px',
            minWidth: '150px'
          }}>
            <div style={{ marginBottom: '5px' }}>
              Principal Signature: {transcriptData.principalName || 'Principal Name'}
            </div>
            <div>
              Date: {formatDate(transcriptData.dateSigned) || 'January 31, 2019'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper function to render course rows for side-by-side semesters
const renderSemesterCourseRows = (leftSemester, rightSemester, semesterGPAs) => {
  // Group courses by grade level for both semesters
  const groupByGradeLevel = (semester) => {
    const gradeGroups = {}
    semester.courses.forEach(course => {
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
    return Object.values(gradeGroups).sort((a, b) => a.gradeLevel - b.gradeLevel)
  }

  const leftGradeGroups = groupByGradeLevel(leftSemester)
  const rightGradeGroups = rightSemester ? groupByGradeLevel(rightSemester) : []
  
  const rows = []
  const maxGroups = Math.max(leftGradeGroups.length, rightGradeGroups.length)

  for (let i = 0; i < maxGroups; i++) {
    const leftGroup = leftGradeGroups[i]
    const rightGroup = rightGradeGroups[i]
    
    if (leftGroup || rightGroup) {
      // Render courses for this grade level
      const maxCourses = Math.max(
        leftGroup ? leftGroup.courses.length : 0,
        rightGroup ? rightGroup.courses.length : 0
      )

      for (let j = 0; j < maxCourses; j++) {
        const leftCourse = leftGroup ? leftGroup.courses[j] : null
        const rightCourse = rightGroup ? rightGroup.courses[j] : null

        rows.push(
          <tr key={`${i}-${j}`}>
            {/* Left Semester Course */}
            <td style={{ border: '1px solid #000', padding: '3px', fontSize: '8px' }}>
              {leftCourse ? leftCourse.gradeLevel : ''}
            </td>
            <td style={{ border: '1px solid #000', padding: '3px', fontSize: '8px' }}>
              {leftCourse ? `'${leftCourse.schoolYear}` : ''}
            </td>
            <td style={{ border: '1px solid #000', padding: '3px', fontSize: '8px' }}>
              {leftCourse ? leftCourse.courseTitle : ''}
            </td>
            <td style={{ border: '1px solid #000', padding: '3px', fontSize: '8px' }}>
              {leftCourse ? (leftCourse.hap || '') : ''}
            </td>
            <td style={{ border: '1px solid #000', padding: '3px', fontSize: '8px' }}>
              {leftCourse ? leftCourse.grade : ''}
            </td>
            <td style={{ border: '1px solid #000', padding: '3px', fontSize: '8px' }}>
              {leftCourse ? (isGradeCountedForGPA(leftCourse.grade) ? leftCourse.credits : '') : ''}
            </td>
            
            {/* Right Semester Course (if exists) */}
            {rightSemester && (
              <>
                <td style={{ border: '1px solid #000', padding: '3px', fontSize: '8px' }}>
                  {rightCourse ? rightCourse.gradeLevel : ''}
                </td>
                <td style={{ border: '1px solid #000', padding: '3px', fontSize: '8px' }}>
                  {rightCourse ? `'${rightCourse.schoolYear}` : ''}
                </td>
                <td style={{ border: '1px solid #000', padding: '3px', fontSize: '8px' }}>
                  {rightCourse ? rightCourse.courseTitle : ''}
                </td>
                <td style={{ border: '1px solid #000', padding: '3px', fontSize: '8px' }}>
                  {rightCourse ? (rightCourse.hap || '') : ''}
                </td>
                <td style={{ border: '1px solid #000', padding: '3px', fontSize: '8px' }}>
                  {rightCourse ? rightCourse.grade : ''}
                </td>
                <td style={{ border: '1px solid #000', padding: '3px', fontSize: '8px' }}>
                  {rightCourse ? (isGradeCountedForGPA(rightCourse.grade) ? rightCourse.credits : '') : ''}
                </td>
              </>
            )}
          </tr>
        )
      }

      // Add GPA rows for each grade level - ONLY IF GPA > 0
      const leftGpaKey = leftGroup ? `${leftGroup.gradeLevel}-${leftGroup.schoolYear}-${leftSemester.semester}` : null
      const rightGpaKey = rightGroup ? `${rightGroup.gradeLevel}-${rightGroup.schoolYear}-${rightSemester?.semester}` : null
      const leftGPA = leftGpaKey ? semesterGPAs[leftGpaKey] : null
      const rightGPA = rightGpaKey ? semesterGPAs[rightGpaKey] : null

      // ✅ ONLY SHOW GPA ROW IF AT LEAST ONE SIDE HAS GPA > 0
      const showLeftGPA = leftGPA && leftGPA.gpa > 0
      const showRightGPA = rightGPA && rightGPA.gpa > 0

      if (showLeftGPA || showRightGPA) {
        rows.push(
          <tr key={`gpa-${i}`} style={{ backgroundColor: '#f9f9f9' }}>
            <td style={{ 
              border: '1px solid #000', 
              padding: '4px', 
              fontWeight: 'bold', 
              fontSize: '8px'
            }} colSpan={rightSemester ? "6" : "12"}>
              {/* ✅ ONLY SHOW GPA TEXT IF > 0, OTHERWISE SHOW NOTHING */}
              {showLeftGPA ? `Sem. GPA (Weighted): ${leftGPA.gpa.toFixed(2)}` : ''}
            </td>
            {rightSemester && (
              <td style={{ 
                border: '1px solid #000', 
                padding: '4px', 
                fontWeight: 'bold', 
                fontSize: '8px'
              }} colSpan="6">
                {/* ✅ ONLY SHOW GPA TEXT IF > 0, OTHERWISE SHOW NOTHING */}
                {showRightGPA ? `Sem. GPA (Weighted): ${rightGPA.gpa.toFixed(2)}` : ''}
              </td>
            )}
          </tr>
        )
      }
    }
  }

  return rows
}

export default TranscriptPreview