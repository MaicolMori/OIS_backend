import mongoose from "mongoose";

const tareasSchema = mongoose.Schema({
    nombreOficina: {
        type: String,
        required: true,
    },
    asunto: {
        type: String,
        required: true,
    },
    descripcion: {
        type: String,
        required: true,
    },
    fecha: {
        type: Date,
        required: true,
        default: Date.now(),
    },
    oficina: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Oficina",
    },
},{
    timestamps: true,
    }
);

const Tareas = mongoose.model("Tareas", tareasSchema);

export default Tareas;