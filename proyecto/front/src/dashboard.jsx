import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Card, Row, Col, Nav, Tab } from 'react-bootstrap';
import useSectionToggle from "./sectionToggle"; // Ruta al para controlar botones
import './dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Dashboard = ({ onLogout }) => {
  const [datos, setDatos] = useState([]);
  const [secondSheetData, setSecondSheetData] = useState([]); // Nuevo estado
  const [showPopup, setShowPopup] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [filterDNI, setFilterDNI] = useState("");
  const [filterCurso, setFilterCurso] = useState("");
  const [filterNombreApellido, setFilterNombreApellido] = useState("");
  const [editingData, setEditingData] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { activeSection, handleSectionToggle } = useSectionToggle()
  const [preheviasData, setPreheviasData] = useState([]);
  const [filterSecondSheetDNI, setFilterSecondSheetDNI] = useState("");
  const [filterMateria, setFilterMateria] = useState("");
  const [filterSecondSheetNombre, setFilterSecondSheetNombre] = useState("");
 
  const [formData, setFormData] = useState({
    foto: "", 
    DNI: "", 
    apellido: "", 
    nombre: "", 
    localidad: "", 
    tiene_hermanos: "", 
    telefono_alumno: "",
    apellido_tutor: "", 
    nombre_tutor: "", 
    telefono_tutor: "", 
    telefono_tutor2: "", 
    curso: "",
    establecimiento_anio_anterior: "", 
    DNI_tutor: "", 
    cuit_tutor: "", 
    enfermedad_cronica: "", 
    cual_enfermedad: "",
    medicacion: "", 
    cual_medicacion: "", 
    correoElectronico: "", 
    fecha_nacimiento: "", 
    edad: "", 
    lugar_nacimiento: "",
    nacionalidad: "", 
    domicilio: "", 
    barrio: "", 
    cod_postal: ""
  });

  const [newData, setNewData] = useState({
    foto: "", 
    DNI: "", 
    apellido: "", 
    nombre: "", 
    localidad: "", 
    tiene_hermanos: "", 
    telefono_alumno: "",
    apellido_tutor: "", 
    nombre_tutor: "", 
    telefono_tutor: "", 
    telefono_tutor2: "", 
    curso: "",
    establecimiento_anio_anterior: "", 
    DNI_tutor: "", 
    cuit_tutor: "", 
    enfermedad_cronica: "", 
    cual_enfermedad: "",
    medicacion: "", 
    cual_medicacion: "", 
    correoElectronico: "", 
    fecha_nacimiento: "", 
    edad: "", 
    lugar_nacimiento: "",
    nacionalidad: "", 
    domicilio: "", 
    barrio: "", 
    cod_postal: ""
  });

  const [secondSheetFormData, setSecondSheetFormData] = useState({
    DNI: "",
    apellido: "",
    nombre: "",
    cursoMateria: "", // Solo mantenemos el curso de la materia
    materia: "",
    nota: "",
    estado: ""
  });

  const [editingSecondSheetData, setEditingSecondSheetData] = useState(null);

  const handleEditSecondSheet = (item) => {
    setEditingSecondSheetData(item);
    setSecondSheetFormData({
      DNI: item.DNI,
      apellido: item.apellido,
      nombre: item.nombre,
      cursoMateria: item.cursoMateria,
      materia: item.materia,
      nota: item.nota,
      estado: item.estado
    });
  };

  const handleUpdateSecondSheet = () => {
    const updatedData = secondSheetData.map(item => {
      if (item.DNI === editingSecondSheetData.DNI && 
          item.materia === editingSecondSheetData.materia) {
        return { ...secondSheetFormData };
      }
      return item;
    });

    axios.put(`http://localhost:3001/proyecto/updateSecondSheetData`, updatedData)
      .then(response => {
        setSecondSheetData(updatedData);
        setEditingSecondSheetData(null);
        setSecondSheetFormData({
          DNI: "",
          apellido: "",
          nombre: "",
          cursoMateria: "",
          materia: "",
          nota: "",
          estado: ""
        });
      })
      .catch(error => {
        console.error("Error al actualizar datos:", error);
      });
  };

  const navigate = useNavigate();

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

  useEffect(() => {
    axios.get("http://localhost:3001/proyecto/datos")
      .then(response => {
        console.log("Datos recibidos:", response.data);
        setDatos(response.data);
      })
      .catch(error => {
        console.error("Error al obtener los datos: ", error);
      });
  }, []);

  useEffect(() => {
    axios.get("http://localhost:3001/prehevias/datos")
      .then(response => {
        console.log("Datos de prehevias recibidos:", response.data);
        setPreheviasData(response.data);
      })
      .catch(error => {
        console.error("Error al obtener los datos de prehevias: ", error);
      });
  }, []);

  // Agregar nuevo useEffect para cargar datos de la segunda hoja
  useEffect(() => {
    axios.get("http://localhost:3001/proyecto/secondSheetData")
      .then(response => {
        console.log("Datos de la segunda hoja:", response.data);
        setSecondSheetData(response.data);
      })
      .catch(error => {
        console.error("Error al obtener datos de la segunda hoja:", error);
      });
  }, []);

  const handleDelete = (id) => {
      if (window.confirm("¿Estás seguro de que deseas eliminar este estudiante? Esta acción no se puede deshacer.")) {
        axios.delete(`http://localhost:3001/proyecto/borrarUsuario/${id}`)
        .then(response => {
          setDatos(datos.filter(dato => dato.id !== id));
        })
        .catch(error => {
          console.error("Error al eliminar el dato:", error);
        });
      }
  };


  const handleEdit = (dato) => {
    setEditingData(dato);
    setFormData(dato);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = () => {
    axios.put(`http://localhost:3001/proyecto/actualizarUsuario/${editingData.id}`, formData)
      .then(response => {
        setDatos(datos.map(dato => (dato.id === editingData.id ? { ...dato, ...formData } : dato)));
        setEditingData(null);
      })
      .catch(error => {
        console.error("Error al actualizar el dato:", error);
      });
  };

  const handleNewDataChange = (e) => {
    const { name, value } = e.target;
    setNewData({ ...newData, [name]: value });
  };

  const handleDNIChange = (e) => {
    const value = e.target.value.trim();
    setFilterDNI(value);
  };

  const handleNewDataSubmit = () => {
    axios.post("http://localhost:3001/proyecto/registrarUsuario", newData)
      .then(response => {
        setDatos([...datos, response.data.data]);
        alert('Alumno agregado exitosamente');
        setNewData({
          foto: "", 
          DNI: "", 
          apellido: "", 
          nombre: "", 
          localidad: "", 
          tiene_hermanos: "", 
          telefono_alumno: "",
          apellido_tutor: "", 
          nombre_tutor: "", 
          telefono_tutor: "", 
          telefono_tutor2: "", 
          curso: "",
          establecimiento_anio_anterior: "", 
          DNI_tutor: "", 
          cuit_tutor: "", 
          enfermedad_cronica: "", 
          cual_enfermedad: "",
          medicacion: "", 
          cual_medicacion: "", 
          correoElectronico: "", 
          fecha_nacimiento: "", 
          edad: "", 
          lugar_nacimiento: "",
          nacionalidad: "", 
          domicilio: "", 
          barrio: "", 
          cod_postal: ""
        });
      })
      .catch(error => {
        console.error("Error al registrar el nuevo dato:", error);
        alert('Error al agregar el alumno');
      });
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Lista de Alumnos", 10, 10);
    doc.setFontSize(12);
    doc.text("nombre - apellido - dni - curso", 10, 20);
  
    let y = 30; 
  
    datos.forEach((dato, index) => {
      doc.text(`${index + 1}. ${dato.nombre} ${dato.apellido} - ${dato.DNI} - ${dato.curso}`, 10, y);
      y += 10;
    });
  
    doc.save("lista_alumnos.pdf");
  };
  


  const filteredData = () => {
    const data = datos.filter((dato) => {
      const matchesDNI = filterDNI ? dato.DNI.toString().includes(filterDNI) : true;
      const matchesCurso = filterCurso ? dato.curso.includes(filterCurso) : true;
      const matchesNombreApellido = filterNombreApellido ?
        `${dato.nombre} ${dato.apellido}`.toLowerCase().includes(filterNombreApellido.toLowerCase()) : true;
      return matchesDNI && matchesCurso && matchesNombreApellido;
    });

    // Si hay algún filtro activo, devolver todos los resultados filtrados
    if (filterDNI || filterCurso || filterNombreApellido) {
      return data;
    }
    
    // Si no hay filtros, devolver solo los primeros 5 registros
    return data.slice(0, 5);
  };

  const handleSaveChanges = () => {
    if (selectedData) {
      axios.put(`http://localhost:3001/proyecto/actualizarUsuario/${selectedData.id}`, selectedData)
        .then(response => {
          setDatos(datos.map(dato => (dato.id === selectedData.id ? { ...dato, ...selectedData } : dato)));
          handleClosePopup();
        })
        .catch(error => {
          console.error("Error al guardar los cambios:", error);
        });
    }
  };

  const handleInputChange = (key, value) => {
    setSelectedData(prevState => ({
      ...prevState,
      [key]: value,
    }));
  };

  const toggleButtonClass = (event) => {
    const buttons = document.querySelectorAll('.square-button');
    buttons.forEach(button => button.classList.remove('active'));
    event.currentTarget.classList.add('active');
  };

  const handleSecondSheetSubmit = () => {
    if (!secondSheetFormData.DNI || !secondSheetFormData.materia || !secondSheetFormData.nota || !secondSheetFormData.estado) {
        alert("Por favor complete todos los campos requeridos");
        return;
    }

    const estudiante = datos.find(d => d.DNI === secondSheetFormData.DNI);
    if (estudiante) {
        const newSecondSheetData = {
            ...secondSheetFormData,
            apellido: estudiante.apellido,
            nombre: estudiante.nombre
        };

        axios.post("http://localhost:3001/proyecto/addOrUpdateSecondSheetData", newSecondSheetData)
            .then(response => {
                if (response.data.success) {
                    alert("Datos agregados correctamente");
                    setSecondSheetData([...secondSheetData, newSecondSheetData]);
                    // Limpiar solo los campos de materia, nota y estado
                    setSecondSheetFormData(prev => ({
                        ...prev,
                        materia: "",
                        nota: "",
                        estado: ""
                    }));
                }
            })
            .catch(error => {
                if (error.response && error.response.data.error) {
                    alert(error.response.data.error);
                } else {
                    alert("Error al agregar datos a la segunda hoja");
                }
            });
    } else {
        alert("DNI no encontrado en la primera hoja");
    }
};

  const filteredSecondSheetData = () => {
    const data = secondSheetData.filter((item) => {
      const matchesDNI = filterSecondSheetDNI ? item.DNI.toString().includes(filterSecondSheetDNI) : true;
      const matchesMateria = filterMateria ? item.materia.toLowerCase().includes(filterMateria.toLowerCase()) : true;
      const matchesNombre = filterSecondSheetNombre ? 
        `${item.nombre} ${item.apellido}`.toLowerCase().includes(filterSecondSheetNombre.toLowerCase()) : true;
      return matchesDNI && matchesMateria && matchesNombre;
    });

    // Si hay algún filtro activo, devolver todos los resultados filtrados
    if (filterSecondSheetDNI || filterMateria || filterSecondSheetNombre) {
      return data;
    }
    
    // Si no hay filtros, devolver solo los primeros 5 registros
    return data.slice(0, 5);
  };

  const isModalVisible = showPopup && selectedData !== null;
  return (
    <div className="container-fluid mt-1-">
     {/* <button className="btn btn-danger btn-lg btn-block" onClick={handleLogout}>Cerrar sesión</button>
      <button className="btn btn-success btn-lg btn-block" onClick={exportToPDF}>Exportar a PDF</button>
*/}

    <div className="d-flex justify-content-center mb-4"> {/* Contenedor para centrar los botones */}
      <button 
        className="btn btn-info square-button mx-2" 
        data-description="Agregar nuevo estudiante"
        onClick={(e) => {handleSectionToggle("addData")
          toggleButtonClass(e);
        }}
        
      >
        {activeSection === "addData" ? "Ocultar Datos" : "Agregar Datos"}
      </button>
      <button 
        className="btn btn-info square-button mx-2" 
        data-description="Modificar datos existentes"
        onClick={(e) => {
          handleSectionToggle("modifyData");
          toggleButtonClass(e);
        }}
      >
        {activeSection === "modifyData" ? "Ocultar" : "Modificar Datos"}
      </button>
      <button 
        className="btn btn-info square-button mx-2" 
        data-description="Ver información detallada"
        onClick={(e) => {
          handleSectionToggle("consultData");
          toggleButtonClass(e);
        }}
      >
        {activeSection === "consultData" ? "Ocultar" : "Consultar Datos"}
      </button>
      <button 
        className="btn btn-info square-button mx-2" 
        data-description="Eliminar registros"
        onClick={(e) => {
          handleSectionToggle("deleteData");
          toggleButtonClass(e);
        }}
      >
        {activeSection === "deleteData" ? "Ocultar" : "Eliminar"}
      </button>
      <button 
        className="btn btn-info square-button mx-2" 
        data-description="Gestionar materias previas"
        onClick={(e) => {
          handleSectionToggle("secondSheet");
          toggleButtonClass(e);
        }}
      >
        {activeSection === "secondSheet" ? "Ocultar" : "Previas"}
      </button>
    </div>


      {activeSection === "addData" && (
        <div className="mb-4 p-4 border rounded bg-white shadow-sm">
          <h4 className="mb-4 text-primary">Registro de Nuevo Estudiante</h4>
          <div className="row g-3">
            {/* Primera fila - Datos principales */}
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                name="foto"
                value={newData.foto}
                onChange={handleNewDataChange}
                placeholder="URL de la foto"
              />
            </div>
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                name="DNI"
                value={newData.DNI}
                onChange={handleNewDataChange}
                placeholder="DNI"
              />
            </div>
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                name="apellido"
                value={newData.apellido}
                onChange={handleNewDataChange}
                placeholder="Apellido"
              />
            </div>
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                name="nombre"
                value={newData.nombre}
                onChange={handleNewDataChange}
                placeholder="Nombre"
              />
            </div>
            <div className="col-12 text-center mt-4">
              <button 
                className="btn btn-primary btn-lg px-5"
                onClick={handleNewDataSubmit}
                style={{
                  background: 'linear-gradient(145deg, #3498db, #2c3e50)',
                  border: 'none',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                }}
              >
                Registrar Estudiante
              </button>
            </div>
          </div>
        </div>
      )}


      {activeSection === "modifyData" && (
        
        <div>

          <div className="d-flex mb-3">
            <input
              type="text"
              placeholder="Filtrar por DNI"
              className="form-control mx-1"
              value={filterDNI}
              onChange={handleDNIChange}
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
          {(filterDNI || filterCurso || filterNombreApellido) && (
      <table className="table table-striped table-bordered table-hover">
        <thead>
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
            <React.Fragment  key={dato.id}>
              <tr>
                    <td><img src={dato.foto} alt="Foto de alumno" style={{ width: "120px", height: "120px", objectFit: "cover" }} />
                    </td>
                    <td>{dato.DNI}</td>
                    <td>{dato.apellido}</td>
                    <td>{dato.nombre}</td>
                    <td>{dato.curso}</td>
                    <td style={{ textAlign: 'center', display: 'flex', alignItems: 'center' }}>
                      <button
                        className="btn btn-info"
                        onClick={() => toggleRow(dato)}
                      >
                          {showModal === dato.id
                          ? "No Mostrar"
                          : "Editar"}
                      </button>
                    </td>
                  </tr>
                   {/* pop up para mostrar datos completos de un alumno */}
{isModalVisible && expandedRow === dato.id && (
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
          {/* Formulario editable */}
          <Tab.Container defaultActiveKey="informacionPersonal">
            <Nav variant="tabs">
              <Nav.Item>
                <Nav.Link eventKey="informacionPersonal">Informacion Personal</Nav.Link>
              </Nav.Item>
             {/* <Nav.Item>
                <Nav.Link eventKey="prehevias">Prehevias</Nav.Link>
              </Nav.Item>*/}
              <Nav.Item>
                <Nav.Link eventKey="tutor">Tutor</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="secondSheet">Previas</Nav.Link>
              </Nav.Item>
            </Nav>
            <Tab.Content>
              <Tab.Pane eventKey="informacionPersonal">
                <ul className="list-unstyled">
                  {/* Campos editables */}
                  <li key="foto">
                    <strong>Foto:</strong> 
                    <input 
                      type="text" 
                      value={selectedData.foto || ''} 
                      onChange={(e) => handleInputChange('foto', e.target.value)} 
                    />
                  </li>
                  <li key="DNI">
                    <strong>DNI:</strong> 
                    <input 
                      type="text" 
                      value={selectedData.DNI || ''} 
                      onChange={(e) => handleInputChange('DNI', e.target.value)} 
                    />
                  </li>
                  {Object.entries(selectedData).map(([key, value]) => {
                    // Lista de campos que no queremos mostrar aquí
                    const excludedFields = [
                      'foto', 
                      'DNI', 
                      'apellido_tutor', 
                      'nombre_tutor', 
                      'telefono_tutor', 
                      'telefono_tutor2', 
                      'DNI_tutor', 
                      'cuit_tutor',
                      'marca_temporal'
                    ];
                    
                    if (!excludedFields.includes(key)) {
                      return (
                        <li key={key}>
                          <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> 
                          <input 
                            type="text" 
                            value={value} 
                            onChange={(e) => handleInputChange(key, e.target.value)} 
                          />
                        </li>
                      );
                    }
                    return null;
                  })}
                </ul>
              </Tab.Pane>

              {/* Sección Prehevias 
              <Tab.Pane eventKey="prehevias">
                <h5>Prehevias</h5>             
                  {['materias_adeuda', 'adeuda_materias', 'quien_aprobo'].map((field) => (
                    <li key={field}>
                      <strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong> 
                      <input 
                        type="text" 
                        value={selectedData[field]} 
                        onChange={(e) => handleInputChange(field, e.target.value)} 
                      />
                    </li>
                  ))}
              </Tab.Pane>
*/}
              {/* Sección Tutor */}
              <Tab.Pane eventKey="tutor">
                <h5>Tutor</h5>             
                  {/* Campos editables para Tutor */}
                  {['apellido_tutor', 'nombre_tutor', 'telefono_tutor', 'telefono_tutor2', 'DNI_tutor', 'cuit_tutor'].map((field) => (
                    <li key={field}>
                      <strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong> 
                      <input 
                        type="text" 
                        value={selectedData[field]} 
                        onChange={(e) => handleInputChange(field, e.target.value)} 
                      />
                    </li>
                  ))}
              </Tab.Pane>

              {/* Sección Segunda Hoja */}
              <Tab.Pane eventKey="secondSheet">
                <h5>Previas</h5>
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
                            <td data-estado={item.estado}>{item.estado}</td>
                          </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Tab.Pane>

            </Tab.Content>
          </Tab.Container>
        </Card.Body>

        {/* Botones para guardar/cancelar */}
        <Card.Footer className="text-center">
          <Button variant="primary" onClick={handleSaveChanges}>
            Guardar Cambios
          </Button>
          {' '}
          <Button variant="secondary" onClick={handleClosePopup}>
            Cancelar
          </Button>
        </Card.Footer>

      </Card>
    </Modal.Body>
  </Modal>
)}


            </React.Fragment>
          ))}
        </tbody>
      </table>
    )}
  </div>
)}


      {activeSection === "consultData" && (
        <div>
          <div className="d-flex mb-3">
            <input
              type="text"
              placeholder="Filtrar por DNI"
              className="form-control mx-1"
              value={filterDNI}
              onChange={handleDNIChange}
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
          
          {(!filterDNI && !filterCurso && !filterNombreApellido) && (
            <p className="text-muted">
              Mostrando los primeros 5 registros. Use los filtros para ver más resultados.
            </p>
          )}

          <table className="table table-striped table-bordered table-hover">
          <thead class="thead-dark">
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
                <React.Fragment key={dato.id}>
                  <tr>
                    <td><img src={dato.foto} alt="Foto de alumno" style={{ width: "120px", height: "120px", objectFit: "cover" }} />
                    </td>
                    <td>{dato.DNI}</td>
                    <td>{dato.apellido}</td>
                    <td>{dato.nombre}</td>
                    <td>{dato.curso}</td>
                    <td>
                       {/*<button
                        className="btn btn-danger"
                        onClick={() => handleDelete(dato.id)}
                      >
                        Eliminar
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleEdit(dato)}
                      >
                        Editar
                      </button>*/}
                      <button
                        className="btn btn-info"
                        onClick={() => toggleRow(dato)}
                      >
                        {expandedRow === dato.id
                          ? "Mostrar Vista Reducida"
                          : "Mostrar Datos Completos"}
                      </button>
                    </td>
                  </tr>
                  {/* pop up para mostrar datos completos de un alumno */}
                  {isModalVisible && expandedRow === dato.id && (
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
                <Nav.Link eventKey="informacionPersonal">Informacion Personal</Nav.Link>
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
                <ul className="list-unstyled">
                  <li><strong>Nombre:</strong> {selectedData.nombre}</li>
                  <li><strong>Apellido:</strong> {selectedData.apellido}</li>
                  <li><strong>DNI:</strong> {selectedData.DNI}</li>
                  <li><strong>Curso:</strong> {selectedData.curso}</li>
                  <li><strong>Edad:</strong> {selectedData.edad}</li>
                  <li><strong>Tiene hermanos:</strong> {selectedData.tiene_hermanos}</li>
                  <li><strong>Telefono alumno:</strong> {selectedData.telefono_alumno}</li>
                  <li><strong>Establecimiento año anterior:</strong> {selectedData.establecimiento_anio_anterior}</li>
                  <li><strong>Enfermedad cronica:</strong> {selectedData.enfermedad_cronica}</li>
                  <li><strong>Cual enfermedad:</strong> {selectedData.cual_enfermedad}</li>
                  <li><strong>Medicacion:</strong> {selectedData.medicacion}</li>
                  <li><strong>Cual medicacion:</strong> {selectedData.cual_medicacion}</li>
                  <li><strong>Correo electronico:</strong> {selectedData.correoElectronico}</li>
                  <li><strong>Fecha de nacimiento:</strong> {selectedData.fecha_nacimiento}</li>
                  <li><strong>Lugar de nacimiento:</strong> {selectedData.lugar_nacimiento}</li>
                  <li><strong>Nacionalidad:</strong> {selectedData.nacionalidad}</li>
                  <li><strong>Domicilio:</strong> {selectedData.domicilio}</li>
                  <li><strong>Barrio:</strong> {selectedData.barrio}</li>
                  <li><strong>Codigo postal:</strong> {selectedData.cod_postal}</li>
                </ul>
              </Tab.Pane>
              <Tab.Pane eventKey="tutor">
                <h5>Tutor</h5>             
                  <li><strong>Apellido del tutor:</strong> {selectedData.apellido_tutor}</li>
                  <li><strong>Nombre del tutor:</strong> {selectedData.nombre_tutor}</li>
                  <li><strong>Telefono del tutor:</strong> {selectedData.telefono_tutor}</li>
                  <li><strong>Telefono del tutor 2:</strong> {selectedData.telefono_tutor2}</li>
                  <li><strong>Apellido del tutor:</strong> {selectedData.apellido_tutor}</li>                  
                  <li><strong>DNI tutor:</strong> {selectedData.DNI_tutor}</li>
                  <li><strong>Cuit tutor:</strong> {selectedData.cuit_tutor}</li>                  
              </Tab.Pane>
              <Tab.Pane eventKey="secondSheet">
                <h5>Previas</h5>
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
                            <td data-estado={item.estado}>{item.estado}</td>
                          </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Card.Body>
        <Card.Footer className="text-center">
          <p className="text-muted">Última actualización: Octubre 2024</p>
        </Card.Footer>
      </Card>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={handleClosePopup}>
        Cerrar
      </Button>
    </Modal.Footer>
  </Modal>
)}


                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeSection === "deleteData" && (
        <div>

        <div className="d-flex mb-3">
          <input
            type="text"
            placeholder="Filtrar por DNI"
            className="form-control mx-1"
            value={filterDNI}
            onChange={handleDNIChange}
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
        {(filterDNI || filterCurso || filterNombreApellido) && (
    <table className="table table-striped table-bordered table-hover">
      <thead>
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
          <React.Fragment  key={dato.id}>
            <tr>
                  <td><img src={dato.foto} alt="Foto de alumno" style={{ width: "120px", height: "120px", objectFit: "cover" }} />
                  </td>
                  <td>{dato.DNI}</td>
                  <td>{dato.apellido}</td>
                  <td>{dato.nombre}</td>
                  <td>{dato.curso}</td>
                  <td style={{ textAlign: 'center', display: 'flex', alignItems: 'center' }}>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(dato.id)}
                    >
                        {expandedRow === dato.id
                        ? "No Mostrar"
                        : "Eliminar"}
                    </button>
                  </td>
                </tr>
</React.Fragment>
          ))}
        </tbody>
      </table>
      
    )}
  </div>
  
)}


      {editingData && (
        <div>
          <h2>Editar Dato</h2>
          <div className="row g-0">
            {Object.keys(formData).map((key) => (
              <div className={`col-md-2 p-1`} key={key} style={{ display: "inline-block", width: "11%" }}>
                {["tiene_hermanos", "enfermedad_cronica", "medicacion", "materias_adeuda"].includes(key) ? (
                  <select className="form-control" name={key} value={formData[key]} onChange={handleFormChange}>
                    <option value="">Seleccione {key.replace(/_/g, " ")}</option>
                    <option value="Sí">Sí</option>
                    <option value="No">No</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    className="form-control"
                    name={key}
                    value={formData[key]}
                    onChange={handleFormChange}
                    placeholder={key.replace(/_/g, " ")}
                  />
                )}
              </div>
            ))}
          </div>
          <button className="btn btn-primary mt-2" onClick={handleUpdate}>Guardar Cambios</button>
        </div>
        
      )}

      {activeSection === "secondSheet" && (
        <div>
          
          {/* Agregar filtros */}
          <div className="d-flex mb-3">
            <input
              type="text"
              placeholder="Filtrar por DNI"
              className="form-control mx-1"
              value={filterSecondSheetDNI}
              onChange={(e) => setFilterSecondSheetDNI(e.target.value)}
            />
            <input
              type="text"
              placeholder="Filtrar por Materia"
              className="form-control mx-1"
              value={filterMateria}
              onChange={(e) => setFilterMateria(e.target.value)}
            />
            <input
              type="text"
              placeholder="Filtrar por Nombre y Apellido"
              className="form-control mx-1"
              value={filterSecondSheetNombre}
              onChange={(e) => setFilterSecondSheetNombre(e.target.value)}
            />
          </div>

          {(!filterSecondSheetDNI && !filterMateria && !filterSecondSheetNombre) && (
            <p className="text-muted"></p>
          )}

          {/* Formulario para agregar/editar datos */}
          <div className="mb-4 p-3 border rounded">
            <h4>{editingSecondSheetData ? "Editar Entrada" : "Agregar Nueva Entrada"}</h4>
            <div className="row g-3">
              <div className="col-md-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="DNI"
                  value={secondSheetFormData.DNI}
                  onChange={(e) => setSecondSheetFormData({
                    ...secondSheetFormData,
                    DNI: e.target.value
                  })}
                />
              </div>
              <div className="col-md-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Curso de la materia"
                  value={secondSheetFormData.cursoMateria}
                  onChange={(e) => setSecondSheetFormData({
                    ...secondSheetFormData,
                    cursoMateria: e.target.value
                  })}
                />
              </div>
              <div className="col-md-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Materia"
                  value={secondSheetFormData.materia}
                  onChange={(e) => setSecondSheetFormData({
                    ...secondSheetFormData,
                    materia: e.target.value
                  })}
                />
              </div>
              <div className="col-md-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nota"
                  value={secondSheetFormData.nota}
                  onChange={(e) => setSecondSheetFormData({
                    ...secondSheetFormData,
                    nota: e.target.value
                  })}
                />
              </div>
              <div className="col-md-3">
                <select
                  className="form-control"
                  value={secondSheetFormData.estado}
                  onChange={(e) => setSecondSheetFormData({
                    ...secondSheetFormData,
                    estado: e.target.value
                  })}
                >
                  <option value="">Seleccionar Estado</option>
                  <option value="Aprobado">Aprobado</option>
                  <option value="Desaprobado">Desaprobado</option>
                  <option value="Pendiente">Pendiente</option>
                </select>
              </div>
              <div className="col-md-2">
                {editingSecondSheetData ? (
                  <div className="d-flex gap-2">
                    <button 
                      className="btn btn-success w-50"
                      onClick={handleUpdateSecondSheet}
                    >
                      Actualizar
                    </button>
                    <button 
                      className="btn btn-secondary w-50"
                      onClick={() => {
                        setEditingSecondSheetData(null);
                        setSecondSheetFormData({
                          DNI: "",
                          apellido: "",
                          nombre: "",
                          cursoMateria: "",
                          materia: "",
                          nota: "",
                          estado: ""
                        });
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <button 
                    className="btn btn-primary w-100"
                    onClick={handleSecondSheetSubmit}
                  >
                    Agregar
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Tabla de datos existentes */}
          <table className="table table-striped table-bordered table-hover">
            <thead>
              <tr>
                <th>DNI</th>
                <th>Apellido</th>
                <th>Nombre</th>
                <th>Curso Materia</th>
                <th>Materia</th>
                <th>Nota</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredSecondSheetData().map((item, index) => (
                <tr key={index}>
                  <td>{item.DNI}</td>
                  <td>{item.apellido}</td>
                  <td>{item.nombre}</td>
                  <td>{item.cursoMateria}</td>
                  <td>{item.materia}</td>
                  <td>{item.nota}</td>
                  <td data-estado={item.estado}>{item.estado}</td>
                  <td style={{ 
                      padding: '0',
                      verticalAlign: 'middle',
                      height: '100%',
                      minHeight: '50px'
                  }}>
                      <div style={{ 
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          height: '100%',
                          minHeight: 'inherit'
                      }}>
                          <button
                              className={`btn btn-sm ${editingSecondSheetData?.DNI === item.DNI && 
                                  editingSecondSheetData?.materia === item.materia ? 
                                  'btn-success' : 'btn-warning'}`}
                              style={{ margin: 'auto' }}
                              onClick={() => handleEditSecondSheet(item)}
                          >
                              {editingSecondSheetData?.DNI === item.DNI && 
                              editingSecondSheetData?.materia === item.materia ? 
                              'Editando...' : 'Editar'}
                          </button>
                      </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    
  );
};

export default Dashboard;