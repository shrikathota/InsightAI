package com.insightai.repository;

import com.insightai.entity.Meeting;
import com.insightai.entity.Role;
import com.insightai.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MeetingRepository extends JpaRepository<Meeting, Long> {
    
    List<Meeting> findByCreatedBy(User user);
    
    @Query("SELECT m FROM Meeting m WHERE m.createdBy = :user OR :role = 'ADMIN'")
    List<Meeting> findByCreatedByOrRole(@Param("user") User user, @Param("role") Role role);
}
