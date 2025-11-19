package com.example.medrecords.controller;

import com.mongodb.client.gridfs.GridFSBucket;
import com.mongodb.client.gridfs.model.GridFSFile;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.*;

@RestController
@RequestMapping("/files")
@CrossOrigin(origins = "*")
public class FileController {

    @Autowired
    private GridFsTemplate gridFsTemplate;

    @Autowired
    private GridFSBucket gridFSBucket;

    // Upload file -> returns fileId string
    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam(value = "file", required = false) MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body("No file provided. Please send a multipart/form-data request with a 'file' parameter.");
        }
        
        try {
            Document metadata = new Document();
            metadata.put("contentType", file.getContentType());
            ObjectId id = gridFsTemplate.store(file.getInputStream(), file.getOriginalFilename(), file.getContentType(), metadata);
            return ResponseEntity.ok(id.toHexString());
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error uploading file: " + e.getMessage());
        }
    }

    // Download by GridFS id
    @GetMapping("/download/{id}")
    public ResponseEntity<?> downloadFile(@PathVariable String id) {
        try {
            id = id.trim();
            ObjectId oid = new ObjectId(id);
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            gridFSBucket.downloadToStream(oid, out);

            GridFSFile file = gridFsTemplate.findOne(new Query(org.springframework.data.mongodb.core.query.Criteria.where("_id").is(oid)));
            String filename = (file != null) ? file.getFilename() : id;

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(out.toByteArray());
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body("Invalid file id");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    // List files (metadata)
    @GetMapping("/all")
    public ResponseEntity<List<Map<String,Object>>> listAll() {
        List<Map<String,Object>> list = new ArrayList<>();
        gridFsTemplate.find(new Query()).forEach((GridFSFile f) -> {
            Map<String,Object> m = new HashMap<>();
            m.put("id", f.getObjectId().toHexString());
            m.put("filename", f.getFilename());
            m.put("length", f.getLength());
            m.put("uploadDate", f.getUploadDate());
            if (f.getMetadata() != null && f.getMetadata().containsKey("contentType")) {
                m.put("contentType", f.getMetadata().getString("contentType"));
            }
            list.add(m);
        });
        return ResponseEntity.ok(list);
    }

    // Delete file by id
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteFile(@PathVariable String id) {
        try {
            gridFsTemplate.delete(new org.springframework.data.mongodb.core.query.Query(
                    org.springframework.data.mongodb.core.query.Criteria.where("_id").is(new ObjectId(id.trim()))
            ));
            return ResponseEntity.ok("File deleted");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid id or delete failed");
        }
    }
}
