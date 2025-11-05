package com.hourglass.jobclocksync.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class InvoiceRequest {
    @NotBlank(message = "Work order ID is required")
    private String workOrderId;
    
    @NotNull(message = "Items are required")
    private List<InvoiceItemRequest> items;
    
    private String dueDate;
    
    @Data
    public static class InvoiceItemRequest {
        @NotBlank(message = "Description is required")
        private String description;
        
        @NotNull(message = "Quantity is required")
        private Integer quantity;
        
        @NotNull(message = "Unit price is required")
        private Double unitPrice;
    }
}

