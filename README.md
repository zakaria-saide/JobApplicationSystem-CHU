# Web Application for Recruitment Management at CHU Hassan II

This project involves the development of a web application for managing job applications for recruitment contests at the **Hassan II University Hospital Center (CHU)** in Fes. The application streamlines the application and recruitment process for both administrators and applicants by automating workflows and providing a user-friendly interface.

## Features

- **Candidate Features**:
  - Create an account and log in securely.
  - Browse available job postings and submit applications.
  - Upload required documents (diplomas, identity proofs, etc.).
  - Track application statuses in real-time.

- **Administrator Features**:
  - Create, edit, and manage job postings.
  - Review and process applications.
  - Update candidates about their application statuses.

- **General Features**:
  - Secure authentication with JWT tokens and email verification.
  - Modern, responsive UI for seamless use across devices.

## Technologies Used

- **Frontend**: React.js with Vite and Tailwind CSS.
- **Backend**: ASP.NET Core 8 MVC.
- **Database**: Oracle SQL Developer.
- **Development Tools**:
  - Visual Studio Code for coding.
  - Postman for API testing.
  - Notion for project organization.

## Architecture

The application is based on the **Model-View-Controller (MVC)** architecture:
- **Model**: Manages application data and interactions with the database.
- **View**: Renders user interfaces using React components.
- **Controller**: Handles logic and communicates between the Model and View.


## Installation

### Prerequisites
- Node.js and npm installed.
- .NET SDK installed.
- Oracle Database or access to Oracle SQL Developer.

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo-name.git
   cd your-repo-name
   ```
2. Install frontend dependencies:
   ```bash
   cd client
   npm install
   ```
3. Install backend dependencies:
   ```bash
   cd server
   dotnet restore
   ```
4. Set up the database with the provided schema.
5. Start the application:
   - Frontend:
     ```bash
     npm run dev
     ```
   - Backend:
     ```bash
     dotnet run
     ```

## Usage

1. Navigate to the application URL.
2. Create an account as an administrator or candidate.
3. Explore and utilize features like application submission or job posting management.

## Project Overview

This project is part of an academic internship aimed at improving the recruitment process at CHU Hassan II. It incorporates agile methodologies for iterative development and focuses on providing a secure, efficient, and user-centric solution.

## Contributors

- **Zakaria Saide** – Developer
- **Douae** – Industry Supervisor
- **Prof. El Kant** – Academic Supervisor

## License

[MIT License](LICENSE)


# JobApplicationSystem-CHU
