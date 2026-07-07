package com.ykomuro.researchlog;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LogRepository extends JpaRepository<Log, Long> {
    List<Log> findByTitleContainingOrContentContaining(
        String titleKeyword,
        String contentKeyword
    );
}
