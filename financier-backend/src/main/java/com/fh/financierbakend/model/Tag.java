package com.fh.financierbakend.model;

import lombok.*;

import javax.persistence.*;
import java.util.Set;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Table(name = "tag")
public class Tag {
    @Id
    @Column(name = "tag_id")
    @GeneratedValue(strategy = GenerationType.AUTO)
    Long id;
    @Column(name = "identifier")
    String identifier;
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    AppUser appUser;
    @OneToMany(mappedBy = "tag")
    Set<AccountMovement> accountMovements;

    public Tag(Long id, String identifier) {
        this.id = id;
        this.identifier = identifier;
    }
}
