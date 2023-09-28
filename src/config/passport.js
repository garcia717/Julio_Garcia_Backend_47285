import local from 'passport-local'
import GithubStrategy from 'passport-github2'
import passport from 'passport'
import { createHash, validatedPassword} from '../utils/bcrypt.js'
import { userModel} from '../models/users.models.js'


const LocalStrategy = local.Strategy

const initializePassport = () => {
    // estrategia de registro
    passport.use('register', new LocalStrategy(
        {usernameField: 'email', passReqToCallBack: true}, async (req, username, password, done) => {

        // destructuro los datos del body     
        const {firstName, lastName, email, age  } = req.body
        try {
            // Validacion de registro usuario ya existente
            const user = await userModel.findOne({email: email})
            if (user) {
                return done(null, false)
            }
            // Creacion de nuevo usuario, hasheo de password con bcrypt para encriptar (logica en utils/bcrypt.js)
            const passwordHash = createHash(password)
            const userCreated = await userModel.create({
                firstName: firstName,
                lastName: lastName,
                age: age,
                email: email,
                password: passwordHash
            })
            return done(null, userCreated)
        } catch (error) {
            return done(error)
        }
    }))

    // estrategia de login
    passport.use('login', new LocalStrategy({usernameField: 'email'}, async (username, password, done) => {
        try {

            // Validacion de usuario con registro ya existente
            const user = await userModel.findOne({email: username})
            if (!user) {
                return done(null, false)
            }
            // login con passowrd 
            if (validatedPassword(password, user.password)) {
                return done(null, user)
            }

            return done(null, false)
        } catch (error) {
            return done(error)
        }
    }))

    // registro con github
    passport.use('github', new GithubStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.SECRET_CLIENT,
        callbackURL: process.env.CALLBACK_URL
    }, async (accessToken, refreshToken, profile, done) => {
        // Validacion de usuario existente
        try {
            const user = await userModel.find({email: profile._json.email})
            if (user) {
                done(null, false)
            } else {
                // creacion de usuario (con los datos disponibles en un perfil publico de GitHub)
                const userCreated = await userModel.create({
                    firstName: profile._json.name,
                    lastName: ' ',
                    email: profile._json.email,
                    age: 18, //Default
                    password: createHash(profile._json.email + profile._json.name)
                })
                done(null, userCreated)
            }

        } catch (error) {
            done(error)
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