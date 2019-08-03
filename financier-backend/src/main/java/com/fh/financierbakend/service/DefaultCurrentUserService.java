package com.fh.financierbakend.service;

import com.fh.financierbakend.dto.UserDto;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class DefaultCurrentUserService implements CurrentUserService {
    @Override
    public UserDto getCurrentUser() {
        try {

            Map<String, Object> claims = ((Jwt) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getClaims();
            return new UserDto(
                    (String) claims.get("sub"),
                    (String) claims.get("email"),
                    (String) claims.get("name"),
                    (String) claims.get("picture")
            );
        } catch (NullPointerException e) {
            return new UserDto();
        }
    }
}
