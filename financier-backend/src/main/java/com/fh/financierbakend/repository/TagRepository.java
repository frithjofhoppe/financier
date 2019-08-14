package com.fh.financierbakend.repository;

import com.fh.financierbakend.model.AppUser;
import com.fh.financierbakend.model.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {
    Optional<Tag> findByAppUser_UserIdAndIdentifier(Long userId, String identifier);
    List<Tag> findAllByAppUser_UserId(Long userId);
}
