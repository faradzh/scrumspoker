import "./app.css";
import AdminPage from "./admin/AdminPage.svelte";
import { mount } from "svelte";

const app = mount(AdminPage, {
  target: document.getElementById("app")!,
});

export default app;
