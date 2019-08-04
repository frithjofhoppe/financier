package com.fh.financierbakend.controller;

import com.fh.financierbakend.dto.AccountMovementDto;
import com.fh.financierbakend.service.AccountMovementService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accountmovement")
public class AccountMovementController {

    private final AccountMovementService movementService;

    public AccountMovementController(AccountMovementService movementService) {
        this.movementService = movementService;
    }

    @PostMapping
    public void create(@RequestBody AccountMovementDto movementDto) {
        movementService.createMovement(movementDto);
    }

    @PutMapping
    public void update(@RequestBody AccountMovementDto movementDto){
        movementService.updateMovement(movementDto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id){
        movementService.deleteMovement(Long.parseLong(id));
    }

    @GetMapping
    public List<AccountMovementDto> getAllMovements() {
        return movementService.getAllMovements();
    }
}
