import { MatchModel } from './match-model.js';
import { Sequelize, Op } from 'sequelize';
import moment from 'moment';

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'path/to/database.sqlite'
});


// const matchModel = new MatchModel(sequelize);
await sequelize.sync({ force: false });

export async function createMatch(params) {
    return MatchModel.create(params);
}

export async function getAllMatch() {
    return MatchModel.findAll();
}

export async function findMatch(userOne, socketIdOne) {
    return MatchModel.findAll({
        where: {
            [Op.and]: [
                { userOne: { [Op.eq]: userOne } },
                { socketIdOne: { [Op.eq]: socketIdOne } }
            ]
        }
    });
}

export async function findJoinableMatches(userOne, socketIdOne, difficulty) {
    const match = await MatchModel.findOne({
        where: {
            [Op.and]: [
                { userTwo: { [Op.is]: null } },
                { socketIdTwo: { [Op.is]: null } },
                { difficulty: { [Op.eq]: difficulty } },
                { userOne: { [Op.ne]: userOne } }
            ]
        },
    });

    if (match) {
        match.userTwo = userOne;
        match.socketIdTwo = socketIdOne;
        await match.save();
    }
    return match;
}

export async function deleteMatch(user) {
    return MatchModel.destroy({
        where: {
            userOne: user
        }
    })
}

export async function updateMatch(userOne, match) {
    const user = await MatchModel.findOne({
        where: {
            userOne: { [Op.eq]: userOne }
        }
    });

    user.userTwo = match.userOne;
    user.socketIdTwo = match.socketIdOne;
    await user.save();
    return;
}
