let userToken = null;

module.exports = {
  getUserToken: () => userToken,
  setUserToken: (token) => {
    userToken = token;
  },
};
