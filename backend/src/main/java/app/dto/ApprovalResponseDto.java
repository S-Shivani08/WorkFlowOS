package app.dto;

import app.model.Approval;
import app.model.Decision;
import java.time.LocalDateTime;

public class ApprovalResponseDto {

    private Long id;
    private Long requestId;
    private String requestTitle;
    private String requesterName;
    private String requesterEmail;
    private Long workflowStepId;
    private String stepName;
    private Integer stepOrder;
    private Long approverId;
    private String approverName;
    private String approverEmail;
    private Decision decision;
    private String comments;
    private LocalDateTime decidedAt;
    private LocalDateTime createdAt;

    public ApprovalResponseDto() {
    }

    public static ApprovalResponseDto fromEntity(Approval app) {
        ApprovalResponseDto dto = new ApprovalResponseDto();
        dto.setId(app.getId());
        if (app.getRequest() != null) {
            dto.setRequestId(app.getRequest().getId());
            dto.setRequestTitle(app.getRequest().getTitle());
            if (app.getRequest().getRequester() != null) {
                dto.setRequesterName(app.getRequest().getRequester().getName());
                dto.setRequesterEmail(app.getRequest().getRequester().getEmail());
            }
        }
        if (app.getWorkflowStep() != null) {
            dto.setWorkflowStepId(app.getWorkflowStep().getId());
            dto.setStepName(app.getWorkflowStep().getStepName());
            dto.setStepOrder(app.getWorkflowStep().getStepOrder());
        }
        if (app.getApprover() != null) {
            dto.setApproverId(app.getApprover().getId());
            dto.setApproverName(app.getApprover().getName());
            dto.setApproverEmail(app.getApprover().getEmail());
        }
        dto.setDecision(app.getDecision());
        dto.setComments(app.getComments());
        dto.setDecidedAt(app.getDecidedAt());
        dto.setCreatedAt(app.getCreatedAt());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getRequestId() {
        return requestId;
    }

    public void setRequestId(Long requestId) {
        this.requestId = requestId;
    }

    public String getRequestTitle() {
        return requestTitle;
    }

    public void setRequestTitle(String requestTitle) {
        this.requestTitle = requestTitle;
    }

    public String getRequesterName() {
        return requesterName;
    }

    public void setRequesterName(String requesterName) {
        this.requesterName = requesterName;
    }

    public String getRequesterEmail() {
        return requesterEmail;
    }

    public void setRequesterEmail(String requesterEmail) {
        this.requesterEmail = requesterEmail;
    }

    public Long getWorkflowStepId() {
        return workflowStepId;
    }

    public void setWorkflowStepId(Long workflowStepId) {
        this.workflowStepId = workflowStepId;
    }

    public String getStepName() {
        return stepName;
    }

    public void setStepName(String stepName) {
        this.stepName = stepName;
    }

    public Integer getStepOrder() {
        return stepOrder;
    }

    public void setStepOrder(Integer stepOrder) {
        this.stepOrder = stepOrder;
    }

    public Long getApproverId() {
        return approverId;
    }

    public void setApproverId(Long approverId) {
        this.approverId = approverId;
    }

    public String getApproverName() {
        return approverName;
    }

    public void setApproverName(String approverName) {
        this.approverName = approverName;
    }

    public String getApproverEmail() {
        return approverEmail;
    }

    public void setApproverEmail(String approverEmail) {
        this.approverEmail = approverEmail;
    }

    public Decision getDecision() {
        return decision;
    }

    public void setDecision(Decision decision) {
        this.decision = decision;
    }

    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }

    public LocalDateTime getDecidedAt() {
        return decidedAt;
    }

    public void setDecidedAt(LocalDateTime decidedAt) {
        this.decidedAt = decidedAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
