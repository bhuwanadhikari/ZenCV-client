import { defineManifest } from "@crxjs/vite-plugin";

export default defineManifest({
  manifest_version: 3,
  name: "IntelliCV",
  version: "0.1.0",
  description: "A Chrome extension popup for managing cover letters, CVs, and settings.",
  permissions: ["activeTab", "scripting"],
  action: {
    default_title: "IntelliCV",
    default_popup: "popup.html",
  },
});
