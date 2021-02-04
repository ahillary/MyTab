const router = require('express').Router()
const {Group, User, Expense} = require('../db/models')

//ORIGINAL GET ROUTE
// router.get('/', async (req, res, next) => {
//   try {
//     const groups = await Group.findAll({
//       include: [User]
//     })
//     res.send(groups)
//   } catch (err) {
//     next(err)
//   }
// })

router.get('/:userId', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.userId, {
      include: [{model: Group}],
    })
    res.json(user.groups)
  } catch (err) {
    next(err)
  }
})

router.get('/singleGroup/:groupId', async (req, res, next) => {
  try {
    const group = await Group.findByPk(req.params.groupId)
    res.json(group)
  } catch (error) {
    next(error)
  }
})

router.post('/', async function (req, res, next) {
  try {
    const newGroup = await Group.create(req.body)
    await newGroup.addUsers([req.user])
    res.send(newGroup)
  } catch (err) {
    next(err)
  }
})

// router.delete('/:id', (req, res, next) => {
//   try {
//     Robot.destroy({
//       where: {
//         id: req.params.id
//       }
//     })
//     res.status(204).end()
//   } catch (err) {
//     next(err)
//   }
// })

// GET all of group's expenses
router.get('/singleGroup/:groupId/expenses', async (req, res, next) => {
  try {
    const groupId = parseInt(req.params.groupId)
    if (isNaN(groupId)) return res.sendStatus(404)

    const thisGroup = await Group.findByPk(groupId)
    if (!thisGroup) res.sendStatus(404)

    const groupExpenses = await thisGroup.getExpenses({
      attributes: ['id', 'name', 'totalCost', 'groupId'],
    })

    res.json(groupExpenses)
  } catch (err) {
    next(err)
  }
})

// POST a new group expense
router.post('/singleGroup/:groupId/expenses', async (req, res, next) => {
  try {
    console.log(req.body)
    const expenseCost = parseInt(req.body.totalCost)
    const expenseName = req.body.name
    const newExpense = await Expense.create({
      name: expenseName,
      totalCost: expenseCost,
    })
    const thisGroup = await Group.findByPk(req.params.groupId)
    await thisGroup.addExpense(newExpense.id)
    // will want to assign expense to user(s) once we have assign to friend built in
    res.json(newExpense)
  } catch (err) {
    next(err)
  }
})

// GET single group expense
router.get(
  '/singleGroup/:groupId/expenses/:expenseId',
  async (req, res, next) => {
    try {
      const expenseId = parseInt(req.params.expenseId)
      if (isNaN(expenseId)) return res.sendStatus(404)

      const thisExpense = await Expense.findByPk(expenseId, {
        attributes: ['id', 'name', 'totalCost', 'groupId'],
      })
      if (!thisExpense) res.sendStatus(404)

      res.json(thisExpense)
    } catch (err) {
      next(err)
    }
  }
)

module.exports = router
