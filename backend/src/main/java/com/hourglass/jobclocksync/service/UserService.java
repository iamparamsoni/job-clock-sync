package com.hourglass.jobclocksync.service;

import com.hourglass.jobclocksync.dto.UserRequest;
import com.hourglass.jobclocksync.dto.UserResponse;
import com.hourglass.jobclocksync.model.User;
import com.hourglass.jobclocksync.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
            .map(UserResponse::fromEntity)
            .collect(Collectors.toList());
    }
    
    public UserResponse getUserById(String id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return UserResponse.fromEntity(user);
    }
    
    public UserResponse createUser(UserRequest request) {
        // Check if user already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("User with this email already exists");
        }
        
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setName(request.getName());
        user.setRole(User.UserRole.valueOf(request.getRole().toUpperCase()));
        user.setActive(request.getActive() != null ? request.getActive() : true);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        
        user = userRepository.save(user);
        return UserResponse.fromEntity(user);
    }
    
    public UserResponse updateUser(String id, UserRequest request) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setName(request.getName());
        user.setRole(User.UserRole.valueOf(request.getRole().toUpperCase()));
        user.setActive(request.getActive() != null ? request.getActive() : user.isActive());
        
        // Only update password if provided
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        
        user.setUpdatedAt(LocalDateTime.now());
        
        user = userRepository.save(user);
        return UserResponse.fromEntity(user);
    }
    
    public void deleteUser(String id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found");
        }
        userRepository.deleteById(id);
    }
    
    public UserResponse toggleUserStatus(String id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setActive(!user.isActive());
        user.setUpdatedAt(LocalDateTime.now());
        
        user = userRepository.save(user);
        return UserResponse.fromEntity(user);
    }
    
    public List<UserResponse> getUsersByRole(String role) {
        User.UserRole userRole = User.UserRole.valueOf(role.toUpperCase());
        return userRepository.findAll().stream()
            .filter(user -> user.getRole() == userRole)
            .map(UserResponse::fromEntity)
            .collect(Collectors.toList());
    }
}

