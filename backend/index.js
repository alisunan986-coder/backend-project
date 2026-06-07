// Import the Express library so we can create a web server and define routes
require('dotenv').config()
const express = require('express')
// Create an instance of an Express application used to register middleware and routes
const app = express()
const cors = require('cors')
app.use(cors())
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
})

// Register middleware to parse incoming requests with JSON payloads into `req.body`
app.use(express.json())

// Custom middleware - runs on every request
app.use((req, res, next) => {
  console.log(`${req.method} request to ${req.url}`)
  next() // pass to the next middleware or route
})

// Register a handler for GET requests to the root path '/'
app.get('/', (req, res) => {
  // `req` represents the incoming HTTP request, `res` is used to build the response
  // Send a plain-text response back to the client
  res.send('Welcome to my API!')
})

// Register a handler for GET requests to '/users' to return a list of users
app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany()
  res.json(users)
})
// Register a handler for GET requests to '/users/:id' to return a single user
app.get('/users/:id', async (req, res) => {
  const id = Number(req.params.id)

  const user = await prisma.user.findUnique({
    where: { id: id }
  })

  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  res.json(user)
})
app.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  // Encrypt the password before saving
  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role
    }
  })

  res.status(201).json({ message: 'User created successfully', userId: user.id })
})

app.post('/login', async (req, res) => {
  const { email, password } = req.body

  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  // Compare password with encrypted one
  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
    return res.status(401).json({ message: 'Wrong password' })
  }

  // Create a JWT token
  const token = jwt.sign(
    { userId: user.id },
    'mysecretkey',
    { expiresIn: '1d' }
  )

  res.json({ message: 'Login successful', token })
})


// Route 4 - Create a new user
app.post('/users', async (req, res) => {
  const { name, role } = req.body

  if (!name || !role) {
    return res.status(400).json({ message: 'Name and role are required' })
  }

  const newUser = await prisma.user.create({
    data: {
      name: name,
      role: role
    }
  })

  res.status(201).json(newUser)
})
//Route 5
app.post('/products', async (req, res) => {
  const { name, price } = req.body

  if (!name || !price) {
    return res.status(400).json({ message: 'name and price are required' })
  }

  const newProduct = await prisma.product.create({
    data: {
      name: name,
      price: price
    }
  })

  res.status(201).json(newProduct)
})
// Route 6- Update a user
app.put('/users/:id', async (req, res) => {
  const id = Number(req.params.id)
  const { name, role } = req.body

  const updatedUser = await prisma.user.update({
    where: { id: id },
    data: { name: name, role: role }
  })

  res.json(updatedUser)
})
//route 7

app.delete('/users/:id', async (req, res) => {
  const id = Number(req.params.id)

  await prisma.user.delete({
    where: { id: id }
  })

  res.json({ message: `User ${id} deleted successfully` })
})
//route 8
app.put('/products/:id',(req,res)=>{
    const id= Number(req.params.id)
    const {name, price}=req.body
    const updateprod= {
        id:id,
        name:name,
        price:price
    }
    res.json(updateprod)
})
//route 9
app.delete('/products/:id', (req,res)=>{
    const id= Number(req.params.id)
    res.json({message :`product ${id} deleted `})
})

// Start the server and listen for incoming connections on port 3000
app.listen(3000, () => {
  // Log to the console when the server is successfully running
  console.log('Server is running on port 3000')
})
