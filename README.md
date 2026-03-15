# Gradimy 🎓

Gradimy is a modern CRUD application designed for university students to manage and track graduation projects.

Team members: @mostafa-43, @mooaaz-shaabaan

## 🚀 Live Links

- **Frontend:** [gradimy.netlify.app](https://gradimy.netlify.app)
- **Backend:** [gradimy.onrender.com](https://gradimy.onrender.com)
- **Database:** Hosted on [Railway](https://railway.app/)

## Key Features

- **Project Dashboard:** A clean overview of all existing graduation projects.
- **Full CRUD Support:**
  - Create new projects with name, deadline, supervisor, and subject.
  - Update project details (including supervisor and subject).
  - Delete individual projects or perform a **Bulk Deletion** to clear the dashboard.
- **Smart Filtering:** Search by project name or filter by supervisor and subject.
- **Contextual Iconography:** Projects automatically display icons based on their subject (e.g., 🗄️ Database, 🌐 Web, 🧠 AI).
- **Premium Notifications:** Integrated with **Sonner** for beautiful, interactive toasts and non-intrusive confirmations.
- **Responsive Design:** Optimized for both desktop and mobile viewing.

## Tech Stack

### Frontend
- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS 4

### Backend
- **Language:** PHP 8.2
- **Database:** MySQL
- **Deployment:** Render (using Docker)

## 📂 Project Structure

```text
├── backend/
│   ├── api/             # PHP API endpoints (add, delete, update, get)
│   ├── database/        # SQL schema (db.sql)
│   └── dockerfile       # Backend deployment configuration
└── frontend/
    ├── src/
    │   ├── components/  # React components & UI elements
    │   ├── lib/         # API integration & data logic
    │   └── App.tsx      # Main application logic
    └── tailwind.config.ts
```

## Local Development (XAMPP)

For local testing and development, we utilized **XAMPP** to host the MySQL database and run the PHP backend:

1.  **Database**: Import `backend/database/db.sql` into **phpMyAdmin**.
2.  **PHP Server**: Place the `backend/api` files in your XAMPP `htdocs` folder.
3.  **Local Connection**: Ensure `backend/api/db.php` is configured for your local credentials (default user: `root`).

## 📡 API Endpoints

All backend logic is hosted at `https://gradimy.onrender.com`. You can interact with the following endpoints:

| Action | Method | URL |
| :--- | :--- | :--- |
| Get All Projects | `GET` | `https://gradimy.onrender.com/get_projects.php` |
| Get All Supervisors | `GET` | `https://gradimy.onrender.com/get_supervisors.php` |
| Get All Subjects | `GET` | `https://gradimy.onrender.com/get_subjects.php` |
| Add a Project | `POST` | `https://gradimy.onrender.com/add_projects.php` |
| Update a Project | `PUT` | `https://gradimy.onrender.com/update_project.php` |
| Delete a Project | `DELETE` | `https://gradimy.onrender.com/delete_project.php` |

## Frontend Setup
1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Run the development server:
   ```bash
   pnpm run dev
   ```

---
