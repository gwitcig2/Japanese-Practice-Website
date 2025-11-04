import { defineProject, mergeConfig } from "vitest/config";
import { baseConfig } from "./base.js";

export const nodeConfig = mergeConfig(
    baseConfig,
    defineProject({
        test: {
            environment: "node",
        },
    })
);