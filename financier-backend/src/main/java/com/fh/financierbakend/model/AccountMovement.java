package com.fh.financierbakend.model;

import lombok.*;

import javax.persistence.*;
import java.util.Date;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class AccountMovement {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    Long id;
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    AppUser appUser;
    @Column(name = "value")
    Long value;
    @Column(name = "valuata")
    Date valuata;
    @Column(name = "movement_direction")
    String movementDirection;
    @Column(name = "description")
    String description;

    public void updateWith(AccountMovement movement) {
        value = movement.getValue();
        valuata = movement.getValuata();
        movementDirection = movement.getMovementDirection();
        description = movement.getDescription();
    }
}
