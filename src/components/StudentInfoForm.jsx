import React from 'react'
import { useTranscript } from '../context/TranscriptContext'
import { Plus, Trash2 } from 'lucide-react'

const StudentInfoForm = () => {
  const { transcriptData, updateTranscriptData, formatSSNInput } = useTranscript()

  const handleChange = (field, value) => {
    updateTranscriptData({ [field]: value })
  }

  const handleSSNChange = (e) => {
    const formattedSSN = formatSSNInput(e.target.value)
    updateTranscriptData({ ssn: formattedSSN })
  }

  const handleEnrollmentChange = (index, field, value) => {
    const newEnrollment = [...transcriptData.enrollmentSummary]
    newEnrollment[index] = { ...newEnrollment[index], [field]: value }
    updateTranscriptData({ enrollmentSummary: newEnrollment })
  }

  const addEnrollmentEntry = () => {
    const newEnrollment = [...transcriptData.enrollmentSummary, { startEndDate: '', grade: '', school: '' }]
    updateTranscriptData({ enrollmentSummary: newEnrollment })
  }

  const removeEnrollmentEntry = (index) => {
    if (transcriptData.enrollmentSummary.length > 1) {
      const newEnrollment = transcriptData.enrollmentSummary.filter((_, i) => i !== index)
      updateTranscriptData({ enrollmentSummary: newEnrollment })
    }
  }

  // CREDIT TRANSFER MANAGEMENT FUNCTIONS
  const handleCreditTransferChange = (index, field, value) => {
    const newCreditTransfer = [...(transcriptData.creditTransfer || [])]
    newCreditTransfer[index] = { ...newCreditTransfer[index], [field]: value }
    updateTranscriptData({ creditTransfer: newCreditTransfer })
  }

  const addCreditTransferEntry = () => {
    const newCreditTransfer = [...(transcriptData.creditTransfer || []), { school: '', credits: 0 }]
    updateTranscriptData({ creditTransfer: newCreditTransfer })
  }

  const removeCreditTransferEntry = (index) => {
    if ((transcriptData.creditTransfer || []).length > 1) {
      const newCreditTransfer = transcriptData.creditTransfer.filter((_, i) => i !== index)
      updateTranscriptData({ creditTransfer: newCreditTransfer })
    }
  }

  // DYNAMIC CREDIT SUMMARY FUNCTIONS
  const handleCreditSummaryChange = (index, field, value) => {
    const newCreditSummary = [...transcriptData.creditSummary]
    newCreditSummary[index] = { ...newCreditSummary[index], [field]: value }
    updateTranscriptData({ creditSummary: newCreditSummary })
  }

  const addCreditSummaryEntry = () => {
    const newCreditSummary = [...transcriptData.creditSummary, { subject: '', earned: 0, required: 0 }]
    updateTranscriptData({ creditSummary: newCreditSummary })
  }

  const removeCreditSummaryEntry = (index) => {
    if (transcriptData.creditSummary.length > 1) {
      const newCreditSummary = transcriptData.creditSummary.filter((_, i) => i !== index)
      updateTranscriptData({ creditSummary: newCreditSummary })
    }
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Student Information</h3>
      
      {/* Institution Header */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-md font-medium text-gray-900 mb-4">Institution Information</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Institution Name
            </label>
            <input
              type="text"
              value={transcriptData.institutionName}
              onChange={(e) => handleChange('institutionName', e.target.value)}
              className="input-field"
              placeholder="e.g., ABC High School"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Institution Address
            </label>
            <input
              type="text"
              value={transcriptData.institutionAddress}
              onChange={(e) => handleChange('institutionAddress', e.target.value)}
              className="input-field"
              placeholder="e.g., 123 Main Street, City, State 12345"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="text"
              value={transcriptData.institutionPhone}
              onChange={(e) => handleChange('institutionPhone', e.target.value)}
              className="input-field"
              placeholder="e.g., Tel: (555) 123-4567"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={transcriptData.institutionEmail}
              onChange={(e) => handleChange('institutionEmail', e.target.value)}
              className="input-field"
              placeholder="e.g., registrar@school.edu"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CEEB Code
            </label>
            <input
              type="text"
              value={transcriptData.ceebCode}
              onChange={(e) => handleChange('ceebCode', e.target.value)}
              className="input-field"
              placeholder="e.g., 123456"
            />
          </div>
        </div>
      </div>

      {/* Student Information */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Student Name *
          </label>
          <input
            type="text"
            value={transcriptData.studentName}
            onChange={(e) => handleChange('studentName', e.target.value)}
            className="input-field"
            placeholder="e.g., Last, First Middle"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Student Number *
          </label>
          <input
            type="text"
            value={transcriptData.studentNumber}
            onChange={(e) => handleChange('studentNumber', e.target.value)}
            className="input-field"
            placeholder="e.g., 2024001"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address
          </label>
          <input
            type="text"
            value={transcriptData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            className="input-field"
            placeholder="e.g., 456 Oak Avenue, City, State 12345"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date of Birth
          </label>
          <input
            type="date"
            value={transcriptData.dateOfBirth}
            onChange={(e) => handleChange('dateOfBirth', e.target.value)}
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender
          </label>
          <select
            value={transcriptData.gender}
            onChange={(e) => handleChange('gender', e.target.value)}
            className="input-field"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Guardian
          </label>
          <input
            type="text"
            value={transcriptData.guardian}
            onChange={(e) => handleChange('guardian', e.target.value)}
            className="input-field"
            placeholder="e.g., Parent/Guardian Name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Social Security Number (SSN)
          </label>
          <input
            type="text"
            value={transcriptData.ssn}
            onChange={handleSSNChange}
            className="input-field"
            placeholder="e.g., 123-45-6789"
            maxLength="11"
          />
          <p className="text-xs text-gray-500 mt-1">
            Only the last 4 digits will be displayed on the transcript for security.
          </p>
        </div>
      </div>

      {/* GPA Summary */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-md font-medium text-gray-900 mb-4">GPA Summary</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cumulative GPA (Weighted)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="5"
              value={transcriptData.cumulativeGPA}
              onChange={(e) => handleChange('cumulativeGPA', e.target.value)}
              className="input-field"
              placeholder="e.g., 3.85"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total Credit Completed
            </label>
            <input
              type="number"
              step="1"
              min="0"
              value={transcriptData.totalCredits}
              onChange={(e) => handleChange('totalCredits', e.target.value)}
              className="input-field"
              placeholder="e.g., 24"
            />
          </div>
        </div>
      </div>

      {/* DYNAMIC Enrollment Summary - BLOCK 1 */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-md font-medium text-gray-900">Enrollment Summary (Block 1)</h4>
          <button
            type="button"
            onClick={addEnrollmentEntry}
            className="btn-primary flex items-center space-x-2 text-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Add School</span>
          </button>
        </div>
        
        <div className="space-y-4">
          {transcriptData.enrollmentSummary.map((enrollment, index) => (
            <div key={index} className="grid md:grid-cols-4 gap-4 p-3 bg-white rounded border">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start/End Date
                </label>
                <input
                  type="text"
                  value={enrollment.startEndDate}
                  onChange={(e) => handleEnrollmentChange(index, 'startEndDate', e.target.value)}
                  className="input-field"
                  placeholder="e.g., 2020-2021"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Grade
                </label>
                <input
                  type="text"
                  value={enrollment.grade}
                  onChange={(e) => handleEnrollmentChange(index, 'grade', e.target.value)}
                  className="input-field"
                  placeholder="e.g., 9"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  School
                </label>
                <input
                  type="text"
                  value={enrollment.school}
                  onChange={(e) => handleEnrollmentChange(index, 'school', e.target.value)}
                  className="input-field"
                  placeholder="e.g., Previous School Name"
                />
              </div>
              <div className="flex items-end">
                {transcriptData.enrollmentSummary.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEnrollmentEntry(index)}
                    className="btn-secondary text-red-600 hover:text-red-800 hover:bg-red-50 flex items-center space-x-1"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Remove</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <p className="text-sm text-blue-800">
            <strong>Block 1:</strong> Add all schools the student attended with dates and grade levels. This appears on the left side of the enrollment section.
          </p>
        </div>
      </div>

      {/* NEW: DYNAMIC Credit Transfer Management - BLOCK 2 */}
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-md font-medium text-gray-900">Total Credit Transferred (Block 2)</h4>
          <button
            type="button"
            onClick={addCreditTransferEntry}
            className="btn-primary flex items-center space-x-2 text-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Add School Credit</span>
          </button>
        </div>
        
        <div className="space-y-4">
          {(transcriptData.creditTransfer || []).map((transfer, index) => (
            <div key={index} className="grid md:grid-cols-3 gap-4 p-3 bg-white rounded border">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  School Name
                </label>
                <input
                  type="text"
                  value={transfer.school}
                  onChange={(e) => handleCreditTransferChange(index, 'school', e.target.value)}
                  className="input-field"
                  placeholder="e.g., Leigh High School"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Credits Transferred
                </label>
                <input
                  type="number"
                  min="0"
                  value={transfer.credits}
                  onChange={(e) => handleCreditTransferChange(index, 'credits', parseInt(e.target.value) || 0)}
                  className="input-field"
                  placeholder="e.g., 150"
                />
              </div>
              <div className="flex items-end">
                {(transcriptData.creditTransfer || []).length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCreditTransferEntry(index)}
                    className="btn-secondary text-red-600 hover:text-red-800 hover:bg-red-50 flex items-center space-x-1"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Remove</span>
                  </button>
                )}
              </div>
            </div>
          ))}
          
          {/* Add default entry if none exist */}
          {(!transcriptData.creditTransfer || transcriptData.creditTransfer.length === 0) && (
            <div className="text-center py-4 border-2 border-dashed border-yellow-300 rounded">
              <p className="text-gray-600 mb-2">No credit transfers added yet</p>
              <button
                type="button"
                onClick={addCreditTransferEntry}
                className="btn-primary text-sm"
              >
                Add First Credit Transfer
              </button>
            </div>
          )}
        </div>
        
        <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded">
          <p className="text-sm text-yellow-800">
            <strong>Block 2:</strong> Add schools and the total credits transferred from each. This appears on the right side of the enrollment section, separated by a line from Block 1.
          </p>
        </div>
      </div>

      {/* DYNAMIC Credit Summary */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-md font-medium text-gray-900">Credit Summary</h4>
          <button
            type="button"
            onClick={addCreditSummaryEntry}
            className="btn-primary flex items-center space-x-2 text-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Add Subject</span>
          </button>
        </div>
        
        <div className="space-y-4">
          {transcriptData.creditSummary.map((credit, index) => (
            <div key={index} className="grid md:grid-cols-4 gap-4 p-3 bg-white rounded border">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={credit.subject}
                  onChange={(e) => handleCreditSummaryChange(index, 'subject', e.target.value)}
                  className="input-field"
                  placeholder="e.g., Mathematics, English, Science"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Earned Credits
                </label>
                <input
                  type="number"
                  min="0"
                  value={credit.earned}
                  onChange={(e) => handleCreditSummaryChange(index, 'earned', parseInt(e.target.value) || 0)}
                  className="input-field"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Required Credits
                </label>
                <input
                  type="number"
                  min="0"
                  value={credit.required}
                  onChange={(e) => handleCreditSummaryChange(index, 'required', parseInt(e.target.value) || 0)}
                  className="input-field"
                  placeholder="0"
                />
              </div>
              <div className="md:col-span-4 flex justify-end">
                {transcriptData.creditSummary.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCreditSummaryEntry(index)}
                    className="btn-secondary text-red-600 hover:text-red-800 hover:bg-red-50 flex items-center space-x-1 text-sm"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Remove Subject</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <p className="text-sm text-blue-800">
            <strong>Tip:</strong> Add all academic subjects with their earned and required credits. Common subjects include Mathematics, English, Science, History, Foreign Language, Arts, and Physical Education.
          </p>
        </div>
      </div>

      {/* Principal Information */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-md font-medium text-gray-900 mb-4">Principal Information</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Principal Name
            </label>
            <input
              type="text"
              value={transcriptData.principalName}
              onChange={(e) => handleChange('principalName', e.target.value)}
              className="input-field"
              placeholder="e.g., Dr. Jane Smith"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Signed
            </label>
            <input
              type="date"
              value={transcriptData.dateSigned}
              onChange={(e) => handleChange('dateSigned', e.target.value)}
              className="input-field"
            />
          </div>
        </div>
      </div>

      {/* Comments */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Comments
        </label>
        <textarea
          value={transcriptData.comments}
          onChange={(e) => handleChange('comments', e.target.value)}
          className="input-field"
          rows="4"
          placeholder="Enter any additional comments or notes about the transcript..."
        />
      </div>
    </div>
  )
}

export default StudentInfoForm