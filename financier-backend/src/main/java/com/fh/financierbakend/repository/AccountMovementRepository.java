package com.fh.financierbakend.repository;

import com.fh.financierbakend.model.AccountMovement;
import com.fh.financierbakend.model.MovementDirection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AccountMovementRepository extends JpaRepository<AccountMovement, Long> {
}
