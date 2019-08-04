package com.fh.financierbakend.repository;

import com.fh.financierbakend.model.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AppUserRepository extends JpaRepository<AppUser, Long> {
    AppUser findByAuth0Id(String auth0Id);
}
