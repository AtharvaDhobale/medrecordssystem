package com.example.medrecords.repository;

import com.example.medrecords.model.Record;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecordRepository extends MongoRepository<Record, String> {
    List<Record> findByPatientId(String patientId);
}
