//  LABELS
import express from 'express';
import { createMembersData, getAllMembers } from "../controllers/memberController.js";

const router = express.Router();


/**
 * @swagger
 * /members/create:
 *   post:
 *      description: Used to create members data
 *      tags:
 *          - Manage Members
 *      summary: create members data
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required:
 *                          - email
 *                          - members
 *                      properties:
 *                          email:
 *                              type: string
 *                          members:
 *                              type: array
 *      responses:
 *          '200':
 *              description: members added successfully
 *          '500':
 *              description: Internal server error
 */
router.post("/create", createMembersData);

/**
 * @swagger
 * /members/{email}:
 *   get:
 *      description: Used to find members for email
 *      tags:
 *          - Manage Members
 *      summary: get all Memebers for email
 *      parameters:
 *        - in: path
 *          name: email
 *          description: The email of the user
 *          required: true
 *          type: string
 *      responses:
 *          '200':
 *              description: Fetched successfully
 *          '500':
 *              description: Internal server error
 *
 */
router.get("/:email", getAllMembers);

export default router;