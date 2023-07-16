import Tareas from "../models/Tareas.js";

const agregarTarea = async (req, res) => {
    const tarea = new Tareas(req.body);
    tarea.oficina = req.oficina._id;
    try {
        const tareaAlmacenada = await tarea.save();
        res.json(tareaAlmacenada);
    } catch (error) {
        console.log(error);
    }
};

const obtenerTareas = async (req, res) => {
    const tareas = await Tareas.find();

    res.json(tareas);
};

//=====================================//
const obtenerTarea = async (req, res) => {
    const { id } = req.params;
    const tarea = await Tareas.findById(id);

    if(!tarea) {
        res.status(404).json({ msg: "No encontrado" });
    }

    if (tarea.oficina._id.toString() !== req.oficina._id.toString()) {
        return res.json({ msg: "Acción no válida" });
    }
    res.json(tarea);  
};

const actualizarTarea = async (req, res) => {
    const { id } = req.params;
    const tarea = await Tareas.findById(id);

    if (!tarea) {
        return res.status(404).json({ msg: "No encontrado" });
    }

    if (tarea.oficina._id.toString() !== req.oficina._id.toString()) {
        return res.json({ msg: "Acción no válida" });
    }
    
    //Actualizar tarea
    tarea.nombreOficina = req.body.nombreOficina || tarea.nombreOficina;
    tarea.asunto = req.body.asunto || tarea.asunto;
    tarea.descripcion = req.body.descripcion || tarea.descripcion;
    tarea.fecha = req.body.fecha || tarea.fecha;

    try {
        const tareaActualizada = await tarea.save();
        res.json(tareaActualizada);
    } catch (error) {
        console.log(error);
    }
};

const eliminarTarea = async (req, res) => {
    const { id } = req.params;
    const tarea = await Tareas.findById(id);

    if (!tarea) {
        return res.status(404).json({ msg: "No encontrado" });
    }

    if (tarea.oficina._id.toString() !== req.oficina._id.toString()) {
        return res.json({ msg: "Acción no válida" });
    }

    try {
        await tarea.deleteOne();
        res.json({ mgm: "Tarea Eliminada"});
    } catch (error) {
        console.log(error);
    }
};


export { agregarTarea, obtenerTareas, obtenerTarea, actualizarTarea, eliminarTarea };