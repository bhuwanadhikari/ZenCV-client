import { defineManifest } from "@crxjs/vite-plugin";
import { getExtensionEnv, type ExtensionEnvInput } from "./src/lib/env.shared";

const PAGE_HOST_PERMISSIONS = ["http://*/*", "https://*/*"];

export function buildManifest(env: ExtensionEnvInput = process.env) {
  const { hostPermission } = getExtensionEnv(env);

  return defineManifest({
    manifest_version: 3,
    name: "ZenCV",
    version: "0.1.0",
    description:
      "A Chrome extension popup for managing cover letters, CVs, and settings.",
    icons: {
      16: "zencv_logo.png",
      32: "zencv_logo.png",
      48: "zencv_logo.png",
      128: "zencv_logo.png",
    },
    permissions: ["activeTab", "scripting"],
    host_permissions: [...PAGE_HOST_PERMISSIONS, hostPermission],
    action: {
      default_title: "ZenCV",
      default_popup: "popup.html",
      default_icon: {
        16: "zencv_logo.png",
        32: "zencv_logo.png",
        48: "zencv_logo.png",
        128: "zencv_logo.png",
      },
    },
  });
}

export default buildManifest();
