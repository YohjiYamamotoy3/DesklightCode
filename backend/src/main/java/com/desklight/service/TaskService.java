package com.desklight.service;

import com.desklight.model.Task;
import com.desklight.model.TaskStatus;
import com.desklight.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {
    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public List<Task> getTasksByProjectId(Long projectId) {
        return taskRepository.findByProjectId(projectId);
    }

    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }

    public Task createTask(Task task) {
        Task saved = taskRepository.save(task);
        messagingTemplate.convertAndSend("/topic/tasks", saved);
        return saved;
    }

    public Task updateTask(Long id, Task taskDetails) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("task not found"));
        
        task.setTitle(taskDetails.getTitle());
        task.setDescription(taskDetails.getDescription());
        task.setStatus(taskDetails.getStatus());
        
        Task updated = taskRepository.save(task);
        messagingTemplate.convertAndSend("/topic/tasks", updated);
        return updated;
    }

    public Task updateTaskStatus(Long id, TaskStatus status) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("task not found"));
        
        task.setStatus(status);
        Task updated = taskRepository.save(task);
        messagingTemplate.convertAndSend("/topic/tasks", updated);
        return updated;
    }

    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
        messagingTemplate.convertAndSend("/topic/tasks", "deleted:" + id);
    }
}

