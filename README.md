# Campus Recruitment System (CRS) - Full Project Documentation

## 1. Project Title
**Campus Recruitment System (CRS)**
*A Modern, Automated, and Scalable Solution for Academic Placement Management.*

---

## 2. Project Overview
The **Campus Recruitment System (CRS)** is a comprehensive web-based application designed to streamline the recruitment process within educational institutions. Built using the **MEAN (MongoDB, Express, Angular, Node.js)** stack, it facilitates professional interaction between the college placement cell (Admin) and the students (Clients). The system automates job listings, application tracking, eligibility filtering, and real-time notifications, providing a seamless experience for both administrators and job seekers.

---

## 3. Problem Statement
Traditional campus recruitment processes are often hindered by:
- **Manual Paperwork:** Coordinating applications, resumes, and eligibility lists through spreadsheets and physical documents is error-prone.
- **Lack of Transparency:** Students often remain unaware of their application status or upcoming opportunities.
- **Inefficient Communication:** Sending manual emails or posting physical notices leads to delays and missed deadlines.
- **Data Redundancy:** Maintaining student records and placement history across multiple disconnected files.

---

## 4. Objectives of the Project
- **Automation:** To automate the end-to-end recruitment workflow from job posting to final selection.
- **Accessibility:** To provide a 24/7 accessible platform for students to browse and apply for jobs.
- **Accuracy:** To implement automated eligibility checks (e.g., CGPA-based) to ensure only qualified candidates apply.
- **Real-time Updates:** To provide instant notifications regarding new jobs and application status changes.
- **Centralized Management:** To maintain a unified database for student profiles, job listings, and placement statistics.

---

## 5. Why this Project is Needed
In the modern educational landscape, the placement rate is a key metric of institutional success. A digital system ensures:
- **Fairness:** Automated eligibility rules prevent manual bias.
- **Scalability:** Handles hundreds of students and dozens of companies simultaneously.
- **Efficiency:** Reduces the administrative workload of the placement cell by over 60%.
- **Future-Ready:** Digital records help in generating year-end placement reports for accreditation (NAAC/NBA).

---

## 6. Scope of the Project
The scope includes:
- **Profile Management:** Comprehensive digital resumes for students.
- **Job Lifecycle:** Posting, editing, closing, and tracking job openings.
- **Application Portal:** A dedicated interface for students to track their progress.
- **Analytics:** Statistical visualization of placement data for admins.
- **Security:** Role-based access control and encrypted data storage.

---

## 7. Features of the System

### Admin Side Features
- **Dashboard:** At-a-glance view of total students, active jobs, and recent applications.
- **Student Management:** View, search, and manage student profiles and academic records.
- **Job Management:** Create and edit job postings with specific eligibility criteria (CGPA, Branch).
- **Application Tracking:** Manage applicant lists, change application statuses (Shortlisted/Selected/Rejected).
- **Notifications:** Send system-wide announcements or targeted alerts.
- **System Settings:** Configure platform parameters and administrative credentials.

### Client (Student) Side Features
- **Self-Registration:** Secure account creation with academic and personal details.
- **Interactive Dashboard:** Personal stats (Applied jobs, pending notifications).
- **Job Discovery:** Browse active job openings with advanced filtering.
- **Eligibility Validation:** Real-time feedback if a student meets the minimum CGPA for a job.
- **Application History:** Track the status of every submitted application.
- **Profile Customization:** Update skills, contact details, and academic performance.

---

## 8. User Roles and Permissions
The system operates on a dual-role architecture:
1. **Admin:** Full access to all modules, including data management, job posting, and final decision-making.
2. **Student:** Restricted access to job browsing, application submission, and personal profile management.
*Authentication is handled via JWT, ensuring that users can only access routes assigned to their roles.*

---

## 9. System Architecture
The system follows a **Client-Server Architecture** using a Monorepo approach:
- **Frontend Layer:** Two separate Angular applications (Admin and Client) providing modularized UI.
- **Backend Layer:** A RESTful Node.js/Express service handling business logic.
- **Data Layer:** MongoDB for flexible, document-oriented data storage.
- **Communication:** Standard HTTP/JSON protocols for data exchange.

---

## 10. Single Page Application (SPA) Concept
This project is built as a **Single Page Application (SPA)** using Angular.
- **No Page Reloads:** Only necessary components are updated dynamically, providing a desktop-like experience.
- **Client-Side Routing:** The `Angular Router` manages navigation without requesting new HTML files from the server.
- **State Management:** Data is fetched asynchronously via Services, keeping the UI responsive.

---

## 11. Technology Stack
- **Frontend:** Angular 21, TypeScript, Tailwind CSS (for modern, responsive styling).
- **Backend:** Node.js, Express.js (RESTful API architecture).
- **Database:** MongoDB (using Mongoose ODM).
- **Security:** JWT (JSON Web Tokens), BCrypt for password hashing.
- **Testing:** Vitest (for frontend unit testing).

---

## 12. Folder Structure Explanation
The project uses an Angular Workspace (Monorepo) structure:
- `/projects/admin`: Dedicated Angular application for administrators.
- `/projects/client`: Dedicated Angular application for students.
- `/backend`: Node.js/Express server containing controllers, models, and routes.
- `/node_modules`: External libraries and dependencies.
- `angular.json`: Workspace configuration for multiple projects.
- `tailwind.config.js`: Global styling configurations.

---

## 13. Modules Description

### Admin Modules
- **Auth Module:** Handles secure login and session management.
- **User Management Module:** CRUD operations for student records.
- **Recruitment Module:** Core engine for job postings and applicant filtering.
- **Notification Module:** Broadcast management system.

### Student Modules
- **Profile Module:** Manage academic data and personal skills.
- **Job Portal Module:** Browse jobs and check eligibility.
- **Tracking Module:** Visualization of application progress.

---

## 14. Authentication and Authorization Flow
1. **Login:** User submits credentials to the `/api/auth/login` endpoint.
2. **Verification:** Backend validates credentials and returns a signed **JWT**.
3. **Storage:** The token is stored in the browser's `localStorage`.
4. **Interceptors:** A HTTP Interceptor automatically attaches the token to the header of every outgoing request.
5. **Guards:** Angular `AuthGuard` prevents unauthorized access to protected routes based on the user's role.

---

## 15. Routing and Navigation Flow
- **Lazy Loading:** Components are loaded only when needed to optimize initial load time.
- **Route Guards:** Ensure that a student cannot access admin routes (e.g., `/admin/settings`) and vice versa.
- **Resolvers:** Data is pre-fetched before the component is rendered, ensuring no empty states or "flash of unstyled content."

---

## 16. Database / Data Model Overview
- **User Model:** Stores `fullName`, `email`, `password`, `cgpa`, `department`, and `role`.
- **Job Model:** Stores `companyName`, `role`, `eligibility` (branches, minCGPA), `package`, and an array of `applications`.
- **Notification Model:** Stores `title`, `message`, `targetAudience`, and `timestamp`.

---

## 17. Job, Application, and Notification Flow
1. **Posting:** Admin creates a job listing with a set `minCGPA`.
2. **Browsing:** Students see the job on their dashboard.
3. **Application:** System checks student's `cgpa` against job's `minCGPA`. If eligible, application is recorded.
4. **Processing:** Admin marks the application as "Shortlisted" or "Selected".
5. **Alerting:** A notification is automatically generated and visible on the student's notification panel.

---

## 18. Error Handling and User-Friendly Notifications
- **Global Error Handler:** Catches backend errors (e.g., 404, 500) and displays human-readable messages.
- **Toast Notifications:** Smooth UI alerts for successful actions (e.g., "Application Submitted Successfully").
- **Form Validation:** Instant feedback on empty fields or invalid email formats.

---

## 19. UI/UX Design Approach
- **Responsive Design:** Fully functional on mobiles, tablets, and desktops using Tailwind CSS.
- **Modern Aesthetics:** Clean, minimalist interface with a professional color palette.
- **Accessibility:** High contrast ratios and semantic HTML elements.
- **Interactive Elements:** Hover effects, smooth transitions, and loading skeletons.

---

## 20. Performance and Optimization Techniques
- **Component Reusability:** Shared UI components for buttons, cards, and tables.
- **Efficient API Calls:** Avoiding redundant requests through Angular Resolvers.
- **Build Optimization:** AOT (Ahead-of-Time) compilation for faster rendering.
- **Tailwind JIT:** Minimal CSS footprint by generating only used styles.

---

## 21. Security Considerations
- **Password Hashing:** Passwords are never stored in plain text (BCrypt).
- **JWT Security:** Tokens expire after a set time to prevent session hijacking.
- **CORS Configuration:** Restricts API access to authorized domains only.
- **Sanitization:** Backend inputs are sanitized to prevent NoSQL injection.

---

## 22. Validation Rules
- **Academic:** CGPA must be between 0 and 10.
- **Contact:** Mobile number must be 10 digits.
- **Auth:** Email must follow standard RFC formats; passwords must be at least 6 characters.
- **Eligibility:** Students cannot apply for jobs if their CGPA is below the requirement.

---

## 23. Reusable Components and Services
- **AuthService:** Centralized logic for login/logout and token management.
- **NotificationService:** Reusable utility for showing alerts across the app.
- **ApiService:** Abstracted HTTP client for clean backend communication.
- **UI Components:** Generic headers, sidebars, and data tables.

---

## 24. API Integration Overview
The frontend communicates with a set of REST endpoints:
- `POST /api/auth/login`: Authentication.
- `GET /api/jobs`: Fetch job listings.
- `POST /api/jobs/:id/apply`: Submit applications.
- `GET /api/admin/stats`: Get dashboard metrics.

---

## 25. Limitations of the Project
- **Resume Parsing:** Current version requires manual entry of details instead of PDF parsing.
- **Interview Scheduling:** Does not yet include a calendar for direct interview booking.
- **Email Integration:** Notifications are currently in-app only (no SMTP yet).

---

## 26. Future Enhancements
- **Resume Builder:** PDF generation for student profiles.
- **AI Matching:** Suggesting jobs based on student skills and performance.
- **Interview Module:** Video conferencing integration for remote interviews.
- **Mobile App:** Native Android/iOS applications using Capacitor or React Native.

---

## 27. How to Run the Project

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- Angular CLI

### Installation
1. Clone the repository.
2. Run `npm install` in the root directory.
3. Navigate to `/backend` and run `npm install`.

### Start the Application
1. **Backend:** In `/backend`, run `npm start` (Runs on port 5000).
2. **Admin App:** Run `ng serve admin` (Runs on port 4200).
3. **Client App:** Run `ng serve client --port 4201` (Runs on port 4201).

---

## 28. Conclusion
The **Campus Recruitment System** is a robust solution that digitizes the vital link between education and employment. By replacing legacy manual processes with a high-performance SPA, it ensures that placement cells operate with maximum efficiency and students have the best possible chance at launching their careers. Its modular design and modern tech stack make it easily maintainable and ready for future technological integration.
