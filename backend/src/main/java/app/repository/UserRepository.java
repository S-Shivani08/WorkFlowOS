package app.repository;

import app.model.Department;
import app.model.Role;
import app.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

    // Find users by department and role (e.g. manager of HR)
    List<User> findByDepartmentAndRoleAndIsActiveTrue(Department department, Role role);

    // Find all users by role (e.g. any Finance Head or Manager)
    List<User> findByRoleAndIsActiveTrue(Role role);

    // Find department head for a specific department
    Optional<User> findFirstByDepartmentAndRoleAndIsActiveTrue(Department department, Role role);

    // Active users
    List<User> findByIsActiveTrue();
    long countByIsActiveTrue();
}
