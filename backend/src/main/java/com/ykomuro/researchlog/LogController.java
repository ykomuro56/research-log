package com.ykomuro.researchlog;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.ArrayList;
import java.time.LocalDateTime;

import com.ykomuro.researchlog.LogRepository;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class LogController {


	private final LogRepository repository;
	private final TagRepository tagRepository;
	private final LogService logService;

	public LogController(
		LogRepository repository,
		TagRepository tagRepository,
		LogService logService
		) {
		this.repository = repository;
		this.tagRepository = tagRepository;
		this.logService = logService;
	}

	@GetMapping("/api/logs")
    public List<Log> getLogs() {
		return repository.findAll();
    }

	@PostMapping("/api/logs")
	public void addLog(@RequestBody LogRequest request) {
		LocalDateTime now = LocalDateTime.now();

		Log log = new Log(
			request.getTitle(),
			request.getContent()
		);

		log.setTags(convertTags(request.getTags()));

		log.setCreatedAt(now);
		log.setUpdatedAt(now);
		log.setTags(convertTags(request.getTags()));

    	repository.save(log);
	}

	@DeleteMapping("/api/logs/{id}")
	public void deleteLog(@PathVariable Long id) {
		logService.deleteLog(id);
	}

	@PutMapping("/api/logs/{id}")
	public void updateLog(@PathVariable Long id, @RequestBody LogRequest request) {

		Log oldLog = repository.findById(id).orElseThrow();

		oldLog.setTitle(request.getTitle());
		oldLog.setContent(request.getContent());
		oldLog.setTags(convertTags(request.getTags()));
		oldLog.setUpdatedAt(LocalDateTime.now());

	    repository.save(oldLog);
	}

	@GetMapping("/api/logs/search")
	public List<Log> searchLogs(@RequestParam String keyword) {
    	return repository.findByTitleContainingOrContentContainingOrTagsNameContaining(
    	    keyword,
    	    keyword,
			keyword
    	);
	}
	private List<Tag> convertTags(String tagString) {
    	List<Tag> tags = new ArrayList<>();

    	if (tagString != null && !tagString.isBlank()) {
        	String[] tagNames = tagString.split(",");

        	for (String tagName : tagNames) {
            	String trimmedName = tagName.trim();

            	if (!trimmedName.isBlank()) {
                	Tag tag = tagRepository
                    	.findByName(trimmedName)
                    	.orElseGet(() -> tagRepository.save(new Tag(trimmedName)));

                	tags.add(tag);
            	}
        	}
    	}

    	return tags;
	}
}
