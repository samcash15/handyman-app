package com.handyman.dto;

import com.handyman.entity.Project.ProjectStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public class ProjectDTO {
    private Long id;
    
    @NotBlank(message = "Project name is required")
    @Size(max = 200, message = "Project name cannot exceed 200 characters")
    private String name;
    
    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String description;
    
    private ProjectStatus status;
    
    private LocalDate startDate;
    private LocalDate endDate;
    
    private BigDecimal hourlyRate;
    
    @NotNull(message = "Client ID is required")
    private Long clientId;
    
    private String clientName;
    
    public ProjectDTO() {}
    
    public ProjectDTO(Long id, String name, String description, ProjectStatus status, 
                     LocalDate startDate, LocalDate endDate, BigDecimal hourlyRate, 
                     Long clientId, String clientName) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.status = status;
        this.startDate = startDate;
        this.endDate = endDate;
        this.hourlyRate = hourlyRate;
        this.clientId = clientId;
        this.clientName = clientName;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public ProjectStatus getStatus() { return status; }
    public void setStatus(ProjectStatus status) { this.status = status; }
    
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    
    public BigDecimal getHourlyRate() { return hourlyRate; }
    public void setHourlyRate(BigDecimal hourlyRate) { this.hourlyRate = hourlyRate; }
    
    public Long getClientId() { return clientId; }
    public void setClientId(Long clientId) { this.clientId = clientId; }
    
    public String getClientName() { return clientName; }
    public void setClientName(String clientName) { this.clientName = clientName; }
}