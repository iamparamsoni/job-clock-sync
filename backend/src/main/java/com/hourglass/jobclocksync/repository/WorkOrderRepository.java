package com.hourglass.jobclocksync.repository;

import com.hourglass.jobclocksync.model.WorkOrder;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorkOrderRepository extends MongoRepository<WorkOrder, String> {
    List<WorkOrder> findByCompanyId(String companyId);
    List<WorkOrder> findByVendorId(String vendorId);
    List<WorkOrder> findByCompanyIdAndStatus(String companyId, WorkOrder.WorkOrderStatus status);
    List<WorkOrder> findByVendorIdAndStatus(String vendorId, WorkOrder.WorkOrderStatus status);
    Optional<WorkOrder> findByWorkOrderNumber(String workOrderNumber);
}

