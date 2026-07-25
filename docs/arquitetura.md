```mermaid
flowchart TD

A[Cliente]

B[Express Routes]

C[Controllers]

D[Services]

E[Repositories]

F[Prisma ORM]

G[(Banco de Dados)]

A --> B
B --> C
C --> D
D --> E
E --> F
F --> G
```
