package com.hourglass.jobclocksync.service;

import com.hourglass.jobclocksync.dto.DashboardStatsResponse;
import com.hourglass.jobclocksync.model.Invoice;
import com.hourglass.jobclocksync.model.Timesheet;
import com.hourglass.jobclocksync.model.WorkOrder;
import com.hourglass.jobclocksync.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {
    
    @Autowired
    private WorkOrderRepository workOrderRepository;
    
    @Autowired
    private InvoiceRepository invoiceRepository;
    
    @Autowired
    private TimesheetRepository timesheetRepository;
    
    @Autowired
    private JobRepository jobRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public DashboardStatsResponse getVendorStats(String vendorId) {
        List<WorkOrder> workOrders = workOrderRepository.findByVendorId(vendorId);
        List<Invoice> pendingInvoices = invoiceRepository.findByVendorIdAndStatus(
            vendorId, Invoice.InvoiceStatus.PENDING);
        List<Timesheet> timesheets = timesheetRepository.findByVendorId(vendorId);
        
        int activeJobs = (int) jobRepository.findAll().stream()
            .filter(job -> job.getApplicantIds() != null && job.getApplicantIds().contains(vendorId))
            .count();
        
        int workOrdersInProgress = (int) workOrders.stream()
            .filter(wo -> wo.getStatus() == WorkOrder.WorkOrderStatus.IN_PROGRESS)
            .count();
        
        double totalHours = timesheets.stream()
            .filter(ts -> ts.getStatus() == Timesheet.TimesheetStatus.APPROVED)
            .mapToDouble(ts -> ts.getTotalHours() != null ? ts.getTotalHours() : 0.0)
            .sum();
        
        double pendingInvoicesAmount = pendingInvoices.stream()
            .mapToDouble(inv -> inv.getTotalAmount() != null ? inv.getTotalAmount() : 0.0)
            .sum();
        
        return new DashboardStatsResponse(
            activeJobs,
            workOrdersInProgress,
            totalHours,
            pendingInvoicesAmount,
            null, null, null, null
        );
    }
    
    public DashboardStatsResponse getCompanyStats(String companyId) {
        List<WorkOrder> workOrders = workOrderRepository.findByCompanyId(companyId);
        List<Invoice> invoices = invoiceRepository.findByCompanyId(companyId);
        
        int activeVendors = (int) workOrders.stream()
            .filter(wo -> wo.getVendorId() != null)
            .map(WorkOrder::getVendorId)
            .distinct()
            .count();
        
        int openPositions = (int) jobRepository.findByCompanyId(companyId).stream()
            .filter(job -> job.getStatus() == com.hourglass.jobclocksync.model.Job.JobStatus.OPEN)
            .count();
        
        int workOrdersInProgress = (int) workOrders.stream()
            .filter(wo -> wo.getStatus() == WorkOrder.WorkOrderStatus.IN_PROGRESS)
            .count();
        
        LocalDateTime startOfMonth = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0);
        double monthlySpend = invoices.stream()
            .filter(inv -> inv.getStatus() == Invoice.InvoiceStatus.PAID)
            .filter(inv -> inv.getPaidDate() != null && inv.getPaidDate().isAfter(startOfMonth))
            .mapToDouble(inv -> inv.getTotalAmount() != null ? inv.getTotalAmount() : 0.0)
            .sum();
        
        return new DashboardStatsResponse(
            null, null, null, null,
            activeVendors,
            openPositions,
            workOrdersInProgress,
            monthlySpend
        );
    }
}

