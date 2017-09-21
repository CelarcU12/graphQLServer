

const _ = require('lodash');

const Authors = require('./data/authors'); // This is to make available authors.json file
const Posts = require('./data/posts'); // This is to make available post.json file
const Views = require('./data/views');
const View2 = require('./data/views2');
const stationData = require('./data/stationData');
/* Here a simple schema is constructed without using the GraphQL query language. 
  e.g. using 'new GraphQLObjectType' to create an object type 
*/

let {
  // These are the basic GraphQL types need in this tutorial
  GraphQLString,
  GraphQLList,
  GraphQLObjectType,
  // This is used to create required fileds and arguments
  GraphQLNonNull,
  // This is the class we need to create the schema
  GraphQLSchema,
  GraphQLInt
} = require('graphql');

const AuthorType = new GraphQLObjectType({
    name: "Author",
    description: "This represent an author",
    fields: () => ({
      id: {type: new GraphQLNonNull(GraphQLString)},
      name: {type: new GraphQLNonNull(GraphQLString)},
      twitterHandle: {type: GraphQLString}
    })
  });

  const PostType = new GraphQLObjectType({
    name: "Post",
    description: "This represent a Post",
    fields: () => ({
      id: {type: new GraphQLNonNull(GraphQLString)},
      title: {type: new GraphQLNonNull(GraphQLString)},
      body: {type: GraphQLString},
      author: {
        type: AuthorType,
        resolve: function(post) {
          return _.find(Authors, a => true);
        }
      }
    })
  });

const ViewsType = new GraphQLObjectType({
    name: "View",
    description: "This represents a View",
    fields: () =>({
        id: {type: GraphQLInt},
        name: {type: GraphQLString},
        position_set: {
          type: GraphQLString}
    })

});
const graphType = new GraphQLObjectType({
  name: "GraphType",
  description: "This represents a graph type",
  fields:() => ({
    id: {type: GraphQLInt},
    description: { type: GraphQLString}
  })
});

const lineType = new GraphQLObjectType({
  name: "LineType",
  description: "This represents a path-line type",
  fields:() => ({
    id: {type: GraphQLInt},
    description: { type: GraphQLString}
  })
});

const colorType = new GraphQLObjectType({
  name: "ColorType",
  description: "This represents a graph color type",
  fields:() => ({
    id: {type: GraphQLInt},
    description: { type: GraphQLString}
  })
});


const graphSetType = new GraphQLObjectType({
  name: "GraphSet",
  description: "This represents a graph set",
  fields: (value) => ({
    gposition: {type: GraphQLInt},
    partab: {type: GraphQLInt},
    station: {type: GraphQLInt},
    flower: {type: GraphQLString},
    position: {type: GraphQLInt},
    plot_code: {type: GraphQLString},
    graph_type: {type: graphType},
    line: {type: lineType},
    color: {type: colorType},
    data: { 
      type: new GraphQLList(stationDataType),
      resolve: function(value) {
      return _.find(stationData, d => {d.value === value })
    }
  }
})
});

const positionSetType = new GraphQLObjectType({
  name: "PositionSet",
  description: "This represents a position set",
  fields: () =>({
    id: {type: GraphQLInt},
    position: {type: GraphQLInt},
    flower: {type: GraphQLString},
    graph_set:{type: new GraphQLList(graphSetType)},
})  
});


const view2Type = new GraphQLObjectType({
  name: "View2",
  description: "This represents a View2",
  fields: () =>({
      id: {type: GraphQLInt},
      position_set: {type: new GraphQLList(positionSetType)},
      name: {type: GraphQLString}
  })

}); 

const stationDataType = new GraphQLObjectType({
  name: "StationData",
  description: "This represent data of station on some date",
  fields: () => ({
    //history: {type: GraphQLInt},
    //modified: {type: GraphQLString},
    value: {type:GraphQLInt},
    //status: {type: GraphQLInt},
    date: {type: GraphQLString}
  })
});





  // This is the Root Query
const BlogQueryRootType = new GraphQLObjectType({
    name: 'BlogAppSchema',
    description: "Blog Application Schema Query Root",
    fields: () => ({
      bleeee: {
        type: new GraphQLList(AuthorType),
        description: "List of all Authors",
        resolve: function() {
          return Authors
        }
      },
      posts: {
        type: new GraphQLList(PostType),
        description: "List of all Posts",
        resolve: function() {
          return Posts
        }
      },
      views: {
          type: new GraphQLList(ViewsType),
          description: "List of all views",
          resolve: function(){
              return Views
          }
      },
      view2: {
        type: new GraphQLList(view2Type),
        description: 'View malo drugače',
        resolve: function() {
          return View2
        }
      }, 
      stationData: {
        type: new GraphQLList(stationDataType),
        description: 'Station date',
        resolve: function() {
          return stationData
        }
      }
    })
  });

  // This is the schema declaration
const BlogAppSchema = new GraphQLSchema({
    query: BlogQueryRootType
    // If you need to create or updata a datasource, 
    // you use mutations. Note:
    // mutations will not be explored in this post.
    // mutation: BlogMutationRootType 
  });



  module.exports = BlogAppSchema;