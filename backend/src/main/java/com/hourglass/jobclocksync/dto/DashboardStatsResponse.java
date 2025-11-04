package com.hourglass.jobclocksync.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponse {
    // Vendor stats
    private Integer activeJobs;
    private Integer workOrdersInProgress;
    private Double totalHours;
    private Double pendingInvoicesAmount;
    
    // Company stats
    private Integer activeVendors;
    private Integer openPositions;
    private Integer workOrdersInProgressCompany;
    private Double monthlySpend;
}

