# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript 
and [`typescript-eslint`](https://typescript-eslint.io) in your project.


Patient Management System - A Modern Web-Based Healthcare Records Solution
The Patient Management System is a responsive web application that provides healthcare professionals with an intuitive interface for managing patient records. Built with React and Material-UI, it offers real-time patient registration and management capabilities with offline-first data persistence using PGlite.
The system features a modern, healthcare-themed interface with a dual-panel layout: a patient registration form for adding new records and a searchable patient records table. It implements real-time synchronization across browser tabs and provides immediate feedback for data operations with comprehensive form validation.

Repository Structure
.
├── src/                      # Source code directory
│   ├── App.jsx              # Main application component with theme and layout
│   ├── PatientForm.jsx      # Patient registration form component
│   ├── PatientQuery.jsx     # Patient records display and search component
│   ├── main.jsx            # Application entry point
│   └── App.css             # Application styles
├── public/                  # Static assets directory
│   └── pglite.js          # PGlite database client
├── dbConnection.js         # Database connection and query utilities
├── vite.config.js         # Vite build configuration
├── package.json           # Project dependencies and scripts
└── index.html            # HTML entry point

Usage Instructions
Prerequisites
Node.js (v14 or higher)
Yarn package manager (v4.8.0)
Modern web browser with IndexedDB support
Internet connection for initial package installation
Installation
# Clone the repository
git clone <repository-url>
cd patient-management-system

# Install dependencies
yarn install

# Start development server
yarn dev

Launch the application:
yarn dev
Access the application at http://localhost:5173 (or the port shown in your terminal)
Begin registering patients using the registration form on the left panel
View and search patient records in the right panel

Searching Patient Records:
Use the search bar above the patient records table
Search by name, email, or phone number
Results update in real-time as you type

Form Validation Errors:
Email format: Ensure valid email format (e.g., user@domain.com)
Phone format: Must contain at least 10 digits
Age: Must be between 0 and 120

Data Flow
The application implements a client-side data management system using PGlite for local storage and synchronization.
[User Input] -> [Form Validation] -> [PGlite Database]
                                          |
                                    [Data Sync]
                                          |
[Search Query] <- [Patient Records] <- [IndexedDB]

Key component interactions:
User submits patient data through PatientForm
Form validation ensures data integrity
Data is stored in PGlite database
Changes are synchronized across browser tabs
PatientQuery component fetches and displays records
Search functionality filters records in real-time
Delete operations trigger immediate UI updates
Cross-tab communication maintains data consistency
