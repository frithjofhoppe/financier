package com.fh.financierbakend.dto;

import lombok.*;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TagDto {
    Long id;
    String identifier;
}
