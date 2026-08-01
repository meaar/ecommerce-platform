# 🐳 Docker - Angular (Node 24)

## PASSO 1: Criar o Container

Execute apenas uma vez:

```powershell
docker run -d `
  --name ecommerce `
  -p 4200:4200 `
  -v C:\Users\Me\Desktop\angular:/app `
  -w /app `
  node:24-slim `
  bash -c "npm install --legacy-peer-deps && npm start -- --host 0.0.0.0 --poll 2000"
```

### O que faz

- `-d` → Executa em segundo plano.
- `--name ecommerce` → Nome do container.
- `-p 4200:4200` → Expõe a porta 4200.
- `-v C:\Users\Me\Desktop\angular:/app` → Monta a pasta do projeto no container.
- `-w /app` → Define `/app` como diretório de trabalho.
- `node:24-slim` → Imagem oficial do Node.js 24.
- `bash -c "..."` → Instala as dependências e inicia o Angular automaticamente.

---

## PASSO 2: Verificar se o Container Está Rodando

```powershell
docker ps
```

Saída esperada:

```text
CONTAINER ID   IMAGE          NAMES        STATUS
abc123def456   node:24-slim   ecommerce    Up xx seconds
```

---

## PASSO 3: Acessar a Aplicação

Abra:

```
http://localhost:4200
```

---

# ▶ Iniciar Novamente

Depois que o container já foi criado, basta usar:

```powershell
docker start ecommerce
```

Ou clicar no botão **Start (▶)** do Docker Desktop.

---

# ⏹ Parar

```powershell
docker stop ecommerce
```

Ou clicar em **Stop** no Docker Desktop.

---

# 📋 Ver os Logs

Caso queira acompanhar o Angular:

```powershell
docker logs -f ecommerce
```

---

# 🔄 Reiniciar o Container

```powershell
docker restart ecommerce
```

---

# 🧹 Remover o Container

```powershell
docker stop ecommerce
docker rm ecommerce
```

---

# 💡 Criar Tudo Novamente

Caso tenha removido o container:

```powershell
docker run -d `
  --name ecommerce `
  -p 4200:4200 `
  -v C:\Users\Me\Desktop\angular:/app `
  -w /app `
  node:24-slim `
  bash -c "npm install --legacy-peer-deps && npm start -- --host 0.0.0.0 --poll 2000"
```

---

# ⚠ Observações

- O `npm install` será executado sempre que o container iniciar.
- Se as dependências já estiverem instaladas, a inicialização será mais rápida.
- Como o projeto está montado por volume (`-v`), qualquer alteração feita nos arquivos do Windows será refletida imediatamente no container.
- O parâmetro `--poll 2000` permite que o Angular detecte alterações corretamente quando executado dentro do Docker.