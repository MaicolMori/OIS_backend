import express from "express";
const router = express.Router();
import { 
    agregarTarea,
    obtenerTareas,
    obtenerTarea,
    actualizarTarea,
    eliminarTarea,
} from "../controllers/tareasController.js";
import checkAuth from "../middleware/authMiddleware.js";

router
.route("/")
.post(checkAuth, agregarTarea)
.get(checkAuth, obtenerTareas);

router
    .route("/:id")
    .get(checkAuth, obtenerTarea)
    .put(checkAuth, actualizarTarea)
    .delete(checkAuth, eliminarTarea);

export default router;