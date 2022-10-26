module.exports = (sequelize, Sequelize) => {
    const Book = sequelize.define('books', {
        id: {
            type: Sequelize.INTEGER(),
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: Sequelize.STRING(11),
            allowNull: false,
        },
        author: {
            type: Sequelize.STRING(35),
            allowNull: false,
        },
        imageUrl: {
            type: Sequelize.STRING(35),
        },
        pages: {
            type: Sequelize.INTEGER(),
        },
        price: {
            type: Sequelize.INTEGER(),
        },
        createdBy: {
            type: Sequelize.INTEGER(),
            references: {
                model: 'users',
                key: 'id',
            },
        },
    });

    return Book;
};
