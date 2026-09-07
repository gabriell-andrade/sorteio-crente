# Sorteio UMADEB

Aplicacao web para organizar participantes e realizar sorteios de forma simples, responsiva e persistente.

O projeto foi desenvolvido para uso da Igreja Assembleia de Deus Ministerio do Belem (UMADEB), com frontend estatico servido pelo proprio Spring Boot e dados armazenados em PostgreSQL.

## Funcionalidades

- Cadastro e edicao da lista atual de participantes.
- Normalizacao de nomes, removendo espacos extras e duplicidades sem diferenciar maiusculas e minusculas.
- Sorteio de um ou mais vencedores.
- Animacao visual durante o sorteio.
- Historico persistente dos sorteios realizados.
- Historico paginado pela API.
- Interface responsiva para desktop e celular.
- Modal de participantes com suporte a teclado, foco acessivel e reducao de movimento.
- Reinicializacao automatica durante o desenvolvimento com Spring Boot DevTools.

## Tecnologias

- Java 21
- Spring Boot 4
- Spring Web MVC
- Spring Data JPA e Hibernate
- PostgreSQL
- HTML, CSS e JavaScript
- Maven Wrapper

## Pre-requisitos

- Java 21 ou superior.
- PostgreSQL 14 ou superior.

O projeto inclui o Maven Wrapper, portanto nao e necessario instalar o Maven separadamente.

## Configuracao local

### PostgreSQL

Crie o banco de dados:

```sql
CREATE DATABASE sorteio_crente;
```

Por padrao, a aplicacao usa:

```text
URL:      jdbc:postgresql://localhost:5432/sorteio_crente
Usuario:  postgres
Senha:    vazia
```

Para configurar outros valores no PowerShell:

```powershell
$env:SPRING_DATASOURCE_URL="jdbc:postgresql://localhost:5432/sorteio_crente"
$env:SPRING_DATASOURCE_USERNAME="postgres"
$env:SPRING_DATASOURCE_PASSWORD="sua senha"
```

Tambem e possivel copiar `src/main/resources/application-local.properties.example` para `application-local.properties`. Esse arquivo e ignorado pelo Git.

O Hibernate usa `ddl-auto=update` e cria/atualiza as tabelas automaticamente. O nome atual dos participantes fica em `participante`; o historico usa `sorteios`, `sorteio_participantes` e `sorteio_vencedores`.

### Perfil de desenvolvimento

Os testes usam o perfil `dev`, que utiliza um banco H2 em memoria. Isso evita alterar o PostgreSQL local durante os testes:

```powershell
$env:SPRING_PROFILES_ACTIVE="dev"
```

## Executando a aplicacao

No Windows:

```powershell
.\mvnw.cmd spring-boot:run
```

No Linux ou macOS:

```bash
./mvnw spring-boot:run
```

Acesse:

```text
http://localhost:8080
```

Para usar outra porta:

```powershell
$env:PORT="8081"
.\mvnw.cmd spring-boot:run
```

Com o DevTools ativo, alteracoes compiladas reiniciam a aplicacao automaticamente. Alteracoes em arquivos estaticos podem exigir a recopia dos recursos ou um reinicio do processo:

```powershell
.\mvnw.cmd process-resources
```

## Testes

Execute todos os testes com:

```powershell
.\mvnw.cmd test
```

A suite cobre carregamento do contexto, regras do sorteio, paginacao do historico e normalizacao de nomes.

## API

A API usa o prefixo `/api/v1`.

### Listar participantes

```http
GET /api/v1/participantes
```

Resposta:

```json
["Gabriel", "Karla", "Ricardo"]
```

### Salvar participantes

Substitui a lista atual de participantes.

```http
POST /api/v1/participantes
Content-Type: application/json

{
  "nomes": ["Gabriel", "Karla", "Ricardo"]
}
```

### Realizar sorteio

```http
POST /api/v1/sorteios
Content-Type: application/json

{
  "nomes": ["Gabriel", "Karla", "Ricardo"],
  "quantidade": 1
}
```

Resposta:

```json
{
  "id": 1,
  "vencedores": ["Karla"],
  "realizadoEm": "2026-09-06T22:30:00Z"
}
```

### Listar historico

A pagina inicia em zero. O tamanho permitido vai de 1 a 100.

```http
GET /api/v1/sorteios?pagina=0&tamanho=20
```

A resposta segue o formato paginado do Spring Data, com `content`, `totalElements`, `totalPages`, `number` e demais metadados.

### Limpar historico

```http
DELETE /api/v1/sorteios
```

### Testar a API

O arquivo `test.http` possui exemplos prontos para uso com a extensao REST Client do VS Code.

## Estrutura principal

```text
src/main/java/com/umadeb43/sorteiocrente
├── controller  # Endpoints REST
├── dto         # Contratos de entrada e saida
├── model       # Entidades JPA
├── repository  # Repositorios Spring Data
├── service     # Regras de negocio
└── util        # Normalizacao compartilhada

src/main/resources/static
├── index.html  # Estrutura da interface
├── script.js   # Interacoes e chamadas da API
├── style.css   # Identidade visual e responsividade
└── images      # Imagens da aplicacao
```

## Aplicacao online

https://sorteio-crente-production.up.railway.app

## Autores

- Gabriel Andrade
- Karla Olimpio

## Licenca

Este projeto esta sob a licenca MIT.
