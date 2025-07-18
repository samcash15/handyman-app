package com.handyman.repository;

import com.handyman.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
    
    @Query("SELECT c FROM Client c WHERE LOWER(c.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Client> findByNameContainingIgnoreCase(@Param("name") String name);
    
    @Query("SELECT c FROM Client c WHERE LOWER(c.email) = LOWER(:email)")
    Client findByEmailIgnoreCase(@Param("email") String email);
    
    @Query("SELECT c FROM Client c WHERE c.phone = :phone")
    Client findByPhone(@Param("phone") String phone);
    
    @Query("SELECT c FROM Client c ORDER BY c.name ASC")
    List<Client> findAllOrderByName();
}