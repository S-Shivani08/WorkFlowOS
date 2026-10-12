package app.repository;

import app.model.Workflow;
import app.model.WorkflowStep;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorkflowStepRepository extends JpaRepository<WorkflowStep, Long> {
    List<WorkflowStep> findByWorkflowOrderByStepOrderAsc(Workflow workflow);

    // Find the first step (step 1)
    Optional<WorkflowStep> findFirstByWorkflowOrderByStepOrderAsc(Workflow workflow);

    // Find the next step with stepOrder > currentStepOrder
    Optional<WorkflowStep> findFirstByWorkflowAndStepOrderGreaterThanOrderByStepOrderAsc(Workflow workflow, Integer stepOrder);

    // Check if step order exists for workflow
    boolean existsByWorkflowAndStepOrder(Workflow workflow, Integer stepOrder);
}
