-- WorkFlowOS Sample Data Seed Script
-- Default password for all sample corporate users: password123
-- BCrypt Hash: $2a$10$Dow1cT7qKqT8E1hH8uL5/OUqS05k/tS1G8yM2dJ.8K4FzO3aL92yG (password123)

USE `workflowos`;

-- 1. Seed Corporate Departments
INSERT INTO `departments` (`id`, `name`, `code`, `description`) VALUES
(1, 'Human Resources', 'HR', 'Employee relations, payroll, talent acquisition, and company policies'),
(2, 'Finance & Accounts', 'FIN', 'Budgeting, procurement, expense reimbursements, and financial auditing'),
(3, 'Information Technology', 'IT', 'Cloud infrastructure, software licenses, cybersecurity, and hardware assets'),
(4, 'Operations & Logistics', 'OPS', 'Facilities, administrative vendor management, and internal services')
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

-- 2. Seed Corporate Users (Admin, Department Heads, Managers, Employees)
-- BCrypt hash for "password123": $2a$10$Dow1cT7qKqT8E1hH8uL5/OUqS05k/tS1G8yM2dJ.8K4FzO3aL92yG
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `department_id`, `job_title`, `phone`, `is_active`) VALUES
(1, 'Admin User', 'admin@workflowos.com', '$2a$10$Dow1cT7qKqT8E1hH8uL5/OUqS05k/tS1G8yM2dJ.8K4FzO3aL92yG', 'ROLE_ADMIN', 3, 'System Administrator', '+1-555-0100', TRUE),
(2, 'Rachel Adams', 'hr.head@workflowos.com', '$2a$10$Dow1cT7qKqT8E1hH8uL5/OUqS05k/tS1G8yM2dJ.8K4FzO3aL92yG', 'ROLE_DEPT_HEAD', 1, 'Head of Human Resources', '+1-555-0101', TRUE),
(3, 'Marcus Vance', 'hr.manager@workflowos.com', '$2a$10$Dow1cT7qKqT8E1hH8uL5/OUqS05k/tS1G8yM2dJ.8K4FzO3aL92yG', 'ROLE_MANAGER', 1, 'HR Operations Manager', '+1-555-0102', TRUE),
(4, 'Elena Rostova', 'finance.head@workflowos.com', '$2a$10$Dow1cT7qKqT8E1hH8uL5/OUqS05k/tS1G8yM2dJ.8K4FzO3aL92yG', 'ROLE_DEPT_HEAD', 2, 'Head of Finance', '+1-555-0103', TRUE),
(5, 'David Chen', 'finance.manager@workflowos.com', '$2a$10$Dow1cT7qKqT8E1hH8uL5/OUqS05k/tS1G8yM2dJ.8K4FzO3aL92yG', 'ROLE_MANAGER', 2, 'Finance Approvals Manager', '+1-555-0104', TRUE),
(6, 'Vikram Malhotra', 'it.head@workflowos.com', '$2a$10$Dow1cT7qKqT8E1hH8uL5/OUqS05k/tS1G8yM2dJ.8K4FzO3aL92yG', 'ROLE_DEPT_HEAD', 3, 'VP of Technology & IT', '+1-555-0105', TRUE),
(7, 'Sophia Garcia', 'it.manager@workflowos.com', '$2a$10$Dow1cT7qKqT8E1hH8uL5/OUqS05k/tS1G8yM2dJ.8K4FzO3aL92yG', 'ROLE_MANAGER', 3, 'IT Infrastructure Manager', '+1-555-0106', TRUE),
(8, 'Thomas Wright', 'ops.head@workflowos.com', '$2a$10$Dow1cT7qKqT8E1hH8uL5/OUqS05k/tS1G8yM2dJ.8K4FzO3aL92yG', 'ROLE_DEPT_HEAD', 4, 'Director of Operations', '+1-555-0107', TRUE),
(9, 'Alex Turner', 'alex.employee@workflowos.com', '$2a$10$Dow1cT7qKqT8E1hH8uL5/OUqS05k/tS1G8yM2dJ.8K4FzO3aL92yG', 'ROLE_EMPLOYEE', 3, 'Senior Software Engineer', '+1-555-0108', TRUE),
(10, 'Sarah Jenkins', 'sarah.employee@workflowos.com', '$2a$10$Dow1cT7qKqT8E1hH8uL5/OUqS05k/tS1G8yM2dJ.8K4FzO3aL92yG', 'ROLE_EMPLOYEE', 2, 'Financial Analyst', '+1-555-0109', TRUE)
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

-- 3. Seed Configured Multi-Step Workflows
-- Workflow 1: Employee Leave Request Routing
INSERT INTO `workflows` (`id`, `name`, `request_type`, `department_id`, `description`, `is_active`) VALUES
(1, 'Standard Employee Leave Workflow', 'LEAVE', NULL, 'Automatic 2-step approval routing: Direct Manager -> HR Department Head', TRUE),
(2, 'Corporate Purchase Approval Workflow', 'PURCHASE', NULL, '3-step authorization routing: Department Head -> Finance Manager -> CFO / Finance Head', TRUE),
(3, 'Expense Reimbursement Workflow', 'REIMBURSEMENT', NULL, '2-step routing: Department Manager -> Finance Manager', TRUE),
(4, 'IT Hardware & Cloud Access Workflow', 'IT_SUPPORT', NULL, '2-step routing: IT Operations Manager -> IT Department Head', TRUE),
(5, 'General Administrative Workflow', 'ADMIN_REQUEST', NULL, '1-step routing: Operations Director Review', TRUE)
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

-- 4. Seed Workflow Steps
-- Steps for Workflow 1 (LEAVE): Step 1 Manager, Step 2 HR Head
INSERT INTO `workflow_steps` (`id`, `workflow_id`, `step_order`, `step_name`, `approver_rule`, `required_role`, `assigned_user_id`) VALUES
(1, 1, 1, 'Manager Initial Review', 'ROLE_IN_DEPT', 'ROLE_MANAGER', NULL),
(2, 1, 2, 'HR Department Head Final Approval', 'SPECIFIC_USER', 'ROLE_DEPT_HEAD', 2),

-- Steps for Workflow 2 (PURCHASE): Step 1 Dept Head, Step 2 Finance Manager, Step 3 Finance Head
(3, 2, 1, 'Department Head Review', 'DEPT_HEAD', 'ROLE_DEPT_HEAD', NULL),
(4, 2, 2, 'Finance Manager Budget Verification', 'ROLE', 'ROLE_MANAGER', 5),
(5, 2, 3, 'CFO / Finance Head Final Sign-off', 'ROLE', 'ROLE_DEPT_HEAD', 4),

-- Steps for Workflow 3 (REIMBURSEMENT): Step 1 Dept Manager, Step 2 Finance Manager
(6, 3, 1, 'Department Manager Verification', 'ROLE_IN_DEPT', 'ROLE_MANAGER', NULL),
(7, 3, 2, 'Finance Audit & Payment Clearance', 'ROLE', 'ROLE_MANAGER', 5),

-- Steps for Workflow 4 (IT_SUPPORT): Step 1 IT Manager, Step 2 IT Head
(8, 4, 1, 'IT Support Manager Triage & Assessment', 'ROLE', 'ROLE_MANAGER', 7),
(9, 4, 2, 'IT Department Head Security Authorization', 'ROLE', 'ROLE_DEPT_HEAD', 6),

-- Steps for Workflow 5 (ADMIN_REQUEST): Step 1 Operations Head
(10, 5, 1, 'Operations Directorate Review', 'ROLE', 'ROLE_DEPT_HEAD', 8)
ON DUPLICATE KEY UPDATE `step_name`=VALUES(`step_name`);

-- 5. Seed Sample Active Requests to demonstrate multi-stage state
INSERT INTO `requests` (`id`, `requester_id`, `request_type`, `title`, `description`, `department_id`, `workflow_id`, `current_step_id`, `current_approver_id`, `status`, `priority`, `amount`, `start_date`, `end_date`, `submitted_at`) VALUES
(1, 9, 'LEAVE', 'Annual Family Vacation Leave', 'Requesting 5 days paid time off for annual family leave', 3, 1, 1, 7, 'PENDING_APPROVAL', 'MEDIUM', NULL, '2026-11-01', '2026-11-05', CURRENT_TIMESTAMP),
(2, 9, 'PURCHASE', 'Ergonomic Desk & 4K Monitor Requisition', 'Hardware upgrade required for senior engineering development workstation', 3, 2, 3, 6, 'PENDING_APPROVAL', 'HIGH', 1250.00, NULL, NULL, CURRENT_TIMESTAMP),
(3, 10, 'REIMBURSEMENT', 'Client Q3 Strategy Dinner Reimbursement', 'Dinner with key fintech enterprise client executives in downtown conference', 2, 3, 7, 5, 'APPROVED', 'LOW', 340.50, NULL, NULL, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`);
