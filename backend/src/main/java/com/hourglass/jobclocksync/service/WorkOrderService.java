package com.hourglass.jobclocksync.service;

import com.hourglass.jobclocksync.dto.WorkOrderRequest;
import com.hourglass.jobclocksync.dto.WorkOrderResponse;
import com.hourglass.jobclocksync.model.WorkOrder;
import com.hourglass.jobclocksync.repository.WorkOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class WorkOrderService {
    
    @Autowired
    private WorkOrderRepository workOrderRepository;
    
    public WorkOrderResponse createWorkOrder(WorkOrderRequest request, String companyId) {
        WorkOrder workOrder = new WorkOrder();
        workOrder.setId(UUID.randomUUID().toString());
        workOrder.setWorkOrderNumber(generateWorkOrderNumber());
        workOrder.setTitle(request.getTitle());
        workOrder.setDescription(request.getDescription());
        workOrder.setCompanyId(companyId);
        workOrder.setVendorId(request.getVendorId());
        workOrder.setStatus(WorkOrder.WorkOrderStatus.DRAFT);
        workOrder.setDueDate(request.getDueDate());
        workOrder.setCreatedAt(LocalDateTime.now());
        workOrder.setUpdatedAt(LocalDateTime.now());
        
        WorkOrder saved = workOrderRepository.save(workOrder);
        return WorkOrderResponse.fromEntity(saved);
    }
    
    public List<WorkOrderResponse> getWorkOrdersByCompany(String companyId) {
        return workOrderRepository.findByCompanyId(companyId).stream()
            .map(WorkOrderResponse::fromEntity)
            .collect(Collectors.toList());
    }
    
    public List<WorkOrderResponse> getWorkOrdersByVendor(String vendorId) {
        return workOrderRepository.findByVendorId(vendorId).stream()
            .map(WorkOrderResponse::fromEntity)
            .collect(Collectors.toList());
    }
    
    public WorkOrderResponse updateWorkOrderStatus(String id, WorkOrder.WorkOrderStatus status) {
        WorkOrder workOrder = workOrderRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Work order not found"));
        
        workOrder.setStatus(status);
        workOrder.setUpdatedAt(LocalDateTime.now());
        
        if (status == WorkOrder.WorkOrderStatus.ASSIGNED && workOrder.getAssignedDate() == null) {
            workOrder.setAssignedDate(LocalDateTime.now());
        }
        
        if (status == WorkOrder.WorkOrderStatus.COMPLETED) {
            workOrder.setCompletedDate(LocalDateTime.now());
        }
        
        WorkOrder saved = workOrderRepository.save(workOrder);
        return WorkOrderResponse.fromEntity(saved);
    }
    
    public WorkOrderResponse assignWorkOrder(String id, String vendorId) {
        WorkOrder workOrder = workOrderRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Work order not found"));
        
        workOrder.setVendorId(vendorId);
        workOrder.setStatus(WorkOrder.WorkOrderStatus.ASSIGNED);
        workOrder.setAssignedDate(LocalDateTime.now());
        workOrder.setUpdatedAt(LocalDateTime.now());
        
        WorkOrder saved = workOrderRepository.save(workOrder);
        return WorkOrderResponse.fromEntity(saved);
    }
    
    private String generateWorkOrderNumber() {
        int year = LocalDateTime.now().getYear();
        long count = workOrderRepository.count();
        return String.format("WO-%d-%03d", year, count + 1);
    }
}

