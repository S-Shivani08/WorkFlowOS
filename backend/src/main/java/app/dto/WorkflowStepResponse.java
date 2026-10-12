package app.dto;

import app.model.ApproverRule;
import app.model.Role;
import app.model.WorkflowStep;

public class WorkflowStepResponse {

    private Long id;
    private Integer stepOrder;
    private String stepName;
    private ApproverRule approverRule;
    private Role requiredRole;
    private Long assignedUserId;
    private String assignedUserName;
    private String assignedUserEmail;

    public WorkflowStepResponse() {
    }

    public static WorkflowStepResponse fromEntity(WorkflowStep step) {
        WorkflowStepResponse res = new WorkflowStepResponse();
        res.setId(step.getId());
        res.setStepOrder(step.getStepOrder());
        res.setStepName(step.getStepName());
        res.setApproverRule(step.getApproverRule());
        res.setRequiredRole(step.getRequiredRole());
        if (step.getAssignedUser() != null) {
            res.setAssignedUserId(step.getAssignedUser().getId());
            res.setAssignedUserName(step.getAssignedUser().getName());
            res.setAssignedUserEmail(step.getAssignedUser().getEmail());
        }
        return res;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getStepOrder() {
        return stepOrder;
    }

    public void setStepOrder(Integer stepOrder) {
        this.stepOrder = stepOrder;
    }

    public String getStepName() {
        return stepName;
    }

    public void setStepName(String stepName) {
        this.stepName = stepName;
    }

    public ApproverRule getApproverRule() {
        return approverRule;
    }

    public void setApproverRule(ApproverRule approverRule) {
        this.approverRule = approverRule;
    }

    public Role getRequiredRole() {
        return requiredRole;
    }

    public void setRequiredRole(Role requiredRole) {
        this.requiredRole = requiredRole;
    }

    public Long getAssignedUserId() {
        return assignedUserId;
    }

    public void setAssignedUserId(Long assignedUserId) {
        this.assignedUserId = assignedUserId;
    }

    public String getAssignedUserName() {
        return assignedUserName;
    }

    public void setAssignedUserName(String assignedUserName) {
        this.assignedUserName = assignedUserName;
    }

    public String getAssignedUserEmail() {
        return assignedUserEmail;
    }

    public void setAssignedUserEmail(String assignedUserEmail) {
        this.assignedUserEmail = assignedUserEmail;
    }
}
