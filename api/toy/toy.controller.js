const toyService = require('./toy.service')

async function getToys(req, res) {
    try {
        const filterBy = req.query
        const toys = await toyService.query(filterBy)
        res.send(toys)
    } catch (err) {
        console.log('Error', err.message);
    }
}

async function getToy(req, res) {
    try {
        const id = req.params.id
        const toy = await toyService.getById(id)
        res.send(toy)
    } catch (err) {
        console.log('Error', err.message);
    }
}

async function addToy(req, res) {
    try {
        const toy = req.body
        console.log('toy:', toy)
        const savedToy = await toyService.addToy(toy)
        res.send(savedToy)
    } catch (err) {
        console.log('Error', err.message);
    }
}

async function updateToy(req, res) {
    try {
        const toy = req.body
        const savedToy = await toyService.updateToy(toy)
        res.send(savedToy)
    } catch (err) {
        console.log('Error', err.message);
    }
}

async function removeToy(req, res) {
    try {
        const toyId = req.params.id
        const savedToy = await toyService.removeToy(toyId)
        res.send(savedToy)
    } catch (err) {
        console.log('Error', err.message);
    }
}

module.exports = {
    getToys,
    getToy,
    addToy,
    updateToy,
    removeToy
}