import { mount } from "svelte";

import "./app.css";
import NotFound from "./404.svelte";

const app = mount(NotFound, {
  target: document.getElementById("app")!,
});

export default app;
