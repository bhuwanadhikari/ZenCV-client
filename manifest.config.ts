export function buildManifest(env: Record<string, string | undefined>) {
  const apiBase = env.VITE_API_BASE_URL || "http://localhost:8000";

  return {
    manifest_version: 3,
    name: "ZenCV",
    version: "0.1.0",
    description: "ZenCV extension",
    icons: {
      "48": "zencv_logo.png",
      "128": "zencv_logo.png",
    },
    action: {
      default_popup: "popup.html",
      default_icon: "zencv_logo.png",
    },
    permissions: ["scripting", "storage", "activeTab"],
    host_permissions: [apiBase + "/*"],
  } as const;
}

export default buildManifest;
