// const { ApolloServer, gql } = require('apollo-server')
// const { v1: uuid } = require('uuid')

// let authors = [
//   {
//     name: 'Robert Martin',
//     id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
//     born: 1952,
//   },
//   {
//     name: 'Martin Fowler',
//     id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
//     born: 1963
//   },
//   {
//     name: 'Fyodor Dostoevsky',
//     id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
//     born: 1821
//   },
//   { 
//     name: 'Joshua Kerievsky', // birthyear not known
//     id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
//   },
//   { 
//     name: 'Sandi Metz', // birthyear not known
//     id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
//   },
// ]

// let books = [
//   {
//     title: 'Clean Code',
//     published: 2008,
//     author: 'Robert Martin',
//     id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
//     genres: ['refactoring']
//   },
//   {
//     title: 'Agile software development',
//     published: 2002,
//     author: 'Robert Martin',
//     id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
//     genres: ['agile', 'patterns', 'design']
//   },
//   {
//     title: 'Refactoring, edition 2',
//     published: 2018,
//     author: 'Martin Fowler',
//     id: "afa5de00-344d-11e9-a414-719c6709cf3e",
//     genres: ['refactoring']
//   },
//   {
//     title: 'Refactoring to patterns',
//     published: 2008,
//     author: 'Joshua Kerievsky',
//     id: "afa5de01-344d-11e9-a414-719c6709cf3e",
//     genres: ['refactoring', 'patterns']
//   },  
//   {
//     title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
//     published: 2012,
//     author: 'Sandi Metz',
//     id: "afa5de02-344d-11e9-a414-719c6709cf3e",
//     genres: ['refactoring', 'design']
//   },
//   {
//     title: 'Crime and punishment',
//     published: 1866,
//     author: 'Fyodor Dostoevsky',
//     id: "afa5de03-344d-11e9-a414-719c6709cf3e",
//     genres: ['classic', 'crime']
//   },
//   {
//     title: 'The Demon ',
//     published: 1872,
//     author: 'Fyodor Dostoevsky',
//     id: "afa5de04-344d-11e9-a414-719c6709cf3e",
//     genres: ['classic', 'revolution']
//   },
// ]

// const typeDefs = gql`
// type Author {
//   name: String!
//   born: Int
//   id: ID!
//   bookCount: Int
// }

// type Book {
//   title: String!
//   published: Int!
//   author: String!
//   id: ID!
//   genres: [String!]!
// }

// type Query {
//   bookCount: Int!
//   authorCount: Int!
//   allBooks(author: String, genre: String): [Book!]!
//   allAuthors: [Author!]!
// }

// type Mutation {
//   addBook(
//     title: String!
//     published: Int!
//     author: String!
//     genres: [String!]!
//   ): Book

//   editAuthor(
//     name: String!
//     setBornTo: Int!
//   ): Author
// }
// `

// const resolvers = {
//   Query: {
//     bookCount: () => books.length,
//     authorCount: () => authors.length,
//     allBooks: (root, args) => {
//       if (!args.author && ! args.genre) return books
//       else if (args.author && !args.genre){
//         return books.filter(book => book.author === args.author)
//       }
//       else if (!args.author && args.genre){
//         return books.filter(book => book.genres.includes(args.genre))
//       }
//       else {
//         return books.filter(book => book.author === args.author)
//                     .filter(book => book.genres.includes(args.genre))
//       }
//     },
//     allAuthors: () => authors
//   },
//   Author: {
//     bookCount: (root) => books.filter(book=>book.author === root.name).length
//   },
//   Mutation: {
//     addBook: (root, args) => {
//       if(!authors.find(a => a.name === args.author)){
//         authors = authors.concat({name:args.author,id:uuid(),born:null})
//       }
//       const book = { ...args, id: uuid() }
//       books = books.concat(book)
//       return book
//     },

//     editAuthor: (root, args) => {
//       const author = authors.find(a => a.name === args.name)
//       const index = authors.indexOf(author)
//       if(index !== -1){
//         authors[index] = {...author, born:args.setBornTo}
//         return {...author, born:args.setBornTo}
//       }
//       return null
//     }
//   }
// }

// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
// })

// server.listen().then(({ url }) => {
//   console.log(`Server ready at ${url}`)
// })

// ----------------above before 8.13

const { ApolloServer, 
  UserInputError, 
  AuthenticationError, 
  gql 
} = require('apollo-server')

const { PubSub } = require('graphql-subscriptions')
const mongoose = require('mongoose')
require('dotenv').config()

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

// mongoose.set('debug', true)

const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')
const jwt = require('jsonwebtoken')

const JWT_SECRET = 'secret'
const pubsub = new PubSub()

const typeDefs = gql`
type Subscription {
  bookAdded: Book!
}    

type User {
  username: String!
  favoriteGenre: String!
  id: ID!
}

type Token {
  value: String!
}

type Book {
  title: String!
  published: Int!
  author: Author!
  genres: [String!]!
  id: ID!
}

type Author {
  name: String!
  born: Int
  id: ID!
  bookCount: Int!
}

type Query {
  bookCount: Int!
  authorCount: Int!
  allBooks(author: String, genre: String): [Book]
  allAuthors: [Author!]!
  me: User
}

type Mutation {
  addBook(
    title: String!
    published: Int!
    author: String!
    genres: [String]
  ): Book

  editAuthor(
    name: String!
    setBornTo: Int!
  ): Author

  createUser(
    username: String!
    favoriteGenre: String!
  ): User

  login(
    username: String!
    password: String!
  ): Token
}
`
const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allAuthors: () => {
      // console.log('Author.find')
      return Author.find({}).populate('books')
    },
    allBooks: async (root, args) => {
      if (!args.author && ! args.genre) return Book.find({}).populate('author')
      else if (args.author && !args.genre){
        const author_in_db = await Author.findOne({name: args.author})
        return Book.find({author: author_in_db})
                   .populate('author')
      }
      else if (!args.author && args.genre){
        return Book.find({genres: { $in: [args.genre] }})
                   .populate('author')
      }
      else {
        const author_in_db = await Author.findOne({name: args.author})
        return Book.find({author: author_in_db, genres: { $in: [args.genre] }})
                   .populate('author')
      }
    },
    me: (root, args, context) => {
      // console.log(context.currentUser)
      return context.currentUser
    }
  },
  Author: {
    bookCount: (root) => {
      // console.log('BookCount')
      // return Book.collection.find({author: root._id}).count()
      return root.books.length
    }
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new AuthenticationError("not authenticated")
      }

      let author_in_db = await Author.findOne({name: args.author})
      if(!author_in_db){
        const new_author = new Author({ name:args.author })
        author_in_db = await new_author.save()
      }
      const book = new Book({ 
        title: args.title, 
        author: author_in_db, 
        published: parseInt(args.published),
        genres: args.genres
      })
      try{
        const saved_book = await book.save()
        author_in_db.books = author_in_db.books.concat(saved_book._id)
        await author_in_db.save()
      }
      catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
      pubsub.publish('BOOK_ADDED', { bookAdded: book })
      return book
    },

    editAuthor: async (root, args,context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new AuthenticationError("not authenticated")
      }

      const author = await Author.findOne({name: args.name})
      if(!author) return null
      author.born = args.setBornTo
      try {
        await author.save()
      }
      catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
      return author
    },

    createUser: (root, args) => {
      const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })
  
      return user.save()
        .catch(error => {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        })
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
  
      if ( !user || args.password !== 'secret' ) {
        throw new UserInputError("wrong credentials")
      }
  
      const userForToken = {
        username: user.username,
        id: user._id,
      }
  
      return { value: jwt.sign(userForToken, JWT_SECRET) }
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
  const auth = req ? req.headers.authorization : null
  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    const decodedToken = jwt.verify(
      auth.substring(7), JWT_SECRET
    )
    const currentUser = await User.findById(decodedToken.id)
    return { currentUser }
  }
}
})

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`Server ready at ${url}`)
  console.log(`Subscriptions ready at ${subscriptionsUrl}`)
})