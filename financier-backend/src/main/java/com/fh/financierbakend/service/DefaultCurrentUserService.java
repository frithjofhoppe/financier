package com.fh.financierbakend.service;

import com.fh.financierbakend.dto.AppUserDto;
import com.fh.financierbakend.model.AppUser;
import com.fh.financierbakend.repository.AppUserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class DefaultCurrentUserService implements CurrentUserService {

    private final AppUserRepository userRepository;

    public DefaultCurrentUserService(AppUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public AppUserDto getCurrentUser() {
        try {
            Map<String, Object> claims = ((Jwt) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getClaims();
            String auth0Id = (String) claims.get("sub");
            return new AppUserDto(
                    getRepositoryUser(auth0Id).getUserId(),
                    auth0Id,
                    (String) claims.get("email"),
                    (String) claims.get("name"),
                    (String) claims.get("picture")
            );
        } catch (NullPointerException e) {
            return new AppUserDto();
        }
    }

    @Override
    public AppUser getCurrentUserAsEntity() {
        AppUserDto currentUser = this.getCurrentUser();
        return getRepositoryUser(currentUser.getAuth0Id());
    }

    private AppUser getRepositoryUser(String auth0Id) {
        AppUser byAuth0Id = this.userRepository.findByAuth0Id(auth0Id);
        if (byAuth0Id == null) {
            this.userRepository.save(new AppUser(auth0Id));
            return this.userRepository.findByAuth0Id(auth0Id);
        } else {
            return byAuth0Id;
        }
    }
}
