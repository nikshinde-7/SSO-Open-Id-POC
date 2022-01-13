
const SESSION_COOKIE = "AUTH";

function setSessionCookie(res, session){
  res.cookie(SESSION_COOKIE, session, {
    httpOnly: true,
    expires: new Date(new Date().getTime() + 9000000),
  });
}

function getSessionCookie(req){
  return req.cookies[SESSION_COOKIE];
}

function clearSessionCookie(res){
  res.clearCookie(SESSION_COOKIE);
}

module.exports = {
    setSessionCookie,
    getSessionCookie,
    clearSessionCookie
}