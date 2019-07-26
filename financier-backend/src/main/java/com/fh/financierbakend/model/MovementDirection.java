package com.fh.financierbakend.model;

import org.hibernate.InvalidMappingException;

import java.util.stream.Stream;

public enum MovementDirection {

    CREDIT("CREDIT"), DEBIT("DEBIT");

    public String value;

    MovementDirection(String value) {
        this.value = value;
    }

    MovementDirection toEnum(String value) {
        return Stream.of(values())
                .filter(v -> v.value.equals(value))
                .findFirst()
                .orElseThrow(IllegalArgumentException::new);
    }
}
