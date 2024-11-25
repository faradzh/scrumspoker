import "./app.css";
import AdminPage from "./AdminPage.svelte";
import { mount } from "svelte";

const app = mount(AdminPage, {
  target: document.getElementById("app")!,
});

export default app;
