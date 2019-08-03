package com.fh.financierbakend.controller;

import com.fh.financierbakend.dto.UserDto;
import com.fh.financierbakend.service.CurrentUserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
public class CurrentUserController {

    private final CurrentUserService currentUserService;

    public CurrentUserController(CurrentUserService currentUserService) {
        this.currentUserService = currentUserService;
    }

    @GetMapping
    UserDto getCurrentUser() {
        return this.currentUserService.getCurrentUser();
    }
}
