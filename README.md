# 🔥 Digital Burnout OS

A comprehensive mental health and productivity tracking platform that helps users monitor, predict, and prevent digital burnout through AI-powered insights, daily tracking, and gamification.

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Next.js](https://img.shields.io/badge/Next.js-14.1.0-black.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109.0-009688.svg)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Running Locally](#running-locally)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## 🌟 Overview

Digital Burnout OS is a full-stack application designed to help individuals track their digital habits, monitor stress levels, and receive AI-powered predictions about burnout risks. The platform combines daily tracking, analytics, gamification, and personalized insights to promote healthier digital habits and work-life balance.

**Live Demo:** [Digital Burnout OS](https://your-netlify-url.netlify.app)

## ✨ Features

### Core Features

- **🔐 Authentication & Authorization**
  - Email/Password authentication with JWT tokens
  - Google Sign-In integration
  - Secure password reset and email verification
  - Protected routes and role-based access

- **📊 Daily Tracking**
  - Track screen time, mood, stress levels, and productivity
  - Log sleep quality, exercise, and social interactions
  - Visual calendar view of tracking history
  - Quick daily check-ins

- **🤖 AI Burnout Prediction**
  - Machine learning algorithm analyzes tracking data
  - Predicts burnout risk levels
  - Personalized recommendations based on patterns
  - Early warning system for mental health risks

- **📈 Analytics & Insights**
  - Interactive charts and visualizations
  - Trend analysis over time
  - Burnout score tracking
  - Weekly and monthly reports
  - Goal progress monitoring

- **🎮 Gamification**
  - Achievement system with badges
  - Streak tracking for consistent logging
  - Points and rewards for healthy habits
  - Leaderboards (optional)

- **💬 AI Chatbot**
  - 24/7 mental health support
  - Personalized wellness tips
  - Interactive guidance and resources
  - Context-aware responses based on user data

- **💳 Premium Features**
  - Subscription plans with Razorpay integration
  - Advanced analytics and insights
  - Export data functionality
  - Priority support

### Additional Features

- **🔔 Notifications**
  - Daily tracking reminders
  - Achievement notifications
  - Burnout risk alerts
  - Customizable notification preferences

- **⚙️ Settings & Customization**
  - Dark/Light theme toggle
  - Profile management
  - Privacy controls
  - Data export

- **📱 Responsive Design**
  - Mobile-first approach
  - Optimized for all screen sizes
  - Progressive Web App (PWA) ready

## 🛠 Tech Stack

### Frontend

- **Framework:** Next.js 14.1.0 (React 18)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** 
  - Lucide React (Icons)
  - Framer Motion (Animations)
  - Chart.js & Recharts (Data Visualization)
- **State Management:** React Context API
- **HTTP Client:** Axios
- **Additional Libraries:**
  - react-hot-toast (Notifications)
  - canvas-confetti (Celebrations)
  - date-fns (Date handling)
  - clsx & tailwind-merge (Class management)

### Backend

- **Framework:** FastAPI 0.109.0
- **Language:** Python 3.11+
- **Database:** 
  - PostgreSQL (Production)
  - SQLite (Development)
- **ORM:** SQLAlchemy 2.0
- **Authentication:** JWT with python-jose
- **Email:** SendGrid
- **Payment Gateway:** Razorpay
- **Additional Libraries:**
  - Pydantic (Data validation)
  - Alembic (Database migrations)
  - Redis (Caching & rate limiting)
  - Sentry (Error monitoring)
  - SlowAPI (Rate limiting)

### DevOps & Infrastructure

- **Frontend Hosting:** Netlify
- **Backend Hosting:** Render
- **Database:** PostgreSQL on Render
- **Containerization:** Docker & Docker Compose
- **CI/CD:** Git-based deployments

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client (Browser)                         │
│                    Next.js Frontend                          │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTPS/REST API
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                   FastAPI Backend                            │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   Routers   │  │   Services   │  │ Repositories │       │
│  │             │  │              │  │              │       │
│  │ • Auth      │─▶│ • Auth       │─▶│ • User       │       │
│  │ • Tracking  │  │ • Tracking   │  │ • DailyLog   │       │
│  │ • Analytics │  │ • Analytics  │  │ • Achievement│       │
│  │ • Payment   │  │ • AI/ML      │  │ • Payment    │       │
│  └─────────────┘  └──────────────┘  └──────────────┘       │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
┌──────────────┐ ┌─────────┐ ┌──────────────┐
│  PostgreSQL  │ │  Redis  │ │   Razorpay   │
│   Database   │ │  Cache  │ │   Gateway    │
└──────────────┘ └─────────┘ └──────────────┘
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **Python** 3.11 or higher
- **PostgreSQL** 14.x or higher (for production)
- **Git**
- **npm** or **yarn**

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-username/digital-burnout-os.git
cd digital-burnout-os
```

2. **Install Frontend Dependencies**

```bash
cd frontend
npm install
```

3. **Install Backend Dependencies**

```bash
cd ../backend
pip install -r requirements.txt
```

### Configuration

#### Frontend Environment Variables

Create a `.env.local` file in the `frontend` directory:

```env
# API Base URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# Razorpay Public Key (Test Mode)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID_HERE

# Google OAuth (if using)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

See `frontend/.env.local.example` for more details.

#### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Database
DATABASE_URL=sqlite:///./burnout.db  # For development
# DATABASE_URL=postgresql://user:password@localhost:5432/burnout_db  # For production

# JWT Secret
SECRET_KEY=your-super-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# API Configuration
API_V1_STR=/api/v1
PROJECT_NAME=Digital Burnout OS
VERSION=0.1.0
ENVIRONMENT=development

# Razorpay
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET
RAZORPAY_WEBHOOK_SECRET=YOUR_WEBHOOK_SECRET

# Email (SendGrid)
SENDGRID_API_KEY=your_sendgrid_api_key
FROM_EMAIL=noreply@yourdomain.com

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

See `backend/.env.example` for more details.

### Running Locally

#### Option 1: Using Docker Compose (Recommended)

```bash
# From the project root
docker-compose up
```

This will start:
- Frontend on http://localhost:3000
- Backend on http://localhost:8000
- PostgreSQL on localhost:5432

#### Option 2: Manual Setup

**Terminal 1 - Backend:**

```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

The application will be available at:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs (Swagger UI)

## 🌐 Deployment

### Frontend (Netlify)

1. **Connect your repository to Netlify**
2. **Build settings:**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Functions directory: `netlify/functions` (if using)

3. **Environment variables:** Add all `NEXT_PUBLIC_*` variables from `.env.local`

4. **Deploy!** Netlify will automatically deploy on every push to main branch

### Backend (Render)

1. **Create a new Web Service on Render**
2. **Settings:**
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

3. **Add PostgreSQL database:**
   - Create a new PostgreSQL instance
   - Copy the internal database URL to `DATABASE_URL` env variable

4. **Environment variables:** Add all variables from `.env.example`

5. **Deploy!** Render will auto-deploy on every push to main branch

## 📚 API Documentation

When running locally in development mode, you can access:

- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

### Main API Endpoints

#### Authentication
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login with credentials
- `POST /api/v1/auth/google` - Google Sign-In
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/forgot-password` - Request password reset

#### Tracking
- `POST /api/v1/tracking/daily-log` - Submit daily tracking data
- `GET /api/v1/tracking/logs` - Get user's tracking logs
- `GET /api/v1/tracking/logs/{id}` - Get specific log
- `PUT /api/v1/tracking/logs/{id}` - Update a log
- `DELETE /api/v1/tracking/logs/{id}` - Delete a log

#### Analytics
- `GET /api/v1/analytics/dashboard` - Get dashboard analytics
- `GET /api/v1/analytics/burnout-prediction` - Get AI burnout prediction
- `GET /api/v1/analytics/trends` - Get trend analysis
- `GET /api/v1/analytics/insights` - Get personalized insights

#### Gamification
- `GET /api/v1/gamification/achievements` - Get user achievements
- `GET /api/v1/gamification/streaks` - Get tracking streaks
- `POST /api/v1/gamification/claim-reward` - Claim achievement reward

#### Payments
- `POST /api/v1/payments/create-order` - Create Razorpay order
- `POST /api/v1/payments/verify` - Verify payment
- `POST /api/v1/payments/webhook` - Razorpay webhook handler
- `GET /api/v1/payments/subscription` - Get subscription status

## 📁 Project Structure

```
digital-burnout-os/
├── frontend/                    # Next.js frontend application
│   ├── src/
│   │   ├── app/                # App router pages
│   │   │   ├── page.tsx       # Homepage
│   │   │   ├── login/         # Login page
│   │   │   ├── signup/        # Signup page
│   │   │   ├── dashboard/     # Dashboard
│   │   │   ├── track/         # Daily tracking
│   │   │   ├── analytics/     # Analytics page
│   │   │   ├── achievements/  # Gamification
│   │   │   ├── checkout/      # Payment checkout
│   │   │   └── ...
│   │   ├── components/        # Reusable UI components
│   │   ├── context/           # React Context providers
│   │   ├── services/          # API service layer
│   │   └── lib/               # Utility functions
│   ├── public/                # Static assets
│   ├── .env.local.example     # Environment variables template
│   ├── package.json
│   └── tailwind.config.ts
│
├── backend/                     # FastAPI backend application
│   ├── app/
│   │   ├── main.py            # Application entry point
│   │   ├── core/              # Core configuration
│   │   │   ├── config.py      # Settings
│   │   │   ├── database.py    # Database connection
│   │   │   └── security.py    # Security utilities
│   │   ├── models/            # SQLAlchemy models
│   │   │   ├── user.py
│   │   │   ├── daily_log.py
│   │   │   ├── achievement.py
│   │   │   └── ...
│   │   ├── schemas/           # Pydantic schemas
│   │   ├── routers/           # API route handlers
│   │   │   ├── auth.py
│   │   │   ├── tracking.py
│   │   │   ├── analytics.py
│   │   │   ├── gamification.py
│   │   │   └── payments.py
│   │   ├── services/          # Business logic
│   │   ├── repositories/      # Database access layer
│   │   └── utils/             # Utility functions
│   ├── .env.example           # Environment variables template
│   ├── requirements.txt       # Python dependencies
│   └── Dockerfile
│
├── docker-compose.yml          # Docker orchestration
├── .gitignore
└── README.md                   # This file
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add some amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Code Style

- **Frontend:** Follow ESLint configuration
- **Backend:** Follow PEP 8 Python style guide
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- FastAPI for the blazing-fast Python backend
- All open-source contributors whose libraries made this possible

## 📧 Contact

For questions, feedback, or support:

- **Email:** your-email@example.com
- **GitHub Issues:** [Create an issue](https://github.com/your-username/digital-burnout-os/issues)
- **Project Link:** [https://github.com/your-username/digital-burnout-os](https://github.com/your-username/digital-burnout-os)

---

**Made with ❤️ to combat digital burnout and promote mental wellness**
