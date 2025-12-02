import React, { useState } from 'react';
import './TaskList.css';

function TaskList({ tasks, selectedProject, onCreateTask, onUpdateTaskStatus }) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onCreateTask(title, description, selectedProject?.id);
      setTitle('');
      setDescription('');
      setShowForm(false);
    }
  };

  const handleStatusChange = (taskId, newStatus) => {
    onUpdateTaskStatus(taskId, newStatus);
  };

  const paginatedTasks = tasks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(tasks.length / itemsPerPage);

  return (
    <div className="task-list">
      <div className="task-list-header">
        <h2>{selectedProject ? selectedProject.name : 'all tasks'}</h2>
        <button onClick={() => setShowForm(!showForm)}>+ new task</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="task-form">
          <input
            type="text"
            placeholder="task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="form-actions">
            <button type="submit">create</button>
            <button type="button" onClick={() => setShowForm(false)}>cancel</button>
          </div>
        </form>
      )}

      <div className="tasks">
        {paginatedTasks.length === 0 ? (
          <div className="no-tasks">no tasks</div>
        ) : (
          paginatedTasks.map(task => (
            <div key={task.id} className="task-item">
              <div className="task-header">
                <h3>{task.title}</h3>
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task.id, e.target.value)}
                  className="status-select"
                >
                  <option value="TODO">todo</option>
                  <option value="IN_PROGRESS">in progress</option>
                  <option value="DONE">done</option>
                </select>
              </div>
              {task.description && (
                <p className="task-description">{task.description}</p>
              )}
              <div className="task-meta">
                <span className="task-date">
                  created: {new Date(task.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            previous
          </button>
          <span>page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            next
          </button>
        </div>
      )}
    </div>
  );
}

export default TaskList;

