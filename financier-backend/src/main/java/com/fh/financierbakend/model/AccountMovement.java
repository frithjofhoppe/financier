package com.fh.financierbakend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Date;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class AccountMovement {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    Long id;
    @Column(name = "value")
    Long value;
    @Column(name = "valuata")
    Date valuata;
    @Column(name = "movement_direction")
    String movementDirection;
    @Column(name = "description")
    String description;
}
