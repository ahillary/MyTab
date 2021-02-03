const router = require('express').Router()
const {User, Expense, Group} = require('../db/models')

// GET all of user's expenses
router.get('/:userId', async (req, res, next) => {
  try {
    const id = parseInt(req.params.userId)
    if (isNaN(id)) return res.sendStatus(404)

    const thisUser = await User.findByPk(id)
    if (!thisUser) return res.sendStatus(404)

    let expenses = await thisUser.getExpenses({
      attributes: ['name', 'totalCost', 'groupId'],
    })

    res.json(expenses)
  } catch (err) {
    next(err)
  }
})

// GET individual expense and show its group name
router.get('/:userId/:expenseId', async (req, res, next) => {
  try {
    const expenseId = parseInt(req.params.expenseId)
    if (isNaN(expenseId)) return res.sendStatus(404)

    const thisExpense = await Expense.findByPk(expenseId, {
      attributes: ['id', 'name', 'totalCost', 'groupId'],
      include: {
        model: Group,
        attributes: ['title'],
      },
    })
    if (!thisExpense) return res.sendStatus(404)

    res.json(thisExpense)
  } catch (err) {
    next(err)
  }
})

module.exports = router
