package app.dto;

import app.model.Department;
import java.time.LocalDateTime;

public class DepartmentResponse {

    private Long id;
    private String name;
    private String code;
    private String description;
    private long employeeCount;
    private LocalDateTime createdAt;

    public DepartmentResponse() {
    }

    public static DepartmentResponse fromEntity(Department dept, long employeeCount) {
        DepartmentResponse res = new DepartmentResponse();
        res.setId(dept.getId());
        res.setName(dept.getName());
        res.setCode(dept.getCode());
        res.setDescription(dept.getDescription());
        res.setEmployeeCount(employeeCount);
        res.setCreatedAt(dept.getCreatedAt());
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

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public long getEmployeeCount() {
        return employeeCount;
    }

    public void setEmployeeCount(long employeeCount) {
        this.employeeCount = employeeCount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
