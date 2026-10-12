package app.dto;

import java.util.HashMap;
import java.util.Map;

public class AdminDashboardDto {

    private long totalRequests;
    private long pendingRequests;
    private long approvedRequests;
    private long rejectedRequests;
    private long draftRequests;
    private long totalUsers;
    private long totalDepartments;
    private long totalWorkflows;

    private Map<String, Long> requestsByStatus = new HashMap<>();
    private Map<String, Long> requestsByType = new HashMap<>();
    private Map<String, Long> requestsByDepartment = new HashMap<>();

    public AdminDashboardDto() {
    }

    public long getTotalRequests() {
        return totalRequests;
    }

    public void setTotalRequests(long totalRequests) {
        this.totalRequests = totalRequests;
    }

    public long getPendingRequests() {
        return pendingRequests;
    }

    public void setPendingRequests(long pendingRequests) {
        this.pendingRequests = pendingRequests;
    }

    public long getApprovedRequests() {
        return approvedRequests;
    }

    public void setApprovedRequests(long approvedRequests) {
        this.approvedRequests = approvedRequests;
    }

    public long getRejectedRequests() {
        return rejectedRequests;
    }

    public void setRejectedRequests(long rejectedRequests) {
        this.rejectedRequests = rejectedRequests;
    }

    public long getDraftRequests() {
        return draftRequests;
    }

    public void setDraftRequests(long draftRequests) {
        this.draftRequests = draftRequests;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalDepartments() {
        return totalDepartments;
    }

    public void setTotalDepartments(long totalDepartments) {
        this.totalDepartments = totalDepartments;
    }

    public long getTotalWorkflows() {
        return totalWorkflows;
    }

    public void setTotalWorkflows(long totalWorkflows) {
        this.totalWorkflows = totalWorkflows;
    }

    public Map<String, Long> getRequestsByStatus() {
        return requestsByStatus;
    }

    public void setRequestsByStatus(Map<String, Long> requestsByStatus) {
        this.requestsByStatus = requestsByStatus;
    }

    public Map<String, Long> getRequestsByType() {
        return requestsByType;
    }

    public void setRequestsByType(Map<String, Long> requestsByType) {
        this.requestsByType = requestsByType;
    }

    public Map<String, Long> getRequestsByDepartment() {
        return requestsByDepartment;
    }

    public void setRequestsByDepartment(Map<String, Long> requestsByDepartment) {
        this.requestsByDepartment = requestsByDepartment;
    }
}
