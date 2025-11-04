package com.hourglass.jobclocksync.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class WorkOrderRequest {
    @NotBlank(message = "Title is required")
    private String title;
    
    @NotBlank(message = "Description is required")
    private String description;
    
    private LocalDateTime dueDate;
    private String vendorId;
}

