package com.handyman.repository;

import com.handyman.entity.Appointment;
import com.handyman.entity.Appointment.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    
    @Query("SELECT a FROM Appointment a WHERE a.appointmentDate = :date ORDER BY a.startTime ASC")
    List<Appointment> findByAppointmentDateOrderByStartTime(@Param("date") LocalDate date);
    
    @Query("SELECT a FROM Appointment a WHERE a.appointmentDate BETWEEN :startDate AND :endDate ORDER BY a.appointmentDate ASC, a.startTime ASC")
    List<Appointment> findByAppointmentDateBetweenOrderByAppointmentDateAscStartTimeAsc(
        @Param("startDate") LocalDate startDate, 
        @Param("endDate") LocalDate endDate);
    
    @Query("SELECT a FROM Appointment a WHERE a.client.id = :clientId ORDER BY a.appointmentDate DESC, a.startTime ASC")
    List<Appointment> findByClientIdOrderByAppointmentDateDescStartTimeAsc(@Param("clientId") Long clientId);
    
    @Query("SELECT a FROM Appointment a WHERE a.project.id = :projectId ORDER BY a.appointmentDate DESC, a.startTime ASC")
    List<Appointment> findByProjectIdOrderByAppointmentDateDescStartTimeAsc(@Param("projectId") Long projectId);
    
    @Query("SELECT a FROM Appointment a WHERE a.status = :status ORDER BY a.appointmentDate ASC, a.startTime ASC")
    List<Appointment> findByStatusOrderByAppointmentDateAscStartTimeAsc(@Param("status") AppointmentStatus status);
    
    @Query("SELECT a FROM Appointment a WHERE a.appointmentDate = :date AND a.status IN ('SCHEDULED', 'IN_PROGRESS') ORDER BY a.startTime ASC")
    List<Appointment> findTodaysActiveAppointments(@Param("date") LocalDate date);
    
    @Query("SELECT a FROM Appointment a WHERE a.appointmentDate >= :date ORDER BY a.appointmentDate ASC, a.startTime ASC")
    List<Appointment> findUpcomingAppointments(@Param("date") LocalDate date);
}