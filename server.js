const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

const projects = [
  {
    id: 1,
    title: "React Game!",
    description: "Tic tac toe game created using Create React app.",
    URL: "http://heroku/myapp/game/",
  },
  {
    id: 2,
    title: "Online store",
    description: "Online store created with HTML, CSS and Javascript.",
    URL: "https://git.com/myrepos/shop/index",
  },
];

app.get("/api", (req, res) => {
  res.send(projects);
});

app.post("/api", (req, res) => {
  const newProject = req.body;
  const highestId = projects.reduce(
    (maxId, project) => Math.max(maxId, project.id),
    0
  );
  newProject.id = highestId + 1;
  projects.push(newProject);
  res.send(`Project ${newProject.title} added successfully!`);
});

app.delete("/api/:id", (req, res) => {
  const projectId = req.params.id;
  const index = projects.findIndex(
    (project) => project.id === Number(projectId)
  );
  if (index === -1) {
    res.send("Project not found!");
  } else {
    projects.splice(index, 1);
    res.send("Project deleted successfully!");
  }
});

app.put("/api/:id", (req, res) => {
  const projectId = req.params.id;
  const index = projects.findIndex(
    (project) => project.id === Number(projectId)
  );
  if (index === -1) {
    res.send("Project not found!");
  } else {
    projects[index] = { ...projects[index], ...req.body };
    res.send("Project updated successfully!");
  }
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
