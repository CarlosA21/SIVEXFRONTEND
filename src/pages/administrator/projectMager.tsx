// src/components/ProjectAssignment.tsx
import React, { useEffect, useState } from "react";
import {
  getUsers,
  getProjects,
  assignUserToProject,
  User,
  Project,
} from "../../services/user_project_roleService";

// Definición de variables CSS para los colores de la institución
const customStyles = `
  :root {
    --bs-dark-blue: #0A2342; /* Azul oscuro */
    --bs-orange: #FF8C00; /* Naranja */
  }
  .bg-dark-blue {
    background-color: var(--bs-dark-blue) !important;
  }
  .text-dark-blue {
    color: var(--bs-dark-blue) !important;
  }
  .btn-orange {
    background-color: var(--bs-orange);
    border-color: var(--bs-orange);
    color: #fff;
  }
  .btn-orange:hover {
    background-color: #e67e00;
    border-color: #e67e00;
  }
  .form-select {
    border-color: var(--bs-dark-blue);
  }
  .table-striped > tbody > tr:nth-of-type(odd) > * {
    background-color: rgba(255, 140, 0, 0.1); /* Naranja muy claro para las filas impares */
  }
`;

const ProjectAssignment: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [coordinators, setCoordinators] = useState<User[]>([]);
  const [facilitators, setFacilitators] = useState<User[]>([]);

  useEffect(() => {
    // Inyecta los estilos personalizados en el documento
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = customStyles;
    document.head.appendChild(styleSheet);

    const loadData = async () => {
      try {
        const users = await getUsers();
        setCoordinators(users.filter((u) => u.role.name === "COORDINATOR"));
        setFacilitators(users.filter((u) => u.role.name === "FACILITATOR"));

        const projectsData = await getProjects();
        setProjects(projectsData);
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };
    loadData();

    // Limpia el estilo al desmontar el componente
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  const handleAssign = async (
    projectId: number,
    userId: string,
    role: "coordinator" | "facilitator"
  ) => {
    if (!userId) return;
    try {
      await assignUserToProject(projectId, parseInt(userId), role);
      alert(`✅ ${role} asignado correctamente al proyecto`);
    } catch (error) {
      alert(`❌ Error al asignar ${role}`);
      console.error(error);
    }
  };

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4 text-dark-blue">
        Asignar Coordinadores y Facilitadores
      </h1>
      <div className="table-responsive">
        <table className="table table-bordered table-striped shadow-sm">
          <thead className="text-white bg-dark-blue">
            <tr>
              <th scope="col">Nombre del Proyecto</th>
              <th scope="col">Descripción</th>
              <th scope="col">Coordinador</th>
              <th scope="col">Facilitador</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>
                <td>{project.title}</td>
                <td>{project.description}</td>
                <td>
                  <select
                    className="form-select"
                    onChange={(e) =>
                      handleAssign(project.id, e.target.value, "coordinator")
                    }
                  >
                    <option value="">-- Seleccionar --</option>
                    {coordinators.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.firstName} {c.lastName}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    className="form-select"
                    onChange={(e) =>
                      handleAssign(project.id, e.target.value, "facilitator")
                    }
                  >
                    <option value="">-- Seleccionar --</option>
                    {facilitators.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.firstName} {f.lastName}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectAssignment;
