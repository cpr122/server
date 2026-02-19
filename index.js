// ============================================
// BACKEND: API REST con Express
// ============================================

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// ⚠️ IMPORTANTE PARA RENDER
const PORT = process.env.PORT || 3001;

// --- MIDDLEWARES ---
app.use(cors({
  origin: "*"
}));

app.use(bodyParser.json());

// --- BASE DE DATOS SIMULADA ---
let sensores = [
  { id: 1, nombre: 'Sensor Sala', tipo: 'Temperatura', valor: 24 },
  { id: 2, nombre: 'Sensor Cocina', tipo: 'Humedad', valor: 60 },
  { id: 3, nombre: 'Sensor Jardín', tipo: 'Luz', valor: 85 }
];

// --- RUTAS ---

app.get('/api/sensores', (req, res) => {
  res.json(sensores);
});

app.post('/api/sensores', (req, res) => {
  const nuevoSensor = {
    id: Date.now(),
    nombre: req.body.nombre,
    tipo: req.body.tipo,
    valor: Number(req.body.valor)
  };

  sensores.push(nuevoSensor);
  res.status(201).json(nuevoSensor);
});

app.delete('/api/sensores/:id', (req, res) => {
  const id = parseInt(req.params.id);
  sensores = sensores.filter(sensor => sensor.id !== id);
  res.json({ mensaje: 'Sensor eliminado correctamente', id });
});

app.get('/api/sensores/tipo/:tipo', (req, res) => {
  const tipo = req.params.tipo;
  const filtrados = sensores.filter(s => s.tipo === tipo);
  res.json(filtrados);
});

// Ruta raíz para evitar error "Cannot GET /"
app.get('/', (req, res) => {
  res.send('API SensorFlow funcionando correctamente 🚀');
});

// --- INICIAR SERVIDOR ---
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
