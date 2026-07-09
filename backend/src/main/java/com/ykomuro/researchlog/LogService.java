package com.ykomuro.researchlog;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class LogService {
	private final LogRepository repository;
	private final TagRepository tagRepository;
	
	public LogService(
		LogRepository repository,
		TagRepository tagRepository
	){
		this.repository = repository;
		this.tagRepository = tagRepository;
	}

	public void deleteLog(Long id) {
		Log log = repository.findById(id).orElseThrow();
		List<Tag> tags = log.getTags();

		repository.delete(log);

		for (Tag tag : tags) {
			if (!repository.existsByTagsContaining(tag)){
				tagRepository.delete(tag);
			}
		}
	}

	public List<Log> searchLogs(String keyword, String tag) {
		if (keyword != null && keyword.isBlank()) {
			keyword = null;
		}
		if (tag != null && tag.isBlank()) {
			tag = null;
		}

		return repository.searchLogs(keyword, tag);
	}
}
