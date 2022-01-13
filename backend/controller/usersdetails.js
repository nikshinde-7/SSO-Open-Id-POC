var models = require('../database/models');
const uuid = require('uuid');
const bcrypt = require('bcryptjs');

// create new local user using login id and password
exports.createNewLocalUser = async userData => {
  try {
    let existingUser = await models.users.findOne({
      where: { email: userData.email }
    });
    existingUser = JSON.stringify(existingUser);
    existingUser = JSON.parse(existingUser);

    const uniqueId = uuid.v4();
    const data = {
      id: uniqueId,
      userId: uniqueId,
      email: userData.email,
      name: userData.name,
      provider: 'local',
      password: userData.password
    };

    if (existingUser === null) {
      const newUser = await models.users.create(data);
      return newUser;
    } else {
      return existingUser;
    }
  } catch (error) {
    console.log(error);
    return error;
  }
};

// get user details by email
exports.getUserByEmail = async (email, password) => {
  try {
    if (email !== undefined && password !== undefined) {
      let user = await models.users.findOne({
        where: { email: email }
      });
      user = JSON.stringify(user);
      user = JSON.parse(user);

      const flag = await bcrypt.compare(
        password,
        user && user.password ? user.password : ''
      );

      const providerText = user !== null ? user.provider : '';

      if (flag || (user !== null && providerText.toLowerCase() !== 'local')) {
        return user;
      } else {
        return null;
      }
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

// find user by email id
exports.findUserByEmail = async email => {
  try {
    let user = await models.users.findOne({
      where: { email }
    });

    user = JSON.stringify(user);
    user = JSON.parse(user);

    if (user) {
      return user;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

// get user details by user id
exports.getUserById = async userId => {
  try {
    const user = await models.users.findOne({
      where: { userId }
    });

    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
};
