/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
class UserRepository {
  async addUser(newUser) {
    throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyAvailableUsername(username) {
    throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = UserRepository;
