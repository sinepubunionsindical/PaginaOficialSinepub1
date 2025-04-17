# SINEPUB Website

Sitio web del Sindicato Nacional de Empleados Públicos del Hospital Universitario del Valle (SINEPUB HUV).

## Configuración de Desarrollo

### Tokens de API

Para el desarrollo local, necesitas configurar los tokens de API para las funcionalidades de chat con IA:

1. Crea un archivo `config.local.js` basado en `config.js` con tus tokens:

```javascript
// config.local.js - NO SUBIR ESTE ARCHIVO AL REPOSITORIO
const API_KEYS = {
    HUGGINGFACE_TOKEN: "tu_token_de_huggingface",
    HYPERBOLIC_TOKEN: "tu_token_de_hyperbolic"
};

window.API_KEYS = API_KEYS;
```

2. Modifica el archivo `index.html` para usar tu archivo local durante el desarrollo:

```html
<!-- Reemplaza esta línea -->
<script src="config.js"></script>

<!-- Por esta línea para desarrollo local -->
<script src="config.local.js"></script>
```

3. Asegúrate de no subir `config.local.js` al repositorio (está incluido en `.gitignore`).

### Ejecución Local

Para ejecutar el sitio localmente, simplemente abre `index.html` en tu navegador o usa un servidor web local como Live Server de VS Code.

## Despliegue

Para desplegar en producción:

1. Asegúrate de que `config.js` tenga tokens vacíos o placeholders.
2. Sube los cambios a GitHub.
3. El sitio se desplegará automáticamente a través de GitHub Pages.

## Estructura del Proyecto

- `index.html`: Página principal del sitio
- `chat-integration.js`: Integración con la API de chat de IA
- `chat-button.js`: Funcionalidad del botón de chat flotante
- `elektra-chat.css`: Estilos para la interfaz de chat
- `android.css`: Estilos específicos para dispositivos móviles
- `config.js`: Configuración de tokens de API (placeholders)
- `config.local.js`: Configuración local con tokens reales (no incluido en el repositorio)

## Seguridad

- Nunca subas tokens de API o credenciales al repositorio.
- Usa `config.local.js` para desarrollo local y asegúrate de que esté en `.gitignore`.
- En un entorno de producción real, estas claves deberían estar en variables de entorno del servidor.
