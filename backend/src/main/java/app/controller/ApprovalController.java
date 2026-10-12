package app.controller;

import app.dto.ApprovalActionRequest;
import app.dto.ApprovalResponseDto;
import app.dto.RequestResponseDto;
import app.service.ApprovalService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/approvals")
public class ApprovalController {

    private final ApprovalService approvalService;

    public ApprovalController(ApprovalService approvalService) {
        this.approvalService = approvalService;
    }

    @GetMapping("/pending")
    public ResponseEntity<List<RequestResponseDto>> getPendingApprovals() {
        return ResponseEntity.ok(approvalService.getPendingApprovals());
    }

    @GetMapping("/history")
    public ResponseEntity<List<ApprovalResponseDto>> getApprovalHistory() {
        return ResponseEntity.ok(approvalService.getApprovalHistory());
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<RequestResponseDto> approveRequest(@PathVariable Long id, @RequestBody(required = false) ApprovalActionRequest body) {
        String comment = body != null ? body.getComment() : null;
        return ResponseEntity.ok(approvalService.approveRequest(id, comment));
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<RequestResponseDto> rejectRequest(@PathVariable Long id, @RequestBody(required = false) ApprovalActionRequest body) {
        String comment = body != null ? body.getComment() : null;
        return ResponseEntity.ok(approvalService.rejectRequest(id, comment));
    }
}
