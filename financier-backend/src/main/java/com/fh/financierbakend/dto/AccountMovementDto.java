package com.fh.financierbakend.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fh.financierbakend.model.MovementDirection;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class AccountMovementDto {
    Long id;
    String value;
//    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mmZ")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    Date valuata;
    String description;
    MovementDirection movementDirection;
}
