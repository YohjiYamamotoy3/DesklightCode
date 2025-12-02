# desklight

система управления задачами и проектами с real-time обновлениями через websocket.

## функциональность

- crud операции для проектов и задач
- real-time обновления через websocket
- пагинация для больших списков
- уведомления о изменениях
- кеширование через redis

## запуск

```bash
docker-compose up -d
```

это запустит:
- postgresql на порту 5432
- redis на порту 6379
- backend на порту 8080
- frontend на порту 3000

откройте http://localhost:3000 в браузере

## эндпоинты

### проекты

- `GET /api/projects` - список всех проектов
- `GET /api/projects/{id}` - получить проект по id
- `POST /api/projects` - создать проект
- `PUT /api/projects/{id}` - обновить проект
- `DELETE /api/projects/{id}` - удалить проект

### задачи

- `GET /api/tasks` - список всех задач
- `GET /api/tasks/project/{projectId}` - задачи по проекту
- `GET /api/tasks/{id}` - получить задачу по id
- `POST /api/tasks` - создать задачу
- `PUT /api/tasks/{id}` - обновить задачу
- `PATCH /api/tasks/{id}/status` - изменить статус задачи
- `DELETE /api/tasks/{id}` - удалить задачу

## websocket

подключение к websocket:
```
ws://localhost:8080/ws
```

подписка на обновления задач:
```
/topic/tasks
```

при создании, обновлении или удалении задачи отправляется сообщение в этот топик.

## тесты

запуск тестов backend:
```bash
cd backend
mvn test
```

## структура проекта

```
desklight/
├── backend/
│   ├── src/main/java/com/desklight/
│   │   ├── DesklightApplication.java
│   │   ├── model/
│   │   ├── repository/
│   │   ├── service/
│   │   ├── controller/
│   │   └── config/
│   ├── src/test/java/
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── docker-compose.yml
└── README.md
```

## технологии

- backend: java 11, spring boot, spring data jpa, websocket, redis
- frontend: react, axios, sockjs, stompjs
- база данных: postgresql
- кеш: redis
- тестирование: junit 5, mockito

