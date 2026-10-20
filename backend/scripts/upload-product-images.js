#!/usr/bin/env node

const fs = require('node:fs/promises');
const path = require('node:path');
const process = require('node:process');

const contentTypes = new Map([
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.png', 'image/png'],
  ['.webp', 'image/webp'],
]);

function usage() {
  console.log(`
Uso:
  node scripts/upload-product-images.js \\
    --email "admin@example.com" \\
    --password "sua-senha" \\
    --images "./product-images" \\
    [--api-url "http://localhost:3000/api"]

Os arquivos devem usar o ID do produto no nome, por exemplo: 2.jpg, 5.png ou 10.webp.
`);
}

function parseArguments(argumentsList) {
  const options = {
    apiUrl: 'http://localhost:3000/api',
  };

  for (let index = 0; index < argumentsList.length; index += 1) {
    const argument = argumentsList[index];
    if (!argument.startsWith('--')) {
      throw new Error(`Argumento inválido: ${argument}`);
    }

    const name = argument.slice(2);
    const value = argumentsList[index + 1];
    if (!value || value.startsWith('--')) {
      throw new Error(`Informe um valor para --${name}.`);
    }

    options[name] = value;
    index += 1;
  }

  for (const requiredOption of ['email', 'password', 'images']) {
    if (!options[requiredOption]) {
      throw new Error(`Parâmetro obrigatório ausente: --${requiredOption}.`);
    }
  }

  return options;
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: 'application/json',
      ...(options.headers || {}),
    },
  });
  const body = await response.text();
  let parsedBody = body;

  try {
    parsedBody = body ? JSON.parse(body) : null;
  } catch {
    // Preserve the raw response when the API does not return JSON.
  }

  if (!response.ok) {
    const message = typeof parsedBody === 'object' && parsedBody?.message
      ? parsedBody.message
      : body;
    throw new Error(`${response.status} ${response.statusText}: ${message}`);
  }

  return { body: parsedBody, response };
}

function getSessionCookie(response) {
  const cookies = response.headers.getSetCookie?.() || [];
  const sessionCookie = cookies.find(cookie => cookie.startsWith('ecommerce_session='));

  if (!sessionCookie) {
    throw new Error('A API não retornou o cookie de sessão após o login.');
  }

  return sessionCookie.split(';', 1)[0];
}

async function login(apiUrl, email, password) {
  const { response } = await requestJson(`${apiUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  return getSessionCookie(response);
}

async function uploadImage(apiUrl, cookie, imagePath, productId, contentType) {
  const imageBuffer = await fs.readFile(imagePath);
  const form = new FormData();
  form.append('image', new Blob([imageBuffer], { type: contentType }), path.basename(imagePath));

  await requestJson(`${apiUrl}/products/${encodeURIComponent(productId)}/image`, {
    method: 'POST',
    headers: { Cookie: cookie },
    body: form,
  });
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  const apiUrl = options['api-url'] || options.apiUrl;
  const imageEntries = await fs.readdir(options.images, { withFileTypes: true });
  const images = imageEntries
    .filter(entry => entry.isFile())
    .map(entry => path.join(options.images, entry.name))
    .filter(imagePath => contentTypes.has(path.extname(imagePath).toLowerCase()));

  if (images.length === 0) {
    throw new Error(`Nenhuma imagem JPG, PNG ou WebP foi encontrada em: ${options.images}`);
  }

  const cookie = await login(apiUrl, options.email, options.password);
  console.log('Login realizado. Iniciando uploads...');

  const failures = [];
  for (const imagePath of images) {
    const filename = path.basename(imagePath);
    const productId = path.basename(filename, path.extname(filename));
    const contentType = contentTypes.get(path.extname(filename).toLowerCase());

    try {
      await uploadImage(apiUrl, cookie, imagePath, productId, contentType);
      console.log(`OK: ${filename} -> produto ${productId}`);
    } catch (error) {
      failures.push(filename);
      console.error(`ERRO: ${filename} -> produto ${productId}. ${error.message}`);
    }
  }

  if (failures.length > 0) {
    throw new Error(`${failures.length} upload(s) falharam: ${failures.join(', ')}`);
  }
}

main().catch(error => {
  console.error(`Falha: ${error.message}`);
  usage();
  process.exitCode = 1;
});
