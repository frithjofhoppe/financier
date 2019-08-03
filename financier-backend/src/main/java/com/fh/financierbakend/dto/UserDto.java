package com.fh.financierbakend.dto;

import lombok.*;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {
    String id;
    String email;
    String name;
    String avatar;
}
