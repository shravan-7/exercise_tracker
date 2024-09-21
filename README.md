<p align="center">
  <img src="https://img.icons8.com/?size=512&id=55494&format=png" width="20%" alt="EXERCISE_TRACKER-logo">
</p>
<p align="center">
    <h1 align="center">EXERCISE_TRACKER</h1>
</p>
<p align="center">
    <em><code>Exercise Tracker Application</code></em>
</p>
<p align="center">
	<img src="https://img.shields.io/github/license/shravan-7/exercise_tracker?style=flat&logo=opensourceinitiative&logoColor=white&color=0080ff" alt="license">
	<img src="https://img.shields.io/github/last-commit/shravan-7/exercise_tracker?style=flat&logo=git&logoColor=white&color=0080ff" alt="last-commit">
	<img src="https://img.shields.io/github/languages/top/shravan-7/exercise_tracker?style=flat&color=0080ff" alt="repo-top-language">
	<img src="https://img.shields.io/github/languages/count/shravan-7/exercise_tracker?style=flat&color=0080ff" alt="repo-language-count">
</p>
<p align="center">
		<em>Built with the tools and technologies:</em>
</p>
<p align="center">
	<img src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=flat&logo=JavaScript&logoColor=black" alt="JavaScript">
	<img src="https://img.shields.io/badge/HTML5-E34F26.svg?style=flat&logo=HTML5&logoColor=white" alt="HTML5">
	<img src="https://img.shields.io/badge/PostCSS-DD3A0A.svg?style=flat&logo=PostCSS&logoColor=white" alt="PostCSS">
	<img src="https://img.shields.io/badge/Autoprefixer-DD3735.svg?style=flat&logo=Autoprefixer&logoColor=white" alt="Autoprefixer">
	<img src="https://img.shields.io/badge/Redis-DC382D.svg?style=flat&logo=Redis&logoColor=white" alt="Redis">
	<img src="https://img.shields.io/badge/React-61DAFB.svg?style=flat&logo=React&logoColor=black" alt="React">
	<br>
	<img src="https://img.shields.io/badge/Axios-5A29E4.svg?style=flat&logo=Axios&logoColor=white" alt="Axios">
	<img src="https://img.shields.io/badge/Celery-37814A.svg?style=flat&logo=Celery&logoColor=white" alt="Celery">
	<img src="https://img.shields.io/badge/Python-3776AB.svg?style=flat&logo=Python&logoColor=white" alt="Python">
	<img src="https://img.shields.io/badge/Django-092E20.svg?style=flat&logo=Django&logoColor=white" alt="Django">
	<img src="https://img.shields.io/badge/JSON-000000.svg?style=flat&logo=JSON&logoColor=white" alt="JSON">
</p>

<br>

##### 🔗 Table of Contents

- [📍 Overview](#-overview)
- [👾 Features](#-features)
- [📂 Repository Structure](#-repository-structure)
- [🧩 Modules](#-modules)
- [🚀 Getting Started](#-getting-started)
    - [🔖 Prerequisites](#-prerequisites)
    - [📦 Installation](#-installation)
    - [🤖 Usage](#-usage)
    - [🧪 Tests](#-tests)
- [📌 Project Roadmap](#-project-roadmap)
- [🤝 Contributing](#-contributing)
- [🎗 License](#-license)
- [🙌 Acknowledgments](#-acknowledgments)

---

## 📍 Overview

Exercise Tracker is a full-stack web application designed to help users track their workout routines, monitor progress, and maintain a consistent fitness regimen. Built with React for the frontend and Django for the backend, this application offers a seamless user experience for creating, managing, and analyzing workout routines.

## 👾 Features

- User authentication (registration, login, profile management)
- Create and manage workout routines
- Track completed workouts
- View progress charts
- Exercise library with various categories
- Set reminders for workouts
- Responsive design for mobile and desktop use

## 🚀 Getting Started

### Prerequisites

- Python (3.8 or higher)
- Node.js (14.0 or higher)
- npm (6.0 or higher)

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/shravan-7/exercise_tracker.git
   cd exercise_tracker
   ```

2. Set up the backend:
   ```sh
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py createsuperuser
   python manage.py populate_exercises  # To populate the exercise library
   ```

3. Set up the frontend:
   ```sh
   cd ../frontend
   npm install
   ```

### Running the Application

1. Start the backend server:
   ```sh
   cd backend
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   python manage.py runserver
   ```

2. In a new terminal, start the frontend development server:
   ```sh
   cd frontend
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000` to use the application.

## 📂 Project Structure

The project is organized into two main directories:

- `backend/`: Contains the Django project and API
- `frontend/`: Contains the React application

Key files and directories:

```
exercise_tracker/
├── backend/
│   ├── api/                 # Django app for the API
│   ├── exercise_tracker/    # Django project settings
│   ├── manage.py
│   └── requirements.txt
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/      # React components
    │   ├── App.jsx
    │   └── index.js
    ├── package.json
    └── tailwind.config.js
```

## 🧩 Modules

- User Authentication
- Routine Management
- Workout Tracking
- Progress Visualization
- Exercise Library
- Reminders

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- React.js and Django communities for their excellent documentation
- All contributors who have helped shape this project
