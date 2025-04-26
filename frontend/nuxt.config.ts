// https://nuxt.com/docs/api/configuration/nuxt-config
import uz from "element-plus/dist/locale/uz-uz.min.mjs";
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  css: ['@/assets/scss/main.scss'],
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@element-plus/nuxt', "nuxt-svgo"],
  components: {
    dirs: [
      {
        path: "~/components/entities",
        pathPrefix: false,
      },
      {
        path: "~/components/widgets",
        pathPrefix: false,
      },
      {
        path: "~/components/layouts",
        pathPrefix: false,
      },
      {
        path: "~/components",
        pathPrefix: true,
      },
    ],
  },
  ssr:false,
  elementPlus: {
    globalConfig: {
      size: "large",
      locale: uz,
    },
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE_URL,
      productionMode: process.env.NUXT_PUBLIC_PRODUCTION_MODE
    },
  },
  nitro: {
    preset: 'static'
  },
  app: {
    baseURL: './', // ✅ bu yer muhim
    buildAssetsDir: 'nuxt/' // static fayllar shu folderda bo‘ladi
  },
  devServer: {
    port: 3000, 
    host: "*",
  },
  svgo: {
    componentPrefix: "icon",
    autoImportPath: "./assets/icons/",
    defaultImport: "component",
    svgoConfig: {
      multipass: true,
      plugins: [
        {
          name: "preset-default",
          params: {
            overrides: {
              // Asosiy atributlarni saqlash
              removeDoctype: false,
              removeViewBox: false,
              inlineStyles: {
                onlyMatchedOnce: false,
              },
              
              // Mask va clip-path uchun muhim
              removeUselessDefs: false,
              cleanupIds: false,
              
              // Path va transform uchun
              
              mergePaths: false,
              convertTransform: false
            },
          },
        }
      ],
    },
  },
})