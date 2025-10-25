# EventTicketing-Frontend

# 🎟️ EventEase — Event Ticketing & Management System (Frontend)

## 🧾 Overview
**EventEase Frontend** is the client-facing part of the EventEase platform — a modern, cloud-based **Event Ticketing and Management System**.  
It enables **attendees** to browse, select seats, purchase tickets, and receive email confirmations, while allowing **organizers/admins** to manage events, monitor sales, and analyze performance.  

This frontend is built using **React 18**, **Vite**, and **Tailwind CSS**, delivering a fast, responsive, and dynamic user experience.  
It communicates securely with the backend **Spring Boot microservices** via an **API Gateway** using **JWT authentication**.

## 🧩 System Architecture
React (Vite) + Tailwind
↓
API Gateway (Spring Cloud Gateway + JWT)
↓
Spring Boot Microservices (User, Event, Ticket, Order, Payment, etc.)
↓
PostgreSQL | Kafka (Aiven) | SendGrid | Cloudinary | Stripe


There are two frontend portals:
- 🎫 **Client Portal** → Attendees can explore events, select seats, and make ticket payments.  
- 🧑‍💼 **Admin Portal** → Organizers can create and manage events, analyze revenue, and send notifications.

## 🌐 Live Deployments
| Component | URL |
|------------|------|
| 🎫 Client Frontend | https://client-frontend-pp19.onrender.com |
| 🧑‍💼 Admin Frontend | https://admin-frontend-040x.onrender.com |

---

## ⚙️ Tech Stack
### 🔹 Core Technologies
- **React 18 + Vite**
- **Tailwind CSS**
- **React Router DOM v6**
- **Axios** for API requests
- **Context API** for state management

### 🔹 UI & UX
- **Framer Motion** → animations and transitions  
- **Konva.js** → seat map rendering and interactivity  
- **Lucide-react / MUI Icons** → icons and UI elements  
- **Recharts** → revenue and analytics graphs  

### 🔹 Payments & Security
- **Stripe.js** → secure payment integration  
- **JWT Authentication** → handled through API Gateway  
- **Role-based Access Control** → attendee vs admin  
- **Environment-based CORS** configuration  

### 🔹 DevOps & Deployment
- **Render Hosting** (Static Site)
- **Vite Build Optimization**
- **Docker Support (Optional)**


## 🧭 Features by User Type
### 👤 Attendee Features
- Browse upcoming events  
- View event details and available seats  
- Select specific seats (interactive canvas)  
- Apply discount codes  
- Pay via Stripe Checkout  
- Receive confirmation and QR-coded ticket via email  
- Access booking history  

### 🧑‍💼 Organizer  Features
- Create and update events  
- Upload event banners (via Cloudinary)  
- Manage discounts and promotional codes  
- Monitor ticket sales and revenue statistics  
- View attendee lists  
- Send reminders and announcements  

### 🔐 Authentication
- Secure login and signup  
- JWT-based access tokens  
- Forgot/change password workflow  
- Session persistence via localStorage  



That gives consistent styling for command snippets.  
Otherwise, your current version is already great!

---

### 📁 **Project Structure Section**
```md
```bash
# Project Directory Structure
EventEase-Frontend/
├── public/                     # Static public files (images, icons, manifest)
├── src/
│   ├── assets/                 # Static images & icons
│   ├── components/             # Shared UI components
│   ├── context/                # React global state context
│   ├── hooks/                  # Custom React hooks
│   ├── pages/                  # Route-based pages
│   ├── services/               # Axios API service functions
│   ├── utils/                  # Helper functions (JWT, validation, etc.)
│   ├── App.jsx                 # Root component
│   └── main.jsx                # Application entry point
├── package.json
├── vite.config.js
├── tailwind.config.js
└── .env
```

## ⚙️ Environment Configuration

Create a `.env` file in the root directory:

```bash
VITE_API_GATEWAY_URL=https://api-gateway-ip5n.onrender.com
VITE_STRIPE_PUBLIC_KEY=pk_live_************************
VITE_ENV=production
```


## ▶️ Development Mode
```bash
npm install
npm run dev
```

Open in your browser: http://localhost:5173

## 🏗️ Production Build
```bash
npm run build
```
