import nodemailer from "nodemailer";

const emailOlvidePassword= async (datos) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const { email, nombre, token } = datos;

    //Enviar el email

    const info = await transporter.sendMail({
        from: "OIS - Administrador de Actividades MPSM",
        to: email,
        subject: "Restablecer tu contraseña",
        text: "Restablecer tu contraseña",
        html: `<p>Hola: ${nombre}, has solicitado restablecer tu contraseña</p>
            <p>Sigue el siguiente enlace para generar una nueva contraseña:
            <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Restablecer Contraseña</a> </p>
        
            <p>Si tú no creaste esta cuenta, puedes ignorar este mensaje</p>
        `,
    });

    console.log("Mensaje enviado: %s", info.messageId);
};

export default emailOlvidePassword;
