const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const express = require('express');
const mongoose = require('mongoose');
const User = require('../db/user.model');


const router = express.Router();
router.use(express.json());

const {
    verify_token,
    false_response,
    tokenize
} = require('./auth.middleware')


router.post('/register', async (req, res) => {
    const user = await User.findOne({ email:req.body.email })
    if (user){   
        return res.status(200).json({
            ...false_response,
            message: 'Email Already Exists' 
        })
    }
    const hashedPassword = await bcryptjs.hash(req.body.password, 8)
    const user_data = {
        ...req.body,
        password: hashedPassword
    }

    const created_user = await User.create(user_data)

    const token = tokenize(created_user._id)

    return res.status(200).json({
        auth: true,
        token,
        user: created_user
    })
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({
        ...false_response,
        message: '201',
        sentData: req.body
    })
    const password_is_valid = await bcryptjs.compare(password, user.password)
    if (!password_is_valid) return res.status(401).json({
        ...false_response,
        message: '202',
        sentData: req.body
    })

    const token = tokenize(user._id)

    return res.status(200).json({
        auth: true,
        token,
        user,
        message: '269'
    })
})

router.get('/logout', async (req, res) => {
    return res.status(200).json(false_response)
})

router.get('/me', verify_token, async (req, res) => {
    const user = await User.findById(req.user_id);
    if (!user) return res.status(404).json({ message: 'No user found.' });
    console.log('Token:',req.user_id)
    res.status(200).json({
        user,
        auth: true       
    });
})

router.post('/update/:id', async (req,res,next) => {
    
    try {
        const selectedUser = await User.findById(req.params.id)
        await selectedUser.updateOne(req.body)
        const updatedUser = await User.findById(req.params.id)
        res.json({ selectedUserUpdate: updatedUser})
    } catch (err) {
        next(new Error(err))
    }  
})




module.exports = router;