import express from 'express';
import Ticket from '../models/ticketModel.js';

const router = express.Router();

// Ruta para crear un nuevo ticket
router.post('/', async (req, res) => {
  try {
    const { code, amount, purchaser } = req.body;
    const ticket = new Ticket({ code, amount, purchaser });
    const savedTicket = await ticket.save();
    res.status(201).json(savedTicket);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el ticket' });
  }
});

// Ruta para obtener todos los tickets
router.get('/', async (req, res) => {
  try {
    const tickets = await Ticket.find();
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los tickets' });
  }
});

// Ruta para obtener un ticket por su ID
router.get('/:id', async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (ticket) {
      res.json(ticket);
    } else {
      res.status(404).json({ error: 'Ticket no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el ticket' });
  }
});

export default router;
