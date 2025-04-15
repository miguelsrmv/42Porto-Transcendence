# Web Development Fundamentals Q&A

This document is a guide to several foundational concepts in web development, categorized into sections. It assumes no prior experience and explains both terms and context.

---

## 🔐 Safety and Authentication

### What is JWT?
**JWT** stands for **JSON Web Token**. It is a compact, URL-safe way of representing claims between two parties. It's commonly used for authentication.

A JWT has three parts:
1. **Header** – contains the signing algorithm and token type (e.g., HS256).
2. **Payload** – contains claims (data) like user ID, role, or expiry time.
3. **Signature** – a hash of the header and payload, signed with a secret or private key.

Example:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
.
eyJ1c2VySWQiOiIxMjM0Iiwicm9sZSI6InVzZXIifQ
.
sflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

### Where to store JWT?
There are three main options:

| Storage         | Pros                                  | Cons                                      |
|----------------|---------------------------------------|-------------------------------------------|
| **LocalStorage**     | Easy to use                         | Vulnerable to XSS attacks                 |
| **SessionStorage**   | Cleared when tab closes             | Still vulnerable to XSS                  |
| **HTTP-only Cookies**| Secure from JS (XSS safe)           | Vulnerable to CSRF if not protected      |

**Best practice:** Store JWTs in **HTTP-only cookies** (with `Secure` and `SameSite=strict`) for better security against XSS. Add CSRF protection if needed.

---

## 🌐 HTML and TypeScript Interaction

### What is `FormData`?
`FormData` is a built-in browser API that lets you easily construct a set of key/value pairs to send form data via JavaScript.

```ts
const form = document.querySelector('form');
const data = new FormData(form);
```

You can then send it using `fetch`:
```ts
fetch('/submit', {
  method: 'POST',
  body: data
});
```

It handles file uploads, checkboxes, and input fields gracefully.

### What is the `JSON` object?
`JSON` (JavaScript Object Notation) is a global object in JavaScript/TypeScript for parsing and stringifying data.

Common functions:
- `JSON.stringify(obj)` → Converts an object to a JSON string.
- `JSON.parse(str)` → Converts a JSON string back into a JS object.

Example:
```ts
const user = { name: "Alice", age: 25 };
const json = JSON.stringify(user); // '{"name":"Alice","age":25}'
const back = JSON.parse(json);     // { name: "Alice", age: 25 }
```

You use JSON to send data over the network, store it, or interact with APIs.

---

## ⚙️ TypeScript, Tailwind, and Tooling

### What's the point of `package.json`, `package-lock.json`, and `tailwind.config.js`?

#### `package.json`
- Keeps track of your project’s dependencies and scripts.
- Defines project name, version, entry file, etc.

```json
{
  "name": "my-project",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {
    "tailwindcss": "^3.0.0"
  }
}
```

#### `package-lock.json`
- Exact version snapshot of all dependencies (including nested ones).
- Ensures **consistent installs** across machines.

#### `tailwind.config.js`
- Customization file for Tailwind.
- Lets you extend the default theme, define custom colors, or add plugins.

```js
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

### What are Node, NodeJS, npm, and npx?

#### Node / NodeJS
- A runtime that allows you to run JavaScript code **outside the browser**.
- You use it to run build tools, servers, scripts, etc.

#### npm
- **Node Package Manager** – helps you install and manage libraries/packages.
- Usage: `npm install package-name`

#### npx
- A tool bundled with npm that lets you run a package **without installing it globally**.
- Usage: `npx tailwindcss init`

---

## ✅ Extra Tips for Beginners

- Always keep `.env` secrets **out of version control** (add to `.gitignore`).
- Understand the **difference between client-side and server-side** operations.
- Use `fetch` or `axios` to send requests in TypeScript.
- Explore browser dev tools (F12) to inspect elements, network requests, and storage.
- Don’t be afraid to break things and inspect the console.

---
