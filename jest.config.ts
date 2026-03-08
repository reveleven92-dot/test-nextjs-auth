/**
 * Jest configuration for Next.js project.
 *
 * Uses ts-jest for TypeScript transformation and maps the @/ path alias.
 * Transforms ESM-only packages (jose) so Jest can process them.
 */

import type { Config } from "jest";

const config: Config = {
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.json",
      },
    ],
    /**
     * jose is an ESM-only package. ts-jest can transform its .js files
     * into CommonJS so Jest can run them.
     */
    "node_modules/jose/.+\\.js$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.json",
      },
    ],
  },
  /**
   * By default Jest ignores all of node_modules. We allow jose through
   * so the transform above can process it.
   */
  transformIgnorePatterns: ["/node_modules/(?!jose/)"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/.next/"],
};

export default config;
