package com.hourglass.jobclocksync.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "invoices")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Invoice {
    @Id
    private String id;
    
    @Indexed(unique = true)
    private String invoiceNumber;
    
    private String vendorId;
    private String companyId;
    private String workOrderId;
    private InvoiceStatus status;
    private Double totalAmount;
    private Double taxAmount;
    private Double subtotal;
    private List<InvoiceItem> items;
    private LocalDateTime dueDate;
    private LocalDateTime paidDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InvoiceItem {
        private String description;
        private Integer quantity;
        private Double unitPrice;
        private Double total;
    }
    
    public enum InvoiceStatus {
        DRAFT, PENDING, APPROVED, PAID, REJECTED
    }
}

