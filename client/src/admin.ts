import "./app.css";
import AdminPage from "./AdminPage.svelte";

const app = new AdminPage({
  target: document.getElementById("app")!,
});

export default app;
