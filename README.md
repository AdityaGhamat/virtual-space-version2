# 🪐 Galactic Lobby - 2D Virtual Space

![Galactic Lobby Demo](./screenshots/demo.png)

A high-performance, real-time multiplayer "Metaverse" featuring zone-based video conferencing, live chat, and spatial interactions. Inspired by the logic of Gather.town and built with an Among Us aesthetic.

## 🔗 Live Demo

Experience the virtual space directly:

- **URL:** [https://virtual.adityaghamat.in](https://virtual.adityaghamat.in)

**Test Credentials:**

- **Email:** `test@gmail.com`
- **Password:** `123456`

---

## 🚀 Key Features

- **Zone-Based Video Calls:** Unlike standard proximity chat, video and audio are managed via "Contextual Zones" (e.g., Cafeteria). Entering a zone auto-connects you to the room's SFU transport.
- **Real-Time Multiplayer:** Synchronized player movement and animations across all clients using WebSockets.
- **Scalable Media Streams:** Utilizing an SFU (Selective Forwarding Unit) architecture to handle multiple concurrent video streams without overloading the client's CPU.
- **Decoupled Chat System:** High-throughput chat events are managed via a message broker (RabbitMQ) to ensure game-loop performance.
- **Monorepo Architecture:** Clean code separation between backend, frontend, and shared packages using Turborepo.

---

## 🛠 Tech Stack

### Frontend & Game Engine

- **Phaser.js:** Core engine for 2D rendering, physics, and tilemap management.
- **React:** For UI overlays, authentication forms, and video grid layouts.
- **Tailwind CSS:** Modern styling for a responsive interface.

### Backend & Real-Time

- **Node.js & TypeScript:** Type-safe backend logic.
- **Mediasoup:** Professional-grade SFU for low-latency WebRTC media routing.
- **Socket.io:** Signaling server for game state and WebRTC handshakes.
- **RabbitMQ:** Message queue for handling background events and chat logs.

### Database & DevOps

- **Drizzle ORM:** For type-safe interactions with PostgreSQL.
- **PostgreSQL (Neon DB):** Serverless SQL database.
- **Docker & Docker Compose:** Containerized environment for consistent deployment.
- **Turborepo:** Orchestrating the monorepo build pipeline.

---

## 🧠 Challenges & Learnings

Building a real-time metaverse is an exercise in high-performance networking.

### 1. The Scaling Wall (P2P vs. SFU)

My first implementation used a standard P2P (Mesh) WebRTC setup. It worked perfectly for two people, but as soon as a third or fourth participant joined, the browser's CPU spiked and the video lagged. I realized that P2P doesn't scale linearly—it multiplies connections.

> **The Fix:** I rebuilt the entire media layer using Mediasoup (SFU). By routing all streams through a central server, I reduced the client-side load, allowing multiple users to join without crashing their browsers.

### 2. Maintaining Game Loop Integrity

Initially, high-frequency events like chat messages and movement updates were fighting for the same resources, causing "micro-stutters" in the game loop.

> **The Fix:** I implemented RabbitMQ to decouple chat events from the main game loop. This ensured that media synchronization and movement remained fluid even during high-throughput chat activity.

---

## 📂 Project Structure

This project uses a Turborepo monorepo structure for maximum modularity:

```plaintext
.
├── apps/
│   ├── backend/       # Node.js + Mediasoup SFU server
│   └── frontend/      # React + Phaser.js client
├── packages/
│   ├── ui/            # Shared UI components
│   ├── types/         # Shared TypeScript interfaces
│   ├── config/        # Shared ESLint/TS configs
│   └── utils/         # Common utility functions
├── screenshots/       # Project assets and demos
│   └── demo.png       # Main project screenshot
├── Dockerfile         # Root Docker configuration
└── turbo.json         # Turborepo configuration
```

---

## ⚙️ Environment Configuration

To run this project locally, create a `.env` file in the `apps/backend` directory.

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Authentication & Security
COOKIE_SECRET_KEY=your_secret_key
COOKIE_REFRESH_SECRET=your_refresh_secret

# Networking
ANNOUNCED_IP=127.0.0.1  # Your public IP or localhost for dev
PORT=3000

# Message Queue
QUEUE_URL=amqp://user:password@rabbitmq:5672
```

---

## 🐳 Deployment & Setup

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- PostgreSQL instance

### Installation & Run

1. **Clone the repository:**

   ```bash
   git clone [https://github.com/AdityaGhamat/virtual-space-version2.git](https://github.com/AdityaGhamat/virtual-space-version2.git)
   cd virtual-space-version2
   ```

2. **Setup Environment:**
   Create the `.env` file in `apps/backend` as shown above.

3. **Run with Docker Compose:**

   ```bash
   docker-compose up --build
   ```

The application will be available at `http://localhost:3000`.

---

## 📜 License

This project is licensed under the MIT License.
