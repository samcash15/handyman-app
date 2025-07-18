package com.handyman.controller;

import com.handyman.dto.AppointmentDTO;
import com.handyman.service.AppointmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "*")
@Tag(name = "Schedule Management", description = "Operations for managing appointments and schedules")
public class AppointmentController {
    
    @Autowired
    private AppointmentService appointmentService;
    
    @GetMapping
    @Operation(summary = "Get all appointments", description = "Retrieve a list of all appointments")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved appointments")
    public ResponseEntity<List<AppointmentDTO>> getAllAppointments() {
        List<AppointmentDTO> appointments = appointmentService.getAllAppointments();
        return ResponseEntity.ok(appointments);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get appointment by ID", description = "Retrieve a specific appointment by its ID")
    public ResponseEntity<AppointmentDTO> getAppointmentById(@PathVariable Long id) {
        Optional<AppointmentDTO> appointment = appointmentService.getAppointmentById(id);
        return appointment.map(ResponseEntity::ok)
                         .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/date/{date}")
    @Operation(summary = "Get appointments by date", description = "Retrieve all appointments for a specific date")
    public ResponseEntity<List<AppointmentDTO>> getAppointmentsByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<AppointmentDTO> appointments = appointmentService.getAppointmentsByDate(date);
        return ResponseEntity.ok(appointments);
    }
    
    @GetMapping("/today")
    @Operation(summary = "Get today's appointments", description = "Retrieve all appointments for today")
    public ResponseEntity<List<AppointmentDTO>> getTodaysAppointments() {
        List<AppointmentDTO> appointments = appointmentService.getTodaysAppointments();
        return ResponseEntity.ok(appointments);
    }
    
    @GetMapping("/today/active")
    @Operation(summary = "Get today's active appointments", description = "Retrieve today's scheduled and in-progress appointments")
    public ResponseEntity<List<AppointmentDTO>> getTodaysActiveAppointments() {
        List<AppointmentDTO> appointments = appointmentService.getTodaysActiveAppointments();
        return ResponseEntity.ok(appointments);
    }
    
    @GetMapping("/upcoming")
    @Operation(summary = "Get upcoming appointments", description = "Retrieve all upcoming appointments from today onwards")
    public ResponseEntity<List<AppointmentDTO>> getUpcomingAppointments() {
        List<AppointmentDTO> appointments = appointmentService.getUpcomingAppointments();
        return ResponseEntity.ok(appointments);
    }
    
    @GetMapping("/range")
    @Operation(summary = "Get appointments by date range", description = "Retrieve appointments within a date range")
    public ResponseEntity<List<AppointmentDTO>> getAppointmentsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<AppointmentDTO> appointments = appointmentService.getAppointmentsByDateRange(startDate, endDate);
        return ResponseEntity.ok(appointments);
    }
    
    @GetMapping("/client/{clientId}")
    @Operation(summary = "Get appointments by client", description = "Retrieve all appointments for a specific client")
    public ResponseEntity<List<AppointmentDTO>> getAppointmentsByClientId(@PathVariable Long clientId) {
        List<AppointmentDTO> appointments = appointmentService.getAppointmentsByClientId(clientId);
        return ResponseEntity.ok(appointments);
    }
    
    @GetMapping("/project/{projectId}")
    @Operation(summary = "Get appointments by project", description = "Retrieve all appointments for a specific project")
    public ResponseEntity<List<AppointmentDTO>> getAppointmentsByProjectId(@PathVariable Long projectId) {
        List<AppointmentDTO> appointments = appointmentService.getAppointmentsByProjectId(projectId);
        return ResponseEntity.ok(appointments);
    }
    
    @PostMapping
    @Operation(summary = "Create a new appointment", description = "Schedule a new appointment")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Appointment created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid appointment data")
    })
    public ResponseEntity<AppointmentDTO> createAppointment(@Valid @RequestBody AppointmentDTO appointmentDTO) {
        try {
            AppointmentDTO createdAppointment = appointmentService.createAppointment(appointmentDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdAppointment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Update an appointment", description = "Update an existing appointment")
    public ResponseEntity<AppointmentDTO> updateAppointment(@PathVariable Long id, @Valid @RequestBody AppointmentDTO appointmentDTO) {
        try {
            Optional<AppointmentDTO> updatedAppointment = appointmentService.updateAppointment(id, appointmentDTO);
            return updatedAppointment.map(ResponseEntity::ok)
                                   .orElse(ResponseEntity.notFound().build());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an appointment", description = "Cancel/delete an appointment")
    public ResponseEntity<Void> deleteAppointment(@PathVariable Long id) {
        boolean deleted = appointmentService.deleteAppointment(id);
        return deleted ? ResponseEntity.noContent().build() 
                       : ResponseEntity.notFound().build();
    }
}