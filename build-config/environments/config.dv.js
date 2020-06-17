const config = {
  dev: true,
  allowRemovalOfQuestionnaire: false,
  baseURL: 'http://dvrmspogbolht01.ad.insee.intra/pogues',
  persistancePath: '/persistence',
  userPath: '/user',
  log: {
    level: 'ERROR',
    activeNamespaces: ['Components', 'Actions', 'Stores', 'Utils', 'Models'],
  },
};

export default config;
