import { mount } from "svelte";

import "./app.css";
import AdminLoginPage from "./AdminLoginPage.svelte";

const app = mount(AdminLoginPage, {
  target: document.getElementById("app")!,
});

export default app;
