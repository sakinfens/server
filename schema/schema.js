const graphql = require("graphql");
const _ = require('lodash'); //allows us to query info easier, npm i lodash
const {GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull} = graphql;

const Song = require("../models/songs");
const Artist = require("../models/artist");
// data
// const songs =[
//   {title: Goodmorning, genre: Hip-Hop, artistId: },
//   {title: Dead Wrong, genre: Rap, artistId: },
//   {title: 'Nikes', genre: 'R&b', id:'3', '': '3'},
//   {title: 'Juicy', genre: 'Rap', id:'4', artistId: },
//   {title: 'Super Rich Kids', genre: 'R&b', id:'5', artistId: },
//   {title: 'Cleopatra', genre: 'R&b', id:'6', artistId: },
//
// ];
// const artist = [
//   {name: 'Kanye West, age: 40},
//   {name: "Biggies Smalls", age: 21},
//   {name: "Frank Ocean", age: 22},
// ]

const SongType = new GraphQLObjectType({
  name: 'Song',
  fields: ()=>({
    id: {type: GraphQLID},
    title:{type: GraphQLString},
    genre:{type: GraphQLString},
    artist:{
      type: ArtistType,
      resolve(parent, args){
        // console.log(parent);
        // return _.find(artist,{id: parent.artistId})
        return Artist.findById(parent.artistId);
      }
    }
  })
});
const ArtistType = new GraphQLObjectType({
  name: 'Artist',
  fields: ()=>({
    id: {type: GraphQLID},
    name:{type: GraphQLString},
    age:{type: GraphQLInt},
    songs: {
      type: new GraphQLList(SongType),
      resolve(parent, args){
        console.log(parent)
        // return _.filter(songs,{artistId: parent.id})
        return Song.find({artistId: parent.id});
      }
    }
  })
});


const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    song:{
      type: SongType,
      args: {id: {type: GraphQLID}},
      resolve(parent,args){
        //code to get data from db / other source
        //return _.find(songs,{id:args.id});
        return Song.findById(args.id);
      }
    },
    artist:{
      type: ArtistType,
      args: {id: {type: GraphQLID}},
      resolve(parent,args){
        //return _.find(artist, {id:args.id})
        return Artist.findById(args.id);
      }
    },
    songs:{
      type: new GraphQLList(SongType),
      resolve(parent, args){
        //return songs
        return Song.find({});
      }
    },
    artists: {
      type: new GraphQLList(ArtistType),
      resolve(parent, args){
        //return artist
        return Artist.find({});
        console.log(args.songs)
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addArtist: {
      type: ArtistType,
      args:{
        name:{type: new GraphQLNonNull(GraphQLString)},
        age: {type: new GraphQLNonNull(GraphQLInt)}
      },
      resolve(parent,args){
        let artist = new Artist({
          name: args.name,
          age: args.age
        });
        return artist.save()
      }
    },
    addSong:{
      type: SongType,
      args:{
        title:{type: new GraphQLNonNull(GraphQLString)},
        genre:{type: new GraphQLNonNull(GraphQLString)},
        artistId:{type: new GraphQLNonNull(GraphQLID)}
      },
      resolve(parent, args){
        let song = new Song({
          title: args.title,
          genre: args.genre,
          artistId: args.artistId
        });
        return song.save();
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
})
