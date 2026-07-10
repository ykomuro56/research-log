package com.ykomuro.researchlog;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Column;
import jakarta.persistence.GenerationType;
import java.time.LocalDateTime;
import jakarta.persistence.ManyToMany;
import java.util.List;
import java.util.ArrayList;

@Entity
public class Log {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
    
	@Column(columnDefinition = "TEXT")
	private String content;

	private String title;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;

	@ManyToMany
	private List<Tag> tags = new ArrayList<>();

	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public Log(){
	}

    public Log(String title, String content) {
        this.title = title;
        this.content = content;
    }

    public String getTitle() {
        return title;
    }

	public void setTitle(String title) {
		this.title = title;
	}

    public String getContent() {
        return content;
    }

	public void setContent(String content) {
		this.content = content;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public LocalDateTime getupdatedAt() {
		return updatedAt;
     }

     public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
 	}

	public List<Tag> getTags() {
		return tags;
	}

	public void setTags(List<Tag> tags) {
		this.tags = tags;
	}
}
