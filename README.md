# Campus Recruitment System (CRS)

A comprehensive campus recruitment management system built with Angular and Node.js/Express.

## Project Structure

This is a monorepo containing three applications:

- **Admin Application** (`projects/admin`) - Administrative interface for managing jobs, students, and applications
- **Client Application** (`projects/client`) - Student-facing interface for browsing and applying to jobs
- **Backend API** (`backend`) - Node.js/Express REST API with MongoDB

## Prerequisites

- Node.js (v18 or higher)
- MongoDB
- Angular CLI (v21.1.1)

## Installation

1. Install root dependencies:
```bash
npm install
```

2. Install backend dependencies:
```bash
cd backend
npm install
cd ..
```

## Development

### Start Backend Server
```bash
cd backend
npm start
```
The API will run on `http://localhost:5000`

### Start Admin Application
```bash
ng serve admin
```
The admin app will run on `http://localhost:4200`

### Start Client Application
```bash
ng serve client --port 4201
```
The client app will run on `http://localhost:4201`

## Environment Configuration

Both applications use environment files located at:
- `projects/admin/src/environments/environment.ts`
- `projects/client/src/environments/environment.ts`

Backend configuration is in `backend/.env`

## Features

### Admin Application
- Dashboard with statistics
- Job management (create, edit, delete, close)
- Student management and profiles
- Application tracking and status updates
- Notifications system
- Settings and configurations

### Client Application
- Student registration and authentication
- Job browsing and filtering
- Job application submission
- Application tracking
- Profile management
- Notifications
- Statistics dashboard

### Backend API
- RESTful API endpoints
- JWT authentication
- Role-based access control (Admin/Student)
- MongoDB data persistence
- Notification system

## Building for Production

### Build Admin Application
```bash
ng build admin --configuration production
```

### Build Client Application
```bash
ng build client --configuration production
```

Build artifacts will be stored in the `dist/` directory.

## Tech Stack

- **Frontend**: Angular 21, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)

## Additional Resources

For more information on using the Angular CLI, visit the [Angular CLI Documentation](https://angular.dev/tools/cli).
