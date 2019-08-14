package com.fh.financierbakend.model;

import lombok.*;

import javax.persistence.*;
import java.math.BigDecimal;
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
    BigDecimal value;
    @Column(name = "valuata")
    Date valuata;
    @Column(name = "description")
    String description;
    @ManyToOne
    @JoinColumn(name = "tag_id", nullable = true)
    Tag tag;

    public void updateWith(AccountMovement movement) {
        value = movement.getValue();
        valuata = movement.getValuata();
        description = movement.getDescription();
    }
}
