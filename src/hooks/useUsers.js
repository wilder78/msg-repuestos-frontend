import { useState, useEffect, useCallback } from "react";

// Helper interno para peticiones con Token
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

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [roleMap, setRoleMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsersData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [resUsers, resRoles] = await Promise.all([
        authFetch("http://localhost:8080/api/users"),
        authFetch("http://localhost:8080/api/roles"),
      ]);

      if (!resUsers.ok || !resRoles.ok) {
        throw new Error("Error fetching data from server");
      }

      const dataUsers = await resUsers.json();
      const dataRoles = await resRoles.json();

      // Normalización de la respuesta según tu Backend
      const userList =
        dataUsers.data || dataUsers.usuarios || dataUsers.content || [];
      const roleList = dataRoles.data || dataRoles.roles || dataRoles || [];

      setUsers(userList);
      setRoles(roleList);

      // Crear mapa de roles para acceso rápido: { 1: "Admin", 2: "Vendedor" }
      const map = {};
      roleList.forEach((role) => {
        map[role.idRol] = role.nombreRol;
      });
      setRoleMap(map);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsersData();
  }, [fetchUsersData]);

  return {
    users,
    setUsers,
    roles,
    roleMap,
    loading,
    error,
    refresh: fetchUsersData,
    authFetch,
  };
};
