API para reportar spam
========================

# Roadmap
 - [x] express
 - [x] queue message
 - [x] test
 - [x] CRUD
 - [x] datastore
 - [ ] logger
 - [ ] integrar frontend
 - [ ] agregar doc
 - [ ] refactor

# Overview

El usuario puede reporar spam luego este servicio se comunica con el broker de mensajes a fin de notificar a sus suscriptores, por lo tanto el subscriptor con o sin aprobación del manager puede gestionar un batch hacia el servicio de mails a fin de agregarlo a una lista de bloqueos. Permitiendo desacoplar los reportes de la gestión del proceso, por un lado gestión de administración desde otro servicio y por otro lado gestión de los reportes de los usuarios finales. Dos servicios dos fuentes de información.

# Funcionalidad

- 1 Agregar email de spammers.
- 2 eliminar email de spammers.
- 3 caso especial las actualizaciones son altas hacia el workers de procesamiento. Solo se actualizan en la primer base. Permite mantener un historico para procesar.
