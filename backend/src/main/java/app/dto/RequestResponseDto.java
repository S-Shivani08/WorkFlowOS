package app.dto;

import app.model.Priority;
import app.model.Request;
import app.model.RequestStatus;
import app.model.RequestType;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class RequestResponseDto {

    private Long id;
    private Long requesterId;
    private String requesterName;
    private String requesterEmail;
    private RequestType requestType;
    private String title;
    private String description;
    private Long departmentId;
    private String departmentName;
    private Long workflowId;
    private String workflowName;
    private Long currentStepId;
    private Integer currentStepOrder;
    private String currentStepName;
    private Long currentApproverId;
    private String currentApproverName;
    private String currentApproverEmail;
    private RequestStatus status;
    private Priority priority;
    private BigDecimal amount;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDateTime submittedAt;
    private LocalDateTime completedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public RequestResponseDto() {
    }

    public static RequestResponseDto fromEntity(Request req) {
        RequestResponseDto dto = new RequestResponseDto();
        dto.setId(req.getId());
        if (req.getRequester() != null) {
            dto.setRequesterId(req.getRequester().getId());
            dto.setRequesterName(req.getRequester().getName());
            dto.setRequesterEmail(req.getRequester().getEmail());
        }
        dto.setRequestType(req.getRequestType());
        dto.setTitle(req.getTitle());
        dto.setDescription(req.getDescription());
        if (req.getDepartment() != null) {
            dto.setDepartmentId(req.getDepartment().getId());
            dto.setDepartmentName(req.getDepartment().getName());
        }
        if (req.getWorkflow() != null) {
            dto.setWorkflowId(req.getWorkflow().getId());
            dto.setWorkflowName(req.getWorkflow().getName());
        }
        if (req.getCurrentStep() != null) {
            dto.setCurrentStepId(req.getCurrentStep().getId());
            dto.setCurrentStepOrder(req.getCurrentStep().getStepOrder());
            dto.setCurrentStepName(req.getCurrentStep().getStepName());
        }
        if (req.getCurrentApprover() != null) {
            dto.setCurrentApproverId(req.getCurrentApprover().getId());
            dto.setCurrentApproverName(req.getCurrentApprover().getName());
            dto.setCurrentApproverEmail(req.getCurrentApprover().getEmail());
        }
        dto.setStatus(req.getStatus());
        dto.setPriority(req.getPriority());
        dto.setAmount(req.getAmount());
        dto.setStartDate(req.getStartDate());
        dto.setEndDate(req.getEndDate());
        dto.setSubmittedAt(req.getSubmittedAt());
        dto.setCompletedAt(req.getCompletedAt());
        dto.setCreatedAt(req.getCreatedAt());
        dto.setUpdatedAt(req.getUpdatedAt());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getRequesterId() {
        return requesterId;
    }

    public void setRequesterId(Long requesterId) {
        this.requesterId = requesterId;
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

    public RequestType getRequestType() {
        return requestType;
    }

    public void setRequestType(RequestType requestType) {
        this.requestType = requestType;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

    public Long getWorkflowId() {
        return workflowId;
    }

    public void setWorkflowId(Long workflowId) {
        this.workflowId = workflowId;
    }

    public String getWorkflowName() {
        return workflowName;
    }

    public void setWorkflowName(String workflowName) {
        this.workflowName = workflowName;
    }

    public Long getCurrentStepId() {
        return currentStepId;
    }

    public void setCurrentStepId(Long currentStepId) {
        this.currentStepId = currentStepId;
    }

    public Integer getCurrentStepOrder() {
        return currentStepOrder;
    }

    public void setCurrentStepOrder(Integer currentStepOrder) {
        this.currentStepOrder = currentStepOrder;
    }

    public String getCurrentStepName() {
        return currentStepName;
    }

    public void setCurrentStepName(String currentStepName) {
        this.currentStepName = currentStepName;
    }

    public Long getCurrentApproverId() {
        return currentApproverId;
    }

    public void setCurrentApproverId(Long currentApproverId) {
        this.currentApproverId = currentApproverId;
    }

    public String getCurrentApproverName() {
        return currentApproverName;
    }

    public void setCurrentApproverName(String currentApproverName) {
        this.currentApproverName = currentApproverName;
    }

    public String getCurrentApproverEmail() {
        return currentApproverEmail;
    }

    public void setCurrentApproverEmail(String currentApproverEmail) {
        this.currentApproverEmail = currentApproverEmail;
    }

    public RequestStatus getStatus() {
        return status;
    }

    public void setStatus(RequestStatus status) {
        this.status = status;
    }

    public Priority getPriority() {
        return priority;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
