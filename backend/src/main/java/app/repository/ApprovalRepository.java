package app.repository;

import app.model.Approval;
import app.model.Decision;
import app.model.Request;
import app.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApprovalRepository extends JpaRepository<Approval, Long> {
    List<Approval> findByRequestOrderByCreatedAtAsc(Request request);

    List<Approval> findByApproverOrderByCreatedAtDesc(User approver);

    List<Approval> findByApproverAndDecisionOrderByCreatedAtDesc(User approver, Decision decision);

    Optional<Approval> findByRequestAndWorkflowStepId(Request request, Long workflowStepId);

    long countByApproverAndDecision(User approver, Decision decision);
}
