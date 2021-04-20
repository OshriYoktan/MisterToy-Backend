const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    query,
    addToy,
    updateToy,
    getById,
    removeToy
}

async function query(filterBy) {
    try {
        const collection = await dbService.getCollection('toy')
        const toy = await collection.find().toArray()
        filterBy.f = (filterBy.f === 'true') ? true : false
        var toysCopy = JSON.parse(JSON.stringify(toy))
        var toysForDisplay = toysCopy
        if (!filterBy.q) {
            if (filterBy.s === 'name') {
                toysForDisplay = toysCopy.sort((toy1, toy2) => {
                    return toy1.name.toLowerCase().localeCompare(toy2.name.toLowerCase())
                })
            } else if (filterBy.s === 'price') {
                toysForDisplay = toysCopy.sort((toy1, toy2) => {
                    return toy2.price - toy1.price;
                })
            }
        } else {
            toysForDisplay = toysCopy.filter((toy) => {
                return toy.name.toLowerCase().includes(filterBy.q.toLowerCase())
            })
        }
        if (filterBy.f) {
            var toysAfterFilter = toysForDisplay.filter((toy) => {
                return toy.inStock === true
            })
            return toysAfterFilter
        } else return toysForDisplay
    } catch (err) {
        console.log('Error - query:', err.message);
    }
}

async function addToy(toy) {
    try {
        const collection = await dbService.getCollection('toy')
        await collection.insertOne(toy)
        return toy;
    } catch (err) {
        console.log('Error - add:', err.message);
    }
}

async function updateToy(toy) {
    try {
        toy._id = ObjectId(toy._id)
        const collection = await dbService.getCollection('toy')
        await collection.updateOne({ '_id': toy._id }, { $set: toy })
        return toy;
    } catch (err) {
        console.log('Error - add:', err.message);
    }
}

async function getById(id) {
    const collection = await dbService.getCollection('toy')
    const toy = await collection.findOne({ '_id': ObjectId(id) })
    return toy
}

async function removeToy(toyId) {
    try {
        const collection = await dbService.getCollection('toy')
        await collection.deleteOne({ '_id': ObjectId(toyId) })
    } catch (err) {
        console.log('Error - add:', err.message);
    }
}

function _makeId(length = 5) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}