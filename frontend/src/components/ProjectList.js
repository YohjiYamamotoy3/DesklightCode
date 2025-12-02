import React, { useState } from 'react';
import './ProjectList.css';

function ProjectList({ projects, selectedProject, onSelectProject, onCreateProject }) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onCreateProject(name, description);
      setName('');
      setDescription('');
      setShowForm(false);
    }
  };

  return (
    <div className="project-list">
      <div className="project-list-header">
        <h2>projects</h2>
        <button onClick={() => setShowForm(!showForm)}>+</button>
      </div>
      
      {showForm && (
        <form onSubmit={handleSubmit} className="project-form">
          <input
            type="text"
            placeholder="project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
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

      <div className="project-items">
        <div
          className={`project-item ${!selectedProject ? 'active' : ''}`}
          onClick={() => onSelectProject(null)}
        >
          all tasks
        </div>
        {projects.map(project => (
          <div
            key={project.id}
            className={`project-item ${selectedProject?.id === project.id ? 'active' : ''}`}
            onClick={() => onSelectProject(project)}
          >
            {project.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProjectList;

