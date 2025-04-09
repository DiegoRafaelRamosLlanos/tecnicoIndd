import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Card, Row, Col, Tab, Nav } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import './dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const SecretaryDashboard = ({ onLogout }) => {
  const [datos, setDatos] = useState([]);
  const [secondSheetData, setSecondSheetData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [filterDNI, setFilterDNI] = useState(""); 
  const [filterCurso, setFilterCurso] = useState("");
  const [filterNombreApellido, setFilterNombreApellido] = useState("");
  const [expandedRow, setExpandedRow] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Cargar datos iniciales
    axios.get("http://localhost:3001/proyecto/datos")
      .then(response => setDatos(response.data))
      .catch(error => console.error("Error:", error));

    axios.get("http://localhost:3001/proyecto/secondSheetData")
      .then(response => setSecondSheetData(response.data))
      .catch(error => console.error("Error:", error));
  }, []);

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedData(null);
    setExpandedRow(null);
  };

  const toggleRow = (dato) => {
    if (expandedRow === dato.id) {
      setExpandedRow(null);
      setShowPopup(false); 
    } else {
      setExpandedRow(dato.id);
      setSelectedData(dato);
      setShowPopup(true);
    }
  };

  const filteredData = () => {
    const data = datos.filter((dato) => {
      const matchesDNI = filterDNI ? dato.DNI.toString().includes(filterDNI) : true;
      const matchesCurso = filterCurso ? dato.curso.includes(filterCurso) : true;
      const matchesNombreApellido = filterNombreApellido ?
        `${dato.nombre} ${dato.apellido}`.toLowerCase().includes(filterNombreApellido.toLowerCase()) : true;
      return matchesDNI && matchesCurso && matchesNombreApellido;
    });

    if (filterDNI || filterCurso || filterNombreApellido) {
      return data;
    }
    return data.slice(0, 5);
  };

  return (
    <div className="container-fluid mt-2">
      <div className="d-flex justify-content-center mb-2">
        <button 
          className="btn btn-danger square-button" 
          style={{
            width: '200px',
            height: '60px',
            borderRadius: '10px',
            fontSize: '1.2em',
            marginBottom: '10px'
          }} 
          onClick={handleLogout}
        >
          Cerrar Sesión
        </button>
      </div>

      <div className="d-flex mb-3">
        <input
          type="text"
          placeholder="Filtrar por DNI"
          className="form-control mx-1"
          value={filterDNI}
          onChange={(e) => setFilterDNI(e.target.value.trim())}
        />
        <input
          type="text"
          placeholder="Filtrar por Curso"
          className="form-control mx-1"
          value={filterCurso}
          onChange={(e) => setFilterCurso(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filtrar por Nombre y Apellido"
          className="form-control mx-1"
          value={filterNombreApellido}
          onChange={(e) => setFilterNombreApellido(e.target.value)}
        />
      </div>

      {(!filterDNI && !filterCurso && !filterNombreApellido)}

      <table className="table table-striped table-bordered table-hover">
        <thead className="thead-dark">
          <tr>
            <th>Foto</th>
            <th>DNI</th>
            <th>Apellido</th>
            <th>Nombre</th>
            <th>Curso</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredData().map((dato) => (
            <tr key={dato.id}>
              <td><img src={dato.foto} alt="Foto" className="img-thumbnail" style={{ width: "50px", height: "50px" }} /></td>
              <td>{dato.DNI}</td>
              <td>{dato.apellido}</td>
              <td>{dato.nombre}</td>
              <td>{dato.curso}</td>
              <td>
                <button className="btn btn-info btn-sm" onClick={() => toggleRow(dato)}>Ver Detalles</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showPopup && selectedData && (
        <Modal show={showPopup} onHide={handleClosePopup} size="xl">
          <Modal.Header closeButton>
            <Modal.Title>Datos Institucionales del Alumno</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Card>
              <Card.Header bg="info" texto="blanco" style={{ height: '160px' }}>
                <Row align="items-center">
                  <Col md={3} className="text-center">
                    <img src={selectedData.foto} alt="Foto completa" className="img-fluid rounded-circle" />
                  </Col>
                  <Col md={9} className="text-center">
                    <h2>{selectedData.nombre}</h2>
                    <p><strong>ID del Alumno:</strong> {selectedData.DNI}</p>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <Tab.Container defaultActiveKey="informacionPersonal">
                  <Nav variant="tabs">
                    <Nav.Item>
                      <Nav.Link eventKey="informacionPersonal">Información Personal</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="tutor">Tutor</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="secondSheet">Previas</Nav.Link>
                    </Nav.Item>
                  </Nav>
                  <Tab.Content>
                    <Tab.Pane eventKey="informacionPersonal">
                      <ul className="list-unstyled mt-3">
                        <li><strong>Nombre:</strong> {selectedData.nombre}</li>
                        <li><strong>Apellido:</strong> {selectedData.apellido}</li>
                        <li><strong>DNI:</strong> {selectedData.DNI}</li>
                        <li><strong>Curso:</strong> {selectedData.curso}</li>
                        <li><strong>Edad:</strong> {selectedData.edad}</li>
                        <li><strong>Tiene hermanos:</strong> {selectedData.tiene_hermanos}</li>
                        <li><strong>Teléfono alumno:</strong> {selectedData.telefono_alumno}</li>
                        <li><strong>Establecimiento año anterior:</strong> {selectedData.establecimiento_anio_anterior}</li>
                        <li><strong>Enfermedad crónica:</strong> {selectedData.enfermedad_cronica}</li>
                        <li><strong>Cuál enfermedad:</strong> {selectedData.cual_enfermedad}</li>
                        <li><strong>Medicación:</strong> {selectedData.medicacion}</li>
                        <li><strong>Cuál medicación:</strong> {selectedData.cual_medicacion}</li>
                        <li><strong>Correo electrónico:</strong> {selectedData.correoElectronico}</li>
                        <li><strong>Fecha de nacimiento:</strong> {selectedData.fecha_nacimiento}</li>
                        <li><strong>Lugar de nacimiento:</strong> {selectedData.lugar_nacimiento}</li>
                        <li><strong>Nacionalidad:</strong> {selectedData.nacionalidad}</li>
                        <li><strong>Domicilio:</strong> {selectedData.domicilio}</li>
                        <li><strong>Barrio:</strong> {selectedData.barrio}</li>
                        <li><strong>Código postal:</strong> {selectedData.cod_postal}</li>
                      </ul>
                    </Tab.Pane>
                    <Tab.Pane eventKey="tutor">
                      <h5 className="mt-3">Tutor</h5>             
                      <ul className="list-unstyled">
                        <li><strong>Apellido del tutor:</strong> {selectedData.apellido_tutor}</li>
                        <li><strong>Nombre del tutor:</strong> {selectedData.nombre_tutor}</li>
                        <li><strong>Teléfono del tutor:</strong> {selectedData.telefono_tutor}</li>
                        <li><strong>Teléfono del tutor 2:</strong> {selectedData.telefono_tutor2}</li>
                        <li><strong>DNI tutor:</strong> {selectedData.DNI_tutor}</li>
                        <li><strong>CUIT tutor:</strong> {selectedData.cuit_tutor}</li>
                      </ul>
                    </Tab.Pane>
                    <Tab.Pane eventKey="secondSheet">
                      <h5 className="mt-3">Previas</h5>
                      <div className="table-responsive">
                        <table className="table table-striped table-bordered">
                          <thead>
                            <tr>
                              <th>Curso</th>
                              <th>Materia</th>
                              <th>Nota</th>
                              <th>Estado</th>
                            </tr>
                          </thead>
                          <tbody>
                            {secondSheetData
                              .filter(item => item.DNI === selectedData?.DNI)
                              .map((item, index) => (
                                <tr key={index}>
                                  <td>{item.cursoMateria}</td>
                                  <td>{item.materia}</td>
                                  <td>{item.nota}</td>
                                  <td>{item.estado}</td>
                                </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Tab.Pane>
                  </Tab.Content>
                </Tab.Container>
              </Card.Body>
            </Card>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClosePopup}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default SecretaryDashboard;
