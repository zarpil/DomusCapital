# Grupo Domus Capital

Sitio web estático de Grupo Domus Capital, servido con Nginx y preparado para desplegar desde GitHub mediante Docker Compose en Coolify.

## Contenido

- `index.html`: página principal y formulario de contacto.
- Páginas de servicios y páginas legales en la raíz.
- `css/`, `js/`, `img/`: estilos, comportamiento del sitio e imágenes.
- `Dockerfile`, `nginx.conf`, `docker-compose.yml`: imagen y servidor web.
- `robots.txt`, `sitemap.xml`: archivos de rastreo e indexación.

## Despliegue en Coolify desde GitHub

1. Sube este repositorio a GitHub.
2. En Coolify, crea una aplicación desde el repositorio y selecciona **Docker Compose** como método de build.
3. Indica `docker-compose.yml` como archivo Compose.
4. Configura el dominio en el servicio `web` y usa el puerto interno `18492`.
5. Despliega y revisa los logs y el estado de salud del contenedor.

El Compose usa `expose`, no publica un puerto del host. Coolify enruta el dominio al puerto interno de Nginx.

## Formulario de contacto

El formulario de `index.html` envía una petición JSON a `/api/contact`. Nginx reenvía esa ruta al webhook de n8n, así que el navegador no necesita CORS entre dominios. El flujo debe procesar los campos `nombre`, `telefono`, `email`, `servicio`, `servicioTexto`, `mensaje`, `consentimientoPrivacidad` y `origen`, y devolver una respuesta HTTP exitosa. Comprueba el envío real después del despliegue.

## Desarrollo local

Puedes servir los archivos con cualquier servidor HTTP estático. Para probar la imagen Docker, ejecuta:

```sh
docker compose up --build
```

Luego abre `http://localhost:18492` si publicas el puerto localmente. En el Compose de Coolify no se asigna un puerto del host; añade temporalmente una asignación `ports` solo para una prueba local.

