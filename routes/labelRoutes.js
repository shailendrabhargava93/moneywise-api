//  LABELS
import express from 'express';
import { fetchAllLabels } from "../controllers/labelController.js";

const router = express.Router();

/**
 * @swagger
 * /label/all/{email}:
 *   get:
 *      description: Used to find labels for user
 *      tags:
 *          - Manage Labels
 *      summary: get all labels for user
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
router.get("/all/:email", fetchAllLabels);

export default router;