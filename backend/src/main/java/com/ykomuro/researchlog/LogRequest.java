package com.ykomuro.researchlog;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class LogRequest {

	@NotBlank(message = "タイトルを入力してください。")
	@Size(max = 100, message = "タイトルは100文字以内で入力してください。")
	private String title;

	@NotBlank(message = "本文を入力してください。")
	@Size(max = 100000, message = "本文は100000文字以内で入力してください。")
    private String content;

    private String tags;


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


    public String getTags() {
        return tags;
    }

    public void setTags(String tags) {
        this.tags = tags;
    }
}
