package com.hourglass.jobclocksync.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class TimesheetRequest {
    @NotBlank(message = "Work order ID is required")
    private String workOrderId;
    
    @NotBlank(message = "Week start date is required")
    private String weekStartDate;
    
    @NotBlank(message = "Week end date is required")
    private String weekEndDate;
    
    @NotNull(message = "Entries are required")
    private List<TimesheetEntryRequest> entries;
    
    private String notes;
    
    @Data
    public static class TimesheetEntryRequest {
        @NotBlank(message = "Date is required")
        private String date;
        
        @NotNull(message = "Hours are required")
        private Double hours;
        
        @NotBlank(message = "Description is required")
        private String description;
        
        @NotBlank(message = "Work order ID is required")
        private String workOrderId;
    }
}

