const User = require('./user')
const Group = require('./group')
const User_Group = require('./user_group')
const User_Expense = require('./user_expense')
const Item = require('./item')
const Expense = require('./expense')

User.belongsToMany(User, {as: 'friends', through: 'Friends'})

Group.belongsToMany(User, {through: User_Group, foreignKey: 'group_Id'})
User.belongsToMany(Group, {through: User_Group, foreignKey: 'user_Id'})

Expense.belongsToMany(User, {through: User_Expense, foreignKey: 'expense_Id'})
User.belongsToMany(Expense, {through: User_Expense, foreignKey: 'user_Id'})

Group.hasMany(Expense)
Expense.belongsTo(Group)

Item.belongsTo(Expense)
Expense.hasMany(Item)

Item.belongsTo(User)
User.hasOne(Item)

Expense.belongsTo(User)
User.hasMany(Expense)

module.exports = {
  User,
  Group,
  User_Group,
  Item,
  Expense,
  User_Expense,
}
