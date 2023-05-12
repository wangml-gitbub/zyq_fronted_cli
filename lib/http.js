const axios = require('axios')

axios.interceptors.response.use(res => {
  return res.data
})

// 获取模版列表
async function getRepoList(){
  return axios.get('https://api.github.com/users/wangml-gitbub/repos') // https://api.github.com/users/wangml-gitbub/repos
}

// 获取版本信息
async function getTagList(repo) {
  return axios.get(`https://api.github.com/repos/wangml-gitbub/${repo}/tags`) // https://api.github.com/repos/wangml-gitbub/${repo}/tags
}

module.exports = {
  getRepoList,
  getTagList
}