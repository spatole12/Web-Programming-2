
const {ApolloServer, gql} = require('apollo-server');
const lodash = require('lodash');
const uuid = require('node-uuid');


    let users = [
        {
            "id": 1,
            "name": "Babbie Veelers",
            "email": "bveelers0@fc2.com",
            "gender": "Female",
            "department": "Support",
            "country": "United States"
        }, {
            "id": 2,
            "name": "Fairleigh Jedras",
            "email": "fjedras1@diigo.com",
            "gender": "Male",
            "department": "Development",
            "country": "United Kingdom"
        }, {
            "id": 3,
            "name": "Lutero Symcox",
            "email": "lsymcox2@fotki.com",
            "gender": "Male",
            "department": "Development",
            "country": "United States"
        }, {
            "id": 4,
            "name": "Pyotr Kalinsky",
            "email": "pkalinsky3@wp.com",
            "gender": "Male",
            "department": "Support",
            "country": "Ireland"
        }, {
            "id": 5,
            "name": "Consuelo Fairey",
            "email": "cfairey4@nature.com",
            "gender": "Female",
            "department": "Legal",
            "country": "United Kingdom"
        }, {
            "id": 6,
            "name": "Jemimah Rodwell",
            "email": "jrodwell5@arizona.edu",
            "gender": "Female",
            "department": "Support",
            "country": "United States"
        }, {
            "id": 7,
            "name": "Sonny Read",
            "email": "sread6@fastcompany.com",
            "gender": "Female",
            "department": "Support",
            "country": "United States"
        }, {
            "id": 8,
            "name": "Marion Janczewski",
            "email": "mjanczewski7@hatena.ne.jp",
            "gender": "Male",
            "department": "Development",
            "country": "Ireland"
        }
    ];

    let todos = [
        {
            "userId": 1,
            "id": uuid.v4(),
            "description": "delectus aut autem",
            "completed": false
        },
        {
            "userId": 1,
            "id": uuid.v4(),
            "description": "quis ut nam facilis et officia qui",
            "completed": false
        },
        {
            "userId": 2,
            "id": uuid.v4(),
            "description": "fugiat veniam minus",
            "completed": false
        },
        {
            "userId": 2,
            "id": uuid.v4(),
            "description": "et porro tempora",
            "completed": false
        },
        {
            "userId": 3,
            "id": uuid.v4(),
            "description": "laboriosam mollitia et enim quasi adipisci quia provident illum",
            "completed": false
        },
        {
            "userId": 4,
            "id": uuid.v4(),
            "description": "qui ullam ratione quibusdam voluptatem quia omnis",
            "completed": false
        },
        {
            "userId": 5,
            "id": uuid.v4(),
            "description": "illo expedita consequatur quia in",
            "completed": false
        },
        {
            "userId": 6,
            "id": uuid.v4(),
            "description": "quo adipisci enim quam ut ab",
            "completed": false
        },
        {
            "userId": 7,
            "id": uuid.v4(),
            "description": "molestiae perspiciatis ipsa",
            "completed": false
        },
        {
            "userId": 8,
            "id": uuid.v4(),
            "description": "illo est ratione doloremque quia maiores aut",
            "completed": false
        },
    ];

const typeDefs = gql`
    type Query {
        users: [User]
        todos: [Todo]
        user(id: Int): User
        todo(id: String): Todo
    }
    type User {
        id: Int
        name: String
        email: String
        gender: String
        department: String
        country: String
        todos: [Todo]
        numOfTodos: Int
    }
    type Todo {
        id: String
        description: String
        completed: Boolean
        user: User
    }
    type Mutation {
        addTodo(description: String!, completed: Boolean!, userId: Int!): Todo
        removeTodo(id: String!): [Todo]
        editTodo(id: String!, description: String, completed: Boolean, userId: Int): Todo
        addUser(name: String!, email: String!, department: String, country: String): User
    }
`;

/* parentValue - References the type def that called it
    so for example when we execute numOfTodos we can reference
    the parent's properties with the parentValue Paramater
*/

/* args - Used for passing any arguments in from the client
    for example, when we call 
    addTodo(description: String!, completed: String!, UserId: Int!): Todo
		
*/

const resolvers = {
    Query: {
        user: (_, args) => users.filter((e) => e.id === args.id)[0],
        todo: (_, args) => todos.filter((e) => e.id === args.id)[0],
        users: () => users,
        todos: () => todos
    },
    User: {
        numOfTodos: (parentValue) => {
            //console.log(`parentValue in User`, parentValue);
            return todos.filter((e) => e.userId === parentValue.id).length;
        },
        todos: (parentValue) => {
            return todos.filter((e) => e.userId === parentValue.id);
        }
    },
    Todo: {
        user: (parentValue) => {
            return users.filter((e) => e.id === parentValue.userId)[0];
        }
    },
    Mutation: {
        addTodo: (_, args) => {
            const newTodo = {
                id: uuid.v4(),
                description: args.description,
                completed: args.completed,
                userId: args.userId
            };
            todos.push(newTodo);
            return newTodo;
        },
        removeTodo: (_, args) => {
            return lodash.remove(todos, (e) => e.id == args.id);
        },
        editTodo: (_, args) => {
            let newTodo;
            todos = todos.map((e) => {
                if (e.id === args.id) {
                    if (args.description) {
                        e.description = args.description;
                    }
                    if (args.completed) {
                        e.completed = args.completed;
                    }
                    if (args.UserId) {
                        e.UserId = args.UserId;
                    }
                    newTodo = e;
                    return e;
                }
                return e;
            });
            return newTodo;
        },
        addUser: (_, args) => {
            const newUser = {
                id: users.length + 1,
                name: args.name,
                email: args.email,
                gender: args.gender,
                department: args.department,
                country: args.country
            };
            users.push(newUser);
            return newUser;
        }
    }
};


const server = new ApolloServer({typeDefs, resolvers});

server.listen().then(({url}) => {
    console.log(`🚀  Server ready at ${url} 🚀`);
});
