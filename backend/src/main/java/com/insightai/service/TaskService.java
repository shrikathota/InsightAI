package com.insightai.service;

import com.insightai.dto.MeetingResponse;
import com.insightai.dto.TaskResponse;
import com.insightai.dto.TaskUpdateRequest;
import com.insightai.dto.UserResponse;
import com.insightai.entity.Role;
import com.insightai.entity.Task;
import com.insightai.entity.TaskStatus;
import com.insightai.entity.User;
import com.insightai.exception.AuthorizationException;
import com.insightai.exception.ResourceNotFoundException;
import com.insightai.exception.ValidationException;
import com.insightai.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private static final Logger logger = LoggerFactory.getLogger(TaskService.class);

    private final TaskRepository taskRepository;

    @Transactional(readOnly = true)
    public List<TaskResponse> getUserTasks(User currentUser) {
        logger.info("Fetching tasks for user: {} with role: {}", currentUser.getEmail(), currentUser.getRole());

        List<Task> tasks;
        
        if (currentUser.getRole() == Role.ADMIN) {
            // Admin can see all tasks
            tasks = taskRepository.findAll();
            logger.debug("Admin user - returning all {} tasks", tasks.size());
        } else {
            // Regular users see tasks from their meetings or assigned to them
            tasks = taskRepository.findByMeeting_CreatedByOrAssignedTo(currentUser);
            logger.debug("Regular user - returning {} tasks", tasks.size());
        }

        return tasks.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public TaskResponse updateTaskStatus(Long taskId, TaskUpdateRequest request, User currentUser) {
        logger.info("Updating task {} status to {} by user: {}", taskId, request.getStatus(), currentUser.getEmail());

        // Fetch task
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));

        // Check authorization: user must own the meeting or be assigned to the task or be an admin
        boolean isOwner = task.getMeeting().getCreatedBy().getId().equals(currentUser.getId());
        boolean isAssigned = task.getAssignedTo() != null && 
                             task.getAssignedTo().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == Role.ADMIN;

        if (!isOwner && !isAssigned && !isAdmin) {
            logger.warn("User {} attempted to update task {} without authorization", 
                       currentUser.getEmail(), taskId);
            throw new AuthorizationException("You don't have permission to update this task");
        }

        // Validate status
        TaskStatus newStatus = request.getStatus();
        if (newStatus == null) {
            throw new ValidationException("Status cannot be null");
        }

        // Update status
        task.setStatus(newStatus);
        Task updatedTask = taskRepository.save(task);

        logger.info("Task {} status updated to {}", taskId, newStatus);

        return mapToResponse(updatedTask);
    }

    private TaskResponse mapToResponse(Task task) {
        TaskResponse response = TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .status(task.getStatus())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();

        // Map meeting (simplified to avoid circular references)
        if (task.getMeeting() != null) {
            response.setMeeting(MeetingResponse.builder()
                    .id(task.getMeeting().getId())
                    .title(task.getMeeting().getTitle())
                    .meetingDateTime(task.getMeeting().getMeetingDateTime())
                    .build());
        }

        // Map assigned user
        if (task.getAssignedTo() != null) {
            response.setAssignedTo(UserResponse.builder()
                    .id(task.getAssignedTo().getId())
                    .fullName(task.getAssignedTo().getFullName())
                    .email(task.getAssignedTo().getEmail())
                    .role(task.getAssignedTo().getRole().name())
                    .build());
        }

        return response;
    }
}
