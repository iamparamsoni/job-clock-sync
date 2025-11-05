package com.hourglass.jobclocksync.dto;

import com.hourglass.jobclocksync.model.Job;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class JobResponse {
    private String id;
    private String title;
    private String description;
    private String companyId;
    private String status;
    private List<String> requiredSkills;
    private String location;
    private Double salaryMin;
    private Double salaryMax;
    private String employmentType;
    private List<String> applicantIds;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public static JobResponse fromEntity(Job job) {
        JobResponse response = new JobResponse();
        response.setId(job.getId());
        response.setTitle(job.getTitle());
        response.setDescription(job.getDescription());
        response.setCompanyId(job.getCompanyId());
        response.setStatus(job.getStatus() != null ? job.getStatus().name() : null);
        response.setRequiredSkills(job.getRequiredSkills());
        response.setLocation(job.getLocation());
        response.setSalaryMin(job.getSalaryMin());
        response.setSalaryMax(job.getSalaryMax());
        response.setEmploymentType(job.getEmploymentType());
        response.setApplicantIds(job.getApplicantIds());
        response.setCreatedAt(job.getCreatedAt());
        response.setUpdatedAt(job.getUpdatedAt());
        return response;
    }
}

