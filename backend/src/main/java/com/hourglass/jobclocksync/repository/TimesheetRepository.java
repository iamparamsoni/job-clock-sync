package com.hourglass.jobclocksync.repository;

import com.hourglass.jobclocksync.model.Timesheet;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TimesheetRepository extends MongoRepository<Timesheet, String> {
    List<Timesheet> findByVendorId(String vendorId);
    List<Timesheet> findByCompanyId(String companyId);
    List<Timesheet> findByVendorIdAndStatus(String vendorId, Timesheet.TimesheetStatus status);
}

