const express = require("express");
const router = express.Router();

const todos = require("../util/todosData"); // Assuming this file exports an array of todos
/**
 * @swagger
 * /todos:
 *   get:
 *     summary: Returns a list of todos
 *     responses:
 *       200:
 *         description: An array of todos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Todo'
 * components:
 *   schemas:
 *     Todo:
 *       type: object
 *       required:
 *         - id
 *         - title
 *         - completed
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier of the todo item
 *         title:
 *           type: string
 *           description: The title of the todo item
 *         completed:
 *           type: boolean
 *           description: Indicates whether the todo item is completed
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the todo item was created
 */
/**
 * @swagger
 * tags:
 *   name: Todos
 *   description: The todos managing API
 * /todos:
 *   get:
 *     summary: Lists all the todos
 *     tags: [Todos]
 *     responses:
 *       200:
 *         description: A list of todos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Todo'
 *   post:
 *     summary: Create a new todo
 *     tags: [Todos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Todo'
 *     responses:
 *       201:
 *         description: The created todo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       500:
 *         description: Server error
 * /todos/{id}:
 *   get:
 *     summary: Get a todo by id
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The todo id
 *     responses:
 *       200:
 *         description: The requested todo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       404:
 *         description: Todo not found
 *   put:
 *     summary: Update a todo by id
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The todo id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Todo'
 *     responses:
 *       200:
 *         description: The updated todo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       404:
 *         description: Todo not found
 *       500:
 *         description: Server error
 *   delete:
 *     summary: Delete a todo by id
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The todo id
 *     responses:
 *       200:
 *         description: The todo was deleted
 *       404:
 *         description: Todo not found
 */

// Implementing the CRUD operations
router.get("/", function (req, res) {
  res.status(200).json(todos);
});

router.get("/:id", function (req, res) {
  const todo = todos.find(todo => todo.id === req.params.id);
  todo ? res.status(200).json(todo) : res.sendStatus(404);
});

router.post("/", function (req, res) {
  const { title, completed } = req.body;
  const newTodoId = todos.length > 0 ? parseInt(todos[todos.length - 1].id) + 1 : 1;
  const newTodo = { id: newTodoId.toString(), title, completed, createdAt: new Date().toISOString() };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

router.put("/:id", function (req, res) {
  const index = todos.findIndex(todo => todo.id === req.params.id);
  if (index !== -1) {
    const updatedTodo = { ...todos[index], ...req.body };
    todos[index] = updatedTodo;
    res.status(200).json(updatedTodo);
  } else {
    res.sendStatus(404);
  }
});

router.delete("/:id", function (req, res) {
  const index = todos.findIndex(todo => todo.id === req.params.id);
  if (index !== -1) {
    todos.splice(index, 1);
    res.sendStatus(204);
  } else {
    res.sendStatus(404);
  }
});

module.exports = router;
