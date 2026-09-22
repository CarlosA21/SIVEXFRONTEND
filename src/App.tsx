import { Routes, Route, Navigate } from "react-router-dom";

// Terceros
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Layouts
import AdminLayout from "./layouts/AdminLayout";
import AuthLayout from "./layouts/AuthLayout";

// Componentes y funciones auxiliares
import ProtectedRoute from "./components/ProtectedRoutes";

// Páginas de Autenticación
import Login from "./pages/auth/Login/Login";
import ResetPasswordPage from "./pages/auth/ResetPassword";

// Páginas principales
import Home from "./pages/administrator/Home";


// Perfil de usuario
import ProfileUpdateForm from "./pages/profile/ProfileUpdateForm";

// Páginas de error
import NotFoundPage from "./pages/NotFoundPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";

import ProjectForm from "./pages/administrator/ProjectForm";
import ActivityForm from "./pages/administrator/EnclosuresForm";
import TypeProjectForm from "./pages/administrator/TypeProjectForm";
import ProjectUpdate from "./pages/administrator/ProjectUpdate";
//import ProjectView from "./pages/administrator/ProjectView";
import ReportsPage from "./pages/administrator/ReportsPage";
import UserAll from "./pages/administrator/UserAll";
import EditUser from "./pages/administrator/EditUser";
import VolunteerLayout from "./layouts/VolunteerLayout";
import VolunteerProjects from "./pages/volunteer/VolunteerProjects";
import FacilitatorProject from "./pages/facilitator/FacilitatorMyProject";
import CoordinatorProject from "./pages/coordinator/CoorditatorProject";
import CoordinatorLayout from "./layouts/CoordinatorLayout";
import FacilitatorLayout from "./layouts/FacilitatorLayout";
import VolunteerStart from "./pages/volunteer/VolunteerStart";
import VolunteerApplications from "./pages/volunteer/VolunteerApplications";
import VolunteerProblematic from "./pages/volunteer/VolunteerProblematic";
import VolunteerMyProject from "./pages/volunteer/VolunteerMyProject";
import ProjectDetails from "./pages/volunteer/ProjectDetails";
import DashboardFacilitator from "./pages/facilitator/DashboardFacilitator";
import ParticipantsSpeakers from "./pages/facilitator/ParticipantsSpeakers";
import StatisticsReports from "./pages/facilitator/StatisticsReports";
import DashboardCoordinator from "./pages/coordinator/DashboardCoordinator";
import ReportsStatistics from "./pages/coordinator/ReportsStatistics";
import ProjectsHistory from "./pages/coordinator/ProjectsHistory";
import FacilitatorProblematic from "./pages/facilitator/FacilitatorProblematic";
import ProjectAssignment from "./pages/administrator/projectMager";

function App() {
  return (
    <>
      {/* Notificaciones (Toast) */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastStyle={{
          color: "solid #ffffff",
          border: "1px solid #3b7fb4ff",
          borderRadius: "8px",
        }}
      />

      <Routes>
        {/* =====================================
            RUTA POR DEFECTO -> Redirige a login
        ===================================== */}
        <Route path="/" element={<Navigate to="/auth/login" />} />

        {/* =====================================
            RUTAS DE AUTENTICACIÓN
        ===================================== */}
        <Route
          path="/auth/login"
          element={
            <AuthLayout>
              <Login />
            </AuthLayout>
          }
        />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        {/* =====================================
            RUTA PRINCIPAL ADMINISTRADOR (HOME)
        ===================================== */}
        <Route
          path="/Home_administrator"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Home />
              </AdminLayout>
            </ProtectedRoute>
          }
        />


          {/* =====================================
            TIPOS DE PROYECTO
        ===================================== */}
        <Route
          path="/form/type-projects"
          element={
            <ProtectedRoute requiredRole={["ADMINISTRATOR"]}>
              <AdminLayout>
                <TypeProjectForm />
              </AdminLayout>
            </ProtectedRoute>
          }
        />


        <Route
          path="/form/add-type-project"
          element={
            <ProtectedRoute requiredRole={["ADMINISTRATOR"]}>
              <AdminLayout>
                <TypeProjectForm />
              </AdminLayout>
            </ProtectedRoute>
          }
        />



         {/* =====================================
            REPORTES
        ===================================== */}
        <Route
          path="/reports"
          element={
            <ProtectedRoute requiredRole={["ADMINISTRATOR"]}>
              <AdminLayout>
                <ReportsPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* =====================================
            ACTIVIDADES
        ===================================== */}
        <Route
          path="/form/Enclosures"
          element={
            <ProtectedRoute requiredRole={["ADMINISTRATOR"]}>
              <AdminLayout>
                <ActivityForm />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/form/add-activity"
          element={
            <ProtectedRoute requiredRole={["ADMINISTRATOR"]}>
              <AdminLayout>
                <ActivityForm />
              </AdminLayout>
            </ProtectedRoute>
          }
        />




        
        {/* =====================================
            PROYECTOS
        ===================================== */}
        <Route
          path="/form/projects"
          element={
            <ProtectedRoute requiredRole={["ADMINISTRATOR"]}>
              <AdminLayout>
                <ProjectForm />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/form/add-project"
          element={
            <ProtectedRoute requiredRole={["ADMINISTRATOR"]}>
              <AdminLayout>
                <ProjectForm />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/form/edit-project/:id"
          element={
            <ProtectedRoute requiredRole={["ADMINISTRATOR"]}>
              <AdminLayout>
                <ProjectUpdate />
              </AdminLayout>
            </ProtectedRoute>
          }
        />


        {/* <Route
          path="/form/view-project/:id"
          element={
            <ProtectedRoute requiredRole={["ADMINISTRATOR"]}>
              <AdminLayout>
                <ProjectView />
              </AdminLayout>
            </ProtectedRoute>
          }
        /> */}



         {/* =====================================
            RUTA PERFIL DE USUARIO
        ===================================== */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <ProfileUpdateForm />
              </AdminLayout>
            </ProtectedRoute>
          }
        />


         <Route
          path="/form/project-manager"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <ProjectAssignment/>
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* =====================================
            DOCUMENTOS (EJEMPLO DE ROLES)
        ===================================== */}
       

        {/* =====================================
            USUARIOS
        ===================================== */}
        <Route
          path="/form/users"
          element={
            <ProtectedRoute requiredRole={["ADMINISTRATOR"]}>
              <AdminLayout>
                <UserAll />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-user/:id"
          element={
            <ProtectedRoute requiredRole={["ADMINISTRATOR"]}>
              <AdminLayout>
                <EditUser />
              </AdminLayout>
            </ProtectedRoute>
          }
        />



         {/* =====================================
            RUTA PRINCIPAL ADMINISTRADOR (HOME)
        ===================================== */}







        {/* =====================================
            RUTAS PARA VOLUNTARIOS
        ===================================== */}
        <Route
          path="/volunteer/projects"
          element={
            <ProtectedRoute>
              <VolunteerLayout>
                <VolunteerProjects />
              </VolunteerLayout>
            </ProtectedRoute>
          }
        />


        <Route
          path="/volunteer/dashboard"
          element={
            <ProtectedRoute>
              <VolunteerLayout>
                <VolunteerStart />
              </VolunteerLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/volunteer/requests"
          element={
            <ProtectedRoute>
              <VolunteerLayout>
                <VolunteerApplications />
              </VolunteerLayout>
            </ProtectedRoute>
          }
        />


        <Route
          path="/volunteer/issues"
          element={
            <ProtectedRoute>
              <VolunteerLayout>
                <VolunteerProblematic/>
              </VolunteerLayout>
            </ProtectedRoute>
          }
        />


        <Route
          path="/volunteer/profile"
          element={
            <ProtectedRoute>
              <VolunteerLayout>
                <ProfileUpdateForm />
              </VolunteerLayout>
            </ProtectedRoute>
          }
        />



        <Route
          path="/volunteer/my_projects"
          element={
            <ProtectedRoute>
              <VolunteerLayout>
                <VolunteerMyProject/>
              </VolunteerLayout>
            </ProtectedRoute>
          }
        />


        <Route
          path="/proyectos/:projectId"
          element={
            <ProtectedRoute>
              <VolunteerLayout>
                <ProjectDetails/>
              </VolunteerLayout>
            </ProtectedRoute>
          }
        />






        {/* =====================================
            RUTAS PARA FACILITADORES
        ===================================== */}
        

        <Route
          path="/facilitator/dashboard"
          element={
            <ProtectedRoute>
              <FacilitatorLayout>
                <DashboardFacilitator/>
              </FacilitatorLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/facilitator/projects"
          element={
            <ProtectedRoute>
              <FacilitatorLayout>
                <FacilitatorProject />
              </FacilitatorLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/facilitator/participants"
          element={
            <ProtectedRoute>
              <FacilitatorLayout>
                <ParticipantsSpeakers/>
              </FacilitatorLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/facilitator/reports"
          element={
            <ProtectedRoute>
              <FacilitatorLayout>
                <StatisticsReports/>
              </FacilitatorLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/facilitator/profile"
          element={
            <ProtectedRoute>
              <FacilitatorLayout>
                <ProfileUpdateForm />
              </FacilitatorLayout>
            </ProtectedRoute>
          }
        />

        {/* /facilitator/problematic */}

        <Route
          path="/facilitator/problematic"
          element={
            <ProtectedRoute>
              <FacilitatorLayout>
                <FacilitatorProblematic/>
              </FacilitatorLayout>
            </ProtectedRoute>
          }
        />



        

        {/* =====================================
            RUTAS PARA COORDINADORES
        ===================================== */}
        
        <Route
          path="/dashboardCoordinator"
          element={
            <ProtectedRoute>
              <CoordinatorLayout>
                <DashboardCoordinator/>
              </CoordinatorLayout>
            </ProtectedRoute>
          }
        />
        
        
        <Route
          path="/coordinator_project"
          element={
            <ProtectedRoute>
              <CoordinatorLayout>
                <CoordinatorProject />
              </CoordinatorLayout>
            </ProtectedRoute>
          }
        />


        <Route
          path="/reportsStatics"
          element={
            <ProtectedRoute>
              <CoordinatorLayout>
                <ReportsStatistics/>
              </CoordinatorLayout>
            </ProtectedRoute>
          }
        />



        <Route
          path="/projectHistory"
          element={
            <ProtectedRoute>
              <CoordinatorLayout>
                <ProjectsHistory/>
              </CoordinatorLayout>
            </ProtectedRoute>
          }
        />


        <Route
          path="/coordinator/profile"
          element={
            <ProtectedRoute>
              <CoordinatorLayout>
                <ProfileUpdateForm/>
              </CoordinatorLayout>
            </ProtectedRoute>
          }
        />

        

        {/* =====================================
            RUTA PERFIL DE USUARIO
        ===================================== */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <ProfileUpdateForm />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

       

        {/* =====================================
            USUARIOS
        ===================================== */}
        <Route
          path="/form/users"
          element={
            <ProtectedRoute requiredRole={["ADMINISTRATOR"]}>
              <AdminLayout>
                <UserAll />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-user/:id"
          element={
            <ProtectedRoute requiredRole={["ADMINISTRATOR"]}>
              <AdminLayout>
                <EditUser />
              </AdminLayout>
            </ProtectedRoute>
          }
        />





       

        

        {/* =====================================
            RUTAS DE ERRORES / NO AUTORIZADAS
        ===================================== */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;