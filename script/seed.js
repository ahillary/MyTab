const {green, red} = require('chalk')
const {Op} = require('sequelize')
const db = require('../server/db')
const {User, Group, Expense, Item} = require('../server/db/models')
const groupData = require('../dummyDataGroups.js')
const userData = require('../dummyDataUser.js')
const expenseData = require('../dummyDataExpenses.js')

async function seed() {
  await db.sync({force: true})
  console.log('db synced!')

  await Promise.all(
    groupData.map((group) => {
      return Group.bulkCreate(group)
    })
  )
  await Promise.all(
    userData.map((user) => {
      return User.bulkCreate(user)
    })
  )
  await Promise.all(
    expenseData.map((expense) => {
      return Expense.bulkCreate(expense)
    })
  )
  console.log(green('seeded successfully'))
}

// this function is first finding things already in the database, then associating them
async function associations() {
  // gives an array of objects that are newly created users that meet the where condition
  // added where condition that includes @ so currently it finds all the Users. We can change this at will
  let usersToAssoc = await User.findAll({
    where: {
      email: {
        [Op.like]: '%@%',
      },
    },
  })

  // gives an array of objects that are newly created groups
  let groupsToAssoc = await Group.findAll()

  // gives an array of objects that are newly created expenses
  let expensesToAssoc = await Expense.findAll()

  // associations creation loops
  // loops through all the groups, assigns two users to each group. Many users will be in more than one group this way
  for (let i = 0; i < groupsToAssoc.length; i++) {
    await usersToAssoc[i].addGroups([groupsToAssoc[i]])
    await usersToAssoc[i + 1].addGroups([groupsToAssoc[i]])
  }

  // loops through all the expenses, assigns one user to each expense. Quick and dirty association for our limited dummy data.
  let count = 0
  for (let i = 0; i < expensesToAssoc.length; i++) {
    await usersToAssoc[count].addExpenses([expensesToAssoc[i]])
    count++
    if (count % 4 === 0) {
      count = count / 4
    }
  }
}

// We've separated the `seed` function from the `runSeed` function.
// This way we can isolate the error handling and exit trapping.
// The `seed` function is concerned only with modifying the database.
async function runSeed() {
  console.log(green('seeding...'))
  try {
    await seed()
    await associations()
  } catch (err) {
    console.log('error seeding:', red(err))
    process.exitCode = 1
  } finally {
    console.log('closing db connection')
    await db.close()
    console.log('db connection closed')
  }
}

// Execute the `seed` function, IF we ran this module directly (`node seed`).
// `Async` functions always return a promise, so we can use `catch` to handle
// any errors that might occur inside of `seed`.
if (module === require.main) {
  runSeed()
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed
