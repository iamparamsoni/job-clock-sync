package com.hourglass.jobclocksync.config;

import com.hourglass.jobclocksync.model.User;
import com.hourglass.jobclocksync.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) {
        // Create default vendor user
        if (!userRepository.existsByEmail("vendor@hourglass.com")) {
            User vendor = new User();
            vendor.setEmail("vendor@hourglass.com");
            vendor.setPassword(passwordEncoder.encode("password123"));
            vendor.setName("Vendor User");
            vendor.setRole(User.UserRole.VENDOR);
            vendor.setActive(true);
            vendor.setCreatedAt(LocalDateTime.now());
            vendor.setUpdatedAt(LocalDateTime.now());
            userRepository.save(vendor);
        }
        
        // Create default company user
        if (!userRepository.existsByEmail("company@hourglass.com")) {
            User company = new User();
            company.setEmail("company@hourglass.com");
            company.setPassword(passwordEncoder.encode("password123"));
            company.setName("Company User");
            company.setRole(User.UserRole.COMPANY);
            company.setActive(true);
            company.setCreatedAt(LocalDateTime.now());
            company.setUpdatedAt(LocalDateTime.now());
            userRepository.save(company);
        }
    }
}

