package com.example.medrecords.controller;

import com.example.medrecords.model.Record;
import com.example.medrecords.repository.RecordRepository;
import com.example.medrecords.service.AuditService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/records")
@CrossOrigin(origins = "*")
public class RecordController {

    @Autowired
    private RecordRepository recordRepository;

    // Removed FileController dependency to avoid circular reference

    @Autowired
    private AuditService auditService;


    
    // Add a new record
    @PostMapping("/add")
    public ResponseEntity<Record> addRecord(@RequestBody Record record) {
        // Set upload date if not provided
        if (record.getUploadDate() == null || record.getUploadDate().isEmpty()) {
            record.setUploadDate(java.time.LocalDateTime.now().format(java.time.format.DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        }
        Record saved = recordRepository.save(record);
        
        // Audit log
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String patientId = record.getPatientId();
        auditService.logAccess(patientId, "RECORD_CREATED", 
            "Medical record created: " + record.getFileName());
        
        return ResponseEntity.ok(saved);
    }

    // Get all records
    @GetMapping("/all")
    public List<Record> getAll() {
        return recordRepository.findAll();
    }

    // Get records by patient ID
    @GetMapping("/patient/{patientId}")
    public List<Record> getByPatient(@PathVariable String patientId) {
        // Audit log
        auditService.logAccess(patientId, "RECORDS_ACCESSED", 
            "Patient accessed their medical records");
        
        return recordRepository.findByPatientId(patientId);
    }

    // Delete record by ID
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> delete(@PathVariable String id) {
        recordRepository.deleteById(id);
        return ResponseEntity.ok("Record deleted");
    }

    // Download file linked to a record
    @GetMapping("/download/{recordId}")
    public ResponseEntity<?> downloadRecordFile(@PathVariable String recordId) throws IOException {
        // Fetch record from repository
        Record record = recordRepository.findById(recordId).orElse(null);
        if (record == null) {
            return ResponseEntity.status(404).body("Record not found");
        }

        // Return file ID for frontend to handle download
        return ResponseEntity.ok().body("{\"fileId\":\"" + record.getFileId() + "\"}");
    }
}
