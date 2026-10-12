package app.service;

import app.dto.DepartmentRequest;
import app.dto.DepartmentResponse;
import app.exception.BadRequestException;
import app.exception.ResourceNotFoundException;
import app.model.Department;
import app.repository.DepartmentRepository;
import app.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;

    public DepartmentService(DepartmentRepository departmentRepository, UserRepository userRepository) {
        this.departmentRepository = departmentRepository;
        this.userRepository = userRepository;
    }

    public List<DepartmentResponse> getAllDepartments() {
        return departmentRepository.findAll().stream()
                .map(d -> {
                    long userCount = userRepository.findAll().stream()
                            .filter(u -> u.getDepartment() != null && u.getDepartment().getId().equals(d.getId()))
                            .count();
                    return DepartmentResponse.fromEntity(d, userCount);
                })
                .collect(Collectors.toList());
    }

    public Department getDepartmentEntityById(Long id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + id));
    }

    public DepartmentResponse getDepartmentById(Long id) {
        Department d = getDepartmentEntityById(id);
        long userCount = userRepository.findAll().stream()
                .filter(u -> u.getDepartment() != null && u.getDepartment().getId().equals(d.getId()))
                .count();
        return DepartmentResponse.fromEntity(d, userCount);
    }

    @Transactional
    public DepartmentResponse createDepartment(DepartmentRequest request) {
        if (departmentRepository.existsByName(request.getName().trim())) {
            throw new BadRequestException("Department with name '" + request.getName() + "' already exists.");
        }
        if (departmentRepository.existsByCode(request.getCode().trim().toUpperCase())) {
            throw new BadRequestException("Department code '" + request.getCode() + "' already exists.");
        }

        Department department = new Department();
        department.setName(request.getName().trim());
        department.setCode(request.getCode().trim().toUpperCase());
        department.setDescription(request.getDescription());

        Department saved = departmentRepository.save(department);
        return DepartmentResponse.fromEntity(saved, 0);
    }

    @Transactional
    public DepartmentResponse updateDepartment(Long id, DepartmentRequest request) {
        Department department = getDepartmentEntityById(id);

        if (!department.getName().equalsIgnoreCase(request.getName().trim())
                && departmentRepository.existsByName(request.getName().trim())) {
            throw new BadRequestException("Department with name '" + request.getName() + "' already exists.");
        }

        if (!department.getCode().equalsIgnoreCase(request.getCode().trim())
                && departmentRepository.existsByCode(request.getCode().trim().toUpperCase())) {
            throw new BadRequestException("Department code '" + request.getCode() + "' already exists.");
        }

        department.setName(request.getName().trim());
        department.setCode(request.getCode().trim().toUpperCase());
        department.setDescription(request.getDescription());

        Department updated = departmentRepository.save(department);
        long userCount = userRepository.findAll().stream()
                .filter(u -> u.getDepartment() != null && u.getDepartment().getId().equals(updated.getId()))
                .count();
        return DepartmentResponse.fromEntity(updated, userCount);
    }

    @Transactional
    public void deleteDepartment(Long id) {
        Department department = getDepartmentEntityById(id);
        departmentRepository.delete(department);
    }
}
