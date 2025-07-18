package com.handyman.service;

import com.handyman.dto.ProjectDTO;
import com.handyman.entity.Client;
import com.handyman.entity.Project;
import com.handyman.entity.Project.ProjectStatus;
import com.handyman.repository.ClientRepository;
import com.handyman.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProjectService {
    
    @Autowired
    private ProjectRepository projectRepository;
    
    @Autowired
    private ClientRepository clientRepository;
    
    public List<ProjectDTO> getAllProjects() {
        return projectRepository.findAllOrderByCreatedAtDesc()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public Optional<ProjectDTO> getProjectById(Long id) {
        return projectRepository.findById(id)
                .map(this::convertToDTO);
    }
    
    public List<ProjectDTO> getProjectsByClientId(Long clientId) {
        return projectRepository.findByClientIdOrderByCreatedAtDesc(clientId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<ProjectDTO> getProjectsByStatus(ProjectStatus status) {
        return projectRepository.findByStatusOrderByCreatedAtDesc(status)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<ProjectDTO> searchProjectsByName(String name) {
        return projectRepository.findByNameContainingIgnoreCaseOrderByCreatedAtDesc(name)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public ProjectDTO createProject(ProjectDTO projectDTO) {
        Client client = clientRepository.findById(projectDTO.getClientId())
                .orElseThrow(() -> new RuntimeException("Client not found"));
        
        Project project = convertToEntity(projectDTO);
        project.setClient(client);
        
        Project savedProject = projectRepository.save(project);
        return convertToDTO(savedProject);
    }
    
    public Optional<ProjectDTO> updateProject(Long id, ProjectDTO projectDTO) {
        return projectRepository.findById(id)
                .map(existingProject -> {
                    existingProject.setName(projectDTO.getName());
                    existingProject.setDescription(projectDTO.getDescription());
                    existingProject.setStatus(projectDTO.getStatus());
                    existingProject.setStartDate(projectDTO.getStartDate());
                    existingProject.setEndDate(projectDTO.getEndDate());
                    existingProject.setHourlyRate(projectDTO.getHourlyRate());
                    
                    if (projectDTO.getClientId() != null && 
                        !projectDTO.getClientId().equals(existingProject.getClient().getId())) {
                        Client client = clientRepository.findById(projectDTO.getClientId())
                                .orElseThrow(() -> new RuntimeException("Client not found"));
                        existingProject.setClient(client);
                    }
                    
                    return convertToDTO(projectRepository.save(existingProject));
                });
    }
    
    public boolean deleteProject(Long id) {
        if (projectRepository.existsById(id)) {
            projectRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    private ProjectDTO convertToDTO(Project project) {
        return new ProjectDTO(
            project.getId(),
            project.getName(),
            project.getDescription(),
            project.getStatus(),
            project.getStartDate(),
            project.getEndDate(),
            project.getHourlyRate(),
            project.getClient().getId(),
            project.getClient().getName()
        );
    }
    
    private Project convertToEntity(ProjectDTO projectDTO) {
        Project project = new Project();
        project.setName(projectDTO.getName());
        project.setDescription(projectDTO.getDescription());
        project.setStatus(projectDTO.getStatus() != null ? projectDTO.getStatus() : ProjectStatus.PENDING);
        project.setStartDate(projectDTO.getStartDate());
        project.setEndDate(projectDTO.getEndDate());
        project.setHourlyRate(projectDTO.getHourlyRate());
        return project;
    }
}