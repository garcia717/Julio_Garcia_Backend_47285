import local from 'passport-local'
import passport from 'passport'
import {createHash, validatedPassword} from '../utils/bcrypt.js'
import {userModel} from '../models/users.models.js'


const LocalStrategy = local.Strategy

const initializePassport = () => {
    passport.use('register', new LocalStrategy({
        passReqToCallBack: true,
        usernameField: 'email'
    }, async (req, username, password, done) => {
        
        const {firstName, lastName, email, age} = req.body
        try {
            const user = await userModel.findOne({email: email})
            if (user) {
                return done(null, false)
            }

            const passwordHash = createHash(password)
            const userCreated = await userModel.create({
                firstName: firstName,
                lastName: lastName,
                age: age,
                email: email,
                password: passwordHash
            })
            return (null, userCreated)
        } catch (error) {
            return done(error)
        }
    }))

    passport.use('login', new LocalStrategy({
        usernameField: 'email'
    }, async (username, password, done) => {
        try {
            const user = await userModel.findOne({
                email: username
            })
            if (!user) {
                return done(null, false)
            }
            if (validatedPassword(password, user.password)) {
                return done(null, user)
            }

            return done(null, false)
        } catch (error) {
            return done(error)
        }
    }))
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })
    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id)
        done(null, user)
    })

}

export default initializePassport