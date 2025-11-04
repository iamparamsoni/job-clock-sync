package com.hourglass.jobclocksync.repository;

import com.hourglass.jobclocksync.model.Invoice;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvoiceRepository extends MongoRepository<Invoice, String> {
    List<Invoice> findByVendorId(String vendorId);
    List<Invoice> findByCompanyId(String companyId);
    List<Invoice> findByVendorIdAndStatus(String vendorId, Invoice.InvoiceStatus status);
}

