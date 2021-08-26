const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { userExtractor } = require('../utils/middleware')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
  response.status(200).json(blogs)
})

// ----------------before 4.22

// blogsRouter.delete('/:id', async (request, response) => {
//   const decodedToken = jwt.verify(request.token, process.env.SECRET)

//   if (!request.token || !decodedToken.id) {
//     return response.status(401).json({ error: 'token missing or invalid' })
//   }

//   const blog = await Blog.findById(request.params.id)
//   if (decodedToken.id.toString() === blog.user.toString()) {
//     await blog.remove()
//     return response.status(204).end()
//   }
//   response.status(400).json({ error: 'non-creator action forbidden' })
// })

// blogsRouter.post('/', async (request, response) => {
//   const body = request.body
//   const decodedToken = jwt.verify(request.token, process.env.SECRET)
//   if (!request.token || !decodedToken.id) {
//     return response.status(401).json({ error: 'token missing or invalid' })
  // }
//   const user = await User.findById(decodedToken.id)

//   const blog = new Blog({
//     title: body.title,
//     author: body.author,
//     url: body.url,
//     likes: body.likes || 0,
//     user: user,
//   })
//   const savedBlog = await blog.save()
//   user.blogs = user.blogs.concat(savedBlog._id)
//   await user.save()

//   response.status(201).json(savedBlog)
// })
  
//4.22
blogsRouter.post('/', userExtractor, async (request, response,next) => {
  const token = request.user
  if (!token){response.status(401).json({"error":"Unauthorized"})}

  const body = request.body
  const user = await User.findById(request.user.id);
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

//4.22
blogsRouter.delete('/:id', userExtractor, async (request,response) => {
  const token = request.user
  if (!token){response.status(401).json({"error":"Unauthorized"})}
  const user_id = request.user.id;   
  const blog = await Blog.findById(request.params.id);

  if (blog.user.toString() === user_id.toString()) {
    await blog.remove()
    return response.status(204).end()
  } 
  
  response.status(404).json({ error: 'non-creator action forbidden' });

})

blogsRouter.put('/:id', async (request,response) => {
  const body = request.body
  
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
  }

  const updatedBlog = await Blog
    .findByIdAndUpdate(request.params.id, blog, { new: true })

  response.status(201).json(updatedBlog.toJSON())
})
  
module.exports = blogsRouter