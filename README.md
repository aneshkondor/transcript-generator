# Transcript Generator

A professional web application for generating official-looking academic transcripts with real-time preview and PDF export capabilities.

## Features

### Core Functionality
- **Interactive Form Interface**: Easy-to-use forms for entering student information, courses, and grades
- **Real-time Preview**: Live preview of the transcript as you fill out the form
- **PDF Generation**: High-quality PDF export with embedded photos and signatures
- **File Upload Support**: Upload student photos, digital stamps, and signatures
- **Save & Resume**: Save progress and return to edit transcripts later

### Student Information Management
- Student personal details (name, ID, date of birth)
- Academic program information (degree, major, minor)
- Institution details (name, address)
- Graduation information and honors

### Academic Records
- Course management (add, edit, delete courses)
- Grade tracking with visual indicators
- Credit hour calculation
- GPA computation (manual or automatic)
- Semester and year organization

### Professional Features
- Official transcript formatting
- Digital stamp and signature integration
- Passport-style photo embedding
- Professional PDF layout
- Academic standards compliance

## Technology Stack

- **Frontend**: React 18 with modern hooks
- **Styling**: Tailwind CSS for responsive design
- **Routing**: React Router for navigation
- **PDF Generation**: html2canvas + jsPDF for high-quality exports
- **File Handling**: react-dropzone for drag-and-drop uploads
- **Icons**: Lucide React for consistent iconography
- **Build Tool**: Vite for fast development and building

## Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd transcript-generator
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage Guide

### Creating a Transcript

1. **Navigate to Create Transcript**: Click on "Create Transcript" in the navigation
2. **Fill Student Information**: Enter student details, program information, and institution data
3. **Add Courses**: Use the courses tab to add academic records with grades and credits
4. **Upload Files**: Add student photo, digital stamp, and signature in the files tab
5. **Preview**: Review the real-time preview to ensure accuracy
6. **Generate PDF**: Click "Generate PDF" to download the final transcript

### Admin Panel

- **View Saved Transcripts**: See all previously saved transcripts
- **Load for Editing**: Load any saved transcript for modifications
- **Delete Transcripts**: Remove unwanted transcript records
- **System Statistics**: View usage statistics and storage information

## File Requirements

### Student Photo
- Format: JPEG, PNG, GIF
- Size: Maximum 2MB
- Recommended: Passport-style photo (2x2 cm)

### Digital Stamp
- Format: JPEG, PNG, GIF
- Size: Maximum 5MB
- Content: Official institutional seal or stamp

### Digital Signature
- Format: JPEG, PNG, GIF
- Size: Maximum 5MB
- Content: Authorized academic official signature

## Features in Detail

### Real-time Preview
The application provides a live preview of the transcript that updates automatically as you enter information. This allows you to see exactly how the final document will look before generating the PDF.

### Grade Management
- Support for standard letter grades (A+ through F)
- Pass/No Pass options
- Withdrawal and Incomplete grades
- Visual grade indicators with color coding
- Automatic GPA calculation

### PDF Export
- High-resolution output suitable for official use
- Embedded images maintain quality
- Professional formatting that matches academic standards
- Automatic page breaks for longer transcripts

### Data Persistence
- Local storage for saving work in progress
- Export/import functionality for backup
- Multiple transcript management

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the development team.

## Roadmap

### Upcoming Features
- [ ] Multiple transcript templates
- [ ] Batch transcript generation
- [ ] Advanced grade calculation options
- [ ] Integration with student information systems
- [ ] Digital signature verification
- [ ] Watermark support
- [ ] Custom institution branding
- [ ] Export to other formats (Word, Excel)

### Known Issues
- Large images may affect PDF generation performance
- Some browsers may have CORS restrictions with file uploads

## Acknowledgments

- React team for the excellent framework
- Tailwind CSS for the utility-first CSS framework
- Contributors to html2canvas and jsPDF libraries
- Lucide for the beautiful icon set