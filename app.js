import express from 'express';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 8000;

// Obtener la ruta del archivo y del directorio (__dirname equivalente en ES6)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware para servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para obtener los productos de maquillaje desde la API
const apiURL = 'http://makeup-api.herokuapp.com/api/v1/products.json?brand=';
const marcas = ['maybelline', 'covergirl', 'milani', 'annasui', 'revlon', 'e.l.f', 'l\'oreal', 'clinique', 'nyx'];


// Endpoint para obtener los productos de las marcas
app.get('/productos', async (req, res) => {
    try {
        const promises = marcas.map(marca => axios.get(`${apiURL}${marca}`));
        const productosPorMarca = await Promise.all(promises);
        const todosLosProductos = productosPorMarca.flatMap(respuesta => respuesta.data);
        res.json(todosLosProductos); // Enviamos todos los productos como respuesta en formato JSON
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});


app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

