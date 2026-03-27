# TeaWorld

**Educational web project** about tea with a Content Management System (CRUD). Built with **React**, **Node.js**, **Express**, and **MongoDB**.

[![Live Demo](https://img.shields.io/badge/live-demo-%234A7C59?style=for-the-badge&logo=vercel&logoColor=white)](https://tea-world-opal.vercel.app/)
[![React](https://img.shields.io/badge/React-18-%2361DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-20-%23339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-7-%2347A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

---

## Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture Highlights](#-architecture-highlights)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [License](#license)

---

## About

**TeaWorld** is an educational fullstack project dedicated to the history and diversity of tea. The platform allows users to explore different tea types, read blog articles, and manage content through a secure admin panel with full CRUD functionality.

**Purpose:**
- Learn about tea culture, history, and varieties
- Read and manage blog content
- Practice authentication and authorization patterns
- Demonstrate fullstack development skills (React + Node + MongoDB)

---

## Features

### User Features
| Feature | Description |
|---------|-------------|
| **Tea Catalog** | Browse tea types with images, descriptions, origin, and brewing tips |
| **Blog** | Read articles about tea culture, health benefits, and brewing guides |
| **Search & Filter** | Find teas by type, origin, or caffeine level |
| **Responsive Design** | Fully adaptive layout for mobile, tablet, and desktop |

### Admin Features (CRUD)
| Feature | Description |
|---------|-------------|
| **Create** | Add new tea entries or blog posts via rich-text editor |
| **Read** | View, search, and paginate all content in admin dashboard |
| **Update** | Edit existing content with instant preview |
| **Delete** | Remove content with confirmation dialog |
| **Auth Guard** | Protected routes with JWT-based authentication |

### Technical Features
| Feature | Description |
|---------|-------------|
| **JWT Authentication** | Secure login with access/refresh tokens, password hashing (bcrypt) |
| **RESTful API** | Clean API design with proper HTTP methods and status codes |
| **Input Validation** | Server-side validation with Express Validator |
| **Error Handling** | Global error handler with meaningful messages |
| **Environment Config** | Secrets managed via `.env` (never committed) |

---

## Tech Stack

### Frontend
![React](https://img.shields.io/badge/React-18-%2361DAFB?style=for-the-badge&logo=react&logoColor=black)
![React Router](https://img.shields.io/badge/React_Router-6-%23CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![SCSS](https://img.shields.io/badge/SCSS-1.5-%23CC6699?style=for-the-badge&logo=sass&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-1.6-%235A29E4?style=for-the-badge&logo=axios&logoColor=white)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-20-%23339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-%23000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-7-%2347A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-8-%23880000?style=for-the-badge&logo=mongoose&logoColor=white)

### Auth & Security
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)
![Bcrypt](https://img.shields.io/badge/Bcrypt-000?style=for-the-badge&logo=bcrypt&logoColor=white)
![Express Validator](https://img.shields.io/badge/Express_Validator-0.13-%230066CC?style=for-the-badge)

### Tools & DevOps
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)

---

## 🏗 Architecture Highlights

| Solution | Technology / Approach | Purpose |
|----------|----------------------|---------|
| **MVC Pattern** | Backend: Models, Views (API responses), Controllers | Clear separation of concerns, easier testing |
| **Component Architecture** | Frontend: Atomic Design (UI, features, pages) | Reusability, maintainability |
| **Authentication Flow** | JWT (access + refresh tokens), bcrypt hashing | Secure user sessions, password protection |
| **API Design** | RESTful endpoints with proper HTTP methods | Predictable, scalable backend interface |
| **State Management** | React Context + custom hooks | Global auth state, minimal prop drilling |
| **Styling** | SCSS with BEM methodology + variables | Modular, themeable, maintainable CSS |
| **Environment Config** | `.env` files with `dotenv` | Secure secrets management |
| **Error Handling** | Global Express error middleware | Consistent error responses, easier debugging |
| **Input Validation** | Express Validator + custom sanitizers | Prevent injection attacks, ensure data integrity |

---



## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm / yarn / pnpm

### Installation

#### 1. Clone the repository
```bash
git clone https://github.com/Atreu1s/TeaWorld.git
cd TeaWorld
```

#### 2. Setup Backend
```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your values:
# MONGODB_URI=your_mongodb_connection_string
# JWT_SECRET=your_secure_secret
# PORT=5000

# Start backend server
npm run dev
```

#### 3. Setup Frontend
```bash
cd ../frontend
npm install

# Create .env file (optional)
cp .env.example .env

# Start frontend dev server
npm run dev
```

#### 4. Open in browser
```
Frontend: http://localhost:5173
Backend API: http://localhost:5000/api
```

### Available Scripts

#### Backend (`/backend`)
| Command | Description |
|---------|-------------|
| `npm run dev` | Start server with nodemon (hot reload) |
| `npm start` | Start production server |
| `npm run seed` | Populate database with sample data |

#### Frontend (`/frontend`)
| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

---

## API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/register` | Create new user | Public |
| POST | `/login` | Login + receive tokens | Public |
| GET | `/me` | Get current user profile | Protected |
| POST | `/logout` | Invalidate refresh token | Protected |

### Teas (`/api/teas`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get all teas (with filters) | Public |
| GET | `/:id` | Get single tea by ID | Public |
| POST | `/` | Create new tea | Admin |
| PUT | `/:id` | Update tea by ID | Admin |
| DELETE | `/:id` | Delete tea by ID | Admin |

### Posts (`/api/posts`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get all blog posts | Public |
| GET | `/:slug` | Get post by slug | Public |
| POST | `/` | Create new post | Admin |
| PUT | `/:id` | Update post by ID | Admin |
| DELETE | `/:id` | Delete post by ID | Admin |

> **Protected routes** require `Authorization: Bearer <token>` header.

---

## Deployment

### Vercel (Frontend) + Render/Railway (Backend)

**Frontend (Vercel):**
```bash
cd frontend
npm run build
# Connect to Vercel → auto-deploys on git push
```

**Backend (Render/Railway):**
```bash
cd backend
# Set environment variables in dashboard:
# MONGODB_URI, JWT_SECRET, NODE_ENV=production
# Deploy via Git or Docker
```

### Environment Variables Checklist

| Variable | Backend | Frontend | Description |
|----------|---------|----------|-------------|
| `MONGODB_URI` | ✅ | ❌ | MongoDB connection string |
| `JWT_SECRET` | ✅ | ❌ | Secret for signing tokens |
| `PORT` | ✅ | ❌ | Server port (default: 5000) |
| `VITE_API_URL` | ❌ | ✅ | Backend API base URL |
| `NODE_ENV` | ✅ | ✅ | `development` or `production` |

---

## License

This project is open source and available under the [MIT License](LICENSE).

```
MIT License

Copyright (c) 2026 Atreu1s (Захаров Артем Михайлович)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

> 💡 **Tip**: Replace demo URLs and contact info with your actual links before publishing.

**Built with ❤️ by [Atreu1s](https://github.com/Atreu1s)** 
```
