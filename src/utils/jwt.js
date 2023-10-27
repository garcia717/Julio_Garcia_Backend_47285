import "dotenv/config"
import jwt from 'jsonwebtoken'

export const generateToken = (user) => {
    const token = jwt.sign({
        user
    }, process.env.JWT_SECRET, {
        expiresIn: '12h'
    })


    return token
    
}



export const authToken = (req, res, next) => {
    const authHeader = req.headers.authorization;   
    if (!authHeader) {
        console.log("No se encontró el encabezado de autorización");
        return res.status(401).send({ error: "Error usuario no autenticado" });
    }
    const token = authHeader.split(' ')[1];
    console.log("Token recibido:", token);   

    jwt.verify(token, process.env.JWT_SECRET, (error, decodedToken) => {
        if (error) {
            console.log("Error al verificar el token:", error);
            return res.status(403).send({ error: 'Usuario no autorizado, token inválido' });
        }
        console.log("Token verificado correctamente:", decodedToken);
        req.user = decodedToken.user;   
        next();
    });
}