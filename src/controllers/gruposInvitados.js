import { collection, getDocs, setDoc, doc, query, orderBy, limit } from "firebase/firestore";
import db from "../models/db.js";

export async function obtenerGruposInvitados() {
  try {
    const querySnapshot = await getDocs(collection(db, "grupos"));
    const invitados = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return invitados;
  } catch (e) {
    console.error("Error al obtener grupos invitados: ", e);
    throw e;
  }
}

async function obtenerUltimoIdInvitado() {
  try {
    const gruposQuery = query(
      collection(db, "grupos"),
      orderBy("ultimoIdInvitado", "desc"),
      limit(1)
    );
    
    const querySnapshot = await getDocs(gruposQuery);
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data().ultimoIdInvitado || 0;
    }
    return 0;
  } catch (e) {
    console.error("Error al obtener último ID de invitado: ", e);
    return 0;
  }
}

export async function enviarGruposAFirebase(gruposData) {
  try {
    const gruposCollection = collection(db, "grupos");
    let ultimoId = await obtenerUltimoIdInvitado();
    
    for (const grupo of gruposData.grupos) {
      let grupoData = {
        nombre: grupo.nombre,
        invitados: [],
        ultimoIdInvitado: ultimoId // Guardamos el último ID usado en este grupo
      };
      
      // Asignar IDs autoincrementales globales a los invitados
      for (const invitado of grupo.invitados) {
        ultimoId++;
        grupoData.invitados.push({
          id: ultimoId.toString(),
          nombre: invitado.nombre,
          relacion: invitado.relacion,
          contacto: {
            whatsapp: invitado.contacto.whatsapp,
            telefono: invitado.contacto.telefono,
            email: invitado.contacto.email
          }
        });
      }
      
      // Actualizamos el último ID usado en el grupo
      grupoData.ultimoIdInvitado = ultimoId;
      
      const grupoDocRef = doc(gruposCollection, grupo.id);
      await setDoc(grupoDocRef, grupoData);
      console.log(`Grupo ${grupo.id} enviado correctamente`);
    }
    
    console.log("Todos los grupos han sido enviados a Firebase");
    return true;
  } catch (error) {
    console.error("Error al enviar grupos a Firebase:", error);
    return false;
  }
}
