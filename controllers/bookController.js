const db = require('../models');
const path = require('path');
const { NotFoundError, BadRequestError } = require('../errors');
const { StatusCodes } = require('http-status-codes');
const { Op } = require('sequelize');
const Book = db.books;

//pagination
const getPagination = (page, size) => {
    const limit = size ? +size : 5;
    const offset = page ? page * limit : 0;

    return { limit, offset };
};
const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: books } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);

    return { totalItems, books, totalPages, currentPage };
};

//retrieve all the books created by user from database
const getAllBooks = async (req, res) => {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
    Book.findAndCountAll({
        where: { createdBy: req.user.id },
        limit,
        offset,
    }).then((data) => {
        const response = getPagingData(data, page, limit);
        res.status(StatusCodes.OK).json(response);
    });
};

//retrieve all books not created by the user
const getRecommendedBooks = async (req, res) => {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
    Book.findAndCountAll({
        where: { createdBy: { [Op.ne]: req.user.id } },
        limit,
        offset,
    }).then((data) => {
        const response = getPagingData(data, page, limit);
        res.status(StatusCodes.OK).json(response);
    });
};

//create book and save it in the databse
const createBook = async (req, res) => {
    if (!req.files) {
        throw new BadRequestError('No File Uploaded');
    }
    const bookImage = req.files.imageUrl;
    const extensionName = path.extname(bookImage.name);
    const allowedExtension = ['.png', '.jpg', '.jpeg'];
    if (!allowedExtension.includes(extensionName)) {
        throw new BadRequestError('Please Upload a valid Image');
    }
    const imagePath = path.join(__dirname, '../uploads/' + `${bookImage.name}`);
    await bookImage.mv(imagePath);
    req.body.imageUrl = `/uploads/${bookImage.name}`;
    req.body.createdBy = req.user.id;
    const book = await Book.create(req.body);
    res.status(StatusCodes.CREATED).json({ book });
};

//retrieve a single book from database
const getBook = async (req, res) => {
    const book = await Book.findOne({
        where: {
            id: req.params.id,
            createdBy: req.user.id,
        },
    });
    if (!book) {
        throw new NotFoundError(`No book with id ${req.params.id}`);
    }
    res.status(StatusCodes.OK).json({ book });
};

// //update a book in database
const updateBook = async (req, res) => {
    await Book.update(req.body, {
        where: { id: req.params.id, createdBy: req.user.id },
    });
    const book = await Book.findByPk(req.params.id);
    if (!book) {
        throw new NotFoundError(`No book with id ${req.params.id}`);
    }
    res.status(StatusCodes.CREATED).json({
        message: 'updated successfully',
        new_book: book,
    });
};

//delete a book from database
const deleteBook = async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (!book) {
        throw new NotFoundError(`No book with id ${req.params.id}`);
    }
    await Book.destroy({
        where: { id: req.params.id, createdBy: req.user.id },
    });
    res.status(StatusCodes.CREATED).json({
        message: 'deleted successfully',
        deleted_book: book,
    });
};

module.exports = {
    getAllBooks,
    getRecommendedBooks,
    createBook,
    getBook,
    updateBook,
    deleteBook,
};
