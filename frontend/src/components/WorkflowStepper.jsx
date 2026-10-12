import React from 'react';
import { Check, Clock, X } from 'lucide-react';

const WorkflowStepper = ({ steps = [], currentStepOrder, status, currentApproverName }) => {
  if (!steps || steps.length === 0) {
    return <div className="text-muted" style={{ fontSize: '0.85rem' }}>No workflow steps defined.</div>;
  }

  // Calculate progress percentage
  const totalSteps = steps.length;
  let activeIndex = steps.findIndex((s) => s.stepOrder === currentStepOrder);
  if (activeIndex === -1 && status === 'APPROVED') {
    activeIndex = totalSteps; // 100% complete
  }

  const fillPercentage = totalSteps > 1
    ? Math.min(100, Math.max(0, (status === 'APPROVED' ? (totalSteps - 1) : Math.max(0, activeIndex)) / (totalSteps - 1) * 100))
    : 100;

  return (
    <div className="workflow-stepper">
      {/* Background connector line */}
      <div className="stepper-progress-line">
        <div
          className="stepper-progress-fill"
          style={{ width: `${status === 'APPROVED' ? 100 : fillPercentage}%` }}
        />
      </div>

      {steps.map((step, index) => {
        let stepState = 'upcoming'; // 'completed' | 'active' | 'upcoming' | 'rejected'

        if (status === 'APPROVED') {
          stepState = 'completed';
        } else if (status === 'REJECTED') {
          if (step.stepOrder < currentStepOrder) {
            stepState = 'completed';
          } else if (step.stepOrder === currentStepOrder) {
            stepState = 'rejected';
          } else {
            stepState = 'upcoming';
          }
        } else {
          // PENDING_APPROVAL or DRAFT
          if (step.stepOrder < currentStepOrder) {
            stepState = 'completed';
          } else if (step.stepOrder === currentStepOrder) {
            stepState = 'active';
          } else {
            stepState = 'upcoming';
          }
        }

        return (
          <div key={step.id || index} className="stepper-step">
            <div className={`step-circle ${stepState}`}>
              {stepState === 'completed' && <Check size={18} strokeWidth={3} />}
              {stepState === 'active' && <span>{step.stepOrder}</span>}
              {stepState === 'rejected' && <X size={18} strokeWidth={3} />}
              {stepState === 'upcoming' && <span>{step.stepOrder}</span>}
            </div>

            <div className="step-info">
              <div className="step-title">{step.stepName}</div>
              <div className="step-approver">
                {stepState === 'active' && currentApproverName ? (
                  <span style={{ color: '#2563eb', fontWeight: 600 }}>
                    Assigned: {currentApproverName}
                  </span>
                ) : step.assignedUserName ? (
                  <span>{step.assignedUserName}</span>
                ) : step.requiredRole ? (
                  <span>Role: {step.requiredRole.replace('ROLE_', '')}</span>
                ) : (
                  <span>Rule: {step.approverRule}</span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WorkflowStepper;
