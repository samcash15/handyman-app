package com.handyman.controller;

import com.handyman.dto.ProjectDTO;
import com.handyman.entity.Project.ProjectStatus;
import com.handyman.service.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*")
@Tag(name = "Project Management", description = "Operations for managing projects")
public class ProjectController {
    
    @Autowired
    private ProjectService projectService;
    
    @GetMapping
    @Operation(summary = "Get all projects", description = "Retrieve a list of all projects sorted by creation date")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved projects")
    public ResponseEntity<List<ProjectDTO>> getAllProjects() {
        List<ProjectDTO> projects = projectService.getAllProjects();
        return ResponseEntity.ok(projects);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ProjectDTO> getProjectById(@PathVariable Long id) {
        Optional<ProjectDTO> project = projectService.getProjectById(id);
        return project.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<ProjectDTO>> getProjectsByClientId(@PathVariable Long clientId) {
        List<ProjectDTO> projects = projectService.getProjectsByClientId(clientId);
        return ResponseEntity.ok(projects);
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<ProjectDTO>> getProjectsByStatus(@PathVariable ProjectStatus status) {
        List<ProjectDTO> projects = projectService.getProjectsByStatus(status);
        return ResponseEntity.ok(projects);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<ProjectDTO>> searchProjects(@RequestParam String name) {
        List<ProjectDTO> projects = projectService.searchProjectsByName(name);
        return ResponseEntity.ok(projects);
    }
    
    @PostMapping
    public ResponseEntity<ProjectDTO> createProject(@Valid @RequestBody ProjectDTO projectDTO) {
        try {
            ProjectDTO createdProject = projectService.createProject(projectDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdProject);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ProjectDTO> updateProject(@PathVariable Long id, @Valid @RequestBody ProjectDTO projectDTO) {
        try {
            Optional<ProjectDTO> updatedProject = projectService.updateProject(id, projectDTO);
            return updatedProject.map(ResponseEntity::ok)
                               .orElse(ResponseEntity.notFound().build());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        boolean deleted = projectService.deleteProject(id);
        return deleted ? ResponseEntity.noContent().build() 
                       : ResponseEntity.notFound().build();
    }
}