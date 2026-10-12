package app.dto;

import app.model.StatusHistory;
import java.time.LocalDateTime;

public class StatusHistoryResponseDto {

    private Long id;
    private Long requestId;
    private String previousStatus;
    private String newStatus;
    private Long actorId;
    private String actorName;
    private String actorEmail;
    private String action;
    private String comment;
    private LocalDateTime createdAt;

    public StatusHistoryResponseDto() {
    }

    public static StatusHistoryResponseDto fromEntity(StatusHistory history) {
        StatusHistoryResponseDto dto = new StatusHistoryResponseDto();
        dto.setId(history.getId());
        if (history.getRequest() != null) {
            dto.setRequestId(history.getRequest().getId());
        }
        dto.setPreviousStatus(history.getPreviousStatus());
        dto.setNewStatus(history.getNewStatus());
        if (history.getActor() != null) {
            dto.setActorId(history.getActor().getId());
            dto.setActorName(history.getActor().getName());
            dto.setActorEmail(history.getActor().getEmail());
        }
        dto.setAction(history.getAction());
        dto.setComment(history.getComment());
        dto.setCreatedAt(history.getCreatedAt());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getRequestId() {
        return requestId;
    }

    public void setRequestId(Long requestId) {
        this.requestId = requestId;
    }

    public String getPreviousStatus() {
        return previousStatus;
    }

    public void setPreviousStatus(String previousStatus) {
        this.previousStatus = previousStatus;
    }

    public String getNewStatus() {
        return newStatus;
    }

    public void setNewStatus(String newStatus) {
        this.newStatus = newStatus;
    }

    public Long getActorId() {
        return actorId;
    }

    public void setActorId(Long actorId) {
        this.actorId = actorId;
    }

    public String getActorName() {
        return actorName;
    }

    public void setActorName(String actorName) {
        this.actorName = actorName;
    }

    public String getActorEmail() {
        return actorEmail;
    }

    public void setActorEmail(String actorEmail) {
        this.actorEmail = actorEmail;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
