let userToken: string | null = null;

export default {
  getUserToken: (): string | null => userToken,
  setUserToken: (token: string): void => {
    userToken = token;
  },
};