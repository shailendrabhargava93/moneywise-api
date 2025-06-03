import express from 'express';
import { 
  fetchAllBudgets,
  addBudget,
  modifyBudget,
  fetchBudgetById,
  fetchBudgetStats
} from '../controllers/budgetController.js';

const router = express.Router();

/**
 * @swagger
 * /budget/all/{email}/{status}:
 *   get:
 *      description: Used to find budgets for user
 *      tags:
 *          - Manage Budgets
 *      summary: get all budgets for user
 *      parameters:
 *        - in: path
 *          name: email
 *          description: The email of the user
 *          required: true
 *          type: string
 *        - in: path
 *          name: status
 *          description: status of budget
 *          required: true
 *          type: string
 *      responses:
 *          '200':
 *              description: Fetched successfully
 *          '500':
 *              description: Internal server error
 */
router.get('/all/:email/:status', fetchAllBudgets);

/**
 * @swagger
 * /budget/create:
 *   post:
 *      description: Used to create budget
 *      tags:
 *          - Manage Budgets
 *      summary: create new budget
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required:
 *                          - name
 *                          - totalBudget
 *                          - startDate
 *                          - endDate
 *                          - createdBy
 *                          - status
 *                      properties:
 *                          name:
 *                              type: string
 *                          totalBudget:
 *                              type: number
 *                              format: double
 *                          startDate:
 *                              type: string
 *                              format: date
 *                          endDate:
 *                              type: string
 *                              format: date
 *                          createdBy:
 *                              type: string
 *                          status:
 *                              type: string
 *      responses:
 *          '200':
 *              description: Budget added successfully
 *          '500':
 *              description: Internal server error
 */
router.post('/create', addBudget);

/**
 * @swagger
 * /budget/update/{id}:
 *   put:
 *      description: Used to update Budget
 *      tags:
 *          - Manage Budgets
 *      summary: update budget
 *      parameters:
 *        - in: path
 *          name: id
 *          description: The id of the budget
 *          required: true
 *          type: string
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required:
 *                          - name
 *                          - totalBudget
 *                          - startDate
 *                          - endDate
 *                          - status
 *                          - users
 *                      properties:
 *                          name:
 *                              type: string
 *                          totalBudget:
 *                              type: number
 *                              format: double
 *                          status:
 *                              type: string
 *                          startDate:
 *                              type: string
 *                              format: date
 *                          endDate:
 *                              type: string
 *                              format: date
 *                          users:
 *                              type: array
 *                              items:
 *                                type: string
 *      responses:
 *          '200':
 *              description: budget updated successfully
 *          '500':
 *              description: Internal server error
 */
router.put('/update/:id', modifyBudget);

/**
 * @swagger
 * '/budget/{id}':
 *  get:
 *     tags:
 *        - Manage Budgets
 *     summary: get any budget by id
 *     parameters:
 *      - name: id
 *        in: path
 *        description: The id of the budget
 *        required: true
 *        type: string
 *     responses:
 *      200:
 *        description: Fetched Successfully
 *      500:
 *        description: Internal Server Error
 */
router.get('/:id', fetchBudgetById);

/**
 * @swagger
 * '/budget/stats/{id}':
 *  get:
 *     tags:
 *        - Manage Budgets
 *     summary: get budget stats
 *     parameters:
 *      - name: id
 *        in: path
 *        description: The id of the budget
 *        required: true
 *        type: string
 *     responses:
 *      200:
 *        description: Fetched Successfully
 *      500:
 *        description: Internal Server Error
 */
router.get('/stats/:id', fetchBudgetStats);

export default router;