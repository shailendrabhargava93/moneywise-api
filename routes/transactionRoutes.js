// routes/transactionRoutes.js
import express from "express";

import {
  addTransaction,
  fetchTransactions,
  fetchFilteredTransactions,
  fetchTransactionById,
  removeTransaction,
  modifyTransaction,
  fetchUserSpent,
} from "../controllers/transactionController.js";
const router = express.Router();
/**
 * @swagger
 * /txn/create:
 *   post:
 *      description: Used to add Transaction
 *      tags:
 *          - Manage Transactions
 *      summary: create new txn
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required:
 *                          - title
 *                          - amount
 *                          - category
 *                          - date
 *                          - budgetId
 *                          - user
 *                      properties:
 *                          title:
 *                              type: string
 *                          amount:
 *                              type: number
 *                              format: double
 *                          category:
 *                              type: string
 *                          date:
 *                              type: string
 *                              format: date
 *                          user:
 *                              type: string
 *                          budgetId:
 *                              type: string
 *      responses:
 *          '200':
 *              description: Txn added successfully
 *          '500':
 *              description: Internal server error
 */
router.post("/create", addTransaction);

/**
 * @swagger
 * /txn/all/{email}/{page}/{count}:
 *  get:
 *     description: Used to Get All Transaction
 *     tags:
 *        - Manage Transactions
 *     summary: get all txns for specific user
 *     parameters:
 *      - name: email
 *        in: path
 *        description: email id of the user
 *        required: true
 *        type: string
 *      - name: page
 *        in: path
 *        description: page no
 *        required: true
 *        type: number
 *      - name: count
 *        in: path
 *        description: no of records
 *        required: true
 *        type: number
 *     responses:
 *      200:
 *        description: Fetched Successfully
 *      500:
 *        description: Internal Server Error
 */
router.get("/all/:email/:page/:count", fetchTransactions);

/**
 * @swagger
 * /txn/filter:
 *   post:
 *      description: filter all transactions
 *      tags:
 *          - Manage Transactions
 *      summary: Filter Txns
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required:
 *                          - email
 *                          - categories
 *                          - min
 *                          - max
 *                      properties:
 *                          email:
 *                              type: string
 *                          min:
 *                              type: number
 *                              format: double
 *                          max:
 *                              type: number
 *                              format: double
 *                          categories:
 *                              type: array
 *                              items:
 *                                type: string
 *      responses:
 *          '200':
 *              description: Fetched successfully
 *          '500':
 *              description: Internal server error
 */
router.post("/filter", fetchFilteredTransactions);

/**
 * @swagger
 * '/txn/{id}':
 *  get:
 *     tags:
 *        - Manage Transactions
 *     summary: get any txn by id
 *     parameters:
 *      - name: id
 *        in: path
 *        description: The id of the txn
 *        required: true
 *        type: string
 *     responses:
 *      200:
 *        description: Fetched Successfully
 *      500:
 *        description: Internal Server Error
 */
router.get("/:id", fetchTransactionById);

/**
 * @swagger
 * '/txn/{id}':
 *  delete:
 *     tags:
 *        - Manage Transactions
 *     summary: delete txn by id
 *     parameters:
 *      - name: id
 *        in: path
 *        description: The id of the txn
 *        required: true
 *        type: string
 *     responses:
 *      200:
 *        description: Deleted Successfully
 *      500:
 *        description: Internal Server Error
 */
router.delete("/:id", removeTransaction);

/**
 * @swagger
 * /txn/update/{id}:
 *   put:
 *      description: Used to update Transaction
 *      tags:
 *          - Manage Transactions
 *      summary: update any txn by id
 *      parameters:
 *        - in: path
 *          name: id
 *          description: The id of the txn
 *          required: true
 *          type: string
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required:
 *                          - title
 *                          - amount
 *                          - category
 *                          - date
 *                      properties:
 *                          title:
 *                              type: string
 *                          amount:
 *                              type: number
 *                              format: double
 *                          category:
 *                              type: string
 *                          date:
 *                              type: string
 *                              format: date
 *      responses:
 *          '200':
 *              description: Txn updated successfully
 *          '500':
 *              description: Internal server error
 */
router.put("/update/:id", modifyTransaction);

/**
 * @swagger
 * '/txn/spent/{email}':
 *  get:
 *     tags:
 *        - Manage Transactions
 *     summary: get spent by user
 *     parameters:
 *      - name: email
 *        in: path
 *        description: user email id
 *        required: true
 *        type: string
 *     responses:
 *      200:
 *        description: Fetched Successfully
 *      500:
 *        description: Internal Server Error
 */
router.get("/spent/:email", fetchUserSpent);

export default router;
