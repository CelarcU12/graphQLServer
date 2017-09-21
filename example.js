
const Authors = require('./src/data/authors'); // This is to make available authors.json file
const Posts = require('./src/data/posts'); 

const _ = require('lodash');
// example.js
const express = require('express');
const { buildSchema, buildClientSchema, buildASTSchema } = require('graphql');
const graphqlHTTP = require('express-graphql');
let port = 3000;

/* Here a simple schema is constructed using the GraphQL schema language (buildSchema). 
   More information can be found in the GraphQL spec release */

/* let Post = buildSchema( `
type Post {
    id: String!
    author_id: String
    author: String
    category: String
    body: String
    date: String
    slug:String
    summary: String
    title: String
  }
`); */



let schema = buildSchema(`

  type Date{
    date: String
  }
  type Post{
    id: String!
    author_id: String
    author: String
    category: String
    body: String
    date: [Date]
    slug:String
    summary: String
    title: String
  }

  type Query {
    allPost(id: String, author: String): [Post]
    blogTitle: String
  }
`);

// Root provides a resolver function for each API endpoint
let root = {
  allPost: (id) => {
    console.log('posts')
    return [Posts.find( a => {
      console.log(a.id , id.id)
      return a.id  === id.id})]
    },
  blogTitle: () => {
    return 'scotch.io';
  }
};

const app = express();
app.use('/', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true //Set to false if you don't want graphiql enabled
}));

app.listen(port);
console.log('GraphQL API server running at localhost:'+ port);