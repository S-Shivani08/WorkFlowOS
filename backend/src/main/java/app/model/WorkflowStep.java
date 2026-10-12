package app.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * An ordered sequential step in a multi-level approval pipeline.
 */
@Entity
@Table(
    name = "workflow_steps",
    uniqueConstraints = @UniqueConstraint(name = "uk_workflow_step_order", columnNames = {"workflow_id", "step_order"})
)
public class WorkflowStep {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workflow_id", nullable = false)
    @JsonBackReference
    private Workflow workflow;

    @Column(name = "step_order", nullable = false)
    private Integer stepOrder;

    @Column(name = "step_name", nullable = false, length = 100)
    private String stepName;

    @Enumerated(EnumType.STRING)
    @Column(name = "approver_rule", nullable = false, length = 50)
    private ApproverRule approverRule;

    @Enumerated(EnumType.STRING)
    @Column(name = "required_role", length = 50)
    private Role requiredRole;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assigned_user_id")
    private User assignedUser;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public WorkflowStep() {
    }

    public WorkflowStep(Long id, Workflow workflow, Integer stepOrder, String stepName, ApproverRule approverRule, Role requiredRole, User assignedUser) {
        this.id = id;
        this.workflow = workflow;
        this.stepOrder = stepOrder;
        this.stepName = stepName;
        this.approverRule = approverRule;
        this.requiredRole = requiredRole;
        this.assignedUser = assignedUser;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Workflow getWorkflow() {
        return workflow;
    }

    public void setWorkflow(Workflow workflow) {
        this.workflow = workflow;
    }

    public Integer getStepOrder() {
        return stepOrder;
    }

    public void setStepOrder(Integer stepOrder) {
        this.stepOrder = stepOrder;
    }

    public String getStepName() {
        return stepName;
    }

    public void setStepName(String stepName) {
        this.stepName = stepName;
    }

    public ApproverRule getApproverRule() {
        return approverRule;
    }

    public void setApproverRule(ApproverRule approverRule) {
        this.approverRule = approverRule;
    }

    public Role getRequiredRole() {
        return requiredRole;
    }

    public void setRequiredRole(Role requiredRole) {
        this.requiredRole = requiredRole;
    }

    public User getAssignedUser() {
        return assignedUser;
    }

    public void setAssignedUser(User assignedUser) {
        this.assignedUser = assignedUser;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
