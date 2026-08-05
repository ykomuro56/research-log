package com.ykomuro.researchlog;

import java.util.List;

import org.springframework.web.bind.annotation.*;

@RestController
public class TagController {

    private final TagRepository repository;

    public TagController(TagRepository repository) {
        this.repository = repository;
    }


    @GetMapping("/api/tags")
    public List<Tag> getTags() {
        return repository.findAll();
    }


    @PostMapping("/api/tags")
    public Tag addTag(@RequestBody Tag tag) {
        return repository.save(tag);
    }
}
