const listHelper = require('../utils/list_helper')

const blogsText = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }  
]

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})


describe('total likes', () => {
  const blogs = JSON.parse(JSON.stringify(blogsText))

  test('when a list with likes 7, 5, 12, 10, 0, 2, is given the sum should be 36', () => {
    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(36)
  })
})

describe('favorite blog', () => {
  const blogs = JSON.parse(JSON.stringify(blogsText))

  test('of one author is itself', () => {
    const result = listHelper.favoriteBlog(blogs.slice(0,1))
    expect(result).toEqual({
      title: blogs[0].title,
      author: blogs[0].author,
      likes: blogs[0].likes
    })
  })
  test('should give the blog with most likes as favorite', () => {
    const result = listHelper.favoriteBlog(blogs)
    expect(result).toEqual({
      title: blogs[2].title,
      author: blogs[2].author,
      likes: blogs[2].likes
    })
  })
})

describe('most blogs', () => {
  const blogs = JSON.parse(JSON.stringify(blogsText))
  test('should return correct author when only one blog', () => {
    const result = listHelper.mostBlogs(blogs.slice(0,1))
    expect(result).toEqual({
      author: blogs[0].author,
      blogs: 1
    })
  })
  test('should return correct author when multiple blogs', () => {
    const result = listHelper.mostBlogs(blogs)
    expect(result).toEqual({
      author: "Robert C. Martin",
      blogs: 3
    })
  })
})

describe('most likes', () => {
  const blogs = JSON.parse(JSON.stringify(blogsText))
  test('should return correct author and number of likes when only one blog', () => {
    const result = listHelper.mostLikes(blogs.slice(0,1))
    expect(result).toEqual({
      author: blogs[0].author,
      likes: blogs[0].likes
    })
  })
  test('should return correct author and number of likes when multiple blogs', () => {
    const result = listHelper.mostLikes(blogs)
    expect(result).toEqual({
      author: "Edsger W. Dijkstra",
      likes: 17
    })
  })
})