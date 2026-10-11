# 📚 LibraAI — Smart Library Management System

> An AI-powered library management web application built for **NOCTIVUS’26 — Secure X Vibe Coding, Tune Trap**, at Velammal Engineering College.

LibraAI aims to simplify library operations by bringing book discovery, availability tracking, borrowing history, and AI-assisted search into one web application.

## 🚀 Live Demo

**Try LibraAI here:** [https://libraai-smart-library.vercel.app/](https://libraai-smart-library.vercel.app/)

## 🎯 Problem Statement

**PS-4: Smart Library Book Management System**  
**Category:** EdTech & Campus Management

Traditional library systems can make it difficult for students to locate books and check availability. Librarians also spend time maintaining inventory and borrowing records manually.

LibraAI addresses these challenges through a centralized web application for discovering books, managing borrowing activities, and exploring relevant books using natural-language search.

## ✨ Features

- 📖 **Book Catalog:** Browse books and explore their details.
- 🔍 **Smart Search:** Search by title, author, and other available filters.
- 📦 **Availability Tracking:** View book availability and remaining copies.
- 🔄 **Borrow and Return:** Manage borrowing and returning.
- 🕘 **Borrowing History:** Track borrowed books and their statuses.
- 📊 **Dashboard:** View library statistics and borrowing information.
- 🛠️ **Admin Portal:** Access inventory and borrowing-record views.
- 🤖 **AI-Powered Search:** Discover books using natural-language queries.
- 💡 **Book Recommendations:** Explore suggested books based on library data.
- 📱 **Responsive UI:** Use the application through a modern web interface.

## 🧠 AI Integration

LibraAI integrates the **Groq API** for natural-language book search and recommendations.

AI results are validated against the available library catalog. A keyword-search fallback helps preserve basic search functionality when AI requests fail or the API is unavailable.

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| Next.js | Web application framework |
| TypeScript | Type-safe development |
| Tailwind CSS | Responsive UI styling |
| Groq API | AI-powered search and recommendations |
| GitHub | Version control and source code management |
| Vercel | Deployment and hosting |

## 🏗️ Application Workflow

1. Open the LibraAI web application.
2. Explore the dashboard and book catalog.
3. Search for books using keywords or natural-language queries.
4. Check availability before borrowing.
5. Borrow and return books through the application.
6. Review borrowing history and status.
7. Explore AI-assisted book discovery and recommendations.
8. Access administrative views for library records.

## ⚙️ Run Locally

### Prerequisites

- Node.js and npm
- Git
- A Groq API key for live AI functionality

### 1. Clone the repository

```bash
git clone https://github.com/anusribaskaran2-arch/libraai-smart-library.git
cd libraai-smart-library
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create `.env.local` in the project root:

```env
GROQ_API_KEY=your_groq_api_key
```

Replace the placeholder with your own API key. Never commit `.env.local` or expose your API key in client-side code.

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Verify the production build

```bash
npm run typecheck
npm run build
npm start
```

## 🔐 Security Notes

- Keep the Groq API key on the server.
- Exclude environment secrets from version control.
- Validate AI-generated results against actual catalog records.
- Demo authentication, if enabled, is intended for demonstration only.
- A production multi-user system requires secure authentication, authorization, persistent storage, and access controls.

## 🚧 Current Scope

LibraAI was developed as a rapid hackathon prototype. Some functionality may use local application state instead of a persistent shared database, so data persistence and multi-user synchronization may be limited.

Real authentication and production-grade database integration are potential future improvements.

## 🔮 Future Enhancements

- Integrate Supabase for persistent book and borrowing records.
- Implement secure role-based authentication.
- Add automated overdue notifications and fine management.
- Expand personalized recommendations.
- Add analytics for borrowing trends and popular books.
- Improve automated testing and production security.

## 🏆 Hackathon Experience

**Event:** NOCTIVUS’26 — Secure X Vibe Coding, Tune Trap  
**Institution:** Velammal Engineering College, Chennai  
**Problem Statement:** PS-4 — Smart Library Book Management System  
**Category:** EdTech & Campus Management  
**Development Approach:** AI-assisted rapid prototyping

The working prototype was built and deployed within **one hour**, creating an intensive learning experience in rapid development, debugging, AI integration, and deployment.

## 👩‍💻 Acknowledgements

Thanks to the event organizers, faculty coordinators, sponsors, and fellow participants for creating an opportunity to learn, collaborate, and build.

---

**Built with curiosity, AI, and a commitment to learning by building.** 🚀
