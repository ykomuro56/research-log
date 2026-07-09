package com.ykomuro.researchlog;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface LogRepository extends JpaRepository<Log, Long> {
	@Query("""
	SELECT DISTINCT l
	FROM Log l
	LEFT JOIN l.tags t
	WHERE
	(:keyword IS NULL OR
	 l.title LIKE %:keyword%
	 OR l.content LIKE %:keyword%)
	AND
	(:tag IS NULL OR t.name = :tag)
	""")
	List<Log> searchLogs(
    	@Param("keyword") String keyword,
    	@Param("tag") String tag
	);
	boolean existsByTagsContaining(Tag tag);
}
