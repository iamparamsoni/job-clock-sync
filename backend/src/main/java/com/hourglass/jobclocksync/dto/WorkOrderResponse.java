package com.hourglass.jobclocksync.dto;

import com.hourglass.jobclocksync.model.WorkOrder;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkOrderResponse {
    private String id;
    private String workOrderNumber;
    private String title;
    private String description;
    private String companyId;
    private String vendorId;
    private String status;
    private LocalDateTime assignedDate;
    private LocalDateTime dueDate;
    private LocalDateTime completedDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public static WorkOrderResponse fromEntity(WorkOrder workOrder) {
        return new WorkOrderResponse(
            workOrder.getId(),
            workOrder.getWorkOrderNumber(),
            workOrder.getTitle(),
            workOrder.getDescription(),
            workOrder.getCompanyId(),
            workOrder.getVendorId(),
            workOrder.getStatus().name(),
            workOrder.getAssignedDate(),
            workOrder.getDueDate(),
            workOrder.getCompletedDate(),
            workOrder.getCreatedAt(),
            workOrder.getUpdatedAt()
        );
    }
}

