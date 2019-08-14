package com.fh.financierbakend.service;

import com.fh.financierbakend.dto.TagDto;
import com.fh.financierbakend.model.Tag;

import java.util.List;

public interface TagService {
    Tag findTagForCurrentUser(Tag tag);

    List<TagDto> findAllForCurrentUser();
}
