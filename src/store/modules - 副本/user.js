const state = {
  // 用户Token 信息
  token: window.localStorage.getItem('USER_TOKEN')
}
const getters = {}
const mutations = {
  // 用户功能：设置用户Token
  setUser (state, payload) {
    state.token = payload
    window.localStorage.setItem('USER_TOKEN', payload)
  }
}
const actions = {}

export default {
  nameSpaced: true,
  state,
  getters,
  mutations,
  actions
}
