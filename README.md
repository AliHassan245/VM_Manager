# VM Manager Dashboard

A modern web-based dashboard for creating, monitoring, and managing Linux virtual machines via Docker, built with FastAPI, PostgreSQL, HTML, Vanilla JavaScript, and Bootstrap 5.

---

## Table of Contents
- [Description](#description)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Demo Video](#demo-video)
- [Contact](#contact)

---

## Description

The VM Manager Dashboard allows you to manage virtual machines directly from your browser. Each VM is represented by a Docker container. The app tracks essential information such as VM name, CPU count, memory, and current status (running or stopped), which is stored in a PostgreSQL database. The backend is powered by FastAPI, while the frontend is built using HTML, Bootstrap 5, and vanilla JavaScript to provide an interactive, card-based interface for VM management.

---

## Features

- Create, edit, start/stop, and delete virtual machines (Docker containers)
- Real-time Docker container creation and control via backend
- Store VM details (name, CPU, memory, status) persistently in PostgreSQL
- Interactive frontend built using HTML, Bootstrap 5, and vanilla JavaScript
- RESTful API powered by FastAPI with full CRUD support

---

## Tech Stack

**Backend**: FastAPI, SQLAlchemy, Pydantic, Docker Python SDK  
**Database**: PostgreSQL  
**Frontend**: HTML, Bootstrap 5, Vanilla JavaScript

---

## Project Structure

```
VM_MANAGER/
├── backend/
│   ├── main.py          # FastAPI application and routes
│   ├── models.py        # SQLAlchemy model definitions
│   └── database.py      # Database connection setup
├── frontend/
│   ├── index.html       # Main dashboard
│   ├── pages/
│   │   ├── create.html  # VM creation form
│   │   └── edit.html    # VM editing form
│   ├── js/
│   │   ├── app.js       # Dashboard logic
│   │   ├── create.js    # Create form logic
│   │   └── edit.js      # Edit form logic
│   └── css/
│       └── style.css    # Custom styles and theme
└── README.md            # Project documentation
```

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/VM_MANAGER.git
cd VM_MANAGER
```

### 2. Install Docker Desktop

Make sure Docker Desktop is installed and running on your system.  
Download from: [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)

> Docker must be running before launching the backend or creating any VMs.

### 3. Start PostgreSQL

You can either:

#### Option A: Install PostgreSQL locally  
Use PgAdmin 4 to manage the database and ensure the following:
- Database: `VM_Manager`
- Username: `postgres`
- Password: `123456`

#### Option B: Use Docker to run PostgreSQL

```bash
docker run --name vm-postgres \
  -e POSTGRES_PASSWORD=123456 \
  -e POSTGRES_DB=VM_Manager \
  -p 5432:5432 -d postgres
```

### 4. Backend Setup

```bash
cd backend
pip install fastapi uvicorn sqlalchemy psycopg2-binary docker
uvicorn main:app --reload
```

> The FastAPI backend server will run at:  
> `http://127.0.0.1:8000`

### 5. Frontend Setup

```bash
cd frontend
python3 -m http.server 5500
```

Or simply open the dashboard directly in your browser at:  
`http://localhost:5500/index.html`

---

## Usage

- Open the dashboard in your browser: `http://localhost:5500/index.html`
- Click the **Create VM** button to open a form where you can enter:
  - VM name
  - CPU count
  - Memory size (MB)
- Upon submission:
  - A new Docker container will be created.
  - Details will be saved to PostgreSQL.
- Each VM appears as a **card** with name, CPU, memory, and status.
- Use the following buttons on each card:
  - **Edit**: Modify VM name, CPU, or memory.
  - **Toggle**: Start/stop the container.
  - **Delete**: Remove the container and delete its record from the DB.

---

## API Reference (To Test with Postman)

All backend endpoints can be tested using [Postman](https://www.postman.com/). Docker container status can also be verified using Docker Desktop.

| Endpoint             | Method  | Description                                     |
|----------------------|---------|-------------------------------------------------|
| `/vms`               | GET     | Retrieve a list of all VMs                     |
| `/vms`               | POST    | Create a new VM (Docker container)             |
| `/vms/{id}`          | GET     | Retrieve a VM by its ID                        |
| `/vms/{id}`          | PUT     | Update VM name, CPU count, and memory          |
| `/vms/{id}`          | DELETE  | Delete a VM (removes Docker container & DB)    |
| `/vms/{id}/toggle`   | PATCH   | Start or stop a VM (toggle container state)    |

---

## Demo Video

https://www.youtube.com/watch?v=uEuXC900tCA

---

## Contact

For questions or feedback, feel free to reach out:

📧 **alihsn.24.5.3.@gmail.com**



---

Happy VM managing! 🚀
