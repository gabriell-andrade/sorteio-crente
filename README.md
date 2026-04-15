# 🎲 Sorteio Crente

Aplicação web full stack desenvolvida com **Spring Boot** e **JavaScript** para realizar sorteios de forma simples, interativa e responsiva.

---

## 🌐 Aplicação online

👉 https://sorteio-crente-production.up.railway.app

---

## 🚀 Tecnologias utilizadas

### 🔙 Backend

- Java
- Spring Boot
- Maven

### 🔜 Frontend

- HTML5
- CSS3
- JavaScript

---

## 📂 Estrutura do projeto

```
sorteio-crente-main/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── ... (controllers, services, etc.)
│   │   └── resources/
│   │       ├── static/
│   │       │   ├── index.html
│   │       │   ├── style.css
│   │       │   └── script.js
│   │       └── application.properties
│   └── test/
├── pom.xml
```

---

## ⚙️ Como executar o projeto

### ✅ Pré-requisitos

- Java 17+
- Maven

---

### ▶️ Passo a passo

1. Clone o repositório:

```bash
git clone https://github.com/gabriell-andrade/sorteio-crente.git
cd sorteio-crente-main
```

2. Execute a aplicação:

Linux/Mac:

```bash
./mvnw spring-boot:run
```

Windows:

```bash
mvnw.cmd spring-boot:run
```

---

### 🌐 Acesse no navegador

http://localhost:8080

---

## 💡 Funcionalidades

- Inserção de participantes
- Sorteio aleatório
- Animação de sorteio (efeito roleta)
- Contador dinâmico de nomes
- Interface responsiva e otimizada para mobile
- Feedback visual em tempo real

---

## 🧠 Como funciona

1. O usuário insere os nomes separados por vírgula  
2. O frontend envia os dados para o backend  
3. O Spring Boot processa o sorteio  
4. O resultado é retornado e exibido na tela  

---

## 🔌 API

### 📍 Endpoint

GET /sortear?nomes=Gabriel,Karla,Ricardo

### 📤 Response

```json
{
  "nome": "Karla"
}
```

---

## 🎯 Objetivo do projeto

- Praticar desenvolvimento com Spring Boot
- Criar e consumir APIs REST
- Integrar frontend com backend
- Aplicar conceitos de UX/UI
- Simular um fluxo real de aplicação web

---

## 🙌 Contexto

Este projeto foi desenvolvido de forma voluntária para uso na Igreja Assembleia de Deus Ministério dp Belém

---

## 👨‍💻 Autores

| [<img src="https://avatars.githubusercontent.com/u/128552944?v=4" width="80"><br><sub>Gabriel Andrade</sub>](https://github.com/gabriell-andrade) | [<img src="https://avatars.githubusercontent.com/u/224125683?v=4" width="80"><br><sub>Karla Olimpio</sub>](https://github.com/karla-olimpio) |
|:--:|:--:|

---

## 📄 Licença

Este projeto está sob a licença MIT.
