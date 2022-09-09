import { Sequelize, Model, DataTypes, DATE } from 'sequelize';

const sequelize = new Sequelize('sqlite::memory:');
const MatchModel = sequelize.define('MatchModel', {
    userOne: {
        type: DataTypes.STRING,
        required: true
    },
    userTwo: {
        type: DataTypes.STRING,
        required: true,
        allowNull: true
    },
    timeCreated: {
        type: DataTypes.DATE,
        defaultValue: Date.now()
    },
    isFull: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

sequelize.sync().then(() => {
    console.log('Match table created successfully!')
}).catch((err) => {
    console.log('Unable to create Match table: ', err)
})
