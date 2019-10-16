const batch = {
  state: {
    batchCache: []
  },
  mutations: {
    SET_BATCHCACHE: (state, data) => {
      state.batchCache = data;
    }
  }
}
export default batch;