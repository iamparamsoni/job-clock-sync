package com.hourglass.jobclocksync.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class JobRequest {
    @NotBlank(message = "Title is required")
    private String title;
    
    @NotBlank(message = "Description is required")
    private String description;
    
    @NotBlank(message = "Location is required")
    private String location;
    
    @NotNull(message = "Employment type is required")
    private String employmentType; // FULL_TIME, PART_TIME, CONTRACT
    
    private List<String> requiredSkills;
    
    private Double salaryMin;
    
    private Double salaryMax;
}

