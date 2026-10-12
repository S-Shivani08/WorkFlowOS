# WorkFlowOS — Enterprise Employee Request & Automatic Approval-Routing System

**WorkFlowOS** is a full-stack corporate web application designed for companies and business enterprises to streamline, track, and automatically route employee requests (leave, purchase requisitions, reimbursements, IT support, and administrative approvals).

It replaces scattered emails, manual paperwork, and delays with a **configurable, multi-stage approval routing engine**.

---

## 🌟 Key Features

1. **Autonomous Request Transfer Engine**:
   - When an employee submits a request, the backend identifies the matching active workflow.
   - It dynamically resolves the first approver based on organizational rules (e.g., manager in requester's department or department head).
   - Once an approver reviews and approves the step, the system **automatically transfers** the request to the next configured approver in sequence.
   - When the final stage is approved, the request is marked **COMPLETED / APPROVED**.
   - If rejected at any stage, the request is finalized as **REJECTED** with reviewer comments.

2. **Visual Multi-Stage Stepper**:
   - Employees and approvers see a dynamic pipeline progress bar:
     - 🟢 **Completed steps**: Green checkmarks
     - 🔵 **Current active step**: Pulsating blue ring with designated approver name
     - ⚪ **Upcoming steps**: Gray sequential order
     - 🔴 **Rejected step**: Red indicator

3. **Complete Cryptographic & Audit Trail**:
   - Every lifecycle transition (`REQUEST_CREATED`, `SUBMITTED_AND_ROUTED`, `STEP_APPROVED`, `AUTOMATIC_STEP_TRANSFER`, `REQUEST_COMPLETED`) is recorded in the `status_history` table.
   - Full timeline with timestamps, actor IDs, actions, and comments.

4. **Corporate Role-Based Access Control (RBAC)**:
   - `ROLE_EMPLOYEE`: Submit requests, view personal submissions, cancel drafts.
   - `ROLE_MANAGER`: Review and authorize departmental requests.
   - `ROLE_DEPT_HEAD`: Department-level sign-offs and budget checks.
   - `ROLE_ADMIN`: Global organization oversight, workflow designer, staff directory, departments.

5. **1-Click Presentation Demo Presets**:
   - Pre-seeded corporate users across HR, Finance, IT, and Operations for instant demoing during college presentations and viva examinations.

---

## 🏗️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, JavaScript (ES6+), React Router 6, Axios, Lucide Icons, Pure CSS |
| **Backend** | Java 17, Spring Boot 3.3.x, Spring Web, Spring Data JPA / Hibernate |
| **Security** | Spring Security 6, JWT (JSON Web Tokens), BCrypt Password Hashing, Bean Validation |
| **Database** | MySQL 8.0 (InnoDB, Foreign Key Constraints, Cascades, Indexes) |
| **Build Tools** | Apache Maven 3.9+, Node.js (npm) |

---

## 📂 Project Structure

```text
WorkFlowOS/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ApprovalModal.jsx     # Review modal with approval comments
│   │   │   ├── Navbar.jsx            # Top navbar with user badges & new request trigger
│   │   │   ├── RequestModal.jsx      # Submission dialog with live workflow preview
│   │   │   ├── Sidebar.jsx           # Role-aware navigation sidebar
│   │   │   ├── StatusBadge.jsx       # Status color pill badges
│   │   │   └── WorkflowStepper.jsx   # Multi-stage interactive progress tracker
│   │   ├── context/
│   │   │   └── AuthContext.jsx       # JWT authentication and user role context
│   │   ├── pages/
│   │   │   ├── AdminDepartmentsPage.jsx # Corporate department management
│   │   │   ├── AdminRequestsPage.jsx    # Company-wide requests oversight
│   │   │   ├── AdminUsersPage.jsx       # Staff directory & status management
│   │   │   ├── AdminWorkflowsPage.jsx   # Pipeline workflow visual builder
│   │   │   ├── ApprovalsPage.jsx        # Pending approvals queue & review history
│   │   │   ├── DashboardPage.jsx        # Executive metrics & quick overview
│   │   │   ├── LoginPage.jsx            # Portal login with 1-click presentation presets
│   │   │   ├── MyRequestsPage.jsx       # Personal requests list & filtering
│   │   │   └── RequestDetailPage.jsx    # Visual stepper, details & audit timeline
│   │   ├── services/
│   │   │   ├── adminService.js       # Admin CRUD API integration
│   │   │   ├── api.js                # Axios instance with JWT interceptor
│   │   │   ├── approvalService.js    # Approvals & decision API integration
│   │   │   ├── authService.js        # Login & authentication API integration
│   │   │   ├── commonService.js      # Metadata & departments API integration
│   │   │   └── requestService.js     # Requests lifecycle API integration
│   │   ├── App.jsx                   # Application router & layout guards
│   │   ├── index.css                 # Corporate design tokens & styling
│   │   └── main.jsx                  # React application entry point
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── .env
├── backend/
│   ├── src/main/java/app/
│   │   ├── config/
│   │   │   └── DataInitializer.java  # Safe idempotent database seeder with BCrypt hashes
│   │   ├── controller/
│   │   │   ├── AdminController.java   # Admin CRUD and system oversight APIs
│   │   │   ├── ApprovalController.java# Approver pending queue & decisions APIs
│   │   │   ├── AuthController.java    # Login and authenticated user APIs
│   │   │   ├── CommonController.java  # Department and active staff lookup APIs
│   │   │   └── RequestController.java # Request submission & details APIs
│   │   ├── dto/                      # Request and Response Data Transfer Objects
│   │   ├── exception/                # Global exception handling and custom errors
│   │   ├── model/                    # JPA Entities (Department, User, Request, Workflow, etc.)
│   │   ├── repository/               # Spring Data JPA repositories with query aggregations
│   │   ├── security/                 # Spring Security 6, JWT Provider, Auth Filters
│   │   ├── service/
│   │   │   ├── AdminDashboardService.java # Analytics metrics service
│   │   │   ├── ApprovalService.java       # Approver queue and decision handling
│   │   │   ├── AuthService.java           # Authentication service
│   │   │   ├── DepartmentService.java     # Department service
│   │   │   ├── RequestService.java        # Request submission service
│   │   │   ├── UserService.java           # User management service
│   │   │   ├── WorkflowEngineService.java # ★ Dedicated Automatic Transfer Engine
│   │   │   └── WorkflowService.java       # Workflow configuration service
│   │   └── BackendApplication.java   # Spring Boot Main Class
│   ├── src/main/resources/
│   │   └── application.properties    # DataSource, JPA, and JWT configurations
│   ├── src/test/java/app/
│   │   └── BackendApplicationTests.java # Context loading integration tests
│   └── pom.xml
├── database/
│   ├── schema.sql                    # MySQL 8.0 DDL database tables & constraints
│   └── sample-data.sql               # Corporate seed data & pre-configured workflows
└── README.md
```

---

## 🗄️ Database Design

The MySQL database `workflowos` consists of 7 normalized relational tables:

1. **`departments`**: Organizational business units (HR, FIN, IT, OPS).
2. **`users`**: Staff accounts with BCrypt-hashed passwords, role, department reference, and active status.
3. **`workflows`**: Configured workflow templates for request types (LEAVE, PURCHASE, REIMBURSEMENT, IT_SUPPORT, ADMIN_REQUEST).
4. **`workflow_steps`**: Sequential ordered steps (1, 2, 3...) per workflow with assignment rules (`ROLE_IN_DEPT`, `DEPT_HEAD`, `ROLE`, `SPECIFIC_USER`).
5. **`requests`**: Employee requests containing title, description, priority, amount/dates, current status, active step, and currently assigned approver.
6. **`approvals`**: Formal decision records containing workflow step, approver, decision (`APPROVED`, `REJECTED`, `PENDING`), comments, and timestamp.
7. **`status_history`**: Immutable chronological audit logs tracking every event, state transition, and actor.

---

## 👥 Sample Corporate Accounts (Quick Demo)

All sample users are pre-configured with the default password: **`password123`**

| Role / Title | Email | Department | Usage in Workflow |
|---|---|---|---|
| **System Admin** | `admin@workflowos.com` | IT | Full administrative oversight, workflows & staff management |
| **IT Manager** | `it.manager@workflowos.com` | IT | Approves IT team leaves & IT support triage |
| **HR Dept Head** | `hr.head@workflowos.com` | HR | Final authorization for all company leaves |
| **Finance Head (CFO)** | `finance.head@workflowos.com` | FIN | Final sign-off on purchase requisitions |
| **Finance Manager** | `finance.manager@workflowos.com` | FIN | Verifies purchase budgets & reimbursements |
| **VP of IT & Infrastructure**| `it.head@workflowos.com` | IT | Approves IT cloud access & department purchases |
| **Senior Software Engineer**| `alex.employee@workflowos.com` | IT | Submits requests (e.g., Leave, Hardware Requisition) |
| **Financial Analyst** | `sarah.employee@workflowos.com` | FIN | Submits expense reimbursements |

---

## ⚡ How to Run the Project Locally

### 1. Database Setup
Make sure MySQL service is running on `localhost:3306`:
```sql
CREATE DATABASE IF NOT EXISTS workflowos;
```
Import schema and sample data:
```bash
mysql -u root -p workflowos < database/schema.sql
mysql -u root -p workflowos < database/sample-data.sql
```

### 2. Run Backend (Spring Boot)
Open a terminal in `WorkFlowOS/backend`:
```bash
mvn spring-boot:run
```
The backend starts at `http://localhost:8080`.

### 3. Run Frontend (React + Vite)
Open a terminal in `WorkFlowOS/frontend`:
```bash
npm install
npm run dev
```
The application will be live at `http://localhost:5173`.

---

## 🎓 B.Tech CSE Viva & Presentation Guide

When presenting WorkFlowOS to your evaluator or professor:

1. **How does the Automatic Transfer work?**
   - Point to `WorkflowEngineService.java`.
   - Explain how `processStepApproval()` checks for the next step order: `findFirstByWorkflowAndStepOrderGreaterThanOrderByStepOrderAsc()`.
   - If a step exists, it updates `request.currentStep` and `request.currentApprover`, logs an audit entry, and assigns a pending approval record.
   - If no further steps exist, it automatically updates the request status to `APPROVED` and records `completedAt`.

2. **How are passwords stored?**
   - No plaintext passwords exist. All passwords use `BCryptPasswordEncoder` with a salt factor of 10.

3. **How does authentication work?**
   - The user calls `POST /api/auth/login`.
   - The backend validates credentials and issues a signed HMAC-SHA256 JWT token.
   - The React frontend stores the token in `localStorage` and attaches it via an Axios interceptor as `Authorization: Bearer <token>`.
   - `JwtAuthenticationFilter` validates the token per request on the backend.

4. **Why is this suitable for corporate enterprises?**
   - It supports department-based hierarchy (managers, department heads, CFO) and enforces separation of concerns through automated audit trails.
