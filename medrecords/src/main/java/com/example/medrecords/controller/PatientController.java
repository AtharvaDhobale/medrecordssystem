package com.example.medrecords.controller;

import com.example.medrecords.model.Patient;
import com.example.medrecords.repository.PatientRepository;
import com.example.medrecords.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/patients")
@CrossOrigin(origins = "*")
public class PatientController {

	@Autowired
	private PatientRepository patientRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private JwtUtil jwtUtil;

	private static boolean isBlank(String s) {
		return s == null || s.trim().isEmpty();
	}

	// Register
	@PostMapping("/register")
	public ResponseEntity<?> register(@RequestBody(required = false) Patient patient) {
		if (patient == null || isBlank(patient.getName()) || isBlank(patient.getEmail()) || isBlank(patient.getPassword())) {
			Map<String, String> error = new HashMap<>();
			error.put("message", "Invalid request: name, email and password are required");
			return ResponseEntity.badRequest().body(error);
		}

		// Check if patient already exists
		Patient existing = patientRepository.findByEmail(patient.getEmail());
		if (existing != null) {
			Map<String, String> error = new HashMap<>();
			error.put("message", "Patient with this email already exists");
			return ResponseEntity.badRequest().body(error);
		}

		// Encrypt password
		patient.setPassword(passwordEncoder.encode(patient.getPassword()));
		Patient saved = patientRepository.save(patient);
		
		// Generate JWT token
		String token = jwtUtil.generateToken(saved.getId(), saved.getEmail());
		
		Map<String, Object> response = new HashMap<>();
		response.put("patient", saved);
		response.put("token", token);
		
		return ResponseEntity.ok(response);
	}

	// Login
	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody(required = false) Patient p) {
		if (p == null || isBlank(p.getEmail()) || isBlank(p.getPassword())) {
			Map<String, String> error = new HashMap<>();
			error.put("message", "Invalid request: email and password are required");
			return ResponseEntity.badRequest().body(error);
		}

		Patient existing = patientRepository.findByEmail(p.getEmail());
		if (existing == null) {
			Map<String, String> error = new HashMap<>();
			error.put("message", "Invalid email or password");
			return ResponseEntity.badRequest().body(error);
		}

		// Verify password
		if (!passwordEncoder.matches(p.getPassword(), existing.getPassword())) {
			Map<String, String> error = new HashMap<>();
			error.put("message", "Invalid email or password");
			return ResponseEntity.badRequest().body(error);
		}

		// Generate JWT token
		String token = jwtUtil.generateToken(existing.getId(), existing.getEmail());
		
		Map<String, Object> response = new HashMap<>();
		response.put("patient", existing);
		response.put("token", token);
		
		return ResponseEntity.ok(response);
	}

}
