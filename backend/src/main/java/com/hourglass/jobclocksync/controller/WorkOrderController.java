package com.hourglass.jobclocksync.controller;

import com.hourglass.jobclocksync.dto.WorkOrderRequest;
import com.hourglass.jobclocksync.dto.WorkOrderResponse;
import com.hourglass.jobclocksync.model.User;
import com.hourglass.jobclocksync.model.WorkOrder;
import com.hourglass.jobclocksync.service.AuthService;
import com.hourglass.jobclocksync.service.WorkOrderService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/work-orders")
@Tag(name = "Work Orders", description = "Work order management APIs")
@SecurityRequirement(name = "bearerAuth")
public class WorkOrderController {
    
    @Autowired
    private WorkOrderService workOrderService;
    
    @Autowired
    private AuthService authService;
    
    @PostMapping
    public ResponseEntity<WorkOrderResponse> createWorkOrder(
            @Valid @RequestBody WorkOrderRequest request,
            Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        if (user.getRole() != User.UserRole.COMPANY) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        WorkOrderResponse response = workOrderService.createWorkOrder(request, user.getId());
        return ResponseEntity.ok(response);
    }
    
    @GetMapping
    public ResponseEntity<List<WorkOrderResponse>> getWorkOrders(Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        List<WorkOrderResponse> workOrders;
        
        if (user.getRole() == User.UserRole.VENDOR) {
            workOrders = workOrderService.getWorkOrdersByVendor(user.getId());
        } else {
            workOrders = workOrderService.getWorkOrdersByCompany(user.getId());
        }
        
        return ResponseEntity.ok(workOrders);
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<WorkOrderResponse> updateStatus(
            @PathVariable String id,
            @RequestParam String status,
            Authentication authentication) {
        try {
            WorkOrder.WorkOrderStatus orderStatus = WorkOrder.WorkOrderStatus.valueOf(status.toUpperCase());
            WorkOrderResponse response = workOrderService.updateWorkOrderStatus(id, orderStatus);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/{id}/assign")
    public ResponseEntity<WorkOrderResponse> assignWorkOrder(
            @PathVariable String id,
            @RequestParam String vendorId,
            Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        if (user.getRole() != User.UserRole.COMPANY) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        try {
            WorkOrderResponse response = workOrderService.assignWorkOrder(id, vendorId);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}

