import { mount } from "svelte";

import "./app.css";
import SignInPage from "./LoginPage.svelte";

const app = mount(SignInPage, {
  target: document.getElementById("app")!,
});

export default app;
