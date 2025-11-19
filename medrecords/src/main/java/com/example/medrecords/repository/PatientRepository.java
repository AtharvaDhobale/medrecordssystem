package com.example.medrecords.repository;

import com.example.medrecords.model.Patient;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PatientRepository extends MongoRepository<Patient, String> {
    Patient findByEmail(String email);  // Must match exactly
}
