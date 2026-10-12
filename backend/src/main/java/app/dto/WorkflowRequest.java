package app.dto;

import app.model.RequestType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

public class WorkflowRequest {

    @NotBlank(message = "Workflow name is required")
    private String name;

    @NotNull(message = "Request type is required")
    private RequestType requestType;

    private Long departmentId; // Optional: null = global workflow

    private String description;

    private Boolean isActive = true;

    @Valid
    private List<WorkflowStepRequest> steps = new ArrayList<>();

    public WorkflowRequest() {
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean active) {
        isActive = active;
    }

    public List<WorkflowStepRequest> getSteps() {
        return steps;
    }

    public void setSteps(List<WorkflowStepRequest> steps) {
        this.steps = steps;
    }
}
