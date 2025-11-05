package com.hourglass.jobclocksync.service;

import com.hourglass.jobclocksync.dto.TimesheetRequest;
import com.hourglass.jobclocksync.dto.TimesheetResponse;
import com.hourglass.jobclocksync.model.Timesheet;
import com.hourglass.jobclocksync.repository.TimesheetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TimesheetService {
    
    @Autowired
    private TimesheetRepository timesheetRepository;
    
    public TimesheetResponse createTimesheet(TimesheetRequest request, String vendorId, String companyId) {
        Timesheet timesheet = new Timesheet();
        timesheet.setId(UUID.randomUUID().toString());
        timesheet.setVendorId(vendorId);
        timesheet.setCompanyId(companyId);
        timesheet.setWorkOrderId(request.getWorkOrderId());
        timesheet.setStatus(Timesheet.TimesheetStatus.DRAFT);
        timesheet.setWeekStartDate(LocalDate.parse(request.getWeekStartDate()));
        timesheet.setWeekEndDate(LocalDate.parse(request.getWeekEndDate()));
        timesheet.setNotes(request.getNotes());
        
        // Convert request entries to model entries
        List<Timesheet.TimesheetEntry> entries = request.getEntries().stream()
            .map(reqEntry -> {
                Timesheet.TimesheetEntry entry = new Timesheet.TimesheetEntry();
                entry.setDate(LocalDate.parse(reqEntry.getDate()));
                entry.setHours(reqEntry.getHours());
                entry.setDescription(reqEntry.getDescription());
                entry.setWorkOrderId(reqEntry.getWorkOrderId());
                return entry;
            })
            .collect(Collectors.toList());
        
        timesheet.setEntries(entries);
        
        // Calculate total hours
        double totalHours = entries.stream()
            .mapToDouble(e -> e.getHours() != null ? e.getHours() : 0.0)
            .sum();
        timesheet.setTotalHours(totalHours);
        
        timesheet.setCreatedAt(LocalDateTime.now());
        timesheet.setUpdatedAt(LocalDateTime.now());
        
        Timesheet saved = timesheetRepository.save(timesheet);
        return TimesheetResponse.fromEntity(saved);
    }
    
    public List<TimesheetResponse> getTimesheetsByVendor(String vendorId) {
        return timesheetRepository.findByVendorId(vendorId).stream()
            .map(TimesheetResponse::fromEntity)
            .collect(Collectors.toList());
    }
    
    public List<TimesheetResponse> getTimesheetsByCompany(String companyId) {
        return timesheetRepository.findByCompanyId(companyId).stream()
            .map(TimesheetResponse::fromEntity)
            .collect(Collectors.toList());
    }
    
    public TimesheetResponse submitTimesheet(String id) {
        Timesheet timesheet = timesheetRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Timesheet not found"));
        
        timesheet.setStatus(Timesheet.TimesheetStatus.SUBMITTED);
        timesheet.setSubmittedDate(LocalDateTime.now());
        timesheet.setUpdatedAt(LocalDateTime.now());
        
        Timesheet saved = timesheetRepository.save(timesheet);
        return TimesheetResponse.fromEntity(saved);
    }
    
    public TimesheetResponse approveTimesheet(String id) {
        Timesheet timesheet = timesheetRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Timesheet not found"));
        
        timesheet.setStatus(Timesheet.TimesheetStatus.APPROVED);
        timesheet.setApprovedDate(LocalDateTime.now());
        timesheet.setUpdatedAt(LocalDateTime.now());
        
        Timesheet saved = timesheetRepository.save(timesheet);
        return TimesheetResponse.fromEntity(saved);
    }
    
    public TimesheetResponse rejectTimesheet(String id) {
        Timesheet timesheet = timesheetRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Timesheet not found"));
        
        timesheet.setStatus(Timesheet.TimesheetStatus.REJECTED);
        timesheet.setUpdatedAt(LocalDateTime.now());
        
        Timesheet saved = timesheetRepository.save(timesheet);
        return TimesheetResponse.fromEntity(saved);
    }
}

