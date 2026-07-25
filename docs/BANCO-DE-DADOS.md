```mermaid
erDiagram

PLAYER ||--o{ RESERVATION : possui

COURT ||--o{ RESERVATION : recebe

PLAYER{
string id
string name
string email
string phone
}

COURT{
string id
string name
string sport
string location
}

RESERVATION{
string id
date date
string startTime
string endTime
}
```
