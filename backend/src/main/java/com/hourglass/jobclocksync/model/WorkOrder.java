package com.hourglass.jobclocksync.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "workorders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkOrder {
    @Id
    private String id;
    
    @Indexed(unique = true)
    private String workOrderNumber;
    
    private String title;
    private String description;
    private String companyId;
    private String vendorId;
    private WorkOrderStatus status;
    private LocalDateTime assignedDate;
    private LocalDateTime dueDate;
    private LocalDateTime completedDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public enum WorkOrderStatus {
        DRAFT, OPEN, ASSIGNED, IN_PROGRESS, COMPLETED, CANCELLED
    }
}

