const jwt = require('jsonwebtoken');
const JWTSECRATE = "##Hello My New User@@"

const verifyUser=(token)=>{
    const data = jwt.verify(token,JWTSECRATE)
    const email = data.user.email
    return email
}

module.exports= verifyUser