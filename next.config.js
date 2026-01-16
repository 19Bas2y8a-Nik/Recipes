/** @type {import('next').NextConfig} */
const nextConfig = {
  // Отключаем проверку типов во время сборки (ускоряет сборку)
  typescript: {
    // В production лучше оставить true для проверки типов
    ignoreBuildErrors: false,
  },
  // Отключаем проверку ESLint во время сборки (если есть проблемы)
  eslint: {
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig
