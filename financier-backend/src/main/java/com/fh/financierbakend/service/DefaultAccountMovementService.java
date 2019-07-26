package com.fh.financierbakend.service;

import com.fh.financierbakend.dto.AccountMovementDto;
import com.fh.financierbakend.model.AccountMovement;
import com.fh.financierbakend.repository.AccountMovementRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DefaultAccountMovementService implements AccountMovementService {

    private final AccountMovementRepository movementRepository;
    private final ModelMapper modelMapper;

    @Autowired
    public DefaultAccountMovementService(AccountMovementRepository movementRepository, ModelMapper modelMapper) {
        this.movementRepository = movementRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public List<AccountMovementDto> getAllMovements() {
        return movementRepository.findAll()
                .stream()
                .map(model -> modelMapper.map(model, AccountMovementDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public void createMovement(AccountMovementDto movementDto) {
        movementRepository.save(modelMapper.map(movementDto, AccountMovement.class));
    }
}
