import MatchModel from './match-model.js';
import { Sequelize, Op } from 'sequelize';

const sequelize = new Sequelize("sqlite::memory:");

const matchModel = await MatchModel(sequelize);
await matchModel.sync({ force: true });

export async function createMatch(params) {
    return matchModel.create(params);
}

export async function findMatch(username) {
    return matchModel.findAll({
        where: {
            userOne: {
                [Op.eq]: username
            }
        }
    });
}

export async function findJoinableMatches(difficulty, createdAt) {
    return matchModel.findAll({
        where: {
            [Op.and]: {
                createdAt: {
                    [Op.between]: [new Date(createdAt - 30000).getTime(), new Date(createdAt + 30000).getTime]
                },
                difficulty: {
                    [Op.eq]: difficulty
                }
            }
        },
    });
}
