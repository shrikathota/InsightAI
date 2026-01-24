package com.insightai.controller;

import com.insightai.dto.TaskResponse;
import com.insightai.dto.TaskUpdateRequest;
import com.insightai.entity.User;
import com.insightai.repository.UserRepository;
import com.insightai.security.UserPrincipal;
import com.insightai.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<TaskResponse>> getAllTasks(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        
        User currentUser = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<TaskResponse> tasks = taskService.getUserTasks(currentUser);
        return ResponseEntity.ok(tasks);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponse> updateTaskStatus(
            @PathVariable Long id,
            @Valid @RequestBody TaskUpdateRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        
        User currentUser = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        TaskResponse response = taskService.updateTaskStatus(id, request, currentUser);
        return ResponseEntity.ok(response);
    }
}
