const mongoose = require("mongoose")
const supertest = require("supertest")
const helper = require("./test_helper")

const app = require("../app")

const Blog = require("../models/blog")

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})

test("blogs are returned as json", async () =>  {
  await api
  .get("/api/blogs")
  .expect(200)
  .expect("Content-type", /application\/json/)
})

test("all blogs are returned", async () =>  {
  const response = await api.get("/api/blogs")
  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test("unique identifier of blog is id", async () => {
  const response = await api.get("/api/blogs")
  expect(response.body[0].id).toBeDefined()
})


test("a valid blog can be added", async () => {
  const newBlog = {
      title: "Test title",
      author: "unknown",
      url: "url.url.url",
      likes: 4
  }
  await api
  .post("/api/blogs")
  .send(newBlog)
  .expect(201)
  .expect("Content-Type", /application\/json/)

  const response = await api.get("/api/blogs")
  const finalBlogs = response.body

  expect(finalBlogs).toHaveLength(helper.initialBlogs.length + 1)

  const contents = finalBlogs.map(n => n.title)
  expect(contents).toContain(
    "Test title"
  )
})

test("if `likes` is not defined, it defaults to 0", async () => {
  const newBlog = {
    title: "Test title",
    author: "unknown",
    url: "url.url.url",
  }
  const response = await api
  .post("/api/blogs")
  .send(newBlog)
  .expect(201)

  expect(response.body.likes).toBe(0)
})

test("all blogs require a title", async () => {
  const newBlog = {
    // title: "untitled",
    author: "unknown",
    url: "url.url.url",
    likes: 0
  }
  await api
  .post("/api/blogs")
  .send(newBlog)
  .expect(400)
})

test("all blogs require a url", async () => {
  const newBlog = {
    title: "untitled",
    author: "unknown",
    likes: 0
  }
  await api
  .post("/api/blogs")
  .send(newBlog)
  .expect(400)
})

test("should be able to delete a single blog post by id", async () => {
  const blogs = await api.get("/api/blogs")
  const deleteId = blogs.body[0].id

  await api
    .delete(`/api/blogs/${deleteId}`)
    .expect(204)
  
  const blogsAfter = await api.get("/api/blogs")
  expect(blogsAfter.body).toHaveLength(blogs.body.length- 1)
})

test("should be able to update information of a blog post", async () => {
  const blogs = await api.get("/api/blogs")
  const editBlog = blogs.body[0]
  const editId = editBlog.id

  updatedBlog = {
    likes: editBlog.likes + 1,
  }
  
  const response = await api
    .put(`/api/blogs/${editId}`)
    .send(updatedBlog)
    .expect(200)

  expect(response.body.likes).toBe(updatedBlog.likes)
  expect(response.body.title).toBe(editBlog.title)
  expect(response.body.author).toBe(editBlog.author)
  expect(response.body.url).toBe(editBlog.url)
})

afterAll(() => {
  mongoose.connection.close()
})

