import { MatchModel } from './match-model.js';
import { Sequelize, Op } from 'sequelize';
import moment from 'moment';

const sequelize = new Sequelize("sqlite::memory:");

const matchModel = new MatchModel(sequelize);
await sequelize.sync({ force: true });

export async function createMatch(params) {
    return MatchModel.create(params);
}

export async function findMatch(username) {
    return MatchModel.findAll({
        where: {
            userOne: {
                [Op.eq]: username
            }
        }
    });
}

export async function findJoinableMatches(difficulty, createdAt) {
    return MatchModel.findAll({
        where: {
            [Op.and]: {
                createdAt: {
                    [Op.between]: [moment(createdAt).subtract(30, 'seconds'), moment(createdAt).add(30, 'seconds')]
                },
                difficulty: {
                    [Op.eq]: difficulty
                }
            }
        },
    });
}
