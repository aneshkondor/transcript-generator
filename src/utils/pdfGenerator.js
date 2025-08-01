import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

// Enhanced PDF generation with high-quality settings
export const generatePDF = async (transcriptData) => {
  try {
    // Get the transcript preview element
    const element = document.getElementById('transcript-preview')
    if (!element) {
      throw new Error('Transcript preview element not found')
    }

    // Show loading indicator
    const loadingDiv = document.createElement('div')
    loadingDiv.id = 'pdf-loading'
    loadingDiv.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0,0,0,0.8);
      color: white;
      padding: 20px;
      border-radius: 8px;
      z-index: 9999;
      font-family: Arial, sans-serif;
    `
    loadingDiv.innerHTML = 'Generating high-quality PDF...'
    document.body.appendChild(loadingDiv)

    // Temporarily modify element for better PDF rendering
    const originalStyle = element.style.cssText
    element.style.cssText = `
      ${originalStyle}
      position: relative;
      background: white !important;
      color: black !important;
      font-family: Arial, sans-serif !important;
      line-height: 1.2 !important;
      box-shadow: none !important;
      border: none !important;
      margin: 0 !important;
      padding: 20px !important;
      width: 8.5in !important;
      min-height: auto !important;
      transform: none !important;
      zoom: 1 !important;
    `

    // Wait for fonts and images to load
    await new Promise(resolve => setTimeout(resolve, 500))

    // High-quality canvas generation with optimized settings
    const canvas = await html2canvas(element, {
      scale: 3, // Higher scale for crisp text
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      width: element.scrollWidth,
      height: element.scrollHeight,
      scrollX: 0,
      scrollY: 0,
      letterRendering: true,
      logging: false,
      imageTimeout: 15000,
      removeContainer: true,
      foreignObjectRendering: false,
      onclone: (clonedDoc) => {
        // Ensure all styles are properly applied in the clone
        const clonedElement = clonedDoc.getElementById('transcript-preview')
        if (clonedElement) {
          clonedElement.style.cssText = `
            font-family: Arial, sans-serif !important;
            background: white !important;
            color: black !important;
            line-height: 1.2 !important;
            font-size: 11px !important;
            width: 8.5in !important;
            padding: 20px !important;
            margin: 0 !important;
            box-shadow: none !important;
            border: none !important;
          `
          
          // Fix all table borders and text
          const tables = clonedElement.querySelectorAll('table, div[style*="border"]')
          tables.forEach(table => {
            table.style.borderCollapse = 'collapse'
            table.style.border = '1px solid #000'
          })
          
          // Fix all text elements
          const textElements = clonedElement.querySelectorAll('*')
          textElements.forEach(el => {
            if (el.style) {
              el.style.fontFamily = 'Arial, sans-serif'
              el.style.color = '#000'
              el.style.backgroundColor = el.style.backgroundColor || 'transparent'
            }
          })
        }
      }
    })

    // Restore original element style
    element.style.cssText = originalStyle

    // Calculate PDF dimensions (A4 size)
    const pdfWidth = 210 // A4 width in mm
    const pdfHeight = 297 // A4 height in mm
    const imgWidth = pdfWidth - 20 // Leave margins
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    
    // Create PDF with high quality settings
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: false, // Don't compress for better quality
      precision: 16
    })

    // Add the image to PDF with proper positioning
    let yPosition = 10 // Top margin
    let remainingHeight = imgHeight

    // If content fits on one page
    if (imgHeight <= pdfHeight - 20) {
      pdf.addImage(
        canvas.toDataURL('image/png', 1.0), // Maximum quality
        'PNG',
        10, // Left margin
        yPosition,
        imgWidth,
        imgHeight,
        undefined,
        'FAST' // Use FAST compression for better quality
      )
    } else {
      // Multi-page handling
      let pageCount = 0
      while (remainingHeight > 0) {
        if (pageCount > 0) {
          pdf.addPage()
        }
        
        const pageHeight = Math.min(remainingHeight, pdfHeight - 20)
        const sourceY = pageCount * (pdfHeight - 20) * (canvas.height / imgHeight)
        const sourceHeight = pageHeight * (canvas.height / imgHeight)
        
        // Create a temporary canvas for this page
        const pageCanvas = document.createElement('canvas')
        const pageCtx = pageCanvas.getContext('2d')
        pageCanvas.width = canvas.width
        pageCanvas.height = sourceHeight
        
        // Draw the portion of the original canvas for this page
        pageCtx.drawImage(
          canvas,
          0, sourceY, canvas.width, sourceHeight,
          0, 0, canvas.width, sourceHeight
        )
        
        pdf.addImage(
          pageCanvas.toDataURL('image/png', 1.0),
          'PNG',
          10,
          10,
          imgWidth,
          pageHeight,
          undefined,
          'FAST'
        )
        
        remainingHeight -= pageHeight
        pageCount++
      }
    }

    // Generate filename with timestamp
    const studentName = transcriptData.studentName || 'Student'
    const cleanName = studentName.replace(/[^a-zA-Z0-9]/g, '_')
    const timestamp = new Date().toISOString().split('T')[0]
    const filename = `${cleanName}_Official_Transcript_${timestamp}.pdf`

    // Remove loading indicator
    document.body.removeChild(loadingDiv)

    // Save the PDF
    pdf.save(filename)
    
    return true
  } catch (error) {
    // Remove loading indicator if it exists
    const loadingDiv = document.getElementById('pdf-loading')
    if (loadingDiv) {
      document.body.removeChild(loadingDiv)
    }
    
    console.error('PDF Generation Error:', error)
    throw new Error(`PDF generation failed: ${error.message}`)
  }
}

// Alternative method using browser's native print functionality
export const generatePDFViaPrint = async (transcriptData) => {
  try {
    const element = document.getElementById('transcript-preview')
    
    if (!element) {
      throw new Error('Transcript preview element not found')
    }

    // Attempt to create a new window for printing
    const printWindow = window.open('', '_blank')
    
    // Check if the window was successfully created
    if (!printWindow) {
      throw new Error('Unable to open print window. This is likely due to a pop-up blocker. Please allow pop-ups for this site and try again, or use the regular PDF download option instead.')
    }

    // Enhanced print styles for perfect PDF output
    const printHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Official Transcript - ${transcriptData.studentName || 'Student'}</title>
        <style>
          @page {
            size: A4;
            margin: 0.5in;
          }
          body {
            font-family: Arial, sans-serif;
            font-size: 11px;
            line-height: 1.2;
            color: black;
            color: #000 !important;
            background: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            margin: 0;
            padding: 0;
          }
          table {
            border-collapse: collapse;
            width: 100%;
          }
          th, td {
            border: 1px solid black;
            padding: 4px;
            text-align: left;
          }
 th {
            background-color: #f5f5f5 !important;
          }
          .no-print {
            display: none;
          }
        </style>
      </head>
      <body>
        ${element.outerHTML}
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
              window.close();
            }, 500);
          }
        </script>
      </body>
      </html>
    `

    printWindow.document.write(printHTML)
    printWindow.document.close()
    
    return true
  } catch (error) {
    console.error('Print PDF Error:', error)
    throw new Error(`Print PDF generation failed: ${error.message}`)
  }
}

// Blob generation for programmatic use
export const generatePDFBlob = async (transcriptData) => {
  try {
    const element = document.getElementById('transcript-preview')
    if (!element) {
      throw new Error('Transcript preview element not found')
    }

    // Use the same high-quality settings as the main function
    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      letterRendering: true,
      logging: false,
      removeContainer: true,
      foreignObjectRendering: false
    })

    const pdfWidth = 210
    const pdfHeight = 297
    const imgWidth = pdfWidth - 20
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: false,
      precision: 16
    })

    if (imgHeight <= pdfHeight - 20) {
      pdf.addImage(
        canvas.toDataURL('image/png', 1.0),
        'PNG',
        10,
        10,
        imgWidth,
        imgHeight,
        undefined,
        'FAST'
      )
    } else {
      // Handle multi-page content
      let remainingHeight = imgHeight
      let pageCount = 0
      
      while (remainingHeight > 0) {
        if (pageCount > 0) {
          pdf.addPage()
        }
        
        const pageHeight = Math.min(remainingHeight, pdfHeight - 20)
        const sourceY = pageCount * (pdfHeight - 20) * (canvas.height / imgHeight)
        const sourceHeight = pageHeight * (canvas.height / imgHeight)
        
        const pageCanvas = document.createElement('canvas')
        const pageCtx = pageCanvas.getContext('2d')
        pageCanvas.width = canvas.width
        pageCanvas.height = sourceHeight
        
        pageCtx.drawImage(
          canvas,
          0, sourceY, canvas.width, sourceHeight,
          0, 0, canvas.width, sourceHeight
        )
        
        pdf.addImage(
          pageCanvas.toDataURL('image/png', 1.0),
          'PNG',
          10,
          10,
          imgWidth,
          pageHeight,
          undefined,
          'FAST'
        )
        
        remainingHeight -= pageHeight
        pageCount++
      }
    }

    return pdf.output('blob')
  } catch (error) {
    console.error('PDF Blob Error:', error)
    throw new Error(`PDF blob generation failed: ${error.message}`)
  }
}

// Quality test function
export const testPDFQuality = async () => {
  try {
    const testElement = document.createElement('div')
    testElement.innerHTML = `
      <div style="font-family: Arial, sans-serif; padding: 20px; background: white; color: black;">
        <h1 style="border: 2px solid black; padding: 10px; text-align: center;">PDF Quality Test</h1>
        <table style="border-collapse: collapse; width: 100%; margin: 20px 0;">
          <tr>
            <th style="border: 1px solid black; padding: 5px;">Test Item</th>
            <th style="border: 1px solid black; padding: 5px;">Expected Result</th>
          </tr>
          <tr>
            <td style="border: 1px solid black; padding: 5px;">Text Clarity</td>
            <td style="border: 1px solid black; padding: 5px;">Sharp, readable text</td>
          </tr>
          <tr>
            <td style="border: 1px solid black; padding: 5px;">Border Rendering</td>
            <td style="border: 1px solid black; padding: 5px;">Clean, solid lines</td>
          </tr>
        </table>
      </div>
    `
    testElement.id = 'pdf-quality-test'
    document.body.appendChild(testElement)

    const canvas = await html2canvas(testElement, {
      scale: 3,
      useCORS: true,
      backgroundColor: '#ffffff',
      letterRendering: true
    })

    document.body.removeChild(testElement)

    const pdf = new jsPDF('p', 'mm', 'a4')
    const imgWidth = 190
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    pdf.addImage(canvas.toDataURL('image/png', 1.0), 'PNG', 10, 10, imgWidth, imgHeight)
    pdf.save('PDF_Quality_Test.pdf')

    return true
  } catch (error) {
    console.error('PDF Quality Test Error:', error)
    return false
  }
}