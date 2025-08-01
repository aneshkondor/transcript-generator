import React, { useRef } from 'react'
import { useTranscript } from '../context/TranscriptContext'
import { Upload, X, FileText, PenTool } from 'lucide-react'

const FilesUpload = () => {
  const { transcriptData, updateTranscriptData } = useTranscript()
  
  // Create refs for file inputs
  const stampInputRef = useRef(null)
  const signatureInputRef = useRef(null)

  const handleFileSelect = (fileType, maxSize = 5 * 1024 * 1024) => {
    return (event) => {
      const file = event.target.files[0]
      if (!file) return

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload only image files (JPEG, PNG, GIF)')
        return
      }

      // Validate file size
      if (file.size > maxSize) {
        alert(`File size must be less than ${maxSize / (1024 * 1024)}MB`)
        return
      }

      console.log('Processing file:', file.name, file.type, file.size)
      
      const reader = new FileReader()
      reader.onload = () => {
        console.log('File read successfully for:', fileType)
        updateTranscriptData({
          [fileType]: {
            file,
            preview: reader.result,
            name: file.name,
            size: file.size
          }
        })
      }
      reader.onerror = () => {
        console.error('Error reading file')
        alert('Error reading file. Please try again.')
      }
      reader.readAsDataURL(file)
      
      // Reset the input value so the same file can be selected again
      event.target.value = ''
    }
  }

  const removeFile = (fileType) => {
    updateTranscriptData({ [fileType]: null })
  }

  const triggerFileInput = (inputRef) => {
    inputRef.current?.click()
  }

  const FileUploadArea = ({ title, description, icon: Icon, fileData, fileType, inputRef, maxSize }) => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Icon className="h-5 w-5 text-gray-600" />
        <h4 className="text-md font-medium text-gray-900">{title}</h4>
      </div>
      
      {fileData ? (
        <div className="relative">
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {fileData.preview && (
                  <img
                    src={fileData.preview}
                    alt="Preview"
                    className="h-16 w-16 object-cover rounded border"
                  />
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900">{fileData.name}</p>
                  <p className="text-xs text-gray-500">
                    {(fileData.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => triggerFileInput(inputRef)}
                  className="text-primary-600 hover:text-primary-800 text-sm"
                  type="button"
                >
                  Change
                </button>
                <button
                  onClick={() => removeFile(fileType)}
                  className="text-red-600 hover:text-red-800"
                  type="button"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={() => triggerFileInput(inputRef)}
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer transition-colors hover:border-gray-400 hover:bg-gray-50"
          style={{ minHeight: '120px' }}
        >
          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-1">
            Click here to select a file
          </p>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      )}
      
      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect(fileType, maxSize)}
        style={{ display: 'none' }}
      />
    </div>
  )

  return (
    <div className="space-y-8">
      <h3 className="text-lg font-semibold text-gray-900">Files & Assets</h3>
      
      <div className="grid md:grid-cols-1 gap-8">
        <FileUploadArea
          title="Digital Stamp"
          description="Upload institutional stamp or seal (JPEG, PNG, max 5MB)"
          icon={FileText}
          fileData={transcriptData.digitalStamp}
          fileType="digitalStamp"
          inputRef={stampInputRef}
          maxSize={5 * 1024 * 1024}
        />
        
        <FileUploadArea
          title="Digital Signature"
          description="Upload authorized signature (JPEG, PNG, max 5MB)"
          icon={PenTool}
          fileData={transcriptData.signature}
          fileType="signature"
          inputRef={signatureInputRef}
          maxSize={5 * 1024 * 1024}
        />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">File Requirements</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Digital stamp should be the official institutional seal</li>
          <li>• Signature should be from an authorized academic official</li>
          <li>• All images should have transparent backgrounds when possible</li>
          <li>• Supported formats: JPEG, PNG, GIF</li>
        </ul>
      </div>
    </div>
  )
}

export default FilesUpload