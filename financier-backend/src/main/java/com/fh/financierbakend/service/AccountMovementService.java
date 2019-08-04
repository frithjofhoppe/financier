package com.fh.financierbakend.service;

import com.fh.financierbakend.dto.AccountMovementDto;

import java.util.List;

public interface AccountMovementService {
    List<AccountMovementDto> getAllMovements();
    void createMovement(AccountMovementDto movementDto);
    void updateMovement(AccountMovementDto movementDto);
    void deleteMovement(Long movementId);
}
