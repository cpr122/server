// ============================================
// FRONTEND: Dashboard Reactivo con React
// ============================================

import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const API_URL = "https://server-ydr1.onrender.com/api/sensores";

  const [sensores, setSensores] = useState([]);
  const [formulario, setFormulario] = useState({
    nombre: "",
    tipo: "",
    valor: "",
  });
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [filtroTipo, setFiltroTipo] = useState("todos");

  useEffect(() => {
    cargarSensores();
  }, []);

  const cargarSensores = async () => {
    setCargando(true);
    setError(null);

    try {
      const respuesta = await fetch(API_URL);

      if (!respuesta.ok) {
        throw new Error("Error al obtener datos");
      }

      const datos = await respuesta.json();
      setSensores(datos);
    } catch (err) {
      console.error("Error:", err);
      setError("No se pudo conectar con el servidor.");
    } finally {
      setCargando(false);
    }
  };

  const manejarCambio = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value,
    });
  };

  const agregarSensor = async (e) => {
    e.preventDefault();

    if (!formulario.nombre || !formulario.tipo || !formulario.valor) {
      alert("Completa todos los campos");
      return;
    }

    try {
      const respuesta = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formulario),
      });

      if (!respuesta.ok) throw new Error("Error al crear sensor");

      setFormulario({ nombre: "", tipo: "", valor: "" });
      cargarSensores();
    } catch (err) {
      console.error(err);
      alert("Error al agregar el sensor");
    }
  };

  const eliminarSensor = async (id) => {
    if (!window.confirm("¿Eliminar este sensor?")) return;

    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      cargarSensores();
    } catch (err) {
      console.error(err);
      alert("Error al eliminar el sensor");
    }
  };

  const sensoresFiltrados =
    filtroTipo === "todos"
      ? sensores
      : sensores.filter((s) => s.tipo === filtroTipo);

  return (
    <div className="contenedor">
      <header>
        <h1>📡 SensorFlow Dashboard</h1>
        <p className="subtitulo">React + Node.js en Render</p>
      </header>

      <form onSubmit={agregarSensor} className="formulario">
        <input
          name="nombre"
          placeholder="Nombre"
          value={formulario.nombre}
          onChange={manejarCambio}
          required
        />

        <select
          name="tipo"
          value={formulario.tipo}
          onChange={manejarCambio}
          required
        >
          <option value="">Tipo...</option>
          <option value="Temperatura">Temperatura</option>
          <option value="Humedad">Humedad</option>
          <option value="Luz">Luz</option>
        </select>

        <input
          name="valor"
          type="number"
          placeholder="Valor"
          value={formulario.valor}
          onChange={manejarCambio}
          required
        />

        <button type="submit" disabled={cargando}>
          {cargando ? "Cargando..." : "Agregar"}
        </button>
      </form>

      <div className="filtros">
        <label>Filtrar por tipo: </label>
        <select
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
        >
          <option value="todos">Todos</option>
          <option value="Temperatura">Temperatura</option>
          <option value="Humedad">Humedad</option>
          <option value="Luz">Luz</option>
        </select>
      </div>

      {error && <div className="error">⚠️ {error}</div>}

      {cargando && !sensores.length && (
        <div className="cargando">⏳ Cargando sensores...</div>
      )}

      <div className="grid-sensores">
        {sensoresFiltrados.map((sensor) => (
          <article key={sensor.id} className="tarjeta-sensor">
            <h3>{sensor.nombre}</h3>
            <p>{sensor.tipo}</p>
            <p>
              {sensor.valor}{" "}
              {sensor.tipo === "Temperatura"
                ? "°C"
                : sensor.tipo === "Humedad"
                ? "%"
                : "lux"}
            </p>

            <button
              onClick={() => eliminarSensor(sensor.id)}
              className="btn-eliminar"
            >
              Eliminar
            </button>
          </article>
        ))}
      </div>

      {sensoresFiltrados.length === 0 && !cargando && (
        <p className="vacio">No hay sensores registrados</p>
      )}
    </div>
  );
}

export default App;
