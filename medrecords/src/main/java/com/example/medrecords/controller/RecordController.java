package com.example.medrecords.controller;

import com.example.medrecords.model.Record;
import com.example.medrecords.repository.RecordRepository;
import com.example.medrecords.service.AuditService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/records")
@CrossOrigin(origins = "*")
public class RecordController {

    @Autowired
    private RecordRepository recordRepository;

    @Autowired
    private AuditService auditService;

    @PostMapping("/add")
    public ResponseEntity<Record> addRecord(@RequestBody Record record) {
        if (record.getUploadDate() == null || record.getUploadDate().isEmpty()) {
            record.setUploadDate(
                java.time.LocalDateTime.now()
                    .format(java.time.format.DateTimeFormatter.ISO_LOCAL_DATE_TIME)
            );
        }
        Record saved = recordRepository.save(record);
        auditService.logAccess(record.getPatientId(), "RECORD_CREATED", record.getFileName());
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/all")
    public List<Record> getAll() {
        return recordRepository.findAll();
    }

    @GetMapping("/patient/{patientId}")
    public List<Record> getByPatient(@PathVariable String patientId) {
        auditService.logAccess(patientId, "RECORDS_ACCESSED", "patient viewed records");
        return recordRepository.findByPatientId(patientId);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> delete(@PathVariable String id) {
        recordRepository.deleteById(id);
        return ResponseEntity.ok("Record deleted");
    }

    @GetMapping("/download/{recordId}")
    public ResponseEntity<?> downloadRecordFile(@PathVariable String recordId) {
        Record record = recordRepository.findById(recordId).orElse(null);
        if (record == null) {
            return ResponseEntity.status(404).body("Record not found");
        }
        return ResponseEntity.ok().body("{\"fileId\":\"" + record.getFileId() + "\"}");
    }
}
