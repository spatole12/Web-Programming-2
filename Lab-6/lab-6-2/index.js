
const {ApolloServer, gql} = require('apollo-server');
const lodash = require('lodash');
const uuid = require('node-uuid');


let quotes = [
    { id: uuid.v4(), quote: "When Chuck Norris was born he drove his mom home from the hospital." },
  { id: uuid.v4(), quote: "Chuck Norris has a diary. It's called the Guinness Book of World Records." },
  { id: "ab648889-f53a-4fdd-9e22-511bcfe45dcc", quote: "Chuck Norris threw a grenade and killed 50 people, then it exploded." },
  { id: "a6cf34b9-c317-450b-bfc0-346599df21a1", quote: "Chuck Norris counted to infinity. Twice." },
  { id: "5a1c7249-c3f4-4321-8b44-4f49707a1c9c", quote: "Chuck Norris beat the sun in a staring contest." }

    ];


const typeDefs = gql`
    type Query {
        quotes: [Quote]
        quote(id: String): Quote
    }

    type Quote {
        id: String
        quote: String

        
    }
    type Mutation {
        addQuote(quote: String!): Quote
        removeQuote(id: String!): [Quote]
        editQuote(id: String!, quote: String!): Quote
    }
`;

/* parentValue - References the type def that called it
    so for example when we execute numOfTodos we can reference
    the parent's properties with the parentValue Paramater
*/

/* args - Used for passing any arguments in from the client
    for example, when we call 
    addTodo(title: String!, completed: String!, UserId: Int!): Todo
		
*/

const resolvers = {
    Query: {
        quote: (_, args) => quotes.filter((e) => e.id === args.id)[0],
        quotes: () => quotes
    },

    // Quote: {
    //     quote: quotes[0]
    // },
    
    Mutation: {
        addQuote: (_, args) => {
            const newQuote = {
                id: uuid.v4(),
                quote: args.quote,
            };
            quotes.push(newQuote);
            return newQuote;
        },
        removeQuote: (_, args) => {
            return lodash.remove(quotes, e => e.id == args.id);
        },
        editQuote: (_, args) => {
            let newQuote;
            quotes = quotes.map(e => {
                if (e.id === args.id) {
                    if (args.quote) {
                        e.quote = args.quote;
                    }
                    newQuote = e;
                    return e;
                }
                return e;
            });
            return newQuote;
        },
    }
};


const server = new ApolloServer({typeDefs, resolvers});

server.listen().then(({url}) => {
    console.log(`🚀  Server ready at ${url} 🚀`);
});
