package com.ykomuro.researchlog;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.ArrayList;

@RestController
public class LogController {

    private final List<Log> logs = new ArrayList<>(
        List.of(
            new Log("Spring Boot", "APIから取得しました！"),
            new Log("React", "fetch成功！")
        )
    );
	@GetMapping("/api/logs")
    public List<Log> getLogs() {
		return logs;
    }
	@PostMapping("/api/logs")
	public void addLog(@RequestBody Log log) {
	    logs.add(log);
	}
	@DeleteMapping("/api/logs/{index}")
	public void deleteLog(@PathVariable int index) {
	    logs.remove(index);
	}
}
