# Smart Department Budget Management & Expense Analytics System

A full-stack web application designed to help academic departments efficiently plan, track, analyze, and audit their budgets and expenses in a structured, transparent, and role-controlled manner.

This system replaces manual spreadsheets with a centralized, secure, and analytics-driven platform.

---

## Overview

Academic departments often manage budgets across infrastructure, events, software, workshops, and student activities. Manual tracking leads to poor visibility, delayed approvals, and audit challenges.

This application provides:
- Structured budget planning
- Controlled expense management
- Role-based approvals
- Real-time analytics
- Audit-ready reporting

---

## Core Features

### Authentication & Roles
- Secure JWT-based authentication
- Fixed roles:
  - **Admin**
  - **HOD**
  - **Staff**
- Role-based access control enforced at API level

### Budget Management
- Create department budgets per category and year
- Planned vs allotted budget tracking
- Restricted creation (Admin, HOD only)

### Expense Management
- Add expenses against budgets
- Hierarchical expenses (parent → sub-expenses)
- Expense approval workflow
- Staff expense requests
- Receipt upload (PDF / Image)

### Receipts
- Cloud-based receipt storage
- Linked to individual expenses
- Upload permissions for all roles

### Reports & Analytics
- Category-wise expense breakdown
- Monthly expense trends
- Budget vs spent vs remaining
- Downloadable reports:
  - PDF
  - Excel
- Role-restricted access (Admin, HOD)

---

## Tech Stack

### Backend
- Node.js
- Express.js
- PostgreSQL (Neon)
- JWT Authentication
- Multer + Cloudinary (file uploads)
- PDFKit (PDF export)
- ExcelJS (Excel export)

### Frontend (upcoming)
- React
- Charts & dashboards
- Role-based UI views

---

## Database Schema

### Users
- id
- name
- email
- password (hashed)
- role

### Categories
- id
- name

### Budgets
- id
- user_id
- category_id
- year
- planned_amount
- allotted_amount

### Expenses
- id
- user_id
- budget_id
- category_id
- parent_expense_id (hierarchy)
- amount
- date
- description
- vendor
- approved

### Receipts
- id
- expense_id
- file_url

---

## Permissions Matrix

| Action | Admin | HOD | Staff |
|------|------|------|------|
| Add budgets | Yes | Yes | No |
| Add expenses | Yes | Yes | No |
| Request expense | No | No | Yes |
| Approve expense | Yes | Yes | No |
| Upload receipts | Yes | Yes | Yes |
| View reports | Yes | Yes | No |
| Download PDF / Excel | Yes | Yes | No |

---

## Project Structure (Backend)

