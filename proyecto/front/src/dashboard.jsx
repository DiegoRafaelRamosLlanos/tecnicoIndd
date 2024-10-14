import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import { useNavigate } from "react-router-dom"; 
import './dashboard.css';
const Dashboard = ({ onLogout }) => {
  const [datos, setDatos] = useState([]);
  const [editingData, setEditingData] = useState(null); 
  const [formData, setFormData] = useState({
    marca_temporal: "",
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
    cod_postal: "",
    materias_adeuda: ""
  });

  const [newData, setNewData] = useState({
    marca_temporal: "",
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
    cod_postal: "",
    materias_adeuda: ""
  });
  const navigate = useNavigate(); // Hook para redirigir a login

  // Función para cerrar sesión
  const handleLogout = () => {
    onLogout(); // Llama a la función para actualizar el estado de autenticación en App.jsx
    navigate("/login"); // Redirigir a la página de login
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

  const handleNewDataSubmit = () => {
    axios.post("http://localhost:3001/proyecto/registrarUsuario", newData)
      .then(response => {
        setDatos([...datos, response.data.data]); 
        setNewData({
          marca_temporal: "",
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
          cod_postal: "",
          materias_adeuda: ""
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
    let y = 20;

    datos.forEach((dato, index) => {
      doc.text(`${index + 1}. ${dato.nombre} ${dato.apellido}`, 10, y);
      y += 10;
    });

    doc.save("lista_alumnos.pdf");
  };

  return (
    <div>
      <h1>Dashboard alumnos</h1>
      <button onClick={handleLogout}>Cerrar sesión</button>
      <button onClick={exportToPDF}>Exportar a PDF</button>

      <div>
        <h2>Agregar Nuevo Dato</h2>
        {Object.keys(newData).map((key) => {
          if (["tiene_hermanos", "enfermedad_cronica", "medicacion", "materias_adeuda"].includes(key)) {
            return (
              <select
                key={key}
                name={key}
                value={newData[key]}
                onChange={handleNewDataChange}
              >
                <option value="">Seleccione {key.replace(/_/g, " ")}</option>
                <option value="Sí">Sí</option>
                <option value="No">No</option>
              </select>
            );
          } else {
            return (
              <input
                key={key}
                type="text"
                name={key}
                value={newData[key]}
                onChange={handleNewDataChange}
                placeholder={key.replace(/_/g, " ")}
              />
            );
          }
        })}
        <button onClick={handleNewDataSubmit}>Agregar Dato</button>
      </div>

      <h2>Lista de Datos</h2>
      <table>
        <thead>
          <tr>
            {Object.keys(formData).map((key) => (
              <th key={key}>{key.replace(/_/g, " ")}</th>
            ))}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {datos.length > 0 ? (
            datos.map((dato) => (
              <tr key={dato.id}>
                {Object.keys(formData).map((key) => (
                  <td key={key}>{dato[key]}</td>
                ))}
                <td>
                  <button onClick={() => handleEdit(dato)}>Editar</button>
                  <button onClick={() => handleDelete(dato.id)}>X</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={Object.keys(formData).length + 1}>No hay datos disponibles</td>
            </tr>
          )}
        </tbody>
      </table>

      {editingData && (
        <div>
          <h2>Editar Dato</h2>
          {Object.keys(formData).map((key) => {
            if (["tiene_hermanos", "enfermedad_cronica", "medicacion", "materias_adeuda"].includes(key)) {
              return (
                <select
                  key={key}
                  name={key}
                  value={formData[key]}
                  onChange={handleFormChange}
                >
                  <option value="">Seleccione {key.replace(/_/g, " ")}</option>
                  <option value="Sí">Sí</option>
                  <option value="No">No</option>
                </select>
              );
            } else {
              return (
                <input
                  key={key}
                  type="text"
                  name={key}
                  value={formData[key]}
                  onChange={handleFormChange}
                  placeholder={key.replace(/_/g, " ")}
                />
              );
            }
          })}
          <button onClick={handleUpdate}>Guardar Cambios</button>
          <button onClick={() => setEditingData(null)}>Cancelar</button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
