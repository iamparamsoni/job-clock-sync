package com.hourglass.jobclocksync.repository;

import com.hourglass.jobclocksync.model.Job;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends MongoRepository<Job, String> {
    List<Job> findByCompanyId(String companyId);
    List<Job> findByStatus(Job.JobStatus status);
}

