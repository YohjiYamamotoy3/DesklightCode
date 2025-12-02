package com.desklight.service;

import com.desklight.model.Project;
import com.desklight.repository.ProjectRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ProjectServiceTest {
    @Mock
    private ProjectRepository projectRepository;

    @InjectMocks
    private ProjectService projectService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllProjects() {
        Project project1 = new Project();
        project1.setId(1L);
        project1.setName("project 1");

        Project project2 = new Project();
        project2.setId(2L);
        project2.setName("project 2");

        when(projectRepository.findAll()).thenReturn(Arrays.asList(project1, project2));

        List<Project> projects = projectService.getAllProjects();

        assertEquals(2, projects.size());
        verify(projectRepository, times(1)).findAll();
    }

    @Test
    void testGetProjectById() {
        Project project = new Project();
        project.setId(1L);
        project.setName("test project");

        when(projectRepository.findById(1L)).thenReturn(Optional.of(project));

        Optional<Project> result = projectService.getProjectById(1L);

        assertTrue(result.isPresent());
        assertEquals("test project", result.get().getName());
    }

    @Test
    void testCreateProject() {
        Project project = new Project();
        project.setName("new project");

        when(projectRepository.save(any(Project.class))).thenReturn(project);

        Project created = projectService.createProject(project);

        assertNotNull(created);
        verify(projectRepository, times(1)).save(project);
    }
}

