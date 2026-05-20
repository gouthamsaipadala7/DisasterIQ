---
title: DisasterIQ
emoji: 🌍
colorFrom: blue
colorTo: indigo
sdk: docker
pinned: false
---

# DisasterIQ 🌍

**AI-Powered Disaster Response and Resource Allocation System**

> Upload satellite or drone imagery → AI detects damage zones → Get optimal resource allocation and field-ready PDF reports.

![DisasterIQ](https://img.shields.io/badge/DisasterIQ-AI%20Disaster%20Response-blue?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.10+-green?style=flat-square)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109-teal?style=flat-square)

---

## 🚀 Features

- **YOLOv8 AI Detection** — Automatic damage detection with HSV color-analysis fallback
- **Zone Classification** — Critical / Moderate / Low zones with resource allocation
- **Interactive Map** — Dark-themed Leaflet map with color-coded zone markers
- **PDF Reports** — Professional field reports generated with ReportLab
- **Sample Demo** — Built-in sample image so the app works without uploading anything
- **Responsive Design** — Glassmorphism UI with smooth animations

---

## 🏗️ Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 18, Tailwind CSS 3, Vite 5    |
| Backend   | Python FastAPI, Uvicorn             |
| AI Model  | YOLOv8n (auto-downloads)            |
| Maps      | Leaflet.js + OpenStreetMap (free)   |
| PDF       | ReportLab                           |
| Deploy    | Hugging Face Spaces (free)          |

---

## 📁 Project Structure

```
disasteriq-web/
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── postcss.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── styles/globals.css
│       └── components/
│           ├── Navbar.jsx
│           ├── Hero.jsx
│           ├── UploadPanel.jsx
│           ├── ProgressBar.jsx
│           ├── ResultsDashboard.jsx
│           ├── ZoneCards.jsx
│           ├── DisasterMap.jsx
│           ├── ResourceTable.jsx
│           ├── ReportSection.jsx
│           ├── HowItWorks.jsx
│           └── Footer.jsx
├── backend/
│   ├── main.py
│   ├── analyzer.py
│   ├── allocator.py
│   ├── mapper.py
│   ├── reporter.py
│   ├── config.py
│   └── requirements.txt
├── Dockerfile
├── app.py
└── README.md
```

---

## 🖥️ Local Development

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm or yarn

### 1. Backend Setup

```bash
cd disasteriq-web/backend
pip install -r requirements.txt
python main.py
```

The API server starts at `http://localhost:7860`.

### 2. Frontend Setup

```bash
cd disasteriq-web/frontend
npm install
npm run dev
```

The dev server starts at `http://localhost:5173` and proxies API requests to port 7860.

### 3. Build for Production

```bash
cd disasteriq-web/frontend
npm run build
```

The built files go to `frontend/dist/`. The FastAPI backend automatically serves them.

---

## ☁️ Deploy to Hugging Face Spaces (Free)

### One-time Setup

1. Go to [huggingface.co/spaces](https://huggingface.co/spaces)
2. Click **Create new Space**
3. Choose **Docker** as the SDK
4. Name it `disasteriq`

### Deploy

Upload these files to the root of your Space:
- `Dockerfile`
- `app.py`
- `backend/` (entire folder)
- `frontend/` (entire folder)

Or use Git:

```bash
git clone https://huggingface.co/spaces/YOUR_USERNAME/disasteriq
# Copy all project files into the cloned repo
git add .
git commit -m "Deploy DisasterIQ"
git push
```

The Space will automatically build and deploy. **No manual configuration needed.**

---

## 🔧 API Endpoints

| Method | Endpoint       | Description                          |
|--------|----------------|--------------------------------------|
| GET    | `/api/health`  | Health check                         |
| POST   | `/api/analyze` | Analyze uploaded disaster image      |
| GET    | `/api/sample`  | Get sample analysis (demo mode)      |
| POST   | `/api/report`  | Generate PDF field report            |

### POST `/api/analyze`

**Multipart Form Data:**
- `image` — JPEG or PNG file
- `disaster_type` — Flood / Earthquake / Fire / Cyclone
- `location` — Location string (geocoded via Nominatim)
- `population` — Affected population number

---

## 👥 Team

**Department of Electronics and Communication Engineering**  
**MLR Institute of Technology, Hyderabad**

- Goutham Sai
- Vishnu
- Nikshith
- Gokul

**Year:** 2025

---

## 📄 License

This project is built for academic purposes as a college mini project.
