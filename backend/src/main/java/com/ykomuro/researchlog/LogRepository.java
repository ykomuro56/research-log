package com.ykomuro.researchlog;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LogRepository extends JpaRepository<Log, Long> {
    List<Log> findByTitleContainingOrContentContainingOrTagsNameContaining(
        String titleKeyword,
        String contentKeyword,
		String tagKeyword
    );

	boolean existsByTagsContaining(Tag tag);
}
