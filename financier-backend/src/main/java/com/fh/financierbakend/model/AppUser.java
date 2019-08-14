package com.fh.financierbakend.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Set;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table(name = "app_user")
public class AppUser {
    @Id
    @Column(name = "user_id")
    @GeneratedValue(strategy = GenerationType.AUTO)
    Long userId;
    @Column(name = "auth0_id")
    String auth0Id;
    @OneToMany(mappedBy = "appUser")
    Set<AccountMovement> accountMovements;
    @OneToMany(mappedBy = "appUser")
    Set<Tag> tags;

    public AppUser(String auth0Id) {
        this.auth0Id = auth0Id;
    }
}
