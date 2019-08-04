package com.fh.financierbakend.dto;

import lombok.*;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AppUserDto {
    Long id;
    String auth0Id;
    String email;
    String name;
    String avatar;
}
