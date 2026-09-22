// src/pages/Home.tsx
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { DashboardService, DashboardKpis } from "../../services/dashboardService";

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const Home: React.FC = () => {
  const [kpis, setKpis] = useState<DashboardKpis>({
    totalUsers: 0,
    completedActivities: 0,
    activeProjects: 0,
    totalUnits: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = import.meta.env.VITE_NOMBRE_PAGINA + " - Dashboard";

    const fetchKpis = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await DashboardService.getKpis();
        setKpis({
          totalUsers: data.totalUsers || 0,
          completedActivities: data.completedActivities || 0,
          activeProjects: data.activeProjects || 0,
          totalUnits: data.totalUnits || 0,
        });
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || "Error al cargar KPIs");
      } finally {
        setLoading(false);
      }
    };

    fetchKpis();
  }, []);

  // 🎨 Colores de la paleta
  const primary = "#041147"; 
  const secondary = "#ff8300"; 
  const accent1 = "#4caf50"; 
  const accent2 = "#17a2b8"; 

  // Datos para el gráfico
  const chartData = {
    labels: ["Usuarios", "Actividades Completadas", "Proyectos Activos", "Recintos"],
    datasets: [
      {
        label: "Cantidad",
        data: [kpis.totalUsers, kpis.completedActivities, kpis.activeProjects, kpis.totalUnits],
        backgroundColor: [primary, secondary, accent1, accent2],
        borderColor: [primary, secondary, accent1, accent2],
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Resumen General",
        font: { size: 18, weight: 600 },
        color: "#041147",
      },
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 }, grid: { color: "rgba(4, 17, 71, 0.1)" } },
      x: { grid: { color: "rgba(4, 17, 71, 0.05)" } },
    },
  };

  return (
    <div className="container my-4">
      <h1 className="mb-4 text-center" style={{ color: primary }}>Dashboard</h1>

      {loading && <div className="alert alert-info">Cargando KPIs...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <>
          {/* Tarjetas resumen */}
          <div className="row g-4 mb-4">
            {[
              { label: "Usuarios", value: kpis.totalUsers, color: primary, text: "Cantidad total de usuarios" },
              { label: "Actividades completadas", value: kpis.completedActivities, color: secondary, text: "Actividades gestionadas" },
              { label: "Proyectos Activos", value: kpis.activeProjects, color: accent1, text: "Proyectos en ejecución" },
              { label: "Recintos", value: kpis.totalUnits, color: accent2, text: "Recintos disponibles" },
            ].map((card, idx) => (
              <div className="col-md-3 col-sm-6" key={idx}>
                <div className="card shadow h-100" style={{ borderLeft: `6px solid ${card.color}` }}>
                  <div className="card-body text-center">
                    <h5 className="card-title" style={{ color: card.color }}>{card.label}</h5>
                    <p className="display-4 fw-bold">{card.value}</p>
                    <p className="card-text text-muted">{card.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Gráfico resumen */}
          <div className="card shadow p-3">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </>
      )}
    </div>
  );
};

export default Home;


