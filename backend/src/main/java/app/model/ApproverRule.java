package app.model;

/**
 * Rules used by the workflow engine to resolve the appropriate approver for a workflow step:
 * - SPECIFIC_USER: Assigned directly to a predetermined corporate user (e.g. HR Admin or IT Lead).
 * - ROLE_IN_DEPT: Assigned to the user with the specified role within the requester's department (e.g. requester's Manager).
 * - DEPT_HEAD: Assigned to the department head of the requester's department.
 * - ROLE: Assigned to any active user holding the required role (e.g. Finance Approver).
 */
public enum ApproverRule {
    SPECIFIC_USER,
    ROLE_IN_DEPT,
    DEPT_HEAD,
    ROLE
}
