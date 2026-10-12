package app.service;

import app.dto.ApprovalResponseDto;
import app.dto.RequestResponseDto;
import app.exception.BadRequestException;
import app.exception.ResourceNotFoundException;
import app.exception.UnauthorizedException;
import app.model.*;
import app.repository.ApprovalRepository;
import app.repository.RequestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ApprovalService {

    private final RequestRepository requestRepository;
    private final ApprovalRepository approvalRepository;
    private final WorkflowEngineService workflowEngineService;
    private final AuthService authService;

    public ApprovalService(RequestRepository requestRepository,
                           ApprovalRepository approvalRepository,
                           WorkflowEngineService workflowEngineService,
                           AuthService authService) {
        this.requestRepository = requestRepository;
        this.approvalRepository = approvalRepository;
        this.workflowEngineService = workflowEngineService;
        this.authService = authService;
    }

    public List<RequestResponseDto> getPendingApprovals() {
        User currentUser = authService.getCurrentAuthenticatedUser();
        // Requests currently assigned to this user and in PENDING_APPROVAL status
        return requestRepository.findByCurrentApproverAndStatusOrderByCreatedAtDesc(currentUser, RequestStatus.PENDING_APPROVAL).stream()
                .map(RequestResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    public List<ApprovalResponseDto> getApprovalHistory() {
        User currentUser = authService.getCurrentAuthenticatedUser();
        return approvalRepository.findByApproverOrderByCreatedAtDesc(currentUser).stream()
                .filter(a -> a.getDecision() != Decision.PENDING)
                .map(ApprovalResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public RequestResponseDto approveRequest(Long requestId, String comment) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found with ID: " + requestId));

        if (request.getStatus() != RequestStatus.PENDING_APPROVAL) {
            throw new BadRequestException("Request is not pending approval. Current status: " + request.getStatus());
        }

        // Authorization check: Is current user the assigned approver or a System Admin?
        boolean isAssigned = request.getCurrentApprover() != null && request.getCurrentApprover().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == Role.ROLE_ADMIN;

        if (!isAssigned && !isAdmin) {
            throw new UnauthorizedException("You are not the designated approver for this request's current step.");
        }

        WorkflowStep currentStep = request.getCurrentStep();
        if (currentStep == null) {
            throw new BadRequestException("Request is missing an active workflow step reference.");
        }

        // Trigger Workflow Engine to process step approval and perform automatic transfer to next step or complete
        workflowEngineService.processStepApproval(request, currentStep, currentUser, comment);

        Request updated = requestRepository.save(request);
        return RequestResponseDto.fromEntity(updated);
    }

    @Transactional
    public RequestResponseDto rejectRequest(Long requestId, String comment) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found with ID: " + requestId));

        if (request.getStatus() != RequestStatus.PENDING_APPROVAL) {
            throw new BadRequestException("Request is not pending approval. Current status: " + request.getStatus());
        }

        boolean isAssigned = request.getCurrentApprover() != null && request.getCurrentApprover().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == Role.ROLE_ADMIN;

        if (!isAssigned && !isAdmin) {
            throw new UnauthorizedException("You are not the designated approver for this request's current step.");
        }

        WorkflowStep currentStep = request.getCurrentStep();
        if (currentStep == null) {
            throw new BadRequestException("Request is missing an active workflow step reference.");
        }

        workflowEngineService.processStepRejection(request, currentStep, currentUser, comment);

        Request updated = requestRepository.save(request);
        return RequestResponseDto.fromEntity(updated);
    }
}
