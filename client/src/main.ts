import "@fontsource/dm-sans";
import "@fontsource/dm-sans/400.css"; // Regular
import "@fontsource/dm-sans/500.css"; // Medium (optional)
import "@fontsource/dm-sans/700.css"; // Bold

import "./app.css";

import { mount } from "svelte";

import App from "./App.svelte";

const app = mount(App, {
  target: document.getElementById("app")!,
});

export default app;
