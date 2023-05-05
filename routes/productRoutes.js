const router = require('express').Router()
const Product = require('../models/Product')
const User = require('../models/User')

router.get('/', async (req, res) => {
    try {
        const products = await Product.find()
        res.status(200).json(products)
    } catch (error) {
        res.status(400).send(error.message)
    }
})


// create product 
router.post('/', async (req, res) => {
    try {
        const { name, description, price, category, images: pictures } = req.body
        const product = await Product.create({ name, description, price, category, pictures })
        const products = await Product.find()
        res.status(201).json(products)
    } catch (error) {
        res.status(400).send(error.message)
    }
})
// update product
router.patch('/:id', async (req, res) => {
    try {
        const { name, description, price, category, images: pictures } = req.body
        const product = await Product.findByIdAndUpdate(id, { name, description, price, category, pictures })
        const products = await Product.find()
        res.status(200).json(products)
    } catch (error) {
        res.status(400).send(error.message)
    }
})

// delete product 
router.delete('/:id', async (req, res) => {
    const { id } = req.params
    const { user_id } = req.body
    try {
        const user = await User.findById(user_id)
        if (!user.isAdmin) return res.status(401).json("You don't have permission")
        await Product.findByIdAndDelete(id)
        const products = await Product.find()
        res.status(200).json(products)
    } catch (error) {
        res.status(400).send(error.message)
    }
})


// 

router.get('/:id', async (req, res) => {
    const { id } = req.params
    try {
        const product = await Product.findById(id)
        const similar = await Product.find({ category: product.category }).limit(5)
        res.status(200).json({ product, similar })
    } catch (error) {
        res.status(400).send(error.message)
    }
})
router.get('/category/:category', async (req, res) => {
    const { category } = req.params
    try {
        let products;
        if (category == "all") {
            products = await Product.find().sort([['date', -1]])
        } else {
            products = await Product.find({ category })
        }
        res.status(200).json(products)
    } catch (error) {
        res.status(400).send(error.message)
    }
})
module.exports = router;