package com.hourglass.jobclocksync.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    private String id;
    
    @Indexed(unique = true)
    private String email;
    
    private String password;
    private String name;
    private UserRole role;
    private boolean active = true;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public enum UserRole {
        VENDOR, COMPANY
    }
}

