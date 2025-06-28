# CORVO

A simple real-time chat application built with Node.js, Express, and Socket.IO.

## Features

<!-- - Real-time messaging between users
- Single room grp chatting app
- Shows number of users online
- Displays list of online users -->
<!-- - Mobile-first responsive design -->

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) installed

### Installation

1. Clone or download this repository.
2. Install dependencies:
   ```
   npm install
   ```

### Running the App

Start the server in development mode (with auto-reload):
```
npm run dev
```
Or in production mode:
```
npm start
```

Open your browser and go to:  
[http://localhost:3000/](http://localhost:3000/)

### Access from Other Devices

1. Find your computer’s local IP address (e.g., `192.168.1.5`).
2. Open `http://<your-ip>:3000/` on any device on the same network.

## Project Structure

```
corvo/
├── public/
│   ├── index.html
│   ├── style.css
│   └── client.js
├── server/
│   └── index.js
├── package.json
└── README.md
```

## Notes

- Usernames are prompted on each join.
- User list and count update automatically.
- For development history or personal notes, you can add to this README or use a separate tool.

---

# updates:

## Up1:
    - LEAVE button : it will be used for user to disconnect. refreshing wont lose connection.

**Author:** Mohd Faiz