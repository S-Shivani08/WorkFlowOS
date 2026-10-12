package app.controller;

import app.dto.*;
import app.model.RequestStatus;
import app.model.RequestType;
import app.service.AdminDashboardService;
import app.service.DepartmentService;
import app.service.RequestService;
import app.service.UserService;
import app.service.WorkflowService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserService userService;
    private final DepartmentService departmentService;
    private final WorkflowService workflowService;
    private final RequestService requestService;
    private final AdminDashboardService adminDashboardService;

    public AdminController(UserService userService,
                           DepartmentService departmentService,
                           WorkflowService workflowService,
                           RequestService requestService,
                           AdminDashboardService adminDashboardService) {
        this.userService = userService;
        this.departmentService = departmentService;
        this.workflowService = workflowService;
        this.requestService = requestService;
        this.adminDashboardService = adminDashboardService;
    }

    // ================= Dashboard =================
    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardDto> getDashboard() {
        return ResponseEntity.ok(adminDashboardService.getDashboardStats());
    }

    // ================= Requests Oversight =================
    @GetMapping("/requests")
    public ResponseEntity<List<RequestResponseDto>> getAllRequests(
            @RequestParam(required = false) RequestStatus status,
            @RequestParam(required = false) RequestType type,
            @RequestParam(required = false) Long departmentId) {
        return ResponseEntity.ok(requestService.getAllRequests(status, type, departmentId));
    }

    // ================= Users Management =================
    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PostMapping("/users")
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody UserRequest userRequest) {
        return new ResponseEntity<>(userService.createUser(userRequest), HttpStatus.CREATED);
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<UserResponse> updateUser(@PathVariable Long id, @Valid @RequestBody UserRequest userRequest) {
        return ResponseEntity.ok(userService.updateUser(id, userRequest));
    }

    @PatchMapping("/users/{id}/toggle-status")
    public ResponseEntity<Void> toggleUserStatus(@PathVariable Long id) {
        userService.toggleUserActiveStatus(id);
        return ResponseEntity.noContent().build();
    }

    // ================= Departments Management =================
    @GetMapping("/departments")
    public ResponseEntity<List<DepartmentResponse>> getAllDepartments() {
        return ResponseEntity.ok(departmentService.getAllDepartments());
    }

    @GetMapping("/departments/{id}")
    public ResponseEntity<DepartmentResponse> getDepartmentById(@PathVariable Long id) {
        return ResponseEntity.ok(departmentService.getDepartmentById(id));
    }

    @PostMapping("/departments")
    public ResponseEntity<DepartmentResponse> createDepartment(@Valid @RequestBody DepartmentRequest departmentRequest) {
        return new ResponseEntity<>(departmentService.createDepartment(departmentRequest), HttpStatus.CREATED);
    }

    @PutMapping("/departments/{id}")
    public ResponseEntity<DepartmentResponse> updateDepartment(@PathVariable Long id, @Valid @RequestBody DepartmentRequest departmentRequest) {
        return ResponseEntity.ok(departmentService.updateDepartment(id, departmentRequest));
    }

    @DeleteMapping("/departments/{id}")
    public ResponseEntity<Void> deleteDepartment(@PathVariable Long id) {
        departmentService.deleteDepartment(id);
        return ResponseEntity.noContent().build();
    }

    // ================= Workflows Management =================
    @GetMapping("/workflows")
    public ResponseEntity<List<WorkflowResponse>> getAllWorkflows() {
        return ResponseEntity.ok(workflowService.getAllWorkflows());
    }

    @GetMapping("/workflows/{id}")
    public ResponseEntity<WorkflowResponse> getWorkflowById(@PathVariable Long id) {
        return ResponseEntity.ok(workflowService.getWorkflowById(id));
    }

    @PostMapping("/workflows")
    public ResponseEntity<WorkflowResponse> createWorkflow(@Valid @RequestBody WorkflowRequest workflowRequest) {
        return new ResponseEntity<>(workflowService.createWorkflow(workflowRequest), HttpStatus.CREATED);
    }

    @PutMapping("/workflows/{id}")
    public ResponseEntity<WorkflowResponse> updateWorkflow(@PathVariable Long id, @Valid @RequestBody WorkflowRequest workflowRequest) {
        return ResponseEntity.ok(workflowService.updateWorkflow(id, workflowRequest));
    }

    @DeleteMapping("/workflows/{id}")
    public ResponseEntity<Void> deleteWorkflow(@PathVariable Long id) {
        workflowService.deleteWorkflow(id);
        return ResponseEntity.noContent().build();
    }
}
