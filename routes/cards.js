const express = require('express');

const router = express.Router();


const cardSchema = require('../models/cards');


router.get('/', async (req,res) => {
    try {
        const cards = await cardSchema.find();
        res.json(cards);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})


router.post('/', async (req, res) =>{

    try {
        const card = new cardSchema({
            cardId: req.body.id,
            name: req.body.name,
            description: req.body.description,
            imageUrl: req.body.imageUrl,
            status: req.body.status
        });

        const savedCard = await card.save();
        res.status(201).json(savedCard);
        
    } catch (error) {
        res.status(500).json({ message: error.message });
        
    }

})