const express = require('express');
const app = express();
const graphqlHTTP = require("express-graphql");
const schema = require("./schema/schema");
const mongoose = require("mongoose");
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');

//allow cross origin
app.use(cors());



mongoose.connect('mongodb://sakinfes:akinfenwa2@ds121950.mlab.com:21950/steve-a-first-mlab-db');
mongoose.connection.once('open', ()=>{
  console.log('Connected to db');
})

app.use("/graphql",graphqlHTTP({
  schema,
  graphiql: true
}));


app.listen(4000,()=>{
  console.log('listening on port 4000')
});
