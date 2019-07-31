package com.fh.financierbakend.config;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.stream.Collectors;

public class JwtGrantedAuthorityExtractor extends JwtAuthenticationConverter {

    private final String namespace = "https://frithjofhome.synology.me";

    @Override
    protected Collection<GrantedAuthority> extractAuthorities(Jwt jwt) {
        Collection<String> permissions = (Collection<String>) jwt.getClaims().get(namespace + "permissions");
        return permissions
                .stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
    }
}
