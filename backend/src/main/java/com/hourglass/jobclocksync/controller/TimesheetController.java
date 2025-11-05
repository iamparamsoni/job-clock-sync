package com.hourglass.jobclocksync.controller;

import com.hourglass.jobclocksync.dto.TimesheetRequest;
import com.hourglass.jobclocksync.dto.TimesheetResponse;
import com.hourglass.jobclocksync.model.User;
import com.hourglass.jobclocksync.service.AuthService;
import com.hourglass.jobclocksync.service.TimesheetService;
import com.hourglass.jobclocksync.service.WorkOrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/timesheets")
public class TimesheetController {
    
    @Autowired
    private TimesheetService timesheetService;
    
    @Autowired
    private AuthService authService;
    
    @Autowired
    private WorkOrderService workOrderService;
    
    @PostMapping
    public ResponseEntity<TimesheetResponse> createTimesheet(
            @Valid @RequestBody TimesheetRequest request,
            Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        if (user.getRole() != User.UserRole.VENDOR) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        // Get company ID from work order
        String companyId = workOrderService.getCompanyIdByWorkOrderId(request.getWorkOrderId());
        
        TimesheetResponse response = timesheetService.createTimesheet(request, user.getId(), companyId);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping
    public ResponseEntity<List<TimesheetResponse>> getTimesheets(Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        List<TimesheetResponse> timesheets;
        
        if (user.getRole() == User.UserRole.VENDOR) {
            timesheets = timesheetService.getTimesheetsByVendor(user.getId());
        } else {
            timesheets = timesheetService.getTimesheetsByCompany(user.getId());
        }
        
        return ResponseEntity.ok(timesheets);
    }
    
    @PostMapping("/{id}/submit")
    public ResponseEntity<TimesheetResponse> submitTimesheet(
            @PathVariable String id,
            Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        if (user.getRole() != User.UserRole.VENDOR) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        try {
            TimesheetResponse response = timesheetService.submitTimesheet(id);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping("/{id}/approve")
    public ResponseEntity<TimesheetResponse> approveTimesheet(
            @PathVariable String id,
            Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        if (user.getRole() != User.UserRole.COMPANY) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        try {
            TimesheetResponse response = timesheetService.approveTimesheet(id);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping("/{id}/reject")
    public ResponseEntity<TimesheetResponse> rejectTimesheet(
            @PathVariable String id,
            Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        if (user.getRole() != User.UserRole.COMPANY) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        try {
            TimesheetResponse response = timesheetService.rejectTimesheet(id);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}

