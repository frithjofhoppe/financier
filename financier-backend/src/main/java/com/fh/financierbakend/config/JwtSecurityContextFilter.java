package com.fh.financierbakend.config;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.context.SecurityContextImpl;
import org.springframework.security.oauth2.core.OAuth2AccessToken;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.oauth2.provider.OAuth2Request;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.filter.GenericFilterBean;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.List;

public class JwtSecurityContextFilter extends GenericFilterBean {

    private final JwtDecoder jwtDecoder;

    public JwtSecurityContextFilter(JwtDecoder jwtDecoder) {
        this.jwtDecoder = jwtDecoder;
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest httpServletRequest = (HttpServletRequest) servletRequest;
        String authentication = httpServletRequest.getHeader("Authorization").replaceFirst("Bearer\\s*", "");
        Jwt jwt = this.jwtDecoder.decode(authentication);

        List<SimpleGrantedAuthority> simpleGrantedAuthorities = List.of(new SimpleGrantedAuthority("ROLE_read:account_movement"));

        JwtAuthenticationToken jwtAuthenticationToken = new JwtAuthenticationToken(jwt,simpleGrantedAuthorities);

        OAuth2Authentication clientId = new OAuth2Authentication(new OAuth2Request(
                null,
                "clientId",
                simpleGrantedAuthorities,
                true,
                null,
                null,
                null,
                null,
                null

        ), jwtAuthenticationToken);

//        SecurityContextHolder.getContext().setAuthentication(clientId);
    }
}
