package com.handyman.dto;

import com.handyman.entity.Appointment.AppointmentStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.time.LocalTime;

public class AppointmentDTO {
    private Long id;
    
    @NotNull(message = "Appointment date is required")
    private LocalDate appointmentDate;
    
    @NotNull(message = "Start time is required")
    private LocalTime startTime;
    
    @NotNull(message = "End time is required")
    private LocalTime endTime;
    
    @Size(max = 500, message = "Notes cannot exceed 500 characters")
    private String notes;
    
    @Size(max = 500, message = "Location cannot exceed 500 characters")
    private String location;
    
    private AppointmentStatus status;
    
    @NotNull(message = "Client ID is required")
    private Long clientId;
    
    private String clientName;
    
    private Long projectId;
    
    private String projectName;
    
    public AppointmentDTO() {}
    
    public AppointmentDTO(Long id, LocalDate appointmentDate, LocalTime startTime, LocalTime endTime,
                         String notes, String location, AppointmentStatus status,
                         Long clientId, String clientName, Long projectId, String projectName) {
        this.id = id;
        this.appointmentDate = appointmentDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.notes = notes;
        this.location = location;
        this.status = status;
        this.clientId = clientId;
        this.clientName = clientName;
        this.projectId = projectId;
        this.projectName = projectName;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public LocalDate getAppointmentDate() { return appointmentDate; }
    public void setAppointmentDate(LocalDate appointmentDate) { this.appointmentDate = appointmentDate; }
    
    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }
    
    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    
    public AppointmentStatus getStatus() { return status; }
    public void setStatus(AppointmentStatus status) { this.status = status; }
    
    public Long getClientId() { return clientId; }
    public void setClientId(Long clientId) { this.clientId = clientId; }
    
    public String getClientName() { return clientName; }
    public void setClientName(String clientName) { this.clientName = clientName; }
    
    public Long getProjectId() { return projectId; }
    public void setProjectId(Long projectId) { this.projectId = projectId; }
    
    public String getProjectName() { return projectName; }
    public void setProjectName(String projectName) { this.projectName = projectName; }
}