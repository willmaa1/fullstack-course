const mongoose = require("mongoose")
const supertest = require("supertest")
const helper = require("./test_helper")

const app = require("../app")

const User = require("../models/user")
const bcrypt = require("bcrypt")

const api = supertest(app)

describe("when the db is empty", () => {
  beforeEach(async () => {
    await User.deleteMany({})
  })

  test("creation succeeds with a fresh username", async () => {
    const newUser = {
      username: "fresh username",
      name: "name user",
      password: "userpwrd"
    }

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(1)

      const usernames = usersAtEnd.map(u => u.username)
      expect(usernames).toContain(newUser.username)
  })

  
  test("creation does not succeeds without username", async () => {
    const newUser = {
      name: "name user",
      password: "userpwrd"
    }

    await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(0)
  })

  test("creation does not succeeds without password", async () => {
    const newUser = {
      username: "fresh username",
      name: "name user"
    }

    await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(0)
  })

  
  test("creation does not succeeds with password length < 3", async () => {
    const newUser = {
      username: "fresh username",
      name: "name user",
      password: "pw"
    }

    await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(0)
  })
})

describe("when there is initially one user in db", () => {
  const firstUser = {username: "first username", password: "first pwrd"}
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash(firstUser.password, 10)
    const user = new User({username: firstUser.username, passwordHash})

    await user.save()
  })

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: "fresh username",
      name: "name user",
      password: "userpwrd"
    }

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length +1)

      const usernames = usersAtEnd.map(u => u.username)
      expect(usernames).toContain(newUser.username)
  })

  test("creation fails with proper statuscode and message if username already taken", async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: firstUser.username,
      name: "Superuser",
      password: "new pwrd",
    }

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/)

    expect(result.body.error).toContain("expected `username` to be unique")

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })
})


afterAll(() => {
  mongoose.connection.close()
})
