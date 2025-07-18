package com.handyman.service;

import com.handyman.dto.AppointmentDTO;
import com.handyman.entity.Appointment;
import com.handyman.entity.Appointment.AppointmentStatus;
import com.handyman.entity.Client;
import com.handyman.entity.Project;
import com.handyman.repository.AppointmentRepository;
import com.handyman.repository.ClientRepository;
import com.handyman.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class AppointmentService {
    
    @Autowired
    private AppointmentRepository appointmentRepository;
    
    @Autowired
    private ClientRepository clientRepository;
    
    @Autowired
    private ProjectRepository projectRepository;
    
    public List<AppointmentDTO> getAllAppointments() {
        return appointmentRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public Optional<AppointmentDTO> getAppointmentById(Long id) {
        return appointmentRepository.findById(id)
                .map(this::convertToDTO);
    }
    
    public List<AppointmentDTO> getAppointmentsByDate(LocalDate date) {
        return appointmentRepository.findByAppointmentDateOrderByStartTime(date)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<AppointmentDTO> getAppointmentsByDateRange(LocalDate startDate, LocalDate endDate) {
        return appointmentRepository.findByAppointmentDateBetweenOrderByAppointmentDateAscStartTimeAsc(startDate, endDate)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<AppointmentDTO> getTodaysAppointments() {
        return getAppointmentsByDate(LocalDate.now());
    }
    
    public List<AppointmentDTO> getTodaysActiveAppointments() {
        return appointmentRepository.findTodaysActiveAppointments(LocalDate.now())
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<AppointmentDTO> getUpcomingAppointments() {
        return appointmentRepository.findUpcomingAppointments(LocalDate.now())
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<AppointmentDTO> getAppointmentsByClientId(Long clientId) {
        return appointmentRepository.findByClientIdOrderByAppointmentDateDescStartTimeAsc(clientId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<AppointmentDTO> getAppointmentsByProjectId(Long projectId) {
        return appointmentRepository.findByProjectIdOrderByAppointmentDateDescStartTimeAsc(projectId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public AppointmentDTO createAppointment(AppointmentDTO appointmentDTO) {
        Client client = clientRepository.findById(appointmentDTO.getClientId())
                .orElseThrow(() -> new RuntimeException("Client not found"));
        
        Project project = null;
        if (appointmentDTO.getProjectId() != null) {
            project = projectRepository.findById(appointmentDTO.getProjectId())
                    .orElseThrow(() -> new RuntimeException("Project not found"));
        }
        
        Appointment appointment = convertToEntity(appointmentDTO);
        appointment.setClient(client);
        appointment.setProject(project);
        
        Appointment savedAppointment = appointmentRepository.save(appointment);
        return convertToDTO(savedAppointment);
    }
    
    public Optional<AppointmentDTO> updateAppointment(Long id, AppointmentDTO appointmentDTO) {
        return appointmentRepository.findById(id)
                .map(existingAppointment -> {
                    existingAppointment.setAppointmentDate(appointmentDTO.getAppointmentDate());
                    existingAppointment.setStartTime(appointmentDTO.getStartTime());
                    existingAppointment.setEndTime(appointmentDTO.getEndTime());
                    existingAppointment.setNotes(appointmentDTO.getNotes());
                    existingAppointment.setLocation(appointmentDTO.getLocation());
                    existingAppointment.setStatus(appointmentDTO.getStatus());
                    
                    if (appointmentDTO.getClientId() != null && 
                        !appointmentDTO.getClientId().equals(existingAppointment.getClient().getId())) {
                        Client client = clientRepository.findById(appointmentDTO.getClientId())
                                .orElseThrow(() -> new RuntimeException("Client not found"));
                        existingAppointment.setClient(client);
                    }
                    
                    if (appointmentDTO.getProjectId() != null) {
                        if (existingAppointment.getProject() == null || 
                            !appointmentDTO.getProjectId().equals(existingAppointment.getProject().getId())) {
                            Project project = projectRepository.findById(appointmentDTO.getProjectId())
                                    .orElseThrow(() -> new RuntimeException("Project not found"));
                            existingAppointment.setProject(project);
                        }
                    } else {
                        existingAppointment.setProject(null);
                    }
                    
                    return convertToDTO(appointmentRepository.save(existingAppointment));
                });
    }
    
    public boolean deleteAppointment(Long id) {
        if (appointmentRepository.existsById(id)) {
            appointmentRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    private AppointmentDTO convertToDTO(Appointment appointment) {
        return new AppointmentDTO(
            appointment.getId(),
            appointment.getAppointmentDate(),
            appointment.getStartTime(),
            appointment.getEndTime(),
            appointment.getNotes(),
            appointment.getLocation(),
            appointment.getStatus(),
            appointment.getClient().getId(),
            appointment.getClient().getName(),
            appointment.getProject() != null ? appointment.getProject().getId() : null,
            appointment.getProject() != null ? appointment.getProject().getName() : null
        );
    }
    
    private Appointment convertToEntity(AppointmentDTO appointmentDTO) {
        Appointment appointment = new Appointment();
        appointment.setAppointmentDate(appointmentDTO.getAppointmentDate());
        appointment.setStartTime(appointmentDTO.getStartTime());
        appointment.setEndTime(appointmentDTO.getEndTime());
        appointment.setNotes(appointmentDTO.getNotes());
        appointment.setLocation(appointmentDTO.getLocation());
        appointment.setStatus(appointmentDTO.getStatus() != null ? appointmentDTO.getStatus() : AppointmentStatus.SCHEDULED);
        return appointment;
    }
}