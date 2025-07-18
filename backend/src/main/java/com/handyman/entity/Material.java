package com.handyman.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "materials")
public class Material {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Material name is required")
    @Size(max = 200, message = "Material name cannot exceed 200 characters")
    @Column(nullable = false)
    private String name;
    
    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be positive")
    @Column(nullable = false)
    private Integer quantity;
    
    @NotNull(message = "Unit cost is required")
    @Positive(message = "Unit cost must be positive")
    @Column(name = "unit_cost", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitCost;
    
    @Column(name = "total_cost", precision = 10, scale = 2)
    private BigDecimal totalCost;
    
    @Size(max = 200, message = "Supplier cannot exceed 200 characters")
    private String supplier;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;
    
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
        if (quantity != null && unitCost != null) {
            totalCost = unitCost.multiply(new BigDecimal(quantity));
        }
    }
    
    public Material() {}
    
    public Material(String name, Integer quantity, BigDecimal unitCost, Project project) {
        this.name = name;
        this.quantity = quantity;
        this.unitCost = unitCost;
        this.project = project;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { 
        this.quantity = quantity;
        calculateTotalCost();
    }
    
    public BigDecimal getUnitCost() { return unitCost; }
    public void setUnitCost(BigDecimal unitCost) { 
        this.unitCost = unitCost;
        calculateTotalCost();
    }
    
    public BigDecimal getTotalCost() { return totalCost; }
    public void setTotalCost(BigDecimal totalCost) { this.totalCost = totalCost; }
    
    public String getSupplier() { return supplier; }
    public void setSupplier(String supplier) { this.supplier = supplier; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }
}