package com.hourglass.jobclocksync.controller;

import com.hourglass.jobclocksync.dto.LoginRequest;
import com.hourglass.jobclocksync.dto.LoginResponse;
import com.hourglass.jobclocksync.model.User;
import com.hourglass.jobclocksync.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        try {
            LoginResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        user.setPassword(null); // Don't return password
        return ResponseEntity.ok(user);
    }
}

