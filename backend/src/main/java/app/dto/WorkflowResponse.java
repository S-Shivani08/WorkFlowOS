package app.dto;

import app.model.RequestType;
import app.model.Workflow;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class WorkflowResponse {

    private Long id;
    private String name;
    private RequestType requestType;
    private Long departmentId;
    private String departmentName;
    private String description;
    private boolean isActive;
    private List<WorkflowStepResponse> steps = new ArrayList<>();
    private LocalDateTime createdAt;

    public WorkflowResponse() {
    }

    public static WorkflowResponse fromEntity(Workflow wf) {
        WorkflowResponse res = new WorkflowResponse();
        res.setId(wf.getId());
        res.setName(wf.getName());
        res.setRequestType(wf.getRequestType());
        if (wf.getDepartment() != null) {
            res.setDepartmentId(wf.getDepartment().getId());
            res.setDepartmentName(wf.getDepartment().getName());
        }
        res.setDescription(wf.getDescription());
        res.setActive(wf.isActive());
        if (wf.getSteps() != null) {
            res.setSteps(wf.getSteps().stream()
                    .map(WorkflowStepResponse::fromEntity)
                    .collect(Collectors.toList()));
        }
        res.setCreatedAt(wf.getCreatedAt());
        return res;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public RequestType getRequestType() {
        return requestType;
    }

    public void setRequestType(RequestType requestType) {
        this.requestType = requestType;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public List<WorkflowStepResponse> getSteps() {
        return steps;
    }

    public void setSteps(List<WorkflowStepResponse> steps) {
        this.steps = steps;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
