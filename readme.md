# HomeCloud - Personal File Manager & Cloud Clipboard

A full-stack file management system built with Node.js, Express, and React, designed to run on your home network. Upload, download, preview, and manage files from any device on your LAN. Includes a shared cloud clipboard for copying text between devices.

## Features

- **File Upload**: Upload multiple files with progress tracking
- **File Download**: Download files from any device on the network
- **File Preview**: Preview images, videos (`.mp4`, `.mov`), PDFs, and documents directly in the browser
- **File Deletion**: Delete files and folders
- **Folder Management**: Create and navigate folders in a tree structure
- **Cloud Clipboard**: Share text between devices on your network
- **Dark/Light Theme**: Toggle between themes with persistent preference
- **Responsive UI**: Works on desktop and mobile browsers

## Prerequisites

- **Node.js** >= 16
- **npm** >= 8

## Installation

```bash
git clone https://github.com/YOUR_USER/HomeCloud.git
cd HomeCloud
```

### Backend

```bash
npm install
```

Create a `.env` file in the root directory:

```env
UPLOAD_PATH=/path/to/your/uploads/folder
HOST=0.0.0.0
PORT=3001
```

### Frontend

```bash
cd frontend
npm install
```

## Running the Application

### Development

```bash
# Backend (from root)
npm run dev

# Frontend (from frontend/)
cd frontend
npm start
```

### macOS App (menu bar)

```bash
# Install dependencies
npm install
cd frontend && npm install && npm run build && cd ..

# Build the .app bundle (bundles backend with esbuild, compiles Swift, downloads Node, generates icon)
node build.mjs

# Run the app
open release/HomeCloud.app
```

This creates `release/HomeCloud.app` — a standalone macOS app that runs in the menu bar. It bundles its own Node.js runtime, so no system Node is required to run it. Configuration (port, upload folder) can be changed from the menu bar icon.

### Production with PM2

```bash
npm i -g pm2
pm2 start "npm start" --name homecloud-backend --cwd /path/to/HomeCloud
pm2 start "npm start" --name homecloud-frontend --cwd /path/to/HomeCloud/frontend
```

Access the app from any device on your network at `http://<server-ip>:3000`.

## Project Structure

```
HomeCloud/
├── server.js                  # Entry point
├── app/
│   ├── app.js                 # Express app setup
│   ├── utils.js               # Shared utilities
│   ├── controllers/
│   │   ├── fileController.js  # File operations (upload, download, list, delete)
│   │   └── clipboardController.js  # Cloud clipboard read/write
│   └── routes/
│       ├── index.js           # Route aggregator
│       ├── fileRoutes.js      # /files/* routes
│       └── clipboardRoutes.js # /clipboard/* routes
├── frontend/
│   └── src/
│       ├── App.js             # Root component
│       ├── FileUpload.js      # Main file manager view
│       ├── FileTree.js        # Folder tree navigation
│       ├── FileItem.js        # File display with preview/download/delete
│       ├── Folder.js          # Folder component
│       ├── CloudClipboard.js  # Shared clipboard component
│       └── styles.css
└── .env                       # Environment config (not tracked)
```

## API Endpoints

### Files

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/files/list` | List all files and folders |
| POST | `/files/upload?folderPath=...` | Upload files to a folder |
| GET | `/files/download/*` | Download a file |
| DELETE | `/files/delete/:filename` | Delete a file |
| POST | `/files/create-folder` | Create a new folder |
| DELETE | `/files/delete-folder` | Delete a folder |

### Clipboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/clipboard/get` | Get clipboard content |
| POST | `/clipboard/set` | Update clipboard content |

## License

MIT
