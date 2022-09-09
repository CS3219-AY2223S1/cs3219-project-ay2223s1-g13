import MatchModel from './match-model.js';
import 'dotenv/config'

//Set up mongoose connection
import mongoose from 'mongoose';

let mongoDB = process.env.ENV == "PROD" ? process.env.DB_CLOUD_URI : process.env.DB_LOCAL_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

let db = mongoose.connection;
db.on('error', console.error.find(console, 'MongoDB connection error:'));

export async function createMatch(params) {
    return new MatchModel(params)
}

export async function findMatch(timing) {
    //logic to filter first user with timing +-30secs
    return;
}

export async function clearMatch(user) {
    //remove user from match collection (means no existing sess/matching for this user)
    return;
}