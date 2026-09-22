import React, { useEffect, useState } from "react";
import reportService, {
  UserByUnit,
  ProjectByUnit,
  ActivitiesStatus,
  EnrollmentsMonthly,
} from "../../services/reportService";

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  DoughnutController,
  ArcElement,
  LineElement,
  PointElement,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  DoughnutController,
  ArcElement,
  LineElement,
  PointElement
);

const ReportsPage: React.FC = () => {
  const [usersByUnit, setUsersByUnit] = useState<UserByUnit[]>([]);
  const [projectsByUnit, setProjectsByUnit] = useState<ProjectByUnit[]>([]);
  const [activitiesStatus, setActivitiesStatus] = useState<ActivitiesStatus>({
    completadas: 0,
    pendientes: 0,
    enCurso: 0,
  });
  const [enrollments, setEnrollments] = useState<EnrollmentsMonthly>({
    labels: [],
    values: [],
  });

  const [selectedUnit, setSelectedUnit] = useState("all");
  const [selectedProject, setSelectedProject] = useState(1);

  const fmt = new Intl.NumberFormat("es-DO");
  const totalUsers = usersByUnit.reduce((a, b) => a + Number(b.totalUsuarios), 0);
  const totalProjects = projectsByUnit.reduce((a, b) => a + Number(b.totalProyectos), 0);
  const totalUnits = usersByUnit.length;

  useEffect(() => {
    refreshAll();
  }, [selectedUnit, selectedProject]);

  const refreshAll = async () => {
    const users = (await reportService.getUsersByUnit(selectedUnit)).map((u) => ({
      unidad: u.unidad || "Sin asignar",
      totalUsuarios: Number(u.totalUsuarios || 0),
    }));
    setUsersByUnit(users);

    const projects = (await reportService.getProjectsByUnit(selectedUnit)).map((p) => ({
      unidad: p.unidad || "Sin asignar",
      totalProyectos: Number(p.totalProyectos || 0),
    }));
    setProjectsByUnit(projects);

    const activities = await reportService.getActivitiesStatus(selectedProject);
    setActivitiesStatus({
      completadas: Number(activities.completadas || 0),
      pendientes: Number(activities.pendientes || 0),
      enCurso: Number(activities.enCurso || 0),
    });

    const enrollmentsData = await reportService.getEnrollmentsMonthly();
    setEnrollments({
      labels: enrollmentsData.labels || [],
      values: enrollmentsData.values?.map(Number) || [],
    });
  };

  return (
    <div id="reports-page" className="container my-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>Reportes</h1>
          <small className="text-muted">
            Usuarios, Proyectos, Actividades y Unidades Académicas
          </small>
        </div>
        <div className="d-flex gap-2">
          <select
            className="form-select"
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(e.target.value)}
          >
            <option value="all">Todas las Unidades</option>
            {usersByUnit.map((u) => (
              <option key={u.unidad} value={u.unidad}>
                {u.unidad}
              </option>
            ))}
          </select>
          <select
            className="form-select"
            value={selectedProject}
            onChange={(e) => setSelectedProject(Number(e.target.value))}
          >
            <option value={1}>Proyecto #1</option>
            <option value={2}>Proyecto #2</option>
            <option value={3}>Proyecto #3</option>
          </select>
          <button className="btn btn-primary" onClick={refreshAll}>
            Actualizar datos
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card text-center p-3">
            <h5>Usuarios totales</h5>
            <p className="h3">{fmt.format(totalUsers)}</p>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center p-3">
            <h5>Proyectos activos</h5>
            <p className="h3">{fmt.format(totalProjects)}</p>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center p-3">
            <h5>Actividades completadas</h5>
            <p className="h3">{fmt.format(activitiesStatus.completadas)}</p>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center p-3">
            <h5>Unidades académicas</h5>
            <p className="h3">{fmt.format(totalUnits)}</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="row mb-4">
        <div className="col-md-6 mb-3">
          <div className="card p-3">
            <h5>Usuarios por Unidad Académica</h5>
            <Bar
              data={{
                labels: usersByUnit.map((u) => u.unidad),
                datasets: [
                  {
                    label: "Usuarios",
                    data: usersByUnit.map((u) => u.totalUsuarios),
                    backgroundColor: "rgba(4,17,71,0.9)", // azul primario
                    borderRadius: 6,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } },
              }}
            />
          </div>
        </div>

        <div className="col-md-6 mb-3">
          <div className="card p-3">
            <h5>Proyectos por Unidad Académica</h5>
            <Bar
              data={{
                labels: projectsByUnit.map((p) => p.unidad),
                datasets: [
                  {
                    label: "Proyectos",
                    data: projectsByUnit.map((p) => p.totalProyectos),
                    backgroundColor: "rgba(255,131,0,0.9)", // naranja secundario
                    borderRadius: 6,
                  },
                ],
              }}
              options={{
                indexAxis: "y",
                responsive: true,
                plugins: { legend: { display: false } },
                scales: { x: { beginAtZero: true } },
              }}
            />
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-6 mb-3">
          <div className="card p-3">
            <h5>Estado de Actividades</h5>
            <Doughnut
              data={{
                labels: ["Completadas", "Pendientes", "En curso"],
                datasets: [
                  {
                    data: [
                      activitiesStatus.completadas,
                      activitiesStatus.pendientes,
                      activitiesStatus.enCurso,
                    ],
                    backgroundColor: [
                      "rgba(34,197,94,0.9)",   // verde → completadas
                      "rgba(255,131,0,0.9)",   // naranja → pendientes
                      "rgba(4,17,71,0.9)",     // azul → en curso
                    ],
                  },
                ],
              }}
              options={{ responsive: true, plugins: { legend: { position: "bottom" } } }}
            />
          </div>
        </div>

        <div className="col-md-6 mb-3">
          <div className="card p-3">
            <h5>Inscripciones por Mes</h5>
            <Line
              data={{
                labels: enrollments.labels,
                datasets: [
                  {
                    label: "Inscripciones",
                    data: enrollments.values,
                    borderColor: "rgba(4,17,71,0.9)",        // azul primario
                    backgroundColor: "rgba(255,131,0,0.3)",  // naranja translúcido
                    tension: 0.3,
                    fill: true,
                  },
                ],
              }}
              options={{ responsive: true, plugins: { legend: { display: true } } }}
            />
          </div>
        </div>
      </div>

      {/* Tables */}
      <div className="row mb-5">
        <div className="col-md-6 mb-3">
          <div className="card p-3">
            <h5>Detalle · Usuarios por Unidad</h5>
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>Unidad</th>
                    <th>Total usuarios</th>
                  </tr>
                </thead>
                <tbody>
                  {usersByUnit.map((u) => (
                    <tr key={u.unidad}>
                      <td>{u.unidad}</td>
                      <td>{fmt.format(u.totalUsuarios)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-3">
          <div className="card p-3">
            <h5>Detalle · Proyectos por Unidad</h5>
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>Unidad</th>
                    <th>Total proyectos</th>
                  </tr>
                </thead>
                <tbody>
                  {projectsByUnit.map((p) => (
                    <tr key={p.unidad}>
                      <td>{p.unidad}</td>
                      <td>{fmt.format(p.totalProyectos)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;