# Gerar APK do MiniGest

## Método 1 (Rápido) — PWABuilder

1. Faça deploy do MiniGest para um servidor público (Vercel, Railway, etc.)
2. Aceda https://pwabuilder.com
3. Digite o URL da sua aplicação (ex: https://minigest.vercel.app)
4. Clique em "Package for Android"
5. Descarregue o APK gerado

Requisitos: A aplicação precisa de estar online num servidor HTTPS.

## Método 2 (Recomendado) — Capacitor + Android Studio

### Pré-requisitos
- Android Studio (https://developer.android.com/studio)
- Java JDK 17+ (incluído no Android Studio)

### Passos

1. **Construir a aplicação Next.js**

```bash
cd minigest
npm run build
```

2. **Atualizar o URL do servidor**

Edite `capacitor.config.ts` e altere o `server.url` para o endereço do seu servidor:

```ts
server: {
  url: 'http://192.168.1.100:3000', // IP do PC na rede local
  cleartext: true,
}
```

3. **Sincronizar com o Capacitor**

```bash
npx cap sync android
```

4. **Abrir no Android Studio e gerar APK**

```bash
npx cap open android
```

No Android Studio:
- Vá a **Build > Build Bundle(s) / APK(s) > Build APK(s)**
- O APK estará em `android/app/build/outputs/apk/debug/`

### Alternativa: Linha de comando

```bash
cd android
./gradlew assembleDebug
```

O APK estará em `android/app/build/outputs/apk/debug/app-debug.apk`.

---

**Nota:** O APK funciona como um WebView que carrega o MiniGest a partir de um servidor. O servidor pode estar:
- Na mesma rede (ex: PC na loja com IP fixo)
- Na internet (Vercel, Railway, etc.)
- No próprio telemóvel (para testes, use `http://localhost:3000`)
