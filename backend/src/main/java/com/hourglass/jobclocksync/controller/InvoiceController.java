package com.hourglass.jobclocksync.controller;

import com.hourglass.jobclocksync.dto.InvoiceRequest;
import com.hourglass.jobclocksync.dto.InvoiceResponse;
import com.hourglass.jobclocksync.model.User;
import com.hourglass.jobclocksync.service.AuthService;
import com.hourglass.jobclocksync.service.InvoiceService;
import com.hourglass.jobclocksync.service.WorkOrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/invoices")
public class InvoiceController {
    
    @Autowired
    private InvoiceService invoiceService;
    
    @Autowired
    private AuthService authService;
    
    @Autowired
    private WorkOrderService workOrderService;
    
    @PostMapping
    public ResponseEntity<InvoiceResponse> createInvoice(
            @Valid @RequestBody InvoiceRequest request,
            Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        if (user.getRole() != User.UserRole.VENDOR) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        // Get company ID from work order
        String companyId = workOrderService.getCompanyIdByWorkOrderId(request.getWorkOrderId());
        
        InvoiceResponse response = invoiceService.createInvoice(request, user.getId(), companyId);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping
    public ResponseEntity<List<InvoiceResponse>> getInvoices(Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        List<InvoiceResponse> invoices;
        
        if (user.getRole() == User.UserRole.VENDOR) {
            invoices = invoiceService.getInvoicesByVendor(user.getId());
        } else {
            invoices = invoiceService.getInvoicesByCompany(user.getId());
        }
        
        return ResponseEntity.ok(invoices);
    }
    
    @PostMapping("/{id}/submit")
    public ResponseEntity<InvoiceResponse> submitInvoice(
            @PathVariable String id,
            Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        if (user.getRole() != User.UserRole.VENDOR) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        try {
            InvoiceResponse response = invoiceService.submitInvoice(id);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping("/{id}/approve")
    public ResponseEntity<InvoiceResponse> approveInvoice(
            @PathVariable String id,
            Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        if (user.getRole() != User.UserRole.COMPANY) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        try {
            InvoiceResponse response = invoiceService.approveInvoice(id);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping("/{id}/reject")
    public ResponseEntity<InvoiceResponse> rejectInvoice(
            @PathVariable String id,
            Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        if (user.getRole() != User.UserRole.COMPANY) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        try {
            InvoiceResponse response = invoiceService.rejectInvoice(id);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping("/{id}/pay")
    public ResponseEntity<InvoiceResponse> markInvoiceAsPaid(
            @PathVariable String id,
            Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        if (user.getRole() != User.UserRole.COMPANY) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        try {
            InvoiceResponse response = invoiceService.markInvoiceAsPaid(id);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}

