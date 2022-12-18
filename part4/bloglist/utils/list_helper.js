const dummy = (blogs) => {
  return 1
}
const totalLikes = (blogs) => {
  return blogs.reduce((prev,cur) => prev + cur.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length < 1) return {}
  const top = blogs.reduce((prev, cur) => prev.likes > cur.likes ? prev : cur, blogs[0])
  return {
    title: top.title,
    author: top.author,
    likes: top.likes
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length < 1) return {}
  const res = []
  blogs.forEach(blog => {
    const ind = res.findIndex((old) => old.author == blog.author)
    if (ind != -1) {
      res[ind].blogs += 1
    } else {
      res.push({
        author: blog.author,
        blogs: 1
      })
    }
  })
  return res.reduce((prev, cur) => prev.blogs > cur.blogs ? prev : cur, res[0])
}

const mostLikes = (blogs) => {
  if (blogs.length < 1) return {}
  const res = []
  blogs.forEach(blog => {
    const ind = res.findIndex((old) => old.author == blog.author)
    if (ind != -1) {
      res[ind].likes += blog.likes
    } else {
      res.push({
        author: blog.author,
        likes: blog.likes
      })
    }
  })
  return res.reduce((prev, cur) => prev.likes > cur.likes ? prev : cur, res[0])
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}