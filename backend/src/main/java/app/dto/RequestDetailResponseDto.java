package app.dto;

import java.util.ArrayList;
import java.util.List;

public class RequestDetailResponseDto {

    private RequestResponseDto request;
    private List<WorkflowStepResponse> workflowSteps = new ArrayList<>();
    private List<ApprovalResponseDto> approvals = new ArrayList<>();
    private List<StatusHistoryResponseDto> timeline = new ArrayList<>();

    public RequestDetailResponseDto() {
    }

    public RequestDetailResponseDto(RequestResponseDto request, List<WorkflowStepResponse> workflowSteps, List<ApprovalResponseDto> approvals, List<StatusHistoryResponseDto> timeline) {
        this.request = request;
        this.workflowSteps = workflowSteps;
        this.approvals = approvals;
        this.timeline = timeline;
    }

    public RequestResponseDto getRequest() {
        return request;
    }

    public void setRequest(RequestResponseDto request) {
        this.request = request;
    }

    public List<WorkflowStepResponse> getWorkflowSteps() {
        return workflowSteps;
    }

    public void setWorkflowSteps(List<WorkflowStepResponse> workflowSteps) {
        this.workflowSteps = workflowSteps;
    }

    public List<ApprovalResponseDto> getApprovals() {
        return approvals;
    }

    public void setApprovals(List<ApprovalResponseDto> approvals) {
        this.approvals = approvals;
    }

    public List<StatusHistoryResponseDto> getTimeline() {
        return timeline;
    }

    public void setTimeline(List<StatusHistoryResponseDto> timeline) {
        this.timeline = timeline;
    }
}
