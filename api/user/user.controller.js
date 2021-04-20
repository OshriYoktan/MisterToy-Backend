const express = require('express')
const userService = require('./user.service')
const logger = require('../../services/logger.service')

module.exports = {
    getUser,
    getUsers,
    deleteUser,
    updateUser,
    login,
    addUser,
    logout
}

async function getUsers(req, res) {
    try {
        const users = await userService.query()
        res.send(users)
    } catch (err) {
        logger.error('Failed to get users', err)
        res.status(500).send({ err: 'Failed to get users' })
    }
}

async function getUser(req, res) {
    try {
        const user = await userService.getById(req.params.id)
        res.send(user)
    } catch (err) {
        logger.error('Failed to get user', err)
        res.status(500).send({ err: 'Failed to get user' })
    }
}


async function deleteUser(req, res) {
    try {
        console.log('req.params:', req.params)
            // await userService.remove(req.params.id)
            // res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        logger.error('Failed to delete user', err)
        res.status(500).send({ err: 'Failed to delete user' })
    }
}

async function updateUser(req, res) {
    try {
        const user = req.body
        const savedUser = await userService.update(user)
        res.send(savedUser)
    } catch (err) {
        logger.error('Failed to update user', err)
        res.status(500).send({ err: 'Failed to update user' })
    }
}

async function addUser(req, res) {
    try {
        const user = JSON.parse(req.params.user)
        const savedUser = await userService.addUser(user)
        req.session.user = savedUser;
        res.send(savedUser)
    } catch (err) {
        logger.error('Failed to update user', err)
        res.status(500).send({ err: 'Failed to update user' })
    }
}

async function login(req, res) {
    try {
        const user = JSON.parse(req.params.user)
        const loginUser = await userService.login(user)
        req.session.user = loginUser;
        res.send(loginUser)
    } catch (err) {
        logger.error('Failed to get user', err)
        res.status(500).send({ err: 'Failed to get user' })
    }
}

async function logout(req, res) {
    try {
        req.session.user = null;
        res.send('loggedout')
    } catch (err) {
        logger.error('Failed to get user', err)
        res.status(500).send({ err: 'Failed to get user' })
    }
}