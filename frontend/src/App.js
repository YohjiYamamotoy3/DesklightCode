import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SockJS from 'sockjs-client';
import { Client } from 'stompjs';
import './App.css';
import ProjectList from './components/ProjectList';
import TaskList from './components/TaskList';
import Notification from './components/Notification';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
const WS_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:8080/ws';

function App() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    loadProjects();
    loadTasks();
    connectWebSocket();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/projects`);
      setProjects(response.data);
    } catch (error) {
      console.error('error loading projects:', error);
    }
  };

  const loadTasks = async () => {
    try {
      const url = selectedProject 
        ? `${API_URL}/api/tasks/project/${selectedProject.id}`
        : `${API_URL}/api/tasks`;
      const response = await axios.get(url);
      setTasks(response.data);
    } catch (error) {
      console.error('error loading tasks:', error);
    }
  };

  const connectWebSocket = () => {
    const socket = new SockJS(WS_URL);
    const client = Client.over(socket);
    
    client.connect({}, () => {
      client.subscribe('/topic/tasks', (message) => {
        const task = JSON.parse(message.body);
        if (task.startsWith && task.startsWith('deleted:')) {
          const taskId = task.split(':')[1];
          setTasks(prev => prev.filter(t => t.id !== parseInt(taskId)));
        } else {
          setTasks(prev => {
            const existing = prev.findIndex(t => t.id === task.id);
            if (existing >= 0) {
              const updated = [...prev];
              updated[existing] = task;
              return updated;
            }
            return [...prev, task];
          });
          addNotification(`task updated: ${task.title}`);
        }
      });
    });

    setStompClient(client);
  };

  const addNotification = (message) => {
    const notification = { id: Date.now(), message };
    setNotifications(prev => [...prev, notification]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  };

  const createProject = async (name, description) => {
    try {
      await axios.post(`${API_URL}/api/projects`, { name, description });
      loadProjects();
    } catch (error) {
      console.error('error creating project:', error);
    }
  };

  const createTask = async (title, description, projectId) => {
    try {
      await axios.post(`${API_URL}/api/tasks`, {
        title,
        description,
        project: { id: projectId }
      });
      loadTasks();
      addNotification(`task created: ${title}`);
    } catch (error) {
      console.error('error creating task:', error);
    }
  };

  const updateTaskStatus = async (taskId, status) => {
    try {
      await axios.patch(`${API_URL}/api/tasks/${taskId}/status`, status);
      loadTasks();
    } catch (error) {
      console.error('error updating task status:', error);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [selectedProject]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>desklight</h1>
      </header>
      <div className="app-content">
        <div className="sidebar">
          <ProjectList
            projects={projects}
            selectedProject={selectedProject}
            onSelectProject={setSelectedProject}
            onCreateProject={createProject}
          />
        </div>
        <div className="main-content">
          <TaskList
            tasks={tasks}
            selectedProject={selectedProject}
            onCreateTask={createTask}
            onUpdateTaskStatus={updateTaskStatus}
          />
        </div>
      </div>
      <div className="notifications">
        {notifications.map(notif => (
          <Notification key={notif.id} message={notif.message} />
        ))}
      </div>
    </div>
  );
}

export default App;

