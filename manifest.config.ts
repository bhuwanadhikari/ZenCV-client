import { defineManifest } from "@crxjs/vite-plugin";
import { getExtensionEnv, type ExtensionEnvInput } from "./src/lib/env.shared";

export function buildManifest(env: ExtensionEnvInput = process.env) {
  const { hostPermission } = getExtensionEnv(env);

  return defineManifest({
    manifest_version: 3,
    name: "IntelliCV",
    version: "0.1.0",
    description:
      "A Chrome extension popup for managing cover letters, CVs, and settings.",
    permissions: ["activeTab", "scripting"],
    host_permissions: [hostPermission],
    action: {
      default_title: "IntelliCV",
      default_popup: "popup.html",
    },
  });
}

export default buildManifest();
