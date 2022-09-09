import MatchModel from './match-model.js';
import { Sequelize } from 'sequelize';


const sequelize = new Sequelize('sqlite::memory:');

const matchModel = await MatchModel(sequelize);
await matchModel.sync({ force: true });

export async function createMatch(params) {
    return matchModel.create(params);
}
