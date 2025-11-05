package com.hourglass.jobclocksync.dto;

import com.hourglass.jobclocksync.model.Timesheet;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class TimesheetResponse {
    private String id;
    private String vendorId;
    private String companyId;
    private String workOrderId;
    private String status;
    private String weekStartDate;
    private String weekEndDate;
    private List<TimesheetEntryResponse> entries;
    private Double totalHours;
    private String notes;
    private LocalDateTime submittedDate;
    private LocalDateTime approvedDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    @Data
    public static class TimesheetEntryResponse {
        private String date;
        private Double hours;
        private String description;
        private String workOrderId;
    }
    
    public static TimesheetResponse fromEntity(Timesheet timesheet) {
        TimesheetResponse response = new TimesheetResponse();
        response.setId(timesheet.getId());
        response.setVendorId(timesheet.getVendorId());
        response.setCompanyId(timesheet.getCompanyId());
        response.setWorkOrderId(timesheet.getWorkOrderId());
        response.setStatus(timesheet.getStatus() != null ? timesheet.getStatus().name() : null);
        response.setWeekStartDate(timesheet.getWeekStartDate() != null ? timesheet.getWeekStartDate().toString() : null);
        response.setWeekEndDate(timesheet.getWeekEndDate() != null ? timesheet.getWeekEndDate().toString() : null);
        response.setTotalHours(timesheet.getTotalHours());
        response.setNotes(timesheet.getNotes());
        response.setSubmittedDate(timesheet.getSubmittedDate());
        response.setApprovedDate(timesheet.getApprovedDate());
        response.setCreatedAt(timesheet.getCreatedAt());
        response.setUpdatedAt(timesheet.getUpdatedAt());
        
        if (timesheet.getEntries() != null) {
            response.setEntries(timesheet.getEntries().stream()
                .map(entry -> {
                    TimesheetEntryResponse entryResponse = new TimesheetEntryResponse();
                    entryResponse.setDate(entry.getDate() != null ? entry.getDate().toString() : null);
                    entryResponse.setHours(entry.getHours());
                    entryResponse.setDescription(entry.getDescription());
                    entryResponse.setWorkOrderId(entry.getWorkOrderId());
                    return entryResponse;
                })
                .collect(Collectors.toList()));
        }
        
        return response;
    }
}

