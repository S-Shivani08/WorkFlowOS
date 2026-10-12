package app.repository;

import app.model.Department;
import app.model.Request;
import app.model.RequestStatus;
import app.model.RequestType;
import app.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RequestRepository extends JpaRepository<Request, Long> {
    List<Request> findByRequesterOrderByCreatedAtDesc(User requester);

    List<Request> findByCurrentApproverAndStatusOrderByCreatedAtDesc(User currentApprover, RequestStatus status);

    List<Request> findByDepartmentOrderByCreatedAtDesc(Department department);

    List<Request> findAllByOrderByCreatedAtDesc();

    // Statistics
    long countByStatus(RequestStatus status);
    long countByRequester(User requester);
    long countByRequesterAndStatus(User requester, RequestStatus status);
    long countByCurrentApproverAndStatus(User currentApprover, RequestStatus status);
    long countByDepartment(Department department);
    long countByRequestType(RequestType requestType);

    @Query("SELECT r.status, COUNT(r) FROM Request r GROUP BY r.status")
    List<Object[]> countGroupedByStatus();

    @Query("SELECT r.requestType, COUNT(r) FROM Request r GROUP BY r.requestType")
    List<Object[]> countGroupedByRequestType();

    @Query("SELECT r.department.name, COUNT(r) FROM Request r GROUP BY r.department.name")
    List<Object[]> countGroupedByDepartment();
}
