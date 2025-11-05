package com.hourglass.jobclocksync.service;

import com.hourglass.jobclocksync.dto.InvoiceRequest;
import com.hourglass.jobclocksync.dto.InvoiceResponse;
import com.hourglass.jobclocksync.model.Invoice;
import com.hourglass.jobclocksync.repository.InvoiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class InvoiceService {
    
    @Autowired
    private InvoiceRepository invoiceRepository;
    
    public InvoiceResponse createInvoice(InvoiceRequest request, String vendorId, String companyId) {
        Invoice invoice = new Invoice();
        invoice.setId(UUID.randomUUID().toString());
        invoice.setInvoiceNumber(generateInvoiceNumber());
        invoice.setVendorId(vendorId);
        invoice.setCompanyId(companyId);
        invoice.setWorkOrderId(request.getWorkOrderId());
        invoice.setStatus(Invoice.InvoiceStatus.DRAFT);
        invoice.setDueDate(request.getDueDate() != null ? LocalDate.parse(request.getDueDate()).atStartOfDay() : null);
        
        // Convert request items to model items and calculate totals
        List<Invoice.InvoiceItem> items = request.getItems().stream()
            .map(reqItem -> {
                Invoice.InvoiceItem item = new Invoice.InvoiceItem();
                item.setDescription(reqItem.getDescription());
                item.setQuantity(reqItem.getQuantity());
                item.setUnitPrice(reqItem.getUnitPrice());
                item.setTotal(reqItem.getQuantity() * reqItem.getUnitPrice());
                return item;
            })
            .collect(Collectors.toList());
        
        invoice.setItems(items);
        
        // Calculate subtotal, tax, and total
        double subtotal = items.stream()
            .mapToDouble(Invoice.InvoiceItem::getTotal)
            .sum();
        invoice.setSubtotal(subtotal);
        
        // Tax rate: 10% (you can make this configurable)
        double taxRate = 0.10;
        double taxAmount = subtotal * taxRate;
        invoice.setTaxAmount(taxAmount);
        invoice.setTotalAmount(subtotal + taxAmount);
        
        invoice.setCreatedAt(LocalDateTime.now());
        invoice.setUpdatedAt(LocalDateTime.now());
        
        Invoice saved = invoiceRepository.save(invoice);
        return InvoiceResponse.fromEntity(saved);
    }
    
    public List<InvoiceResponse> getInvoicesByVendor(String vendorId) {
        return invoiceRepository.findByVendorId(vendorId).stream()
            .map(InvoiceResponse::fromEntity)
            .collect(Collectors.toList());
    }
    
    public List<InvoiceResponse> getInvoicesByCompany(String companyId) {
        return invoiceRepository.findByCompanyId(companyId).stream()
            .map(InvoiceResponse::fromEntity)
            .collect(Collectors.toList());
    }
    
    public InvoiceResponse submitInvoice(String id) {
        Invoice invoice = invoiceRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Invoice not found"));
        
        invoice.setStatus(Invoice.InvoiceStatus.PENDING);
        invoice.setUpdatedAt(LocalDateTime.now());
        
        Invoice saved = invoiceRepository.save(invoice);
        return InvoiceResponse.fromEntity(saved);
    }
    
    public InvoiceResponse approveInvoice(String id) {
        Invoice invoice = invoiceRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Invoice not found"));
        
        invoice.setStatus(Invoice.InvoiceStatus.APPROVED);
        invoice.setUpdatedAt(LocalDateTime.now());
        
        Invoice saved = invoiceRepository.save(invoice);
        return InvoiceResponse.fromEntity(saved);
    }
    
    public InvoiceResponse rejectInvoice(String id) {
        Invoice invoice = invoiceRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Invoice not found"));
        
        invoice.setStatus(Invoice.InvoiceStatus.REJECTED);
        invoice.setUpdatedAt(LocalDateTime.now());
        
        Invoice saved = invoiceRepository.save(invoice);
        return InvoiceResponse.fromEntity(saved);
    }
    
    public InvoiceResponse markInvoiceAsPaid(String id) {
        Invoice invoice = invoiceRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Invoice not found"));
        
        invoice.setStatus(Invoice.InvoiceStatus.PAID);
        invoice.setPaidDate(LocalDateTime.now());
        invoice.setUpdatedAt(LocalDateTime.now());
        
        Invoice saved = invoiceRepository.save(invoice);
        return InvoiceResponse.fromEntity(saved);
    }
    
    private String generateInvoiceNumber() {
        int year = LocalDateTime.now().getYear();
        long count = invoiceRepository.count();
        return String.format("INV-%d-%04d", year, count + 1);
    }
}

