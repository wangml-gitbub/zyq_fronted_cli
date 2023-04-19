const axios = require('axios')

axios.interceptors.response.use(res => {
  return res.data
})

// 获取模版列表
async function getRepoList(){
  return axios.get('https://api.github.com/orgs/vue3-0-cli-yd/repos') // https://api.github.com/orgs/wangml-gitbub/repos
}

// 获取版本信息
async function getTagList(repo) {
  return axios.get(`https://api.github.com/repos/vue3-0-cli-yd/${repo}/tags`) // https://api.github.com/orgs/wangml-gitbub/repos
}

module.exports = {
  getRepoList,
  getTagList
}