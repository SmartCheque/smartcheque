import {
  Identifier
} from "sequelize";

import db from '../models'
// database
const Role = db.role;
const User = db.user;

const databaseInit = async () => {
  await db.sequelize.sync({ alter: true })
  const c = await Role.count()
  if (c == 0) {
    await Role.create({
      id: 1,
      name: "user"
    });

    await Role.create({
      id: 2,
      name: "moderator"
    });

    await Role.create({
      id: 3,
      name: "admin"
    });
  } else {
    const id = await User.min('id') as Identifier | undefined
    if (id) {
      const user = await User.findByPk(id)
      if (user) {
        await user.setRoles([1, 2, 3])
      }
    }
  }
}

export default databaseInit
