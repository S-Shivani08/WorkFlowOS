package app.service;

import app.dto.AdminDashboardDto;
import app.model.RequestStatus;
import app.repository.DepartmentRepository;
import app.repository.RequestRepository;
import app.repository.UserRepository;
import app.repository.WorkflowRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminDashboardService {

    private final RequestRepository requestRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final WorkflowRepository workflowRepository;

    public AdminDashboardService(RequestRepository requestRepository,
                                 UserRepository userRepository,
                                 DepartmentRepository departmentRepository,
                                 WorkflowRepository workflowRepository) {
        this.requestRepository = requestRepository;
        this.userRepository = userRepository;
        this.departmentRepository = departmentRepository;
        this.workflowRepository = workflowRepository;
    }

    public AdminDashboardDto getDashboardStats() {
        AdminDashboardDto dto = new AdminDashboardDto();

        dto.setTotalRequests(requestRepository.count());
        dto.setPendingRequests(requestRepository.countByStatus(RequestStatus.PENDING_APPROVAL));
        dto.setApprovedRequests(requestRepository.countByStatus(RequestStatus.APPROVED));
        dto.setRejectedRequests(requestRepository.countByStatus(RequestStatus.REJECTED));
        dto.setDraftRequests(requestRepository.countByStatus(RequestStatus.DRAFT));

        dto.setTotalUsers(userRepository.count());
        dto.setTotalDepartments(departmentRepository.count());
        dto.setTotalWorkflows(workflowRepository.count());

        // Grouped by status
        Map<String, Long> statusMap = new HashMap<>();
        List<Object[]> statusList = requestRepository.countGroupedByStatus();
        for (Object[] row : statusList) {
            statusMap.put(row[0].toString(), (Long) row[1]);
        }
        dto.setRequestsByStatus(statusMap);

        // Grouped by request type
        Map<String, Long> typeMap = new HashMap<>();
        List<Object[]> typeList = requestRepository.countGroupedByRequestType();
        for (Object[] row : typeList) {
            typeMap.put(row[0].toString(), (Long) row[1]);
        }
        dto.setRequestsByType(typeMap);

        // Grouped by department
        Map<String, Long> deptMap = new HashMap<>();
        List<Object[]> deptList = requestRepository.countGroupedByDepartment();
        for (Object[] row : deptList) {
            deptMap.put(row[0].toString(), (Long) row[1]);
        }
        dto.setRequestsByDepartment(deptMap);

        return dto;
    }
}
