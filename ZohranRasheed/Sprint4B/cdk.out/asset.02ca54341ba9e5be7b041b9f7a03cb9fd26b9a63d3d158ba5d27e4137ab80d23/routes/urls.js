const { dbGet, dbCreate, dbRemove, dbUpdate } = require('../db')
const express = require('express');
const validate = require('../middlewares/validate')
const router = express.Router();


router.get('/', async (req, res) => {
    const result = await dbGet({})
    res.send(result)
})
router.post('/', validate, async (req, res) => {
    const result = await dbCreate(req.body)
    res.send(result)
})
router.delete('/:id', async (req, res) => {
    const result = await dbRemove(req.params.id);
    res.send(result)
})
router.put('/:id', validate, async (req, res) => {
    const result = await dbUpdate(req.params.id, req.body.url)
    res.send(result)
})
module.exports = router;
