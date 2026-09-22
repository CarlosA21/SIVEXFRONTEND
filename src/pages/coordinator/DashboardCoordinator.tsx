// // src/pages/DashboardCoordinator.tsx
// import React, { useEffect, useState } from "react";
// import { Bar } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   Title,
//   Tooltip,
//   Legend,
//   BarElement,
//   CategoryScale,
//   LinearScale,
// } from "chart.js";
// import { fetchKpis, KpiData } from "../../services/Dashboard_Service";

// ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

// const DashboardCoordinator: React.FC = () => {
//   const [kpiData, setKpiData] = useState<KpiData | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     document.title = import.meta.env.VITE_NOMBRE_PAGINA + " - Dashboard";

//     const loadKpis = async () => {
//       try {
//         setLoading(true);
//         const data = await fetchKpis();
//         setKpiData(data);
//         setError(null);
//       } catch (err: any) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadKpis();
//   }, []);

//   if (loading) {
//     return <div className="container my-4 alert alert-info">Cargando KPIs...</div>;
//   }

//   if (error) {
//     return <div className="container my-4 alert alert-danger">{error}</div>;
//   }

//   if (!kpiData) {
//     // This case should ideally not be reached if loading/error are handled,
//     // but it's good practice to have a fallback.
//     return <div className="container my-4">No hay datos para mostrar.</div>;
//   }

//   // Desestructurar los datos para usarlos en el componente
//   const { totalUsers, completedActivities, activeProjects, totalUnits } = kpiData;

//   // Datos para el gráfico
//   const chartData = {
//     labels: ["Usuarios", "Actividades Completadas", "Proyectos Activos", "Recintos"],
//     datasets: [
//       {
//         label: "Cantidad",
//         data: [totalUsers, completedActivities, activeProjects, totalUnits],
//         backgroundColor: [
//           "rgba(0, 123, 255, 0.7)",
//           "rgba(111, 66, 193, 0.7)",
//           "rgba(220, 53, 69, 0.7)",
//           "rgba(23, 162, 184, 0.7)",
//         ],
//         borderRadius: 5,
//       },
//     ],
//   };

//   const chartOptions = {
//     responsive: true,
//     plugins: {
//       legend: { display: false },
//       title: {
//         display: true,
//         text: "Resumen General",
//         font: { size: 18 },
//       },
//     },
//     scales: {
//       y: { beginAtZero: true, ticks: { stepSize: 1 } },
//     },
//   };

//   return (
//     <div className="container my-4">
//       <h1 className="mb-4 text-center">Dashboard</h1>

//       {/* Tarjetas resumen */}
//       <div className="row g-4 mb-4">
//         <div className="col-md-3 col-sm-6">
//           <div className="card shadow h-100" style={{ borderLeft: "5px solid #007bff" }}>
//             <div className="card-body text-center">
//               <h5 className="card-title text-primary">Usuarios</h5>
//               <p className="display-4 fw-bold">{totalUsers}</p>
//               <p className="card-text text-muted">Cantidad total de usuarios</p>
//             </div>
//           </div>
//         </div>

//         <div className="col-md-3 col-sm-6">
//           <div className="card shadow h-100" style={{ borderLeft: "5px solid #6f42c1" }}>
//             <div className="card-body text-center">
//               <h5 className="card-title text-purple">Actividades completadas</h5>
//               <p className="display-4 fw-bold">{completedActivities}</p>
//               <p className="card-text text-muted">Actividades gestionadas</p>
//             </div>
//           </div>
//         </div>

//         <div className="col-md-3 col-sm-6">
//           <div className="card shadow h-100" style={{ borderLeft: "5px solid #dc3545" }}>
//             <div className="card-body text-center">
//               <h5 className="card-title text-danger">Actividades</h5>
//               <p className="display-4 fw-bold">{activeProjects}</p>
//               <p className="card-text text-muted">Actividades registrados</p>
//             </div>
//           </div>
//         </div>

//         <div className="col-md-3 col-sm-6">
//           <div className="card shadow h-100" style={{ borderLeft: "5px solid #17a2b8" }}>
//             <div className="card-body text-center">
//               <h5 className="card-title text-info">Recintos</h5>
//               <p className="display-4 fw-bold">{totalUnits}</p>
//               <p className="card-text text-muted">Recintos disponibles</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Gráfico resumen */}
//       <div className="card shadow p-3">
//         <Bar data={chartData} options={chartOptions} />
//       </div>
//     </div>
//   );
// };

// export default DashboardCoordinator;


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

const DashboardCoordinator: React.FC = () => {
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

export default DashboardCoordinator;
