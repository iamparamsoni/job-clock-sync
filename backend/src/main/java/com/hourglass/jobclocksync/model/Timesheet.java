package com.hourglass.jobclocksync.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "timesheets")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Timesheet {
    @Id
    private String id;
    
    private String vendorId;
    private String companyId;
    private String workOrderId;
    private TimesheetStatus status;
    private LocalDateTime weekStartDate;
    private LocalDateTime weekEndDate;
    private List<TimesheetEntry> entries;
    private Double totalHours;
    private String notes;
    private LocalDateTime submittedDate;
    private LocalDateTime approvedDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TimesheetEntry {
        private LocalDateTime date;
        private Double hours;
        private String description;
        private String workOrderId;
    }
    
    public enum TimesheetStatus {
        DRAFT, SUBMITTED, APPROVED, REJECTED
    }
}

