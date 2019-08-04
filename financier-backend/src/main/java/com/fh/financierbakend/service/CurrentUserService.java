package com.fh.financierbakend.service;

import com.fh.financierbakend.dto.AppUserDto;
import com.fh.financierbakend.model.AppUser;

public interface CurrentUserService {
    AppUserDto getCurrentUser();
    AppUser getCurrentUserAsEntity();
}
