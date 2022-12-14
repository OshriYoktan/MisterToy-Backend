const dbService = require('../../services/db.service')
    // const logger = require('../../services/logger.service')
const reviewService = require('../review/review.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    query,
    getById,
    login,
    remove,
    update,
    addUser
}

async function query() {
    // const criteria = _buildCriteria(filterBy)
    try {
        const collection = await dbService.getCollection('user')
        var users = await collection.find().toArray()
            // users = users.map(user => {
            //     delete user.password
            //     user.isHappy = true
            //     user.createdAt = ObjectId(user._id).getTimestamp()
            // Returning fake fresh data
            // user.createdAt = Date.now() - (1000 * 60 * 60 * 24 * 3) // 3 days ago
            // return user
            // })
        return users
    } catch (err) {
        logger.error('cannot find users', err)
        throw err
    }
}

async function getById(userId) {
    try {
        const collection = await dbService.getCollection('user')
        const user = await collection.findOne({ '_id': ObjectId(userId) })
        delete user.password

        user.givenReviews = await reviewService.query({ byUserId: ObjectId(user._id) })
        user.givenReviews = user.givenReviews.map(review => {
            delete review.byUser
            return review
        })

        return user
    } catch (err) {
        logger.error(`while finding user ${userId}`, err)
        throw err
    }
}
async function login(user) {
    try {
        const collection = await dbService.getCollection('user')
        const loginUser = await collection.findOne({ $and: [{ 'username': user.username, 'password': user.password }] })
        if (!loginUser) throw err
        return loginUser
    } catch (err) {
        logger.error(`while finding user ${username}`, err)
        throw err
    }
}

async function remove(userId) {
    try {
        const collection = await dbService.getCollection('user')
        await collection.deleteOne({ '_id': ObjectId(userId) })
    } catch (err) {
        logger.error(`cannot remove user ${userId}`, err)
        throw err
    }
}

async function update(user) {
    try {
        const userToSave = {
            _id: ObjectId(user._id),
            username: user.username,
            fullname: user.fullname,
            score: user.score
        }
        const collection = await dbService.getCollection('user')
        await collection.updateOne({ '_id': userToSave._id }, { $set: userToSave })
        return userToSave;
    } catch (err) {
        logger.error(`cannot update user ${user._id}`, err)
        throw err
    }
}

async function addUser(user) {
    try {
        const userToAdd = {
            username: user.username,
            password: user.password,
            fullname: user.fullname,
            // score: user.score || 0
        }
        const collection = await dbService.getCollection('user')
        const usernameCheck = await collection.findOne({ 'username': userToAdd.username })
        await collection.insertOne(userToAdd)
        if (usernameCheck) throw err
        return userToAdd
    } catch (err) {
        logger.error('cannot insert user', err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.txt) {
        const txtCriteria = { $regex: filterBy.txt, $options: 'i' }
        criteria.$or = [{
                username: txtCriteria
            },
            {
                fullname: txtCriteria
            }
        ]
    }
    if (filterBy.minBalance) {
        criteria.balance = { $gte: filterBy.minBalance }
    }
    return criteria
}