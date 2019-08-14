package com.fh.financierbakend.service;

import com.fh.financierbakend.dto.TagDto;
import com.fh.financierbakend.model.AppUser;
import com.fh.financierbakend.model.Tag;
import com.fh.financierbakend.repository.TagRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DefaultTagService implements TagService {

    private final CurrentUserService currentUserService;
    private final TagRepository tagRepository;
    private final ModelMapper modelMapper;

    public DefaultTagService(CurrentUserService currentUserService, TagRepository tagRepository, ModelMapper modelMapper) {
        this.currentUserService = currentUserService;
        this.tagRepository = tagRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public Tag findTagForCurrentUser(Tag tag) {
        AppUser user = this.currentUserService.getCurrentUserAsEntity();
        Optional<Tag> result = this.tagRepository
                .findByAppUser_UserIdAndIdentifier(user.getUserId(), tag.getIdentifier());
        if (result.isPresent()) {
            return result.get();
        } else {
            tag.setAppUser(user);
            return this.tagRepository.save(tag);
        }
    }

    @Override
    public List<TagDto> findAllForCurrentUser() {
        return this.tagRepository
                .findAllByAppUser_UserId(this.currentUserService.getCurrentUserAsEntity().getUserId())
                .stream()
                .map(tag -> this.modelMapper.map(tag, TagDto.class))
                .collect(Collectors.toList());
    }
}
