import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify/functions'; // Adaptador para Netlify Functions

export default defineConfig({
  output: 'server',     // Necesario para manejar rutas API POST
  adapter: netlify(),   // Lo conecta con Netlify Functions
});
