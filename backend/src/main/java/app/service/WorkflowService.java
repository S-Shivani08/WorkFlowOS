package app.service;

import app.dto.WorkflowRequest;
import app.dto.WorkflowResponse;
import app.dto.WorkflowStepRequest;
import app.exception.BadRequestException;
import app.exception.ResourceNotFoundException;
import app.model.*;
import app.repository.DepartmentRepository;
import app.repository.UserRepository;
import app.repository.WorkflowRepository;
import app.repository.WorkflowStepRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class WorkflowService {

    private final WorkflowRepository workflowRepository;
    private final WorkflowStepRepository workflowStepRepository;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;

    public WorkflowService(WorkflowRepository workflowRepository,
                           WorkflowStepRepository workflowStepRepository,
                           DepartmentRepository departmentRepository,
                           UserRepository userRepository) {
        this.workflowRepository = workflowRepository;
        this.workflowStepRepository = workflowStepRepository;
        this.departmentRepository = departmentRepository;
        this.userRepository = userRepository;
    }

    public List<WorkflowResponse> getAllWorkflows() {
        return workflowRepository.findAll().stream()
                .map(WorkflowResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<WorkflowResponse> getActiveWorkflows() {
        return workflowRepository.findByIsActiveTrue().stream()
                .map(WorkflowResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public Workflow getWorkflowEntityById(Long id) {
        return workflowRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Workflow not found with ID: " + id));
    }

    public WorkflowResponse getWorkflowById(Long id) {
        return WorkflowResponse.fromEntity(getWorkflowEntityById(id));
    }

    @Transactional
    public WorkflowResponse createWorkflow(WorkflowRequest request) {
        Department department = null;
        if (request.getDepartmentId() != null) {
            department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + request.getDepartmentId()));
        }

        Workflow workflow = new Workflow();
        workflow.setName(request.getName().trim());
        workflow.setRequestType(request.getRequestType());
        workflow.setDepartment(department);
        workflow.setDescription(request.getDescription());
        workflow.setActive(request.getIsActive() != null ? request.getIsActive() : true);

        // Validate steps if provided
        if (request.getSteps() != null && !request.getSteps().isEmpty()) {
            Set<Integer> orders = new HashSet<>();
            for (WorkflowStepRequest sr : request.getSteps()) {
                if (!orders.add(sr.getStepOrder())) {
                    throw new BadRequestException("Duplicate step order " + sr.getStepOrder() + " detected in workflow.");
                }
            }

            for (WorkflowStepRequest sr : request.getSteps()) {
                WorkflowStep step = new WorkflowStep();
                step.setWorkflow(workflow);
                step.setStepOrder(sr.getStepOrder());
                step.setStepName(sr.getStepName().trim());
                step.setApproverRule(sr.getApproverRule());
                step.setRequiredRole(sr.getRequiredRole());
                if (sr.getAssignedUserId() != null) {
                    User assigned = userRepository.findById(sr.getAssignedUserId())
                            .orElseThrow(() -> new ResourceNotFoundException("Assigned user not found with ID: " + sr.getAssignedUserId()));
                    step.setAssignedUser(assigned);
                }
                workflow.getSteps().add(step);
            }
        }

        Workflow saved = workflowRepository.save(workflow);
        return WorkflowResponse.fromEntity(saved);
    }

    @Transactional
    public WorkflowResponse updateWorkflow(Long id, WorkflowRequest request) {
        Workflow workflow = getWorkflowEntityById(id);

        Department department = null;
        if (request.getDepartmentId() != null) {
            department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + request.getDepartmentId()));
        }

        workflow.setName(request.getName().trim());
        workflow.setRequestType(request.getRequestType());
        workflow.setDepartment(department);
        workflow.setDescription(request.getDescription());
        if (request.getIsActive() != null) {
            workflow.setActive(request.getIsActive());
        }

        if (request.getSteps() != null) {
            Set<Integer> orders = new HashSet<>();
            for (WorkflowStepRequest sr : request.getSteps()) {
                if (!orders.add(sr.getStepOrder())) {
                    throw new BadRequestException("Duplicate step order " + sr.getStepOrder() + " detected in workflow.");
                }
            }

            workflow.getSteps().clear();
            for (WorkflowStepRequest sr : request.getSteps()) {
                WorkflowStep step = new WorkflowStep();
                step.setWorkflow(workflow);
                step.setStepOrder(sr.getStepOrder());
                step.setStepName(sr.getStepName().trim());
                step.setApproverRule(sr.getApproverRule());
                step.setRequiredRole(sr.getRequiredRole());
                if (sr.getAssignedUserId() != null) {
                    User assigned = userRepository.findById(sr.getAssignedUserId())
                            .orElseThrow(() -> new ResourceNotFoundException("Assigned user not found with ID: " + sr.getAssignedUserId()));
                    step.setAssignedUser(assigned);
                }
                workflow.getSteps().add(step);
            }
        }

        Workflow updated = workflowRepository.save(workflow);
        return WorkflowResponse.fromEntity(updated);
    }

    @Transactional
    public void deleteWorkflow(Long id) {
        Workflow workflow = getWorkflowEntityById(id);
        workflowRepository.delete(workflow);
    }
}
