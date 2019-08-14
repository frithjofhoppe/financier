package com.fh.financierbakend.service;

import com.fh.financierbakend.dto.AccountMovementDto;
import com.fh.financierbakend.exception.UnauthorizedOperationException;
import com.fh.financierbakend.model.AccountMovement;
import com.fh.financierbakend.model.Tag;
import com.fh.financierbakend.repository.AccountMovementRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DefaultAccountMovementService implements AccountMovementService {

    private final AccountMovementRepository movementRepository;
    private final CurrentUserService currentUserService;
    private final ModelMapper modelMapper;
    private final TagService tagService;

    @Autowired
    public DefaultAccountMovementService(AccountMovementRepository movementRepository, CurrentUserService currentUserService, ModelMapper modelMapper, TagService tagService) {
        this.movementRepository = movementRepository;
        this.currentUserService = currentUserService;
        this.modelMapper = modelMapper;
        this.tagService = tagService;
    }

    @Override
    public List<AccountMovementDto> getAllMovements() {
        return movementRepository.findAllByAppUser_UserId(this.currentUserService.getCurrentUser().getId())
                .stream()
                .map(model -> modelMapper.map(model, AccountMovementDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public void createMovement(AccountMovementDto movementDto) {
        // Preventing to modify existing entity
        movementDto.setId(null);
        AccountMovement map = modelMapper.map(movementDto, AccountMovement.class);
        map.setAppUser(currentUserService.getCurrentUserAsEntity());
        if (map.getTag() != null) {
            Tag repoTag = this.tagService.findTagForCurrentUser(map.getTag());
            map.setTag(repoTag);
        } else {
            map.setTag(null);
        }

        movementRepository.save(map);
    }

    @Override
    public void updateMovement(AccountMovementDto movementDto) {
        Optional<AccountMovement> entity = movementRepository.findById(movementDto.getId());
        if (entity.isPresent()) {
            AccountMovement accountMovement = entity.get();
            boolean isEntityOwnedByUser = isEntityOwnedByCurrentUser(accountMovement);
            if (!isEntityOwnedByUser) {
                throw new UnauthorizedOperationException("Update operation is not authorized");
            }
            AccountMovement mappedDto = modelMapper.map(movementDto, AccountMovement.class);
            accountMovement.updateWith(mappedDto);

            if (mappedDto.getTag() != null) {
                Tag repoTag = this.tagService.findTagForCurrentUser(mappedDto.getTag());
                accountMovement.setTag(repoTag);
            }

            movementRepository.save(accountMovement);
        }
    }

    @Override
    public void deleteMovement(Long movementId) {
        Optional<AccountMovement> entity = movementRepository.findById(movementId);
        if (entity.isPresent()) {
            AccountMovement accountMovement = entity.get();
            boolean isEntityOwnedByCurrentUser = isEntityOwnedByCurrentUser(accountMovement);
            if (!isEntityOwnedByCurrentUser) {
                throw new UnauthorizedOperationException("Delete operation is not authorized");
            }
            movementRepository.deleteById(movementId);
        }
    }

    private boolean isEntityOwnedByCurrentUser(AccountMovement accountMovement) {
        return accountMovement
                .getAppUser()
                .getUserId()
                .equals(currentUserService.getCurrentUser().getId());
    }
}
