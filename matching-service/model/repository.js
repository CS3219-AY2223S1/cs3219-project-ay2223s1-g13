import MatchModel from './match-model.js';
import 'dotenv/config'

//Set up socketio connection
let sequelize = process.env.ENV == "PROD" ? process.env.DB_CLOUD_URI : process.env.DB_LOCAL_URI;

export async function createMatch(params) {
    const room = await MatchModel.create(params);
}

export async function findMatch(timing) {
    //logic to filter first user with timing +-30secs
    return;
}

export async function clearMatch(user) {
    //remove user from match collection (means no existing sess/matching for this user)
    return;
}