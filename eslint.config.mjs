import { FlatCompat } from "@eslint/eslintrc"
import { fileURLToPath } from "url"
import { dirname } from "path"

const filename = fileURLToPath(import.meta.url)
const directory = dirname(filename)
const compat = new FlatCompat({ baseDirectory: directory })

const config = [
  {
    ignores: [".next/**", "node_modules/**", "out/**", "public/**", "next-env.d.ts"],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "prefer-const": "warn",
    },
  },
]

export default config
