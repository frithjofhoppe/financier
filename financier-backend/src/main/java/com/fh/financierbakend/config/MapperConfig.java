package com.fh.financierbakend.config;

import com.fh.financierbakend.dto.AccountMovementDto;
import com.fh.financierbakend.model.AccountMovement;
import com.fh.financierbakend.model.MovementDirection;
import org.modelmapper.Converter;
import org.modelmapper.ModelMapper;
import org.modelmapper.spi.MappingContext;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class MapperConfig {

    @Bean
    ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.addConverter(new Converter<AccountMovement, AccountMovementDto>() {
            @Override
            public AccountMovementDto convert(MappingContext<AccountMovement, AccountMovementDto> mappingContext) {
                AccountMovement source = mappingContext.getSource();
                return AccountMovementDto.builder()
                        .valuata(source.getValuata())
                        .value(source.getValue().toString())
                        .id(source.getId())
                        .description(source.getDescription())
                        .movementDirection(MovementDirection.valueOf(source.getMovementDirection()))
                        .build();
            }
        });
        modelMapper.addConverter(new Converter<AccountMovementDto, AccountMovement>() {
            @Override
            public AccountMovement convert(MappingContext<AccountMovementDto, AccountMovement> mappingContext) {
                AccountMovementDto source = mappingContext.getSource();
                return AccountMovement.builder()
                        .movementDirection(source.getMovementDirection().value)
                        .valuata(source.getValuata())
                        .value(new BigDecimal(source.getValue()))
                        .description(source.getDescription())
                        .build();
            }
        });
        return modelMapper;
    }
}
