package com.hourglass.jobclocksync.controller;

import com.hourglass.jobclocksync.dto.JobRequest;
import com.hourglass.jobclocksync.dto.JobResponse;
import com.hourglass.jobclocksync.model.Job;
import com.hourglass.jobclocksync.model.User;
import com.hourglass.jobclocksync.service.AuthService;
import com.hourglass.jobclocksync.service.JobService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/jobs")
@Tag(name = "Jobs", description = "Job posting and application management APIs")
@SecurityRequirement(name = "bearerAuth")
public class JobController {
    
    @Autowired
    private JobService jobService;
    
    @Autowired
    private AuthService authService;
    
    @PostMapping
    public ResponseEntity<JobResponse> createJob(
            @Valid @RequestBody JobRequest request,
            Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        if (user.getRole() != User.UserRole.COMPANY) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        JobResponse response = jobService.createJob(request, user.getId());
        return ResponseEntity.ok(response);
    }
    
    @GetMapping
    public ResponseEntity<List<JobResponse>> getJobs(Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        List<JobResponse> jobs;
        
        if (user.getRole() == User.UserRole.VENDOR) {
            // Vendors see open jobs
            jobs = jobService.getOpenJobs();
        } else {
            // Companies see their own jobs
            jobs = jobService.getJobsByCompany(user.getId());
        }
        
        return ResponseEntity.ok(jobs);
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<JobResponse> updateStatus(
            @PathVariable String id,
            @RequestParam String status,
            Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        if (user.getRole() != User.UserRole.COMPANY) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        try {
            Job.JobStatus jobStatus = Job.JobStatus.valueOf(status.toUpperCase());
            JobResponse response = jobService.updateJobStatus(id, jobStatus);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping("/{id}/apply")
    public ResponseEntity<JobResponse> applyForJob(
            @PathVariable String id,
            Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        if (user.getRole() != User.UserRole.VENDOR) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        try {
            JobResponse response = jobService.applyForJob(id, user.getId());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<JobResponse> updateJob(
            @PathVariable String id,
            @Valid @RequestBody JobRequest request,
            Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        if (user.getRole() != User.UserRole.COMPANY) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        try {
            JobResponse response = jobService.updateJob(id, request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}

