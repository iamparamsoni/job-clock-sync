package com.hourglass.jobclocksync.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "jobs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Job {
    @Id
    private String id;
    
    private String title;
    private String description;
    private String companyId;
    private JobStatus status;
    private List<String> requiredSkills;
    private String location;
    private Double salaryMin;
    private Double salaryMax;
    private String employmentType; // FULL_TIME, PART_TIME, CONTRACT
    private List<String> applicantIds; // Vendor IDs who applied
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public enum JobStatus {
        DRAFT, OPEN, CLOSED, FILLED
    }
}

