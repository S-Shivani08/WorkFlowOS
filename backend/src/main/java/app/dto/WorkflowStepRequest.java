package app.dto;

import app.model.ApproverRule;
import app.model.Role;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class WorkflowStepRequest {

    @NotNull(message = "Step order is required")
    @Min(value = 1, message = "Step order must be >= 1")
    private Integer stepOrder;

    @NotBlank(message = "Step name is required")
    private String stepName;

    @NotNull(message = "Approver rule is required")
    private ApproverRule approverRule;

    private Role requiredRole;

    private Long assignedUserId;

    public WorkflowStepRequest() {
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
}
