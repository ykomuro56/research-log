package com.ykomuro.researchlog;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

@Entity
public class Log {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
    
	private String title;
    private String content;

	public Long getId() {
		return id;
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
}
