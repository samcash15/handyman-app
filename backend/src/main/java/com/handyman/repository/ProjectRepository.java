package com.handyman.repository;

import com.handyman.entity.Project;
import com.handyman.entity.Project.ProjectStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    
    @Query("SELECT p FROM Project p WHERE p.client.id = :clientId ORDER BY p.createdAt DESC")
    List<Project> findByClientIdOrderByCreatedAtDesc(@Param("clientId") Long clientId);
    
    @Query("SELECT p FROM Project p WHERE p.status = :status ORDER BY p.createdAt DESC")
    List<Project> findByStatusOrderByCreatedAtDesc(@Param("status") ProjectStatus status);
    
    @Query("SELECT p FROM Project p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%')) ORDER BY p.createdAt DESC")
    List<Project> findByNameContainingIgnoreCaseOrderByCreatedAtDesc(@Param("name") String name);
    
    @Query("SELECT p FROM Project p ORDER BY p.createdAt DESC")
    List<Project> findAllOrderByCreatedAtDesc();
}