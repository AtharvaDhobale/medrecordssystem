package com.example.medrecords.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Document(collection = "records")
public class Record {
    @Id
    private String id;
    private String patientId;   // link to patient._id
    private String doctorName;
    private String fileName;
    private String fileId;      // GridFS ID
    private String description;
    private String uploadDate;  // ISO string format

    public Record() {}

    public Record(String patientId, String doctorName, String fileName, String fileId) {
        this.patientId = patientId;
        this.doctorName = doctorName;
        this.fileName = fileName;
        this.fileId = fileId;
        this.uploadDate = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
    }

    public String getId() { return id; }
    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }
    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }
    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    public String getFileId() { return fileId; }
    public void setFileId(String fileId) { this.fileId = fileId; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getUploadDate() { return uploadDate; }
    public void setUploadDate(String uploadDate) { this.uploadDate = uploadDate; }
}

