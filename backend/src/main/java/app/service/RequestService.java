package app.service;

import app.dto.*;
import app.exception.BadRequestException;
import app.exception.ResourceNotFoundException;
import app.exception.UnauthorizedException;
import app.model.*;
import app.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class RequestService {

    private final RequestRepository requestRepository;
    private final DepartmentRepository departmentRepository;
    private final WorkflowStepRepository workflowStepRepository;
    private final ApprovalRepository approvalRepository;
    private final StatusHistoryRepository statusHistoryRepository;
    private final WorkflowEngineService workflowEngineService;
    private final AuthService authService;

    public RequestService(RequestRepository requestRepository,
                          DepartmentRepository departmentRepository,
                          WorkflowStepRepository workflowStepRepository,
                          ApprovalRepository approvalRepository,
                          StatusHistoryRepository statusHistoryRepository,
                          WorkflowEngineService workflowEngineService,
                          AuthService authService) {
        this.requestRepository = requestRepository;
        this.departmentRepository = departmentRepository;
        this.workflowStepRepository = workflowStepRepository;
        this.approvalRepository = approvalRepository;
        this.statusHistoryRepository = statusHistoryRepository;
        this.workflowEngineService = workflowEngineService;
        this.authService = authService;
    }

    public List<RequestResponseDto> getMyRequests() {
        User currentUser = authService.getCurrentAuthenticatedUser();
        return requestRepository.findByRequesterOrderByCreatedAtDesc(currentUser).stream()
                .map(RequestResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    public RequestDetailResponseDto getRequestDetails(Long id) {
        Request request = requestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found with ID: " + id));

        User currentUser = authService.getCurrentAuthenticatedUser();
        // Permission check: Requester, Approvers, Managers, Dept Heads, or Admins can view
        boolean isRequester = request.getRequester().getId().equals(currentUser.getId());
        boolean isCurrentApprover = request.getCurrentApprover() != null && request.getCurrentApprover().getId().equals(currentUser.getId());
        boolean isManagement = currentUser.getRole() == Role.ROLE_ADMIN ||
                               currentUser.getRole() == Role.ROLE_DEPT_HEAD ||
                               currentUser.getRole() == Role.ROLE_MANAGER;

        if (!isRequester && !isCurrentApprover && !isManagement) {
            throw new UnauthorizedException("You are not authorized to view this request.");
        }

        RequestResponseDto reqDto = RequestResponseDto.fromEntity(request);

        // Fetch workflow steps for visualization
        List<WorkflowStepResponse> stepDtos = new ArrayList<>();
        if (request.getWorkflow() != null) {
            stepDtos = workflowStepRepository.findByWorkflowOrderByStepOrderAsc(request.getWorkflow()).stream()
                    .map(WorkflowStepResponse::fromEntity)
                    .collect(Collectors.toList());
        }

        // Fetch approvals history
        List<ApprovalResponseDto> approvalDtos = approvalRepository.findByRequestOrderByCreatedAtAsc(request).stream()
                .map(ApprovalResponseDto::fromEntity)
                .collect(Collectors.toList());

        // Fetch timeline history
        List<StatusHistoryResponseDto> timelineDtos = statusHistoryRepository.findByRequestOrderByCreatedAtAsc(request).stream()
                .map(StatusHistoryResponseDto::fromEntity)
                .collect(Collectors.toList());

        return new RequestDetailResponseDto(reqDto, stepDtos, approvalDtos, timelineDtos);
    }

    @Transactional
    public RequestResponseDto createRequest(CreateRequestDto dto) {
        User currentUser = authService.getCurrentAuthenticatedUser();

        Department department;
        if (dto.getDepartmentId() != null) {
            department = departmentRepository.findById(dto.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + dto.getDepartmentId()));
        } else if (currentUser.getDepartment() != null) {
            department = currentUser.getDepartment();
        } else {
            department = departmentRepository.findAll().stream().findFirst()
                    .orElseThrow(() -> new BadRequestException("No corporate department configured in system."));
        }

        Request request = new Request();
        request.setRequester(currentUser);
        request.setRequestType(dto.getRequestType());
        request.setTitle(dto.getTitle().trim());
        request.setDescription(dto.getDescription().trim());
        request.setDepartment(department);
        request.setPriority(dto.getPriority() != null ? dto.getPriority() : Priority.MEDIUM);
        request.setAmount(dto.getAmount());
        request.setStartDate(dto.getStartDate());
        request.setEndDate(dto.getEndDate());
        request.setStatus(RequestStatus.DRAFT);

        Request saved = requestRepository.save(request);

        // Record creation history
        StatusHistory history = new StatusHistory();
        history.setRequest(saved);
        history.setPreviousStatus(null);
        history.setNewStatus(RequestStatus.DRAFT.name());
        history.setActor(currentUser);
        history.setAction("REQUEST_CREATED");
        history.setComment("Request draft created by " + currentUser.getName());
        statusHistoryRepository.save(history);

        if (dto.isSubmitImmediately()) {
            workflowEngineService.startWorkflow(saved, currentUser);
            saved = requestRepository.save(saved);
        }

        return RequestResponseDto.fromEntity(saved);
    }

    @Transactional
    public RequestResponseDto submitDraftRequest(Long id) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        Request request = requestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found with ID: " + id));

        if (!request.getRequester().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("Only the requester can submit this draft request.");
        }

        if (request.getStatus() != RequestStatus.DRAFT) {
            throw new BadRequestException("Request is already in status: " + request.getStatus());
        }

        workflowEngineService.startWorkflow(request, currentUser);
        Request updated = requestRepository.save(request);
        return RequestResponseDto.fromEntity(updated);
    }

    @Transactional
    public RequestResponseDto cancelRequest(Long id, String reason) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        Request request = requestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found with ID: " + id));

        if (!request.getRequester().getId().equals(currentUser.getId()) && currentUser.getRole() != Role.ROLE_ADMIN) {
            throw new UnauthorizedException("Only the requester or an administrator can cancel this request.");
        }

        if (request.getStatus() == RequestStatus.APPROVED || request.getStatus() == RequestStatus.REJECTED) {
            throw new BadRequestException("Cannot cancel an already completed request.");
        }

        String prevStatus = request.getStatus().name();
        request.setStatus(RequestStatus.CANCELLED);
        request.setCurrentApprover(null);
        request.setCompletedAt(LocalDateTime.now());
        Request updated = requestRepository.save(request);

        StatusHistory history = new StatusHistory();
        history.setRequest(updated);
        history.setPreviousStatus(prevStatus);
        history.setNewStatus(RequestStatus.CANCELLED.name());
        history.setActor(currentUser);
        history.setAction("REQUEST_CANCELLED");
        history.setComment("Request cancelled by " + currentUser.getName() + (reason != null ? ". Reason: " + reason : "."));
        statusHistoryRepository.save(history);

        return RequestResponseDto.fromEntity(updated);
    }

    public List<RequestResponseDto> getAllRequests(RequestStatus status, RequestType type, Long departmentId) {
        List<Request> all = requestRepository.findAllByOrderByCreatedAtDesc();

        return all.stream()
                .filter(r -> status == null || r.getStatus() == status)
                .filter(r -> type == null || r.getRequestType() == type)
                .filter(r -> departmentId == null || (r.getDepartment() != null && r.getDepartment().getId().equals(departmentId)))
                .map(RequestResponseDto::fromEntity)
                .collect(Collectors.toList());
    }
}
