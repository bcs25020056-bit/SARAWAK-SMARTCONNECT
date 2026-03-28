# 🏢 Sarawak Smart Connect

**Sarawak Smart Connect** is a comprehensive career and education portal designed specifically for the Sarawakian ecosystem. It bridges the gap between talented students and forward-thinking companies, providing a unified platform for job searching, scholarship tracking, mentorship, and professional growth.

---

## 🚀 Key Features

### 🎓 For Students
- **Personalized Dashboard**: Track your career progress, XP, and achievements in real-time.
- **Smart Job Search**: Find the latest opportunities in Sarawak with advanced filtering for internships, full-time roles, and remote work.
- **Application Tracking**: Monitor the status of your job applications from "Review" to "Offer" with an interactive progress tracker.
- **Scholarship Hub**: Access information on major scholarships like PTPTN, Yayasan Sarawak, and Petronas.
- **Gamified Growth**: Earn XP and level up as you complete milestones and engage with the platform.
- **Mentorship & Achievements**: Connect with industry experts and showcase your badges to potential employers.

### 🏢 For Companies
- **Job Management Portal**: Easily post, edit, and manage job openings directly from your dashboard.
- **Recruitment Analytics**: Get a quick overview of your active postings and incoming applications.
- **Targeted Talent Pool**: Reach students and professionals specifically within the Sarawak region.
- **Company Branding**: Showcase your company culture and industry through a dedicated profile.

### 🛠️ Core Platform Features
- **Unified Onboarding**: A seamless setup experience that tailors the platform to your specific role (Student or Company).
- **Real-time Notifications**: Stay updated with instant alerts for application status changes and system announcements.
- **Secure Authentication**: Robust login and registration system powered by Firebase (Email/Password and Google Sign-in).
- **Modern UI/UX**: A responsive, high-performance interface built with Tailwind CSS v4 and smooth Framer Motion animations.

---

## 💻 Tech Stack

- **Frontend**: [React 18](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Backend/Database**: [Firebase Cloud Firestore](https://firebase.google.com/docs/firestore)
- **Authentication**: [Firebase Auth](https://firebase.google.com/docs/auth)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## ⚙️ Setup & Configuration

### Environment Variables
To run this project, you will need to add the following environment variables to your `.env` file:

```env
# Firebase Configuration (provided in firebase-applet-config.json)
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## 🛡️ Security Rules

The platform uses strict **Firestore Security Rules** to ensure:
- Users can only modify their own profile data.
- Companies can only manage their own job postings.
- Students can only view their own application history.
- Public data (like job postings) is readable by all authenticated users.

---

## 🗺️ Roadmap
- [ ] **AI Career Assistant**: Integration with Gemini API for resume reviews and career advice.
- [ ] **Direct Messaging**: Real-time chat between students and recruiters.
- [ ] **Event Management**: Posting and registration for career fairs and workshops in Sarawak.
- [ ] **Verified Profiles**: Identity verification for companies to ensure platform trust.

---

Developed with ❤️ for the Sarawakian community.
