package com.fh.financierbakend.config;

import com.fh.financierbakend.dto.AccountMovementDto;
import com.fh.financierbakend.dto.TagDto;
import com.fh.financierbakend.model.AccountMovement;
import com.fh.financierbakend.model.Tag;
import org.modelmapper.Converter;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.modelmapper.TypeMap;
import org.modelmapper.spi.MappingContext;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class MapperConfig {

    @Bean
    ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();
//        modelMapper.addConverter(new Converter<AccountMovement, AccountMovementDto>() {
//            @Override
//            public AccountMovementDto convert(MappingContext<AccountMovement, AccountMovementDto> mappingContext) {
//                AccountMovement source = mappingContext.getSource();
//                Tag sourceTag = source.getTag();
//                TagDto tag = null;
//
//                if (sourceTag != null) {
//                    tag = new TagDto(sourceTag.getId(), sourceTag.getIdentifier());
//                }
//
//                return AccountMovementDto.builder()
//                        .valuata(source.getValuata())
//                        .value(source.getValue().toString())
//                        .id(source.getId())
//                        .description(source.getDescription())
//                        .tag(tag)
//                        .build();
//            }
//        });
//        modelMapper.addConverter(new Converter<AccountMovementDto, AccountMovement>() {
//            @Override
//            public AccountMovement convert(MappingContext<AccountMovementDto, AccountMovement> mappingContext) {
//                AccountMovementDto source = mappingContext.getSource();
//                TagDto sourceTag = source.getTag();
//                Tag tag = null;
//
//                if (sourceTag != null) {
//                    tag = Tag.builder()
//                            .id(sourceTag.getId())
//                            .identifier(sourceTag.getIdentifier())
//                            .build();
//                }
//
//                return AccountMovement.builder()
//                        .valuata(source.getValuata())
//                        .value(new BigDecimal(source.getValue()))
//                        .description(source.getDescription())
//                        .tag(tag)
//                        .build();
//            }
//        });
//        modelMapper.addConverter(new Converter<Tag, TagDto>() {
//            @Override
//            public TagDto convert(MappingContext<Tag, TagDto> mappingContext) {
//                Tag source = mappingContext.getSource();
//                if (source == null) {
//                    return new TagDto();
//                }
//                return TagDto.builder()
//                        .id(source.getId())
//                        .identifier(source.getIdentifier())
//                        .build();
//            }
//        });
        modelMapper.createTypeMap(AccountMovement.class, AccountMovementDto.class).
                addMappings(type -> type.using(new Converter<Tag, TagDto>() {
                    @Override
                    public TagDto convert(MappingContext<Tag, TagDto> mappingContext) {
                        Tag source = mappingContext.getSource();
                        if (source != null) {
                            return new TagDto(source.getId(), source.getIdentifier());
                        }
                        return null;
                    }
                }).map(AccountMovement::getTag, AccountMovementDto::setTag));
        modelMapper.createTypeMap(AccountMovementDto.class, AccountMovement.class).
                addMappings(type -> type.using(new Converter<TagDto, Tag>() {
                    @Override
                    public Tag convert(MappingContext<TagDto, Tag> mappingContext) {
                        TagDto source = mappingContext.getSource();
                        if (source != null) {
                            return new Tag(source.getId(), source.getIdentifier());
                        }
                        return null;
                    }
                }).map(AccountMovementDto::getTag, AccountMovement::setTag));
        return modelMapper;
    }
}
