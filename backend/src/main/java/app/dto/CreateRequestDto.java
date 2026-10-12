package app.dto;

import app.model.Priority;
import app.model.RequestType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

public class CreateRequestDto {

    @NotNull(message = "Request type is required")
    private RequestType requestType;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    private Long departmentId; // If null, defaults to employee's own department

    private Priority priority = Priority.MEDIUM;

    private BigDecimal amount; // For PURCHASE or REIMBURSEMENT

    private LocalDate startDate; // For LEAVE

    private LocalDate endDate; // For LEAVE

    private boolean submitImmediately = true; // True to immediately route to workflow

    public CreateRequestDto() {
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

    public boolean isSubmitImmediately() {
        return submitImmediately;
    }

    public void setSubmitImmediately(boolean submitImmediately) {
        this.submitImmediately = submitImmediately;
    }
}
