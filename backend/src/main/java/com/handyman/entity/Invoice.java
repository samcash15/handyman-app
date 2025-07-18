package com.handyman.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "invoices")
public class Invoice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Invoice number is required")
    @Size(max = 50, message = "Invoice number cannot exceed 50 characters")
    @Column(name = "invoice_number", nullable = false, unique = true)
    private String invoiceNumber;
    
    @NotNull(message = "Invoice date is required")
    @Column(name = "invoice_date", nullable = false)
    private LocalDate invoiceDate;
    
    @Column(name = "due_date")
    private LocalDate dueDate;
    
    @Positive(message = "Labor hours must be positive")
    @Column(name = "labor_hours", precision = 5, scale = 2)
    private BigDecimal laborHours;
    
    @Positive(message = "Labor rate must be positive")
    @Column(name = "labor_rate", precision = 10, scale = 2)
    private BigDecimal laborRate;
    
    @Column(name = "labor_cost", precision = 10, scale = 2)
    private BigDecimal laborCost;
    
    @Column(name = "materials_cost", precision = 10, scale = 2)
    private BigDecimal materialsCost;
    
    @Column(name = "total_cost", precision = 10, scale = 2)
    private BigDecimal totalCost;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InvoiceStatus status = InvoiceStatus.DRAFT;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        calculateTotalCost();
    }
    
    @PreUpdate
    protected void onUpdate() {
        calculateTotalCost();
    }
    
    private void calculateTotalCost() {
        BigDecimal labor = (laborHours != null && laborRate != null) ? 
            laborHours.multiply(laborRate) : BigDecimal.ZERO;
        BigDecimal materials = (materialsCost != null) ? materialsCost : BigDecimal.ZERO;
        
        laborCost = labor;
        totalCost = labor.add(materials);
    }
    
    public Invoice() {}
    
    public Invoice(String invoiceNumber, LocalDate invoiceDate, Project project, Client client) {
        this.invoiceNumber = invoiceNumber;
        this.invoiceDate = invoiceDate;
        this.project = project;
        this.client = client;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getInvoiceNumber() { return invoiceNumber; }
    public void setInvoiceNumber(String invoiceNumber) { this.invoiceNumber = invoiceNumber; }
    
    public LocalDate getInvoiceDate() { return invoiceDate; }
    public void setInvoiceDate(LocalDate invoiceDate) { this.invoiceDate = invoiceDate; }
    
    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
    
    public BigDecimal getLaborHours() { return laborHours; }
    public void setLaborHours(BigDecimal laborHours) { 
        this.laborHours = laborHours;
        calculateTotalCost();
    }
    
    public BigDecimal getLaborRate() { return laborRate; }
    public void setLaborRate(BigDecimal laborRate) { 
        this.laborRate = laborRate;
        calculateTotalCost();
    }
    
    public BigDecimal getLaborCost() { return laborCost; }
    public void setLaborCost(BigDecimal laborCost) { this.laborCost = laborCost; }
    
    public BigDecimal getMaterialsCost() { return materialsCost; }
    public void setMaterialsCost(BigDecimal materialsCost) { 
        this.materialsCost = materialsCost;
        calculateTotalCost();
    }
    
    public BigDecimal getTotalCost() { return totalCost; }
    public void setTotalCost(BigDecimal totalCost) { this.totalCost = totalCost; }
    
    public InvoiceStatus getStatus() { return status; }
    public void setStatus(InvoiceStatus status) { this.status = status; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }
    
    public Client getClient() { return client; }
    public void setClient(Client client) { this.client = client; }
    
    public enum InvoiceStatus {
        DRAFT, SENT, PAID, OVERDUE, CANCELLED
    }
}