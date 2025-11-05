package com.hourglass.jobclocksync.service;

import com.hourglass.jobclocksync.dto.JobRequest;
import com.hourglass.jobclocksync.dto.JobResponse;
import com.hourglass.jobclocksync.dto.UserResponse;
import com.hourglass.jobclocksync.model.Job;
import com.hourglass.jobclocksync.model.User;
import com.hourglass.jobclocksync.repository.JobRepository;
import com.hourglass.jobclocksync.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class JobService {
    
    @Autowired
    private JobRepository jobRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public JobResponse createJob(JobRequest request, String companyId) {
        Job job = new Job();
        job.setId(UUID.randomUUID().toString());
        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setCompanyId(companyId);
        job.setStatus(Job.JobStatus.DRAFT);
        job.setRequiredSkills(request.getRequiredSkills());
        job.setLocation(request.getLocation());
        job.setSalaryMin(request.getSalaryMin());
        job.setSalaryMax(request.getSalaryMax());
        job.setEmploymentType(request.getEmploymentType());
        job.setCreatedAt(LocalDateTime.now());
        job.setUpdatedAt(LocalDateTime.now());
        
        Job saved = jobRepository.save(job);
        return JobResponse.fromEntity(saved);
    }
    
    public List<JobResponse> getJobsByCompany(String companyId) {
        return jobRepository.findByCompanyId(companyId).stream()
            .map(JobResponse::fromEntity)
            .collect(Collectors.toList());
    }
    
    public List<JobResponse> getOpenJobs() {
        return jobRepository.findByStatus(Job.JobStatus.OPEN).stream()
            .map(JobResponse::fromEntity)
            .collect(Collectors.toList());
    }
    
    public JobResponse updateJobStatus(String id, Job.JobStatus status) {
        Job job = jobRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Job not found"));
        
        job.setStatus(status);
        job.setUpdatedAt(LocalDateTime.now());
        
        Job saved = jobRepository.save(job);
        return JobResponse.fromEntity(saved);
    }
    
    public JobResponse applyForJob(String jobId, String vendorId) {
        Job job = jobRepository.findById(jobId)
            .orElseThrow(() -> new RuntimeException("Job not found"));
        
        if (job.getApplicantIds() == null) {
            job.setApplicantIds(new java.util.ArrayList<>());
        }
        
        if (!job.getApplicantIds().contains(vendorId)) {
            job.getApplicantIds().add(vendorId);
        }
        
        job.setUpdatedAt(LocalDateTime.now());
        
        Job saved = jobRepository.save(job);
        return JobResponse.fromEntity(saved);
    }
    
    public JobResponse updateJob(String id, JobRequest request) {
        Job job = jobRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Job not found"));
        
        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setLocation(request.getLocation());
        job.setRequiredSkills(request.getRequiredSkills());
        job.setSalaryMin(request.getSalaryMin());
        job.setSalaryMax(request.getSalaryMax());
        job.setEmploymentType(request.getEmploymentType());
        job.setUpdatedAt(LocalDateTime.now());
        
        Job saved = jobRepository.save(job);
        return JobResponse.fromEntity(saved);
    }
    
    public List<UserResponse> getJobApplicants(String jobId) {
        Job job = jobRepository.findById(jobId)
            .orElseThrow(() -> new RuntimeException("Job not found"));
        
        if (job.getApplicantIds() == null || job.getApplicantIds().isEmpty()) {
            return List.of();
        }
        
        return job.getApplicantIds().stream()
            .map(vendorId -> userRepository.findById(vendorId))
            .filter(java.util.Optional::isPresent)
            .map(java.util.Optional::get)
            .map(UserResponse::fromEntity)
            .collect(Collectors.toList());
    }
}

