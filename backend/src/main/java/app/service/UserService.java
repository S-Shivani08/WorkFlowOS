package app.service;

import app.dto.UserRequest;
import app.dto.UserResponse;
import app.exception.BadRequestException;
import app.exception.ResourceNotFoundException;
import app.model.Department;
import app.model.Role;
import app.model.User;
import app.repository.DepartmentRepository;
import app.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
                       DepartmentRepository departmentRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.departmentRepository = departmentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<UserResponse> getActiveUsers() {
        return userRepository.findByIsActiveTrue().stream()
                .map(UserResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<UserResponse> getUsersByRole(Role role) {
        return userRepository.findByRoleAndIsActiveTrue(role).stream()
                .map(UserResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public User getUserEntityById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
    }

    public UserResponse getUserById(Long id) {
        return UserResponse.fromEntity(getUserEntityById(id));
    }

    @Transactional
    public UserResponse createUser(UserRequest request) {
        if (userRepository.existsByEmail(request.getEmail().trim().toLowerCase())) {
            throw new BadRequestException("User with email '" + request.getEmail() + "' already exists.");
        }
        if (!StringUtils.hasText(request.getPassword())) {
            throw new BadRequestException("Password is required for new users.");
        }

        Department department = null;
        if (request.getDepartmentId() != null) {
            department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + request.getDepartmentId()));
        }

        User user = new User();
        user.setName(request.getName().trim());
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setDepartment(department);
        user.setJobTitle(request.getJobTitle());
        user.setPhone(request.getPhone());
        user.setActive(request.getIsActive() != null ? request.getIsActive() : true);

        User saved = userRepository.save(user);
        return UserResponse.fromEntity(saved);
    }

    @Transactional
    public UserResponse updateUser(Long id, UserRequest request) {
        User user = getUserEntityById(id);

        if (!user.getEmail().equalsIgnoreCase(request.getEmail().trim())
                && userRepository.existsByEmail(request.getEmail().trim().toLowerCase())) {
            throw new BadRequestException("User with email '" + request.getEmail() + "' already exists.");
        }

        if (request.getDepartmentId() != null) {
            Department department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + request.getDepartmentId()));
            user.setDepartment(department);
        } else {
            user.setDepartment(null);
        }

        user.setName(request.getName().trim());
        user.setEmail(request.getEmail().trim().toLowerCase());
        if (StringUtils.hasText(request.getPassword())) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        user.setRole(request.getRole());
        user.setJobTitle(request.getJobTitle());
        user.setPhone(request.getPhone());
        if (request.getIsActive() != null) {
            user.setActive(request.getIsActive());
        }

        User updated = userRepository.save(user);
        return UserResponse.fromEntity(updated);
    }

    @Transactional
    public void toggleUserActiveStatus(Long id) {
        User user = getUserEntityById(id);
        user.setActive(!user.isActive());
        userRepository.save(user);
    }
}
