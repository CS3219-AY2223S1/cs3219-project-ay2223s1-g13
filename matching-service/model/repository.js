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

export async function findMatch(username) {
    return MatchModel.findAll({
        where: {
            userOne: {
                [Op.eq]: username
            }
        }
    });
}

export async function findJoinableMatches(userOne, difficulty, createdAt) {
    return MatchModel.findOne({
        where: {
            [Op.and]: [
                {
                    createdAt: {
                        [Op.between]: [moment(createdAt).subtract(30, 'seconds').toDate(), moment(createdAt).add(30, 'seconds').toDate()]
                    }
                },
                {
                    difficulty: {
                        [Op.eq]: difficulty
                    }
                },
                {
                    userOne: {
                        [Op.ne]: userOne
                    }
                }
            ]
        },
    });
}

export async function deleteMatch(user) {
    return MatchModel.destroy({
        where: {
            userOne: user
        }
    })
}

export async function deleteMatchWithName(username) {
    return MatchModel.destroy({
        where: {
            [Op.or]: [
                {
                    userOne: username
                },
                {
                    userTwo: username
                }
            ]
        }
    })
}

export async function updateMatch(userOne, userTwo, userTwoSocketId, createdAt, isPending) {
    return MatchModel.update({
        userTwo: userTwo,
        userTwoSocketId: userTwoSocketId,
        createdAt: createdAt,
        isPending: isPending
    },
        {
            where: {
                userOne: userOne
            }
        })
}
