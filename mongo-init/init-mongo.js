// Script de inicialización de MongoDB
// Este script se conecta al MongoDB del host y copia los datos al contenedor

print('🔄 Iniciando copia de datos desde MongoDB del host...');

// Conectar a la base de datos del contenedor
const containerDb = db.getSiblingDB('bbdd');

// Obtener credenciales desde variables de entorno
const hostUsername = process.env.HOST_MONGODB_USERNAME || 'admin';
const hostPassword = process.env.HOST_MONGODB_PASSWORD || '';
const hostDatabase = process.env.HOST_MONGODB_DATABASE || 'bbdd';

print('📋 Usuario: ' + hostUsername);
print('📋 Base de datos: ' + hostDatabase);

try {
  // Conectar al MongoDB del host con autenticación
  const hostConnection = new Mongo('mongodb://' + hostUsername + ':' + hostPassword + '@host.docker.internal:27017/admin');
  const hostDb = hostConnection.getDB(hostDatabase);
  
  print('✅ Conectado al MongoDB del host');
  
  // Copiar colección de artículos
  print('📦 Copiando colección "articulos"...');
  const articulos = hostDb.articulos.find().toArray();
  
  if (articulos.length > 0) {
    containerDb.articulos.insertMany(articulos);
    print('✅ Insertados ' + articulos.length + ' documentos en "articulos"');
  } else {
    print('⚠️ No se encontraron documentos en la colección "articulos" del host');
  }
  
  // Copiar colección de facturas
  print('📦 Copiando colección "facturas"...');
  const facturas = hostDb.facturas.find().toArray();
  
  if (facturas.length > 0) {
    containerDb.facturas.insertMany(facturas);
    print('✅ Insertados ' + facturas.length + ' documentos en "facturas"');
  } else {
    print('⚠️ No se encontraron documentos en la colección "facturas" del host');
  }
  
  print('✅ Migración completada correctamente');
  print('📊 Total articulos: ' + containerDb.articulos.countDocuments());
  print('📊 Total facturas: ' + containerDb.facturas.countDocuments());
  
} catch (error) {
  print('❌ Error al conectar con MongoDB del host: ' + error);
  print('💡 Asegúrate de que MongoDB está corriendo en el host en el puerto 27017');
  print('💡 Si tu MongoDB del host requiere autenticación, modifica la cadena de conexión');
}
