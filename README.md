#  Canvas Clash

> **Draw the prompt. Hide your name. Win the room.**

Canvas Clash is a real-time multiplayer pixel-art competition where players receive the same prompt, draw against the clock, and anonymously judge each other's artwork.

Votes reward creativity and popularity, while an automatic quality score rewards **effort, coverage, colors, and detail**.

---

##  Features

*  Real-time multiplayer drawing
*  Private rooms with 4-character codes
*  Timed drawing rounds
*  Anonymous artwork voting
*  Round winners and final leaderboard
*  Automatic drawing-quality scoring
*  Real-time room chat with emoji support
*  30-second reconnect grace period
*  Undo through stroke-history replay
*  Flood fill with color tolerance
*  Custom colors and multiple brush sizes
*  Mouse and touch support
* Achievements and final podium
*  Shareable/downloadable result cards

---

##  How to Play

1. Enter your username and choose an avatar.
2. Create a room or join using a 4-character code.
3. Wait for at least two players.
4. Draw the given prompt before the timer ends.
5. Review anonymous drawings.
6. Vote for your favorite drawing or skip.
7. Earn points and climb the leaderboard.
8. Play across **3 increasingly difficult rounds**.

| Round | Difficulty | Time |
| ----- | ---------- | ---: |
| 1     | Easy       |  90s |
| 2     | Medium     |  60s |
| 3     | Hard       |  45s |

---

##  Scoring

Players earn points from three sources:

* **100 points** — per vote received
* **200 points** — round winner
* **0–100 points** — drawing quality score

### Quality Score

| Metric            | Weight |
| ----------------- | -----: |
| Effort & activity |    35% |
| Canvas coverage   |    25% |
| Color variety     |    20% |
| Stroke detail     |    20% |

The quality score is converted to **0–100 points** and added to the player's total.

Quality score also acts as the **tie-breaker** when vote totals are equal.

---

##  Architecture

```text
┌─────────────────────────┐
│        Browser          │
│ React + Canvas + Socket │
└────────────┬────────────┘
             │
             │ WebSocket / HTTP
             ▼
┌─────────────────────────┐
│      Node.js Server     │
│ Express + Socket.IO     │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│    In-Memory Game State │
│ Rooms • Players         │
│ Drawings • Votes        │
│ Scores • Chat • Timers  │
└─────────────────────────┘
```

The server is **authoritative**: clients send actions, while the server validates actions, updates game state, and broadcasts the resulting state.

---

##  Tech Stack

| Area        | Technology                   |
| ----------- | ---------------------------- |
| Frontend    | React 18                     |
| Styling     | Tailwind CSS 3               |
| Drawing     | HTML5 Canvas API             |
| Real-time   | Socket.IO 4                  |
| Backend     | Node.js + Express 5          |
| State       | In-memory JavaScript objects |
| Build       | Create React App             |
| Development | npm, Nodemon, Concurrently   |
| Font        | Press Start 2P               |

---

##  Project Structure

```text
canvas-clash/
├── package.json
├── backend/
│   ├── server.js
│   ├── socketHandlers.js
│   ├── roomManager.js
│   ├── gameLoop.js
│   ├── rateDrawing.js
│   ├── prompts.js
│   ├── avatars.js
│   ├── package.json
│   └── .env.example
└── client/
    ├── public/
    │   ├── avatar/
    │   └── assets/
    │
    └── src/
        ├── App.js
        ├── socket.js
        ├── tailwind.css
        │
        └── components/
            ├── JoinRoom.js
            ├── Room.js
            ├── Canvas.js
            ├── Voting.js
            ├── Results.js
            ├── GameSummary.js
            ├── Chat.js
            └── socket.js
```

---

##  Getting Started

### Requirements

* Node.js **18+**
* npm

### Installation

```bash
git clone <your-repository-url>
cd canvas-clash
npm install
```

### Run Locally

```bash
npm run dev
```
Or run the frontend and backend separately:

```bash
# Backend (http://localhost:3001)
npm run dev:backend
```

```bash
# Frontend (http://localhost:3000)
npm run dev:client
```

### Local URLs

```text
Frontend → http://localhost:3000
Backend  → http://localhost:3001
Health   → http://localhost:3001/health
```

## Deployment

### Deploy Frontend and Backend Separately

1. Deploy `client/build` to any static host.
2. Set `REACT_APP_SERVER_URL` in `client/.env` or in the host build environment:

```env
REACT_APP_SERVER_URL=https://your-backend.example.com
```

3. Build and deploy the client:

```bash
npm install
npm run build:client
```

4. Deploy the `backend/` workspace to a Node.js host. Set:

```env
PORT=3001
NODE_ENV=production
CLIENT_URLS=https://your-client.example.com
```

`CLIENT_URLS` accepts a comma-separated list of allowed frontend origins.

### Deploy as One Node.js Service

Build the React app and start the backend with the build directory:

```bash
npm install
npm run build:client
CLIENT_BUILD_DIR=client/build npm start
```

---



##  Real-Time Protection

To prevent abuse, the server validates important actions and applies rate limits:

```text
Drawing events → 60 / second / socket
Chat messages  → 1 / second / socket
```

Room permissions, voting, game phases, and player actions are validated server-side.

---

##  Achievements

Players can earn achievements such as:

*  **Champion**
*  **Fan Favorite**
*  **Picasso**
*  **Consistent**

---

##  Project Goal

Canvas Clash was designed around a simple idea:

> **Make multiplayer drawing feel competitive, fast, and fair.**

Anonymous voting reduces popularity bias, while automated quality scoring ensures that winning isn't only about getting the most votes.

---
