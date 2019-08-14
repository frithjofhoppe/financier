package com.fh.financierbakend.controller;

import com.fh.financierbakend.dto.TagDto;
import com.fh.financierbakend.service.TagService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/tag")
public class TagController {

    private final TagService tagService;

    public TagController(TagService tagService) {
        this.tagService = tagService;
    }

    @GetMapping
    public List<TagDto> getAllTagsForCurrentUser() {
        return this.tagService.findAllForCurrentUser();
    }
}
