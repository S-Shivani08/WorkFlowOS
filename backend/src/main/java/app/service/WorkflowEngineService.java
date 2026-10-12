package app.service;

import app.exception.BadRequestException;
import app.model.*;
import app.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Dedicated Workflow Engine Service responsible for:
 * 1. Identifying the appropriate corporate workflow for a submitted request.
 * 2. Resolving authorized approvers dynamically based on company rules and department hierarchy.
 * 3. Automatically routing and transferring requests between sequential approval levels.
 * 4. Finalizing request completion or rejection.
 */
@Service
public class WorkflowEngineService {

    private final WorkflowRepository workflowRepository;
    private final WorkflowStepRepository workflowStepRepository;
    private final UserRepository userRepository;
    private final ApprovalRepository approvalRepository;
    private final StatusHistoryRepository statusHistoryRepository;

    public WorkflowEngineService(WorkflowRepository workflowRepository,
                                 WorkflowStepRepository workflowStepRepository,
                                 UserRepository userRepository,
                                 ApprovalRepository approvalRepository,
                                 StatusHistoryRepository statusHistoryRepository) {
        this.workflowRepository = workflowRepository;
        this.workflowStepRepository = workflowStepRepository;
        this.userRepository = userRepository;
        this.approvalRepository = approvalRepository;
        this.statusHistoryRepository = statusHistoryRepository;
    }

    /**
     * Resolves the active workflow configuration for a given request type and department.
     * Looks for a department-specific workflow first, then falls back to the global company workflow.
     */
    public Workflow resolveWorkflow(RequestType requestType, Department department) {
        if (department != null) {
            Optional<Workflow> deptWorkflow = workflowRepository
                    .findFirstByRequestTypeAndDepartmentAndIsActiveTrue(requestType, department);
            if (deptWorkflow.isPresent()) {
                return deptWorkflow.get();
            }
        }

        return workflowRepository
                .findFirstByRequestTypeAndDepartmentIsNullAndIsActiveTrue(requestType)
                .orElseThrow(() -> new BadRequestException("No active approval workflow configured for request type: " + requestType));
    }

    /**
     * Initiates the workflow routing for a newly submitted request.
     * Assigns step 1 and routes to the initial approver.
     */
    @Transactional
    public void startWorkflow(Request request, User requester) {
        Workflow workflow = resolveWorkflow(request.getRequestType(), request.getDepartment());
        request.setWorkflow(workflow);

        List<WorkflowStep> steps = workflowStepRepository.findByWorkflowOrderByStepOrderAsc(workflow);
        if (steps.isEmpty()) {
            throw new BadRequestException("Configured workflow '" + workflow.getName() + "' contains no approval steps.");
        }

        WorkflowStep firstStep = steps.get(0);
        User initialApprover = resolveApproverForStep(firstStep, request);

        request.setCurrentStep(firstStep);
        request.setCurrentApprover(initialApprover);
        request.setStatus(RequestStatus.PENDING_APPROVAL);
        request.setSubmittedAt(LocalDateTime.now());

        // Create pending approval record for this step
        Approval approval = new Approval();
        approval.setRequest(request);
        approval.setWorkflowStep(firstStep);
        approval.setApprover(initialApprover);
        approval.setDecision(Decision.PENDING);
        approvalRepository.save(approval);

        // Record audit trail in StatusHistory
        StatusHistory history = new StatusHistory();
        history.setRequest(request);
        history.setPreviousStatus(RequestStatus.DRAFT.name());
        history.setNewStatus(RequestStatus.PENDING_APPROVAL.name());
        history.setActor(requester);
        history.setAction("SUBMITTED_AND_ROUTED");
        history.setComment("Request submitted and automatically routed to Step " + firstStep.getStepOrder() + " (" +
                firstStep.getStepName() + ") assigned to " + initialApprover.getName() + " (" + initialApprover.getRole().name() + ").");
        statusHistoryRepository.save(history);
    }

    /**
     * Automatically transfers the request to the next workflow step after current step approval,
     * or marks the request as APPROVED (completed) if all steps have been successfully passed.
     */
    @Transactional
    public void processStepApproval(Request request, WorkflowStep currentStep, User approver, String comment) {
        // 1. Update the approval record for the current step
        Approval currentApproval = approvalRepository.findByRequestAndWorkflowStepId(request, currentStep.getId())
                .orElseGet(() -> {
                    Approval newApp = new Approval();
                    newApp.setRequest(request);
                    newApp.setWorkflowStep(currentStep);
                    newApp.setApprover(approver);
                    return newApp;
                });

        currentApproval.setDecision(Decision.APPROVED);
        currentApproval.setComments(comment != null ? comment : "Approved");
        currentApproval.setDecidedAt(LocalDateTime.now());
        approvalRepository.save(currentApproval);

        // 2. Audit current step approval
        StatusHistory stepHistory = new StatusHistory();
        stepHistory.setRequest(request);
        stepHistory.setPreviousStatus(request.getStatus().name());
        stepHistory.setNewStatus(request.getStatus().name());
        stepHistory.setActor(approver);
        stepHistory.setAction("STEP_APPROVED");
        stepHistory.setComment("Step " + currentStep.getStepOrder() + " (" + currentStep.getStepName() +
                ") approved by " + approver.getName() + (comment != null && !comment.isBlank() ? ". Notes: " + comment : "."));
        statusHistoryRepository.save(stepHistory);

        // 3. Find if there is a next step
        Optional<WorkflowStep> nextStepOpt = workflowStepRepository
                .findFirstByWorkflowAndStepOrderGreaterThanOrderByStepOrderAsc(request.getWorkflow(), currentStep.getStepOrder());

        if (nextStepOpt.isPresent()) {
            // AUTOMATIC REQUEST TRANSFER TO NEXT APPROVER
            WorkflowStep nextStep = nextStepOpt.get();
            User nextApprover = resolveApproverForStep(nextStep, request);

            request.setCurrentStep(nextStep);
            request.setCurrentApprover(nextApprover);
            request.setStatus(RequestStatus.PENDING_APPROVAL);

            // Create pending approval record for next step
            Approval nextApproval = new Approval();
            nextApproval.setRequest(request);
            nextApproval.setWorkflowStep(nextStep);
            nextApproval.setApprover(nextApprover);
            nextApproval.setDecision(Decision.PENDING);
            approvalRepository.save(nextApproval);

            // Audit the automatic transfer
            StatusHistory transferHistory = new StatusHistory();
            transferHistory.setRequest(request);
            transferHistory.setPreviousStatus(RequestStatus.PENDING_APPROVAL.name());
            transferHistory.setNewStatus(RequestStatus.PENDING_APPROVAL.name());
            transferHistory.setActor(approver);
            transferHistory.setAction("AUTOMATIC_STEP_TRANSFER");
            transferHistory.setComment("WorkFlowOS Engine automatically transferred request to Step " + nextStep.getStepOrder() +
                    " (" + nextStep.getStepName() + ") assigned to " + nextApprover.getName() + " (" + nextApprover.getRole().name() + ").");
            statusHistoryRepository.save(transferHistory);

        } else {
            // ALL WORKFLOW STEPS COMPLETE -> FINAL APPROVAL
            request.setStatus(RequestStatus.APPROVED);
            request.setCurrentApprover(null);
            request.setCompletedAt(LocalDateTime.now());

            StatusHistory finalHistory = new StatusHistory();
            finalHistory.setRequest(request);
            finalHistory.setPreviousStatus(RequestStatus.PENDING_APPROVAL.name());
            finalHistory.setNewStatus(RequestStatus.APPROVED.name());
            finalHistory.setActor(approver);
            finalHistory.setAction("REQUEST_COMPLETED");
            finalHistory.setComment("All configured approval stages successfully completed. Request marked COMPLETED/APPROVED.");
            statusHistoryRepository.save(finalHistory);
        }
    }

    /**
     * Handles rejection of a request at any workflow step.
     */
    @Transactional
    public void processStepRejection(Request request, WorkflowStep currentStep, User approver, String comment) {
        Approval currentApproval = approvalRepository.findByRequestAndWorkflowStepId(request, currentStep.getId())
                .orElseGet(() -> {
                    Approval newApp = new Approval();
                    newApp.setRequest(request);
                    newApp.setWorkflowStep(currentStep);
                    newApp.setApprover(approver);
                    return newApp;
                });

        currentApproval.setDecision(Decision.REJECTED);
        currentApproval.setComments(comment != null ? comment : "Rejected");
        currentApproval.setDecidedAt(LocalDateTime.now());
        approvalRepository.save(currentApproval);

        request.setStatus(RequestStatus.REJECTED);
        request.setCurrentApprover(null);
        request.setCompletedAt(LocalDateTime.now());

        StatusHistory rejectionHistory = new StatusHistory();
        rejectionHistory.setRequest(request);
        rejectionHistory.setPreviousStatus(RequestStatus.PENDING_APPROVAL.name());
        rejectionHistory.setNewStatus(RequestStatus.REJECTED.name());
        rejectionHistory.setActor(approver);
        rejectionHistory.setAction("REQUEST_REJECTED");
        rejectionHistory.setComment("Request rejected at Step " + currentStep.getStepOrder() + " (" + currentStep.getStepName() +
                ") by " + approver.getName() + (comment != null && !comment.isBlank() ? ". Reason: " + comment : "."));
        statusHistoryRepository.save(rejectionHistory);
    }

    /**
     * Resolves the approver for a specific step based on its configured rule.
     */
    public User resolveApproverForStep(WorkflowStep step, Request request) {
        ApproverRule rule = step.getApproverRule();

        if (rule == ApproverRule.SPECIFIC_USER) {
            if (step.getAssignedUser() != null && step.getAssignedUser().isActive()) {
                return step.getAssignedUser();
            }
        }

        if (rule == ApproverRule.ROLE_IN_DEPT) {
            Role requiredRole = step.getRequiredRole() != null ? step.getRequiredRole() : Role.ROLE_MANAGER;
            List<User> deptUsers = userRepository.findByDepartmentAndRoleAndIsActiveTrue(request.getDepartment(), requiredRole);
            for (User u : deptUsers) {
                // Do not assign request to the requester themselves if others exist
                if (!u.getId().equals(request.getRequester().getId())) {
                    return u;
                }
            }
            if (!deptUsers.isEmpty()) {
                return deptUsers.get(0);
            }
        }

        if (rule == ApproverRule.DEPT_HEAD) {
            Optional<User> deptHead = userRepository.findFirstByDepartmentAndRoleAndIsActiveTrue(request.getDepartment(), Role.ROLE_DEPT_HEAD);
            if (deptHead.isPresent() && !deptHead.get().getId().equals(request.getRequester().getId())) {
                return deptHead.get();
            }
            if (deptHead.isPresent()) {
                return deptHead.get();
            }
        }

        if (rule == ApproverRule.ROLE) {
            Role requiredRole = step.getRequiredRole() != null ? step.getRequiredRole() : Role.ROLE_MANAGER;
            if (step.getAssignedUser() != null && step.getAssignedUser().isActive()) {
                return step.getAssignedUser();
            }
            List<User> roleUsers = userRepository.findByRoleAndIsActiveTrue(requiredRole);
            if (!roleUsers.isEmpty()) {
                return roleUsers.get(0);
            }
        }

        // Fallback: If configured assignedUser is available
        if (step.getAssignedUser() != null && step.getAssignedUser().isActive()) {
            return step.getAssignedUser();
        }

        // Final fallback: Company Admin so workflow never blocks
        return userRepository.findByRoleAndIsActiveTrue(Role.ROLE_ADMIN).stream()
                .findFirst()
                .orElseThrow(() -> new BadRequestException("No eligible approver could be resolved for step: " + step.getStepName()));
    }
}
