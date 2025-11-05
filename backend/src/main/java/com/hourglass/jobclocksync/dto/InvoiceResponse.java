package com.hourglass.jobclocksync.dto;

import com.hourglass.jobclocksync.model.Invoice;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class InvoiceResponse {
    private String id;
    private String invoiceNumber;
    private String vendorId;
    private String companyId;
    private String workOrderId;
    private String status;
    private Double totalAmount;
    private Double taxAmount;
    private Double subtotal;
    private List<InvoiceItemResponse> items;
    private String dueDate;
    private String paidDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    @Data
    public static class InvoiceItemResponse {
        private String description;
        private Integer quantity;
        private Double unitPrice;
        private Double total;
    }
    
    public static InvoiceResponse fromEntity(Invoice invoice) {
        InvoiceResponse response = new InvoiceResponse();
        response.setId(invoice.getId());
        response.setInvoiceNumber(invoice.getInvoiceNumber());
        response.setVendorId(invoice.getVendorId());
        response.setCompanyId(invoice.getCompanyId());
        response.setWorkOrderId(invoice.getWorkOrderId());
        response.setStatus(invoice.getStatus() != null ? invoice.getStatus().name() : null);
        response.setTotalAmount(invoice.getTotalAmount());
        response.setTaxAmount(invoice.getTaxAmount());
        response.setSubtotal(invoice.getSubtotal());
        response.setDueDate(invoice.getDueDate() != null ? invoice.getDueDate().toString() : null);
        response.setPaidDate(invoice.getPaidDate() != null ? invoice.getPaidDate().toString() : null);
        response.setCreatedAt(invoice.getCreatedAt());
        response.setUpdatedAt(invoice.getUpdatedAt());
        
        if (invoice.getItems() != null) {
            response.setItems(invoice.getItems().stream()
                .map(item -> {
                    InvoiceItemResponse itemResponse = new InvoiceItemResponse();
                    itemResponse.setDescription(item.getDescription());
                    itemResponse.setQuantity(item.getQuantity());
                    itemResponse.setUnitPrice(item.getUnitPrice());
                    itemResponse.setTotal(item.getTotal());
                    return itemResponse;
                })
                .collect(Collectors.toList()));
        }
        
        return response;
    }
}

