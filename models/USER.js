module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('users', {
        id: {
            type: Sequelize.INTEGER(),
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: Sequelize.STRING(11),
            allowNull: false,
        },
        email: {
            type: Sequelize.STRING(35),
            allowNull: false,
        },
        password: {
            type: Sequelize.STRING(15),
            allowNull: false,
        },
    });

    return User;
};
