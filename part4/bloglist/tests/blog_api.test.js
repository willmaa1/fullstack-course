const mongoose = require("mongoose")
const supertest = require("supertest")
const helper = require("./test_helper")

const app = require("../app")

const Blog = require("../models/blog")
const User = require("../models/user")

const api = supertest(app)
let authToken = ""
beforeEach(async () => {
  // Clear all blogs and users
  await Blog.deleteMany({})
  await User.deleteMany({})

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }

  // Create and login as a new user
  const newUser = {
    username: "username",
    name: "name",
    password: "userpwrd"
  }

  await api
    .post("/api/users")
    .send(newUser)

  resp = await api
    .post("/api/login")
    .send(newUser)

  authToken = "Bearer " + resp.body.token

})

test("blog api requires a valid token", async () => {
  await api
  .get("/api/blogs")
  .expect(400) // Note. The example in materials returns '400' when token is missing but exercise 4.23 says '401 Unauthorized'. Regarding it as a typo.
  .expect("Content-Type", /application\/json/)
})

test("blogs cannot be added without a valid token", async () => {
  const newBlog = {
      title: "Test title",
      author: "unknown",
      url: "url.url.url",
      likes: 4
  }
  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(400) // Note. The example in materials returns '400' when token is missing but exercise 4.23 says '401 Unauthorized'. Regarding it as a typo.
    .expect("Content-Type", /application\/json/)
})

test("blogs are returned as json", async () =>  {
  await api
  .get("/api/blogs")
  .expect(200)
  .expect("Content-Type", /application\/json/)
  .set("Authorization", authToken)
})

test("all blogs are returned", async () =>  {
  const response = await api
    .get("/api/blogs")
    .set("Authorization", authToken)
  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test("unique identifier of blog is id", async () => {
  const response = await api
    .get("/api/blogs")
    .set("Authorization", authToken)
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
  .set("Authorization", authToken)

  const response = await api
    .get("/api/blogs")
    .set("Authorization", authToken)
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
  .set("Authorization", authToken)

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
  .set("Authorization", authToken)
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
  .set("Authorization", authToken)
})

test("should be able to delete a single blog post by id", async () => {
  const blogsBefore = await api
    .get("/api/blogs")
    .set("Authorization", authToken)


  const newBlog = {
    title: "Test title",
    author: "unknown",
    url: "url.url.url",
  }

  const response = await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .set("Authorization", authToken)

  // Just to make sure the blog was created correctly
  const blogsMidway = await api
    .get("/api/blogs")
    .set("Authorization", authToken)
  expect(blogsMidway.body).toHaveLength(blogsBefore.body.length + 1)

  await api
    .delete(`/api/blogs/${response.body.id}`)
    .expect(204)
    .set("Authorization", authToken)
  
  const blogsAfter = await api
    .get("/api/blogs")
    .set("Authorization", authToken)
  expect(blogsAfter.body).toHaveLength(blogsBefore.body.length)
})

test("should be able to update information of a blog post", async () => {
  const blogs = await api
    .get("/api/blogs")
    .set("Authorization", authToken)
  const editBlog = blogs.body[0]
  const editId = editBlog.id

  updatedBlog = {
    likes: editBlog.likes + 1,
  }
  
  const response = await api
    .put(`/api/blogs/${editId}`)
    .send(updatedBlog)
    .expect(200)
    .set("Authorization", authToken)

  expect(response.body.likes).toBe(updatedBlog.likes)
  expect(response.body.title).toBe(editBlog.title)
  expect(response.body.author).toBe(editBlog.author)
  expect(response.body.url).toBe(editBlog.url)
})

afterAll(() => {
  mongoose.connection.close()
})

