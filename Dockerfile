# Imagen ligera oficial de Nginx basada en Alpine Linux (<25MB)
FROM nginx:alpine

# Etiqueta de mantenimiento
LABEL maintainer="Grupo Domus Capital"

# Eliminar configuración por defecto de Nginx
RUN rm -rf /etc/nginx/conf.d/default.conf

# Copiar la configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar todo el contenido de la web a la raíz web de Nginx
COPY . /usr/share/nginx/html

# Exponer el puerto interno configurado para Coolify
EXPOSE 18492

# Iniciar servidor Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]
