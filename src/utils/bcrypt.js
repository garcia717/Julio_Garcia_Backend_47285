import 'dotenv/config'
import bcrypt from 'bcrypt'

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(parseInt(process.env.SALT)))


const passwordTest = createHash('password')

export const validatedPassword = (passwordSend, passwordDB) => bcrypt.compareSync(passwordSend, passwordDB)

console.log(validatedPassword('password', passwordTest))