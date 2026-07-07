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

import com.ykomuro.researchlog.LogRepository;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class LogController {

	private final LogRepository repository;

	public LogController(LogRepository repository) {
		this.repository = repository;
	}
	@GetMapping("/api/logs")
    public List<Log> getLogs() {
		return repository.findAll();
    }
	@PostMapping("/api/logs")
	public void addLog(@RequestBody Log log) {
    	repository.save(log);
	}
	@DeleteMapping("/api/logs/{id}")
	public void deleteLog(@PathVariable Long id) {
	    repository.deleteById(id);
	}
	@PutMapping("/api/logs/{id}")
	public void updateLog(@PathVariable Long id, @RequestBody Log log) {

		System.out.println("PUT recieved: " + id);

	    log.setId(id);

	    repository.save(log);
	}
	@GetMapping("/api/logs/search")
	public List<Log> searchLogs(@RequestParam String keyword) {
    	return repository.findByTitleContainingOrContentContaining(
    	    keyword,
    	    keyword
    	);
	}
}
