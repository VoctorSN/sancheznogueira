# Inicialización de MongoDB

Este directorio contiene scripts de inicialización para MongoDB que se ejecutan automáticamente cuando el contenedor se crea por primera vez.

## Funcionamiento

Los archivos `.js` o `.sh` que se coloquen en este directorio se montan en `/docker-entrypoint-initdb.d/` del contenedor MongoDB y se ejecutan en orden alfabético durante la primera inicialización.

## Scripts actuales

- **init-mongo.js**: Carga los datos iniciales de artículos (coches) en la colección `articulos` de la base de datos `bbdd`.

## Importante

⚠️ **Los scripts solo se ejecutan la primera vez que se crea el volumen de MongoDB.**

Si ya has ejecutado `docker-compose up` anteriormente, necesitas eliminar el volumen para que los scripts se ejecuten:

```bash
# Detener los contenedores
docker-compose down

# Eliminar el volumen de MongoDB
docker volume rm sancheznogueira_mongodb_data

# Volver a iniciar (los scripts se ejecutarán)
docker-compose up --build
```

## Agregar más datos

Para inicializar más colecciones o datos:

1. Crea un nuevo archivo `.js` en este directorio
2. Usa la sintaxis de MongoDB shell
3. Los archivos se ejecutan en orden alfabético (usa prefijos numéricos si necesitas controlar el orden: `01-init.js`, `02-users.js`, etc.)
