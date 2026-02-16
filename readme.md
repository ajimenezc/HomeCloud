# File Management System

A full-stack file management system built with Node.js, Express, and React. This application allows users to upload, download, preview, and manage files and folders. It supports various file types, including images, videos, documents, and more.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Frontend Components](#frontend-components)
- [Troubleshooting](#troubleshooting)
- [Security Considerations](#security-considerations)
- [License](#license)

---

## Features

- **File Upload**: Upload multiple files to the server with support for large files.
- **File Download**: Download files from the server.
- **File Preview**: Preview images, videos (including `.mp4`), PDFs, and more directly in the browser.
- **File Deletion**: Delete files from the server.
- **Folder Management**: Create and delete folders on the server.
- **File Listing**: List all files and folders in a hierarchical structure.
- **Responsive UI**: User-friendly interface built with React and styled for a pleasant user experience.
- **Error Handling**: Graceful error handling with informative messages.
- **Cross-Origin Support**: Configured CORS to allow requests from different origins.

---

## Prerequisites

- **Node.js** (version 12 or higher)
- **npm** or **yarn**
- **Git** (for cloning the repository)

---

## Installation

### Clone the Repository

```bash
git clone https://github.com/yourusername/file-management-system.git
cd file-management-system

npm i -g pm2
pm2 start "npm run start:backend"  --name nube-backend  --cwd /ruta/a/tu/app
pm2 start "npm run start:frontend" --name nube-frontend --cwd /ruta/a/tu/app
pm2 stop nube-frontend && pm2 delete nube-frontend