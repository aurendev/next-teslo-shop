# Next.js Teslo App
para correr localmente , se necesita la base de datos
```
docker-compose up -d
```

* El -d , significa __detached__

* Mongobd URL Local: 
```
mongobd://localhost:27017/teslodb
```

## Configurar las variables de entorno
Renombrar el **archivo** __.env.template a __.env__

## Llenar la base de datos con informacion de pruebas 
Llamara:
```
http://localhost:3000/api/seed
```
