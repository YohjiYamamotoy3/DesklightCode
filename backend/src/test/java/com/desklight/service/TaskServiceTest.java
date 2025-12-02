package com.desklight.service;

import com.desklight.model.Task;
import com.desklight.model.TaskStatus;
import com.desklight.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class TaskServiceTest {
    @Mock
    private TaskRepository taskRepository;

    @Mock
    private SimpMessagingTemplate messagingTemplate;

    @InjectMocks
    private TaskService taskService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateTask() {
        Task task = new Task();
        task.setTitle("test task");

        when(taskRepository.save(any(Task.class))).thenReturn(task);

        Task created = taskService.createTask(task);

        assertNotNull(created);
        verify(taskRepository, times(1)).save(task);
        verify(messagingTemplate, times(1)).convertAndSend(eq("/topic/tasks"), any());
    }

    @Test
    void testUpdateTaskStatus() {
        Task task = new Task();
        task.setId(1L);
        task.setStatus(TaskStatus.TODO);

        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
        when(taskRepository.save(any(Task.class))).thenReturn(task);

        Task updated = taskService.updateTaskStatus(1L, TaskStatus.IN_PROGRESS);

        assertEquals(TaskStatus.IN_PROGRESS, updated.getStatus());
        verify(messagingTemplate, times(1)).convertAndSend(eq("/topic/tasks"), any());
    }
}

