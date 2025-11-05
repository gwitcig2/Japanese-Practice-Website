import { defineConfig, mergeConfig } from "vitest/config";
import { baseConfig } from "@kanpeki/vitest-config";

export default mergeConfig(
    baseConfig,
    defineConfig({
        test: {
            environment: "node",
            // setupFiles: ["./tests/setupTests.js"]
        },
    })
);