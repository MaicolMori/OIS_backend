import Oficina from "../models/Oficina.js";
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarId.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";

const registrar = async (req, res) => {
    const { email, nombre } = req.body;

    // Prevenir oficinas duplicadas
    const existeOficina = await Oficina.findOne({email});
    if (existeOficina) {
        const error = new Error("Usuario ya registrado");
        return res.status(400).json({msg: error.message});
    }

    try {
        // Guardar una nueva oficina (oficina)
        const oficina = new Oficina(req.body);
        const oficinaGuardado = await oficina.save();

        // Enviar el email
        emailRegistro({
            email,
            nombre,
            token: oficinaGuardado.token,
        });

        res.json(oficinaGuardado);
    } catch (error) {
        console.log(error);
    }

    
};

const perfil = (req, res) => {
    const { oficina } = req;
    res.json( oficina );
};

const confirmar = async (req, res) => {
    const { token } = req.params;

    const oficinaConfirmar = await Oficina.findOne({token});

    if (!oficinaConfirmar) {
        const error = new Error("Token no válido");
        return res.status(404).json({msg: error.message});
    }

    try {
        oficinaConfirmar.token = null;
        oficinaConfirmar.confirmado = true;
        await oficinaConfirmar.save();

        res.json({ msg: "Usuario confirmado correctamente" });
    } catch (error) {
        console.log(error);
    }
};

const autenticar = async (req, res) => {
    const { email, password } = req.body;

    //Comprobar si la oficina existe
    const oficina = await Oficina.findOne({email});
    if (!oficina) {
        const error = new Error("El usuario no existe");
        return res.status(404).json({msg: error.message});
    } 

    // Comprobar si la oficina está confirmado
    if (!oficina.confirmado) {
        const error = new Error("Tu cuenta no ha sido confirmada");
        return res.status(403).json({msg: error.message});
    }

    //Revisar el password
    if ( await oficina.comprobarPassword(password)) {
        
        // Autenticar
        res.json({ 
            _id: oficina._id,
            nombre: oficina.nombre,
            email:oficina.email,
            token: generarJWT(oficina.id)
        });
    } else {
        const error = new Error("El Password es incorrecto");
        return res.status(404).json({msg: error.message});
    }
};

const olvidePassword = async (req, res) => {
    const { email } = req.body;

    const existeOficina = await Oficina.findOne({ email });
    if (!existeOficina) {
        const error = new Error("El Usuario no existe");
        return res.status(400).json({ msg: error.message });
    }

    try {
        existeOficina.token = generarId();
        await existeOficina.save()

        //Enviar email con instrucciones
        emailOlvidePassword({
            email,
            nombre: existeOficina.nombre,
            token: existeOficina.token,
        });

        res.json({ msg: "Hemos enviado un email con las instrucciones" })
    } catch (error) {
        console.log(error);
    }
};

const comprobarToken = async (req, res) => {
    const { token } = req.params;

    const tokenValido = await Oficina.findOne({ token });
    if (tokenValido) {
        //El Token es válido si el usuario (oficina) existe
        res.json({ msg: "Token válido y el usuario existe"});
    } else {
        const error = new Error("Token no válido");
        return res.status(400).json({ msg: error.message });
    }
};

const nuevoPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const oficina = await Oficina.findOne({ token });
    if (!oficina) {
        const error = new Error("Hubo un error");
        return res.status(400).json({ msg: error.message });
    }

    try {
        oficina.token = null;
        oficina.password = password;
        await oficina.save();
        res.json({ msg: "Password modificado correctamente" });
    } catch (error) {
        console.log(error);
    }
};

const actualizarPerfil = async (req, res) => {
    const oficina = await Oficina.findById(req.params.id)
    if (!oficina) {
        const error = new Error("Hubo un error");
        return res.status(400).json({msg: error.message});
    }

    const { email } = req.body
    if (oficina.email !== req.body.email) {
        const existeEmail = await Oficina.findOne({email})
        if (existeEmail) {
            const error = new Error("Ese email ya está en uso");
            return res.status(400).json({msg: error.message});
        }
    }

    try {
        oficina.nombre = req.body.nombre;
        oficina.email = req.body.email;
        oficina.telefono = req.body.telefono;

        const oficinaActualizada = await oficina.save();
        res.json(oficinaActualizada);

    } catch (error) {
        console.log(error);
    }
}

const actualizarPassword = async (req, res) => {

    //Leer datos
    const { id } = req.oficina;
    const { pwd_actual, pwd_nuevo } = req.body;

    //Comprobar que el usuario existe
    const oficina = await Oficina.findById(id);
    if (!oficina) {
        const error = new Error("Hubo un error");
        return res.status(400).json({msg: error.message});
    }

    //Comprobar su password
    if (await oficina.comprobarPassword(pwd_actual)) {
        //Almacenar nuevo password

        oficina.password = pwd_nuevo;
        await oficina.save();
        res.json({ msg: "Contraseña almacenada correctamente" });
    } else {
        const error = new Error("La contraseña Actual es incorrecta");
        return res.status(400).json({ msg: error.message });
    }

    
}

export { 
    registrar, 
    perfil, 
    confirmar, 
    autenticar, 
    olvidePassword, 
    comprobarToken, 
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword,
};

