import express from 'express';
import Factura from '../model/Factura.js';

const router = express.Router();

// Obtener todas las facturas
router.get('/', async (req, res) => {
  try {
    const facturas = await Factura.find({ estado: { $ne: 'eliminado' } }).sort({ fecha: -1 });
    res.json(facturas);
  } catch (error) {
    console.error('Error al obtener facturas:', error);
    res.status(500).json({ 
      error: 'Error al obtener facturas',
      details: error.message 
    });
  }
});

// Obtener una factura por ID
router.get('/:id', async (req, res) => {
  try {
    const factura = await Factura.findById(req.params.id);
    
    if (!factura) {
      return res.status(404).json({ error: 'Factura no encontrada' });
    }
    
    res.json(factura);
  } catch (error) {
    console.error('Error al obtener factura:', error);
    res.status(500).json({ 
      error: 'Error al obtener factura',
      details: error.message 
    });
  }
});

// Obtener HTML de factura para imprimir
router.get('/imprimir/:id', async (req, res) => {
  try {
    const factura = await Factura.findById(req.params.id);
    
    if (!factura) {
      return res.status(404).json({ error: 'Factura no encontrada' });
    }
    
    res.json(factura);
  } catch (error) {
    console.error('Error al obtener factura para imprimir:', error);
    res.status(500).json({ 
      error: 'Error al obtener factura',
      details: error.message 
    });
  }
});

// Obtener facturas por email de cliente
router.get('/cliente/:email', async (req, res) => {
  try {
    const facturas = await Factura.find({ 
      'cliente.email': req.params.email,
      estado: { $ne: 'eliminado' }
    }).sort({ fecha: -1 });
    
    res.json(facturas);
  } catch (error) {
    console.error('Error al obtener facturas del cliente:', error);
    res.status(500).json({ 
      error: 'Error al obtener facturas del cliente',
      details: error.message 
    });
  }
});

// Obtener facturas por DNI de cliente
router.get('/cliente/dni/:dni', async (req, res) => {
  try {
    const facturas = await Factura.find({ 
      'cliente.dni': req.params.dni,
      estado: { $ne: 'eliminado' }
    }).sort({ fecha: -1 });
    
    res.json(facturas);
  } catch (error) {
    console.error('Error al obtener facturas del cliente por DNI:', error);
    res.status(500).json({ 
      error: 'Error al obtener facturas del cliente por DNI',
      details: error.message 
    });
  }
});

// Eliminar factura (eliminación lógica)
router.patch('/:id/eliminar', async (req, res) => {
  try {
    const factura = await Factura.findByIdAndUpdate(
      req.params.id,
      { estado: 'eliminado' },
      { new: true }
    );
    
    if (!factura) {
      return res.status(404).json({ error: 'Factura no encontrada' });
    }
    
    res.json({ message: 'Factura marcada como eliminada', factura });
  } catch (error) {
    console.error('Error al eliminar factura:', error);
    res.status(500).json({ 
      error: 'Error al eliminar factura',
      details: error.message 
    });
  }
});

export default router;
