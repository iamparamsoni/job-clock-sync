package com.hourglass.jobclocksync.service;

import com.hourglass.jobclocksync.dto.LoginRequest;
import com.hourglass.jobclocksync.dto.LoginResponse;
import com.hourglass.jobclocksync.model.User;
import com.hourglass.jobclocksync.repository.UserRepository;
import com.hourglass.jobclocksync.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("Invalid email or password"));
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }
        
        if (!user.isActive()) {
            throw new RuntimeException("User account is inactive");
        }
        
        String token = jwtUtil.generateToken(user.getEmail(), user.getId(), user.getRole().name());
        
        return new LoginResponse(
            token,
            user.getId(),
            user.getEmail(),
            user.getName(),
            user.getRole().name().toLowerCase()
        );
    }
    
    public User getCurrentUser(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }
}

