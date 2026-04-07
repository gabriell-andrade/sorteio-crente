# 🎲 Sorteio Crente

Aplicação web desenvolvida com **Spring Boot** para realizar sorteios de forma simples e eficiente, permitindo selecionar participantes de maneira aleatória.

---

## 🚀 Tecnologias utilizadas

### 🔙 Backend

* Java
* Spring Boot
* Maven

### 🔜 Frontend

* HTML5
* CSS3
* JavaScript

---

## 📂 Estrutura do projeto

```id="c1u5s2"
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

* Java 17+
* Maven

---

### ▶️ Passo a passo

1. Clone o repositório:

```bash id="g0m7k9"
git clone github.com/gabriell-andrade/sorteio-crente.git
cd sorteio-crente-main
```

2. Execute a aplicação:

Linux/Mac:

```bash id="y6z8t3"
./mvnw spring-boot:run
```

Windows:

```bash id="c2n9x1"
mvnw.cmd spring-boot:run
```

---

### 🌐 Acesse no navegador

```id="f8q3w2"
http://localhost:8080
```

---

## 💡 Funcionalidades

* Cadastro de participantes
* Sorteio aleatório
* Exibição do resultado em tempo real
* Interface simples e intuitiva

---

## 🧠 Como funciona

1. O usuário insere os participantes na interface
2. O frontend envia os dados para o backend
3. O Spring Boot processa o sorteio
4. O resultado é retornado e exibido na tela

---

## 🔌 API (exemplo)

```id="v3k9p1"
POST /sorteio
```

### 📥 Request

```json id="a2m7z4"
{
  "nomes": ["Gabriel", "Karla", "Ricardo"]
}
```

### 📤 Response

```json id="b6x1n8"
{
  "sorteado": "Karla"
}
```

---

## 🎯 Objetivo do projeto

* Praticar desenvolvimento com Spring Boot
* Criar APIs REST
* Integrar backend com frontend
* Trabalhar lógica de sorteio

---

---

## 👨‍💻 Autores

| [<img src="https://avatars.githubusercontent.com/u/128552944?v=4" width="80"><br><sub>Gabriel Andrade</sub>](https://github.com/gabriell-andrade) | [<img src="https://avatars.githubusercontent.com/u/224125683?v=4" width="80"><br><sub>Karla Olimpio</sub>](https://github.com/karla-olimpio) |
|:--:|:--:|

---

## 📄 Licença

Projeto de uso educacional.
