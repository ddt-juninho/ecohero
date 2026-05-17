import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // Ou '@vitejs/plugin-vue' se usar Vue

// Se a Vercel ou o ambiente local não fornecerem uma PORT, ele usa a 5173 por padrão
const port = process.env.PORT ? parseInt(process.env.PORT) : 5173;

export default defineConfig({
  plugins: [react()],
  server: {
    port: port,
  },
  // Se o seu projeto exigir alguma configuração específica de caminhos (como o @/)
  /* resolve: {
    alias: {
      '@': '/src',
    },
  }, */
});