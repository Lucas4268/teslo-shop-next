# Next.js OpenJira App
Para correr localmente, se necesita la base de datos
```
docker-compose up -d
```

## Configurar las variables de entorno
Renombrar el archivo __.env.template__ a __.env__

* MongoDB URL Local:
```
MONGO_URL=mongodb://localhost:27017/teslodb
```

* Reconstruir módulos de node y levantar next
```
yarn install
yarn dev
```



## Llenar la base de datos con informacion de pruebas
Llamar a: 
```
http://localhost:3000/api/seed
```