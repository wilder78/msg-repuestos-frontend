import { useState, useEffect, useCallback } from "react";

const getAuthToken = () =>
  localStorage.getItem("token") || sessionStorage.getItem("token") || null;

const authFetch = (url, options = {}) => {
  const token = getAuthToken();
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
};

export const useRoles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRolesData = useCallback(async () => {
    setLoading(true);
    try {
      const [resRoles, resPerms] = await Promise.all([
        authFetch("http://localhost:8080/api/roles"),
        authFetch("http://localhost:8080/api/role-permissions/"),
      ]);

      if (!resRoles.ok || !resPerms.ok) throw new Error("Error en el servidor");

      const dataRoles = await resRoles.json();
      const dataPerms = await resPerms.json();

      const roleList = dataRoles.data || dataRoles.roles || dataRoles || [];

      const formattedRoles = roleList.map((rol) => {
        const idActual = rol.idRol || rol.id_rol;

        const asignacionesDelRol = dataPerms.filter(
          (p) => p.idRol === idActual || p.id_rol === idActual,
        );

        let ultimaFecha = "N/A";

        if (asignacionesDelRol.length > 0) {
          const fechas = asignacionesDelRol
            .map((a) => new Date(a.fechaAsignacion))
            .filter((d) => !isNaN(d))
            .sort((a, b) => b - a);

          if (fechas.length > 0) {
            ultimaFecha = fechas[0].toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            });
          }
        }

        // ✅ return dentro del map, con su cierre correcto
        return {
          id: idActual,
          nombre: rol.nombreRol || rol.nombre_rol || rol.nombre,
          descripcion: rol.descripcion || "Sin descripción",
          estado: rol.estado || "activo",
          idEstado: rol.idEstado || rol.id_estado || 1,
          fechaCreacion: ultimaFecha,
          permisosCount: asignacionesDelRol.length,
        };
      }); // ✅ cierre del .map()

      // ✅ setRoles va DESPUÉS del map, no dentro de él
      setRoles(formattedRoles);
    } catch (err) {
      console.error("Error al sincronizar datos:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRolesData();
  }, [fetchRolesData]);

  // ✅ setRoles expuesto para actualizaciones optimistas
  return { roles, setRoles, loading, refresh: fetchRolesData };
};
