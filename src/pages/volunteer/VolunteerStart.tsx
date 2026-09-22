// src/components/VolunteerStart.tsx
import React from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const VolunteerStart: React.FC = () => {
  return (
    <div className="container mt-5">
      <h2 className="text-center mb-5 fw-bold" style={{ color: '#041147' }}>
        Panel del Voluntario
      </h2>
      <div className="row justify-content-center">

        <div className="col-md-4 mb-4">

          <Card className="h-100 shadow-lg border-0" style={{ transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out' }} onMouseOver={(e) => {
            (e.currentTarget as HTMLElement).style.transform = 'translateY(-5px) scale(1.02)';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.15)';
          }} onMouseOut={(e) => {
            (e.currentTarget as HTMLElement).style.transform = 'translateY(0) scale(1)';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'; // Sombra default de Bootstrap
          }}>
            <Card.Body className="d-flex flex-column justify-content-between">
              <Card.Title className="h4 fw-bold" style={{ color: '#041147' }}>Mis Proyectos</Card.Title>
              <Card.Text className="text-secondary">
                Accede a los proyectos en los que participas actualmente.
              </Card.Text>
              <Button
                variant="primary" // Bootstrap usa 'primary' por defecto, pero personalizamos el color
                className="w-100 mt-3 fw-bold"
                style={{ backgroundColor: '#041147', borderColor: '#041147', color: '#fff' }}
                onMouseOver={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = '#030a2f';
                  (e.currentTarget as HTMLElement).style.borderColor = '#030a2f';
                }}
                onMouseOut={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = '#041147';
                  (e.currentTarget as HTMLElement).style.borderColor = '#041147';
                }}
              >
                <Link to="/volunteer/my_projects" style={{color:'white'}}>
                  Ver Proyectos

                </Link>

              </Button>
            </Card.Body>
          </Card>
        </div>

        <div className="col-md-4 mb-4">
          <Card className="h-100 shadow-lg border-0" style={{ transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out' }} onMouseOver={(e) => {
            (e.currentTarget as HTMLElement).style.transform = 'translateY(-5px) scale(1.02)';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.15)';
          }} onMouseOut={(e) => {
            (e.currentTarget as HTMLElement).style.transform = 'translateY(0) scale(1)';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'; // Sombra default de Bootstrap
          }}>
            <Card.Body className="d-flex flex-column justify-content-between">
              <Card.Title className="h4 fw-bold" style={{ color: '#041147' }}>Exponer Problemática</Card.Title>
              <Card.Text className="text-secondary">
                Expone tus dudas, seran respondidas en el menor tiempo posible.
              </Card.Text>
              <Button
                variant="primary" // Usamos 'secondary' como base para nuestro color naranja
                className="w-100 mt-3 fw-bold"
                style={{ backgroundColor: '#041147', borderColor: '#041147', color: '#fff' }}
                onMouseOver={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = '#e67500';
                  (e.currentTarget as HTMLElement).style.borderColor = '#e67500';
                }}
                onMouseOut={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = '#ff8300';
                  (e.currentTarget as HTMLElement).style.borderColor = '#ff8300';
                }}
              >
                <Link to="/volunteer/issues" style={{color:'white'}}>
                  Problematica
                </Link>
              </Button>
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-4 mb-4">
          <Card className="h-100 shadow-lg border-0" style={{ transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out' }} onMouseOver={(e) => {
            (e.currentTarget as HTMLElement).style.transform = 'translateY(-5px) scale(1.02)';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.15)';
          }} onMouseOut={(e) => {
            (e.currentTarget as HTMLElement).style.transform = 'translateY(0) scale(1)';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'; // Sombra default de Bootstrap
          }}>


            <Card.Body className="d-flex flex-column justify-content-between">
              <Card.Title className="h4 fw-bold" style={{ color: '#041147' }}>Mis Solicitudes</Card.Title>
              <Card.Text className="text-secondary">
                Revisa el estado de tus solicitudes de participación.
              </Card.Text>
              <Button
                variant="info" // Usamos 'info' como base, pero personalizamos el color
                className="w-100 mt-3 fw-bold"
                style={{ backgroundColor: '#041147', borderColor: '#041147', color: '#fff' }}
                
              >
                <Link to="/volunteer/requests" style={{color:'white'}}>
                  Ver Solicitudes
                </Link>

              </Button>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VolunteerStart;
