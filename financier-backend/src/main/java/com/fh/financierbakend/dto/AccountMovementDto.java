package com.fh.financierbakend.dto;

import com.fh.financierbakend.model.MovementDirection;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
public class AccountMovementDto {
    Long id;
    Long value;
    Date valuata;
    MovementDirection movementDirection;
}
