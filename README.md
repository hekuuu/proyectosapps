# Buscador de usuarios de GitHub

Aplicación frontend simple que consumes la API pública de GitHub para buscar perfiles por nombre de usuario.

## Requisitos

- Navegador moderno
- Conexión a Internet

## Cómo ejecutar

1. Abre una terminal dentro de esta carpeta.
2. Ejecuta:

```bash
python -m http.server 8000
```

3. Abre en el navegador:

```text
http://localhost:8000
```

## Funcionalidades

- Validación del campo de búsqueda antes de consultar la API.
- Consumo real de la API pública de GitHub.
- Render dinámico del DOM con la información del usuario.
- Estados visuales de carga y error.
- Manejo de errores como usuarios no encontrados o fallos de conexión.
