-- WorkFlowOS Database Schema
-- MySQL 8.0+

CREATE DATABASE IF NOT EXISTS `workflowos` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `workflowos`;

-- 1. Departments Table
CREATE TABLE IF NOT EXISTS `departments` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL UNIQUE,
    `code` VARCHAR(20) NOT NULL UNIQUE,
    `description` VARCHAR(255),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Users Table
CREATE TABLE IF NOT EXISTS `users` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `role` VARCHAR(50) NOT NULL,
    `department_id` BIGINT NULL,
    `job_title` VARCHAR(100),
    `phone` VARCHAR(30),
    `is_active` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_user_department` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL,
    INDEX `idx_users_email` (`email`),
    INDEX `idx_users_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Workflows Table
CREATE TABLE IF NOT EXISTS `workflows` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(150) NOT NULL,
    `request_type` VARCHAR(50) NOT NULL,
    `department_id` BIGINT NULL,
    `description` TEXT,
    `is_active` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_workflow_department` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE CASCADE,
    INDEX `idx_workflow_type` (`request_type`),
    INDEX `idx_workflow_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Workflow Steps Table
CREATE TABLE IF NOT EXISTS `workflow_steps` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `workflow_id` BIGINT NOT NULL,
    `step_order` INT NOT NULL,
    `step_name` VARCHAR(100) NOT NULL,
    `approver_rule` VARCHAR(50) NOT NULL,
    `required_role` VARCHAR(50) NULL,
    `assigned_user_id` BIGINT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_step_workflow` FOREIGN KEY (`workflow_id`) REFERENCES `workflows` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_step_assigned_user` FOREIGN KEY (`assigned_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
    CONSTRAINT `uk_workflow_step_order` UNIQUE (`workflow_id`, `step_order`),
    INDEX `idx_step_order` (`step_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Requests Table
CREATE TABLE IF NOT EXISTS `requests` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `requester_id` BIGINT NOT NULL,
    `request_type` VARCHAR(50) NOT NULL,
    `title` VARCHAR(200) NOT NULL,
    `description` TEXT NOT NULL,
    `department_id` BIGINT NOT NULL,
    `workflow_id` BIGINT NULL,
    `current_step_id` BIGINT NULL,
    `current_approver_id` BIGINT NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    `priority` VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    `amount` DECIMAL(12,2) NULL,
    `start_date` DATE NULL,
    `end_date` DATE NULL,
    `submitted_at` TIMESTAMP NULL,
    `completed_at` TIMESTAMP NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_req_requester` FOREIGN KEY (`requester_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_req_department` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_req_workflow` FOREIGN KEY (`workflow_id`) REFERENCES `workflows` (`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_req_current_step` FOREIGN KEY (`current_step_id`) REFERENCES `workflow_steps` (`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_req_current_approver` FOREIGN KEY (`current_approver_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
    INDEX `idx_requests_status` (`status`),
    INDEX `idx_requests_requester` (`requester_id`),
    INDEX `idx_requests_approver` (`current_approver_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Approvals Table
CREATE TABLE IF NOT EXISTS `approvals` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `request_id` BIGINT NOT NULL,
    `workflow_step_id` BIGINT NOT NULL,
    `approver_id` BIGINT NOT NULL,
    `decision` VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    `comments` TEXT,
    `decided_at` TIMESTAMP NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_approval_request` FOREIGN KEY (`request_id`) REFERENCES `requests` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_approval_step` FOREIGN KEY (`workflow_step_id`) REFERENCES `workflow_steps` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_approval_approver` FOREIGN KEY (`approver_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT,
    INDEX `idx_approval_decision` (`decision`),
    INDEX `idx_approval_approver` (`approver_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Status History Table
CREATE TABLE IF NOT EXISTS `status_history` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `request_id` BIGINT NOT NULL,
    `previous_status` VARCHAR(50) NULL,
    `new_status` VARCHAR(50) NOT NULL,
    `actor_id` BIGINT NOT NULL,
    `action` VARCHAR(100) NOT NULL,
    `comment` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_history_request` FOREIGN KEY (`request_id`) REFERENCES `requests` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_history_actor` FOREIGN KEY (`actor_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT,
    INDEX `idx_history_request` (`request_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
