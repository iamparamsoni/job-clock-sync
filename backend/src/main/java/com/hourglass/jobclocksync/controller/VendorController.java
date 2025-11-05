package com.hourglass.jobclocksync.controller;

import com.hourglass.jobclocksync.dto.UserResponse;
import com.hourglass.jobclocksync.model.User;
import com.hourglass.jobclocksync.repository.UserRepository;
import com.hourglass.jobclocksync.service.AuthService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/vendors")
@Tag(name = "Vendors", description = "Vendor management APIs (Company only)")
@SecurityRequirement(name = "bearerAuth")
public class VendorController {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private AuthService authService;
    
    @GetMapping
    public ResponseEntity<List<UserResponse>> getVendors(Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        if (user.getRole() != User.UserRole.COMPANY) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        List<UserResponse> vendors = userRepository.findAll().stream()
            .filter(u -> u.getRole() == User.UserRole.VENDOR && u.isActive())
            .map(UserResponse::fromEntity)
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(vendors);
    }
}

