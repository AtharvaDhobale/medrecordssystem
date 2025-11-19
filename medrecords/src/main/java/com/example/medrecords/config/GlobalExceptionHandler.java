package com.example.medrecords.config;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(HttpMessageNotReadableException.class)
	public ResponseEntity<Map<String, String>> handleNotReadable(HttpMessageNotReadableException ex) {
		Map<String, String> body = new HashMap<>();
		body.put("message", "Malformed JSON request");
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<Map<String, String>> handleValidation(MethodArgumentNotValidException ex) {
		Map<String, String> body = new HashMap<>();
		body.put("message", "Validation failed");
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
	}
}



