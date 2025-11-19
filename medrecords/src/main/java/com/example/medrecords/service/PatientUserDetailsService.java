package com.example.medrecords.service;

import com.example.medrecords.model.Patient;
import com.example.medrecords.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class PatientUserDetailsService implements UserDetailsService {

    @Autowired
    private PatientRepository patientRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Patient patient = patientRepository.findByEmail(email);
        if (patient == null) {
            throw new UsernameNotFoundException("Patient not found with email: " + email);
        }
        return patient;
    }
}
