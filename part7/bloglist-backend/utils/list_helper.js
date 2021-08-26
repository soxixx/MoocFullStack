var _ = require('lodash')

const dummy = (blogs) => 1

const totalLikes = (blogs) => {
    if (blogs.length === 0) return 0
    return (blogs.map(blog=>blog.likes)).reduce((a, b) => a + b, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) return null
    const starter = {"likes":-1}
    return blogs.reduce((a,b) => a.likes >= b.likes? a : b,starter)
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) return null
    const authors = _.countBy(blogs,(ele)=>ele.author)
    return {'author':Object.keys(authors).pop(),'blogs':Object.values(authors).pop()}
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) return null
    blogs = blogs.map(blog=> Object({'author':blog.author,'likes':blog.likes}))
    const tmp = _.groupBy(blogs, (ele)=>ele.author)
    authors_and_likes = []
    _.forEach(tmp, function(value, key) {
        author_and_like = Object({'author':key,'likes':value.map(v=>v.likes).reduce((a, b) => a + b, 0)})    
        authors_and_likes.push(author_and_like)
    })
    // console.log(authors_and_likes)
    const starter = {"likes":-1}
    return authors_and_likes.reduce((a,b)=>a.likes>b.likes?a:b,starter)
}

  
module.exports = {
    dummy, totalLikes,favoriteBlog,mostBlogs,mostLikes
}