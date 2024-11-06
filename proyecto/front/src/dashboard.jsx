
import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from 'react-bootstrap';
import './dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Dashboard = ({ onLogout }) => {
  const [datos, setDatos] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [filterDNI, setFilterDNI] = useState("");
  const [filterCurso, setFilterCurso] = useState("");
  const [filterNombreApellido, setFilterNombreApellido] = useState("");
  const [editingData, setEditingData] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const [showList, setShowList] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);

  const [formData, setFormData] = useState({
    marca_temporal: "", foto: "", DNI: "", apellido: "", nombre: "", localidad: "", tiene_hermanos: "", telefono_alumno: "",
    apellido_tutor: "", nombre_tutor: "", telefono_tutor: "", telefono_tutor2: "", curso: "",
    establecimiento_anio_anterior: "", DNI_tutor: "", cuit_tutor: "", enfermedad_cronica: "", cual_enfermedad: "",
    medicacion: "", cual_medicacion: "", correoElectronico: "", fecha_nacimiento: "", edad: "", lugar_nacimiento: "",
    nacionalidad: "", domicilio: "", barrio: "", cod_postal: "", materias_adeuda: "", adeuda_materias: "", quien_aprobo: ""
  });

  const [newData, setNewData] = useState({
    marca_temporal: "", foto: "", DNI: "", apellido: "", nombre: "", localidad: "", tiene_hermanos: "", telefono_alumno: "",
    apellido_tutor: "", nombre_tutor: "", telefono_tutor: "", telefono_tutor2: "", curso: "",
    establecimiento_anio_anterior: "", DNI_tutor: "", cuit_tutor: "", enfermedad_cronica: "", cual_enfermedad: "",
    medicacion: "", cual_medicacion: "", correoElectronico: "", fecha_nacimiento: "", edad: "", lugar_nacimiento: "",
    nacionalidad: "", domicilio: "", barrio: "", cod_postal: "", materias_adeuda: "", adeuda_materias: "", quien_aprobo: ""
  });


 
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

  const handleDelete = (id) => {
    axios.delete(`http://localhost:3001/proyecto/borrarUsuario/${id}`)
      .then(response => {
        setDatos(datos.filter(dato => dato.id !== id));
      })
      .catch(error => {
        console.error("Error al eliminar el dato:", error);
      });
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
        setNewData({
          marca_temporal: "", foto: "", DNI: "", apellido: "", nombre: "", localidad: "", tiene_hermanos: "", telefono_alumno: "",
          apellido_tutor: "", nombre_tutor: "", telefono_tutor: "", telefono_tutor2: "", curso: "",
          establecimiento_anio_anterior: "", DNI_tutor: "", cuit_tutor: "", enfermedad_cronica: "", cual_enfermedad: "",
          medicacion: "", cual_medicacion: "", correoElectronico: "", fecha_nacimiento: "", edad: "", lugar_nacimiento: "",
          nacionalidad: "", domicilio: "", barrio: "", cod_postal: "", materias_adeuda: "", adeuda_materias: "", quien_aprobo: ""
        });
      })
      .catch(error => {
        console.error("Error al registrar el nuevo dato:", error);
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
    return datos.filter((dato) => {
      const matchesDNI = filterDNI ? dato.DNI.toString().includes(filterDNI) : true;
      const matchesCurso = filterCurso ? dato.curso.includes(filterCurso) : true;
      const matchesNombreApellido = filterNombreApellido ?
        `${dato.nombre} ${dato.apellido}`.toLowerCase().includes(filterNombreApellido.toLowerCase()) : true;
      return matchesDNI && matchesCurso && matchesNombreApellido;
    });
  };

  const isModalVisible = showPopup && selectedData !== null;
  return (
    <div className="container-fluid mt-1">
      <button className="btn btn-danger" onClick={handleLogout}>Cerrar sesión</button>
      <button className="btn btn-success" onClick={exportToPDF}>Exportar a PDF</button>

      <h4>Agregar Nuevo Dato</h4>
      <button className="btn btn-info" onClick={() => setShowTable(!showTable)}>
        {showTable ? "Ocultar Ingreso de Datos" : "Mostrar Ingreso de Datos"}
      </button>

      {showTable && (
        <div>
          <div className="row g-0">
            {Object.keys(newData).map((key, index) => (
              <div className={`col-md-2 p-1`} key={key} style={{ display: "inline-block", width: "11%" }}>
                {["tiene_hermanos", "enfermedad_cronica", "medicacion", "materias_adeuda"].includes(key) ? (
                  <select className="form-control" name={key} value={newData[key]} onChange={handleNewDataChange}>
                    <option value="">Seleccione {key.replace(/_/g, " ")}</option>
                    <option value="Sí">Sí</option>
                    <option value="No">No</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    className="form-control"
                    name={key}
                    value={newData[key]}
                    onChange={handleNewDataChange}
                    placeholder={key.replace(/_/g, " ")}
                  />
                )}
              </div>
            ))}
          </div>
          <button className="btn btn-primary mt-1" onClick={handleNewDataSubmit}>Agregar Dato</button>
        </div>
      )}

      <button className="btn btn-info mt-1" onClick={() => setShowList(!showList)}>
        {showList ? "Ocultar Lista de Datos" : "Mostrar Lista de Datos"}
      </button>

      {showList && (
        <div>
          <h2>Lista de Datos</h2>

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

          <table className="table table-responsive">
            <thead>
              <tr>
              <th>foto</th>
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
                    <td><img src={dato.foto} alt="Foto de alumno" style={{ width: "50px", height: "50px", objectFit: "cover" }} />
                    </td>
                    <td>{dato.DNI}</td>
                    <td>{dato.apellido}</td>
                    <td>{dato.nombre}</td>
                    <td>{dato.curso}</td>
                    <td>
                      <button
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
                      </button>
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
                  {isModalVisible && (
      <Modal show={showPopup} onHide={handleClosePopup}  size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Detalles del Alumno</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div style={{ textAlign: "center" }}>
          <p><strong>Foto:</strong><br />
            <img src={selectedData.foto} alt="Foto completa" style={{ width: "100px", height: "100px", objectFit: "full" }} />
          </p>
          <p><strong>Nombre:</strong> {selectedData.nombre}</p>
          <p><strong>Apellido:</strong> {selectedData.apellido}</p>
          <p><strong>DNI:</strong> {selectedData.DNI}</p>
          <p><strong>Curso:</strong> {selectedData.curso}</p>
          <p><strong>Teléfono del Tutor:</strong> {selectedData.telefono_tutor}</p>
          <p><strong>Enfermedad Crónica:</strong> {selectedData.enfermedad_cronica}</p>
        </div>
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
    </div>
  );
};

export default Dashboard;
