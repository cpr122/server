
// ============================================
// FRONTEND: Dashboard Reactivo con React
// ============================================
// 🔹 IMPORTS: Hooks de React para manejar estado y efectos
import { useState, useEffect } from 'react'
import './App.css'
function App() {
// ============================================
// 1 ESTADO REACTIVO (Tema 1.1 - Definición)
// ============================================
// useState crea una variable "reactiva":
// cuando cambia, React actualiza automáticamente la UI.
// Estado principal: lista de sensores
const [sensores, setSensores] = useState([]);
// Estado para el formulario de nuevo sensor
const [formulario, setFormulario] = useState({
nombre: '',
tipo: '',
valor: ''
});
// Estado para mensajes de carga/error
const [cargando, setCargando] = useState(false);
const [error, setError] = useState(null);
// ============================================
// 2️ EFECTOS SECUNDARIOS (Ciclo de vida)
// ============================================
// useEffect se ejecuta después de que el componente se renderiza.
// El array vacío [] significa: "ejecutar solo al montar el componente".
useEffect(() => {
cargarSensores();
}, []); // Dependencias vacías = solo al inicio
// Función para obtener datos del backend
const cargarSensores = async () => {
setCargando(true);
setError(null);
try {
// Fetch a nuestra API local (CORS debe estar habilitado en backend)
const respuesta = await fetch('http://localhost:3001/api/sensores');
if (!respuesta.ok) {
throw new Error(`Error HTTP: ${respuesta.status}`);
}
const datos = await respuesta.json();
// AQUÍ OCURRE LA MAGIA REACTIVA:
// Al llamar a setSensores, React detecta el cambio de estado
// y vuelve a ejecutar la función del componente (re-render)
// con los nuevos datos, actualizando la UI automáticamente.
setSensores(datos);
} catch (err) {
console.error(" Error al cargar sensores:", err);
setError("No se pudo conectar con el servidor. ¿Está corriendo elbackend?");
} finally {
setCargando(false);
}
};
// 🔹 Manejar cambios en los inputs del formulario
const manejarCambio = (e) => {
// Actualizamos solo el campo que cambió, manteniendo los demás
setFormulario({
...formulario, // Copiamos el estado anterior (spread operator)
[e.target.name]: e.target.value // Actualizamos solo la propiedad cambiada
});
};
// 🔹 Agregar nuevo sensor (POST a la API)
const agregarSensor = async (e) => {
e.preventDefault(); // Evita que la página se recargue
// Validación básica
if (!formulario.nombre || !formulario.tipo || !formulario.valor) {
alert("Por favor completa todos los campos");
return;
}
try {
const respuesta = await fetch('http://localhost:3001/api/sensores', {
method: 'POST',
headers: {
'Content-Type': 'application/json' // Indicamos que enviamos JSON
},
body: JSON.stringify(formulario) // Convertimos objeto a string JSON
});
if (!respuesta.ok) throw new Error("Error al crear sensor");
// Limpiamos el formulario
setFormulario({ nombre: '', tipo: '', valor: '' });
// 🔄 Recargamos la lista para mostrar el nuevo sensor
// Esto demuestra la reactividad: cambio de datos → UI actualizada
cargarSensores();
} catch (err) {
console.error("❌ Error:", err);
alert("Error al agregar el sensor");
}
};
// 🔹 Eliminar sensor (DELETE a la API)
const eliminarSensor = async (id) => {
if (!confirm(`¿Eliminar ${sensores.find(s => s.id === id)?.nombre}?`)) {
return; // Si el usuario cancela, no hacemos nada
}
try {
await fetch(`http://localhost:3001/api/sensores/${id}`, {
method: 'DELETE'
});
// Actualizamos la lista tras eliminar
cargarSensores();
} catch (err) {
console.error("❌ Error al eliminar:", err);
alert("Error al eliminar el sensor");
}
};
// Filtrar sensores por tipo ( Reactividad en acción)
const [filtroTipo, setFiltroTipo] = useState('todos');
const sensoresFiltrados = filtroTipo === 'todos'
? sensores
: sensores.filter(s => s.tipo === filtroTipo);
// ============================================
// 3️ ⃣ VISTA DECLARATIVA (Tema 1.4 - Framework)
// ============================================
// En React, describimos CÓMO QUEREMOS que se vea la UI
// en función del estado actual. React se encarga del "cómo".
return (
<div className="contenedor">
<header>
<h1>📡 SensorFlow Dashboard</h1>
<p className="subtitulo">Programación Reactiva con React + Node.js</p>
</header>
{/* --- FORMULARIO DE ENTRADA --- */}
<form onSubmit={agregarSensor} className="formulario">
<input
name="nombre"
placeholder="Nombre (ej. Sala)"
value={formulario.nombre}
onChange={manejarCambio}
required
aria-label="Nombre del sensor"
/>
<select
name="tipo"
value={formulario.tipo}
onChange={manejarCambio}
required
aria-label="Tipo de sensor"
>
<option value="">Tipo...</option>
<option value="Temperatura">🌡️ Temperatura</option>
<option value="Humedad">💧 Humedad</option>
<option value="Luz">☀️ Luz</option>
</select>
<input
name="valor"
type="number"
placeholder="Valor"
value={formulario.valor}
onChange={manejarCambio}
required
aria-label="Valor medido"
/>
<button type="submit" disabled={cargando}>
{cargando ? 'Cargando...' : '➕ Agregar'}
</button>
</form>
{/* --- FILTROS --- */}
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
{/* --- MENSAJES DE ESTADO --- */}
{error && <div className="error">⚠️ {error}</div>}
{cargando && !sensores.length && <div className="cargando">⏳ Cargando
sensores...</div>}
{/* --- LISTA REACTIVA DE SENSORES --- */}
<div className="grid-sensores">
{sensoresFiltrados.map((sensor) => (
<article key={sensor.id} className="tarjeta-sensor">
<h3>{sensor.nombre}</h3>
<p className="tipo">🏷️ {sensor.tipo}</p>
<p className="valor">📊 {sensor.valor} {sensor.tipo ===
'Temperatura' ? '°C' : sensor.tipo === 'Humedad' ? '%' : 'lux'}</p>
<button
onClick={() => eliminarSensor(sensor.id)}
className="btn-eliminar"
aria-label={`Eliminar ${sensor.nombre}`}
>🗑️
Eliminar
</button>
</article>
))}
</div>
{/* Mensaje cuando no hay resultados */}
{sensoresFiltrados.length === 0 && !cargando && (
<p className="vacio">
{filtroTipo === 'todos'
? 'No hay sensores registrados. ¡Agrega uno!'
: `No hay sensores de tipo "${filtroTipo}"`}
</p>
)}
</div>
)
}
export default App;