import React, { useEffect, useState } from "react";
import {
  GetAllProjects,
  CreateProject,
  UpdateProject,
  CreateActivity,
  UpdateActivity,
  DeleteActivity,
  GetAcademicUnits,
  GetProjectResponsables,
} from "../../services/project_Service";
import { Project, Activity } from "../../models/Project";





const ProjectForm: React.FC = () => {

  const [projects, setProjects] = useState<Project[]>([]);

  // 📌 Estados de paginación
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [total, setTotal] = useState(0);
  const [lastPage, setLastPage] = useState(1);
  console.log(total);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectResponsables, setProjectResponsables] = useState<any | null>(null);

  const [newActivity, setNewActivity] = useState<Partial<Activity>>({});
  const [editingActivityId, setEditingActivityId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProject, setNewProject] = useState<Partial<Project>>({});

  const [academicUnits, setAcademicUnits] = useState<any[]>([]);

  // // 🔹 Cargar proyectos y unidades académicas
  // const fetchProjects = async () => {
  //   try {
  //     setError(null);
  //     const data = await GetAllProjects(setLoading);
  //     setProjects(data);
  //   } catch (err: any) {
  //     setError(err.message || "Error cargando proyectos");
  //   }
  // };

  // 🔹 Cargar proyectos con paginación
  const fetchProjects = async (pageNumber = 1) => {
    try {
      setError(null);
      const response = await GetAllProjects(setLoading, pageNumber, limit);

      // tu servicio debe devolver { data, total, page, lastPage }
      setProjects(response.data);
      setTotal(response.total);
      setPage(response.page);
      setLastPage(response.lastPage);
    } catch (err: any) {
      setError(err.message || "Error cargando proyectos");
    }
  };



  const fetchAcademicUnits = async () => {
    try {
      const data = await GetAcademicUnits();
      setAcademicUnits(data);
    } catch (err: any) {
      console.error(err);
      setError("Error cargando unidades académicas");
    }
  };


  // useEffect(() => {
  //   fetchProjects();
  //   fetchAcademicUnits();
  // }, []);

  useEffect(() => {
    fetchProjects(page);
    fetchAcademicUnits();
  }, [page]); // 👈 se actualiza al cambiar de página



  // 🔹 Render paginación
  const renderPagination = () => {
    return (
      <nav className="d-flex justify-content-center mt-3">
        <ul className="pagination">
          <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => setPage(page - 1)}>
              Anterior
            </button>
          </li>

          {[...Array(lastPage)].map((_, i) => (
            <li
              key={i}
              className={`page-item ${page === i + 1 ? "active" : ""}`}
            >
              <button className="page-link" onClick={() => setPage(i + 1)}>
                {i + 1}
              </button>
            </li>
          ))}

          <li className={`page-item ${page === lastPage ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => setPage(page + 1)}>
              Siguiente
            </button>
          </li>
        </ul>
      </nav>
    );
  };




  const fetchProjectResponsables = async (projectId: number) => {
    try {
      setError(null);
      const data = await GetProjectResponsables(projectId, setLoading);
      setProjectResponsables(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error cargando responsables del proyecto");
    }
  };


  // 🔹 Actividades - MODIFICADA para usar el servicio
  const handleSaveActivity = async () => {
    if (!selectedProject || !newActivity.name || !newActivity.description) return;

    try {
      const payload = {
        name: newActivity.name!,
        description: newActivity.description!,
        date: newActivity.date || new Date().toISOString().split("T")[0],
        status:
          (newActivity.status as "pending" | "in_progress" | "completed") ||
          "pending",
        projectId: selectedProject.id,
      };

      let updatedActivity: Activity;

      if (editingActivityId) {
        updatedActivity = await UpdateActivity(editingActivityId, payload, setLoading);
        alert("Actividad actualizada correctamente ✅");

        setProjects(prevProjects =>
          prevProjects.map(project =>
            project.id === selectedProject.id
              ? {
                ...project,
                activities: project.activities.map(activity =>
                  activity.id === editingActivityId
                    ? { ...activity, ...updatedActivity }
                    : activity
                )
              }
              : project
          )
        );
      } else {
        updatedActivity = await CreateActivity(payload, setLoading);
        alert("Actividad creada correctamente ✅");

        setProjects(prevProjects =>
          prevProjects.map(project =>
            project.id === selectedProject.id
              ? {
                ...project,
                activities: [...project.activities, updatedActivity]
              }
              : project
          )
        );
      }

      setSelectedProject(prevSelected =>
        prevSelected && prevSelected.id === selectedProject.id
          ? {
            ...prevSelected,
            activities: editingActivityId
              ? prevSelected.activities.map(activity =>
                activity.id === editingActivityId
                  ? { ...activity, ...updatedActivity }
                  : activity
              )
              : [...prevSelected.activities, updatedActivity]
          }
          : prevSelected
      );

      setNewActivity({});
      setEditingActivityId(null);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error guardando actividad");
    }
  };

  const handleEditActivity = (activity: Activity) => {
    setNewActivity({
      name: activity.name,
      description: activity.description,
      status: activity.status,
      date: activity.date,
    });
    setEditingActivityId(activity.id);
  };

  // 🔹 Eliminar actividad - MODIFICADA para usar el servicio
  const handleDeleteActivity = async (activityId: number) => {
    if (!selectedProject) return;
    if (!confirm("¿Seguro que deseas eliminar esta actividad?")) return;

    try {
      setLoading(true);
      await DeleteActivity(activityId);

      setProjects(prevProjects =>
        prevProjects.map(project =>
          project.id === selectedProject.id
            ? {
              ...project,
              activities: project.activities.filter(activity => activity.id !== activityId)
            }
            : project
        )
      );

      setSelectedProject(prevSelected =>
        prevSelected && prevSelected.id === selectedProject.id
          ? {
            ...prevSelected,
            activities: prevSelected.activities.filter(activity => activity.id !== activityId)
          }
          : prevSelected
      );

    } catch (err: any) {
      setError(err.message || "Error eliminando actividad");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Proyectos - MODIFICADA para usar el servicio
  const handleSaveProject = async () => {
    if (!newProject.title || !newProject.description || !newProject.startDate) {
      alert("Por favor completa todos los campos obligatorios");
      return;
    }

    try {
      const payload = {
        title: newProject.title,
        description: newProject.description,
        startDate: newProject.startDate,
        endDate: newProject.endDate || "",
        status:
          (newProject.status as "active" | "inactive" | "completed") || "active",
        projectType:
          typeof newProject.projectType === "object"
            ? newProject.projectType
            : (newProject.projectType as "extensionism" | "volunteering"),
        academicUnitId: newProject.academicUnits?.[0]?.id,
      };

      if (newProject.id) {
        await UpdateProject(newProject.id, payload);
      } else {
        await CreateProject(payload, setLoading);
      }

      await fetchProjects();
      setNewProject({});
      setShowNewProjectModal(false);
    } catch (err: any) {
      setError(err.message || "Error guardando proyecto");
    }
  };

  const handleEditProject = (project: Project) => {
    setNewProject({
      id: project.id,
      title: project.title,
      description: project.description,
      startDate: project.startDate,
      endDate: project.endDate,
      status: project.status,
      projectType: project.projectType,
      academicUnits: project.academicUnits,
    });
    setShowNewProjectModal(true);
  };

  // 🔹 Filtrado
  const filteredProjects = projects.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus ? p.status === filterStatus : true;
    return matchSearch && matchStatus;
  });

  const renderProjectsList = () => {
    if (filteredProjects.length === 0)
      return <p className="text-muted">No hay proyectos que coincidan.</p>;

    return filteredProjects.map((p) => (
      <div key={p.id} className="card mb-3 shadow-sm">
        <div className="card-body d-flex justify-content-between align-items-center">
          <div>
            <h5 className="card-title">
              {p.title}{" "}
              <span
                className={`badge ${p.status === "active"
                  ? "bg-success"
                  : p.status === "completed"
                    ? "bg-info"
                    : "bg-secondary"
                  }`}
              >
                {p.status}
              </span>
            </h5>
            <p className="card-text">{p.description}</p>
            {p.academicUnits?.[0]?.name && (
              <p className="text-muted">Unidad Académica: {p.academicUnits[0].name}</p>
            )}
          </div>
          <div>

            <button
              className="btn btn-primary btn-sm me-1"
              onClick={() => setSelectedProject(p)}
            >
              Ver
            </button>

            <button
              className="btn btn-info btn-sm me-1"
              onClick={() => fetchProjectResponsables(p.id)}
            >
              Responsables
            </button>

            <button
              className="btn btn-warning btn-sm"
              onClick={() => handleEditProject(p)}
            >
              Editar
            </button>


          </div>
        </div>
      </div>
    ));
  };

  return (
    <div id="project-form" className="container py-4">
      <header className="mb-4 d-flex justify-content-between align-items-center">
        <h2>Proyectos</h2>
        <button
          className="btn btn-success"
          onClick={() => {
            setNewProject({});
            setShowNewProjectModal(true);
          }}
        >
          + Nuevo Proyecto
        </button>
      </header>

      <section className="mb-4">
        <div className="row g-2">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por nombre"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <select
              className="form-select"
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(
                  e.target.value as "" | "active" | "inactive" | "completed"
                )
              }
            >
              <option value="">Todos los estados</option>
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
              <option value="completed">Completado</option>
            </select>
          </div>
        </div>
      </section>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <div className="spinner-border text-primary"></div>}

      <section>{renderProjectsList()}</section>
      {renderPagination()}

      {selectedProject && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedProject.title}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedProject(null)}
                ></button>
              </div>
              <div className="modal-body">
                <p>{selectedProject.description}</p>
                <h6>Actividades:</h6>
                <ul className="list-group mb-3">
                  {selectedProject.activities.length === 0 && (
                    <li className="list-group-item text-muted">
                      No hay actividades.
                    </li>
                  )}
                  {selectedProject.activities.map((a) => (
                    <li
                      key={a.id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <strong>{a.name}</strong> - {a.description}{" "}
                        <span className="badge bg-light text-dark ms-2">{a.status}</span>
                      </div>
                      <div>
                        <button
                          className="btn btn-sm btn-outline-primary me-1"
                          onClick={() => handleEditActivity(a)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteActivity(Number(a.id))}
                        >
                          Eliminar
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>

                <h6>{editingActivityId ? "Editar Actividad" : "Nueva Actividad"}</h6>
                <div className="form-floating mb-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nombre"
                    value={newActivity.name || ""}
                    onChange={(e) =>
                      setNewActivity({ ...newActivity, name: e.target.value })
                    }
                  />
                  <label>Nombre</label>
                </div>
                <div className="form-floating mb-2">
                  <textarea
                    className="form-control"
                    placeholder="Descripción"
                    style={{ height: "80px" }}
                    value={newActivity.description || ""}
                    onChange={(e) =>
                      setNewActivity({ ...newActivity, description: e.target.value })
                    }
                  />
                  <label>Descripción</label>
                </div>
                <button className="btn btn-outline-primary" onClick={handleSaveActivity}>
                  {editingActivityId ? "Guardar Cambios" : "+ Agregar Actividad"}
                </button>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setSelectedProject(null);
                    setEditingActivityId(null);
                    setNewActivity({});
                  }}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showNewProjectModal && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{newProject.id ? "Editar Proyecto" : "Nuevo Proyecto"}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowNewProjectModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="form-floating mb-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Título"
                    value={newProject.title || ""}
                    onChange={(e) =>
                      setNewProject({ ...newProject, title: e.target.value })
                    }
                  />
                  <label>Título</label>
                </div>

                <div className="form-floating mb-2">
                  <textarea
                    className="form-control"
                    placeholder="Descripción"
                    style={{ height: "80px" }}
                    value={newProject.description || ""}
                    onChange={(e) =>
                      setNewProject({ ...newProject, description: e.target.value })
                    }
                  />
                  <label>Descripción</label>
                </div>

                <div className="form-floating mb-2">
                  <input
                    type="date"
                    className="form-control"
                    value={newProject.startDate || ""}
                    onChange={(e) =>
                      setNewProject({ ...newProject, startDate: e.target.value })
                    }
                  />
                  <label>Fecha de Inicio</label>
                </div>

                <div className="form-floating mb-2">
                  <input
                    type="date"
                    className="form-control"
                    value={newProject.endDate || ""}
                    onChange={(e) =>
                      setNewProject({ ...newProject, endDate: e.target.value })
                    }
                  />
                  <label>Fecha de Fin</label>
                </div>

                <div className="form-floating mb-2">
                  <select
                    className="form-select"
                    value={newProject.status || ""}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        status: e.target.value as "active" | "inactive" | "completed",
                      })
                    }
                  >
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                    <option value="completed">Completado</option>
                  </select>
                  <label>Estado</label>
                </div>

                <div className="form-floating mb-2">
                  <select
                    className="form-select"
                    value={newProject.projectType || ""}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        projectType: e.target.value as "extensionism" | "volunteering",
                      })
                    }
                  >
                    <option value="">Seleccione...</option>
                    <option value="extensionism">Extensionismo</option>
                    <option value="volunteering">Voluntariado</option>
                  </select>
                  <label>Tipo de Proyecto</label>
                </div>

                <div className="form-floating mb-2">
                  <select
                    className="form-select"
                    value={newProject.academicUnits?.[0]?.id || ""}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        academicUnits: [
                          { id: Number(e.target.value), name: "" },
                        ],
                      })
                    }
                  >
                    <option value="">Seleccione una unidad académica</option>
                    {academicUnits.map((unit) => (
                      <option key={unit.id} value={unit.id}>
                        {unit.name}
                      </option>
                    ))}
                  </select>
                  <label>Unidad Académica</label>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowNewProjectModal(false)}
                >
                  Cancelar
                </button>
                <button className="btn btn-success" onClick={handleSaveProject}>
                  {newProject.id ? "Guardar Cambios" : "Guardar Proyecto"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {projectResponsables && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {projectResponsables.project.title}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setProjectResponsables(null)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>Descripción:</strong> {projectResponsables.project.description}
                </p>
                <p>
                  <strong>Estado:</strong> {projectResponsables.project.status}
                </p>
                <p>
                  <strong>Coordinador:</strong>{" "}
                  {projectResponsables.coordinators.length > 0
                    ? `${projectResponsables.coordinators[0].firstName} ${projectResponsables.coordinators[0].lastName}`
                    : "No asignado"}
                </p>
                <p>
                  <strong>Facilitador:</strong>{" "}
                  {projectResponsables.facilitators.length > 0
                    ? `${projectResponsables.facilitators[0].firstName} ${projectResponsables.facilitators[0].lastName}`
                    : "No asignado"}
                </p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setProjectResponsables(null)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ProjectForm;