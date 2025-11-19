package com.example.medrecords.service;

import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class AuditService {
    
    public void logAccess(String patientId, String action, String details) {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        System.out.println(String.format("[AUDIT] %s - Patient: %s, Action: %s, Details: %s", 
            timestamp, patientId, action, details));
        
        // In production, log to a secure audit database or file
        // This ensures compliance with HIPAA and medical data regulations
    }
    
    public void logSecurityEvent(String event, String details) {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        System.out.println(String.format("[SECURITY] %s - Event: %s, Details: %s", 
            timestamp, event, details));
    }
}
