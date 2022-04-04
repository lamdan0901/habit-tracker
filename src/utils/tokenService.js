class TokenService {
  getLocalRefreshToken() {
    const refresh_Token = localStorage.getItem('refreshToken')
    return refresh_Token ? refresh_Token : null
  }
  getLocalAccessToken() {
    const access_Token = localStorage.getItem('accessToken')
    return access_Token ? access_Token : null
  }
  updateLocalAccessToken(token) {
    localStorage.setItem('accessToken', token)
  }
  setTokens(res) {
    localStorage.setItem('accessToken', res.accessToken)
    localStorage.setItem('refreshToken', res.refreshToken)
  }
}

export default new TokenService()
