# Smart Campus Scheduling and Attendance Platform

A comprehensive backend for a Smart Campus Scheduling and Attendance Platform built with NestJS, TypeORM, and PostgreSQL.

## Features

- JWT-based authentication
- Role-based access control (Admin, Faculty, Student)
- Class scheduling with conflict validation
- Biometric/external API hooks for attendance
- Live lecture tracking with auto-mark attendance
- Student activity logs
- Faculty leave approval with substitute management

## Tech Stack

- NestJS
- TypeScript
- TypeORM
- PostgreSQL
- JWT Authentication
- Swagger API Documentation

## Prerequisites

- Node.js (v14 or later)
- PostgreSQL

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file based on `.env.example` and configure your environment variables.

## Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod
```

## API Documentation

Swagger documentation is available at `/api` when the application is running.

## Database Schema

The application uses the following entities:

- User: Admin, Faculty, and Student users
- Class: Course classes with faculty, room, and timeslot
- Room: Physical rooms for classes
- Timeslot: Time periods for scheduling
- Attendance: Student attendance records
- ActivityLog: Student activity tracking
- LeaveRequest: Faculty leave management

## API Endpoints

### Authentication
- POST /auth/login: User login

### Admin APIs
- CRUD for Users: POST /users, GET /users, PUT /users/:id, DELETE /users/:id
- CRUD for Classes: POST /classes, GET /classes, PUT /classes/:id, DELETE /classes/:id
- CRUD for Rooms: POST /rooms, GET /rooms
- CRUD for Timeslots: POST /timeslots, GET /timeslots
- Leave Requests: POST /leave-requests, GET /leave-requests, PUT /leave-requests/:id
- Reports: GET /attendance/reports, GET /activity-logs

### Faculty APIs
- Classes: GET /classes/faculty
- Attendance: POST /attendance, GET /attendance/class/:classId
- Lecture Control: POST /lectures/start, POST /lectures/end
- Leave Requests: POST /leave-requests/faculty, GET /leave-requests/faculty
- Activity Logs: GET /activity-logs/class/:classId

### Student APIs
- Classes: GET /classes/student
- Attendance: GET /attendance/student
- Activity Logs: GET /activity-logs/student, GET /activity-logs/heatmap, GET /activity-logs/calendar

### External API
- POST /attendance/biometric: Biometric attendance recording