import axios from "axios";
import React, { useState, useEffect } from "react";
import "./WebProjects.css";

const WebProjects = () => {
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    URL: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      axios
        .put(`http://localhost:8000/api/${newProject.id}`, newProject)
        .then(() => {
          setNewProject({ title: "", description: "", URL: "" });
          setIsEditing(false);
          axios
            .get("http://localhost:8000/api")
            .then((res) => setProjects(res.data))
            .catch((err) => console.error(err));
        })
        .catch((err) => console.error(err));
    } else {
      axios
        .post("http://localhost:8000/api", newProject)
        .then(() => {
          setNewProject({ title: "", description: "", URL: "" });
          axios
            .get("http://localhost:8000/api")
            .then((res) => setProjects(res.data))
            .catch((err) => console.error(err));
        })
        .catch((err) => console.error(err));
    }
  };

  axios.defaults.headers.post["Content-Type"] = "application/json";

  const [projects, setProjects] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api")
      .then((res) => {
        const projectsWithId = res.data.map((project, index) => ({
          ...project,
          id: project.id || index,
        }));
        setProjects(projectsWithId);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleEdit = (project) => {
    setNewProject(project);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    if (!id) {
      console.error("No project id found");
      return;
    }
    axios
      .delete(`http://localhost:8000/api/${id}`)
      .then(() => {
        setProjects(projects.filter((project) => project.id !== id));
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="web-projects-container">
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Title"
          value={newProject.title}
          onChange={(e) =>
            setNewProject({ ...newProject, title: e.target.value })
          }
          className="form-input"
        />
        <textarea
          placeholder="Description"
          value={newProject.description}
          onChange={(e) =>
            setNewProject({ ...newProject, description: e.target.value })
          }
          className="form-input"
        />
        <input
          type="text"
          placeholder="URL"
          value={newProject.URL}
          onChange={(e) =>
            setNewProject({ ...newProject, URL: e.target.value })
          }
          className="form-input"
        />
        <button type="submit" className="form-button">
          {isEditing ? "Save" : "Add Project"}
        </button>
      </form>
      <div className="projects-list">
        {projects.map((project) => (
          <div
            key={`${project.id}-${Math.random()}-${Date.now()}`}
            className="project"
          >
            <h3 className="project-title">{project.title}</h3>
            <p className="project-description">{project.description}</p>
            <a href={project.URL} className="project-link">
              {project.URL}
            </a>
            <button onClick={() => handleEdit(project)} className="edit-button">
              Edit
            </button>
            <button
              onClick={() => handleDelete(project.id)}
              className="delete-button"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default WebProjects;
