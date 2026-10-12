package app.repository;

import app.model.Department;
import app.model.RequestType;
import app.model.Workflow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorkflowRepository extends JpaRepository<Workflow, Long> {
    List<Workflow> findByIsActiveTrue();

    // Specific department workflow first
    Optional<Workflow> findFirstByRequestTypeAndDepartmentAndIsActiveTrue(RequestType requestType, Department department);

    // Global workflow fallback (where department is null)
    Optional<Workflow> findFirstByRequestTypeAndDepartmentIsNullAndIsActiveTrue(RequestType requestType);

    List<Workflow> findByRequestType(RequestType requestType);
}
