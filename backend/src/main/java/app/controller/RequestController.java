package app.controller;

import app.dto.*;
import app.service.ApprovalService;
import app.service.RequestService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
public class RequestController {

    private final RequestService requestService;
    private final ApprovalService approvalService;

    public RequestController(RequestService requestService, ApprovalService approvalService) {
        this.requestService = requestService;
        this.approvalService = approvalService;
    }

    @GetMapping("/my")
    public ResponseEntity<List<RequestResponseDto>> getMyRequests() {
        return ResponseEntity.ok(requestService.getMyRequests());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RequestDetailResponseDto> getRequestDetails(@PathVariable Long id) {
        return ResponseEntity.ok(requestService.getRequestDetails(id));
    }

    @PostMapping
    public ResponseEntity<RequestResponseDto> createRequest(@Valid @RequestBody CreateRequestDto createRequestDto) {
        RequestResponseDto created = requestService.createRequest(createRequestDto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PostMapping("/{id}/submit")
    public ResponseEntity<RequestResponseDto> submitDraftRequest(@PathVariable Long id) {
        return ResponseEntity.ok(requestService.submitDraftRequest(id));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<RequestResponseDto> cancelRequest(@PathVariable Long id, @RequestBody(required = false) ApprovalActionRequest body) {
        String reason = body != null ? body.getComment() : null;
        return ResponseEntity.ok(requestService.cancelRequest(id, reason));
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
