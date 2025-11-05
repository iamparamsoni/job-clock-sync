package com.hourglass.jobclocksync.controller;

import com.hourglass.jobclocksync.dto.DashboardStatsResponse;
import com.hourglass.jobclocksync.model.User;
import com.hourglass.jobclocksync.service.AuthService;
import com.hourglass.jobclocksync.service.DashboardService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dashboard")
@Tag(name = "Dashboard", description = "Dashboard statistics APIs")
@SecurityRequirement(name = "bearerAuth")
public class DashboardController {
    
    @Autowired
    private DashboardService dashboardService;
    
    @Autowired
    private AuthService authService;
    
    @GetMapping("/vendor/stats")
    public ResponseEntity<DashboardStatsResponse> getVendorStats(Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        if (user.getRole() != User.UserRole.VENDOR) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        DashboardStatsResponse stats = dashboardService.getVendorStats(user.getId());
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/company/stats")
    public ResponseEntity<DashboardStatsResponse> getCompanyStats(Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        if (user.getRole() != User.UserRole.COMPANY) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        DashboardStatsResponse stats = dashboardService.getCompanyStats(user.getId());
        return ResponseEntity.ok(stats);
    }
}

