import { doc, setDoc, collection, getDocs } from "firebase/firestore";
import db from "../models/db";


/**
 * Guarda la confirmación de un invitado
 */
export async function guardarConfirmacion(id, confirmacion) {
  try {
    await setDoc(doc(db, "confirmaciones", id), confirmacion);
    return { success: true };
  } catch (error) {
    console.error("Error al guardar confirmación en Firestore:", error);
    return {
      success: false,
      message: "Ocurrió un error al guardar tu confirmación. Intenta de nuevo.",
    };
  }
}

/**
 * Obtiene todos los registros de la colección "confirmaciones"
 */
export async function obtenerConfirmaciones() {
  try {
    const querySnapshot = await getDocs(collection(db, "confirmaciones"));
    const confirmaciones = [];
    querySnapshot.forEach((doc) => {
      confirmaciones.push({ id: doc.id, ...doc.data() });
    });
    return confirmaciones;
  } catch (error) {
    console.error("Error al obtener confirmaciones de Firestore:", error);
    return [];
  }
}

