import { Sequelize, Model, DataTypes, DATE } from "sequelize";

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'path/to/database.sqlite'
});
export const MatchModel = sequelize.define("MatchModel", {
    userOne: {
        type: DataTypes.STRING,
        required: true
    },
    userTwo: {
        type: DataTypes.STRING,
        required: true,
        allowNull: true,
    },
    difficulty: {
        type: DataTypes.STRING,
        required: true,
    },
    socketIdOne: {
        type: DataTypes.STRING,
        required: true,
    },
    socketIdTwo: {
        type: DataTypes.STRING,
        required: true,
        allowNull: true,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: Date.now(),
    },
    isPending: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
});

sequelize
    .sync({
        force: false
    })
    .then(() => {
        console.log("Match table created successfully!");
    })
    .catch((err) => {
        console.log("Unable to create Match table: ", err);
    });
