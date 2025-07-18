package com.handyman.service;

import com.handyman.dto.ClientDTO;
import com.handyman.entity.Client;
import com.handyman.repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class ClientService {
    
    @Autowired
    private ClientRepository clientRepository;
    
    public List<ClientDTO> getAllClients() {
        return clientRepository.findAllOrderByName()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public Optional<ClientDTO> getClientById(Long id) {
        return clientRepository.findById(id)
                .map(this::convertToDTO);
    }
    
    public List<ClientDTO> searchClientsByName(String name) {
        return clientRepository.findByNameContainingIgnoreCase(name)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public ClientDTO createClient(ClientDTO clientDTO) {
        Client client = convertToEntity(clientDTO);
        Client savedClient = clientRepository.save(client);
        return convertToDTO(savedClient);
    }
    
    public Optional<ClientDTO> updateClient(Long id, ClientDTO clientDTO) {
        return clientRepository.findById(id)
                .map(existingClient -> {
                    existingClient.setName(clientDTO.getName());
                    existingClient.setEmail(clientDTO.getEmail());
                    existingClient.setPhone(clientDTO.getPhone());
                    existingClient.setAddress(clientDTO.getAddress());
                    return convertToDTO(clientRepository.save(existingClient));
                });
    }
    
    public boolean deleteClient(Long id) {
        if (clientRepository.existsById(id)) {
            clientRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    private ClientDTO convertToDTO(Client client) {
        return new ClientDTO(
            client.getId(),
            client.getName(),
            client.getEmail(),
            client.getPhone(),
            client.getAddress()
        );
    }
    
    private Client convertToEntity(ClientDTO clientDTO) {
        Client client = new Client();
        client.setName(clientDTO.getName());
        client.setEmail(clientDTO.getEmail());
        client.setPhone(clientDTO.getPhone());
        client.setAddress(clientDTO.getAddress());
        return client;
    }
}