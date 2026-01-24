package com.insightai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MeetingResponse {
    
    private Long id;
    private String title;
    private String description;
    private String transcript;
    private String summary;
    private LocalDateTime meetingDateTime;
    private UserResponse createdBy;
    private Long summaryGeneratedBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
