// src/components/layouts/AppLayout.ts
import { html, type TemplateResult } from "lit-html";
import {
  type AuthModel,
  proposeAuthAction,
} from "../../lib/client/stores/authStore";
import { runClientUnscoped } from "../../lib/client/runtime";
import { navigate } from "../../lib/client/router";

interface Props {
  children: TemplateResult;
  auth: AuthModel;
}

export const AppLayout = ({ children, auth }: Props): TemplateResult => {
  const handleLogout = (e: Event) => {
    e.preventDefault();
    proposeAuthAction({ type: "LOGOUT_START" });
    runClientUnscoped(navigate("/login"));
  };

  const handleLinkClick = (path: string) => (e: Event) => {
    e.preventDefault();
    runClientUnscoped(navigate(path));
  };

  const loggedInNav = html`
    <div class="flex items-center gap-4">
      <a
        href="/profile"
        @click=${handleLinkClick("/profile")}
        class="text-sm font-medium text-zinc-600 hover:text-zinc-900"
        >Profile</a
      >
      <a
        href="#"
        @click=${handleLogout}
        class="text-sm font-medium text-zinc-600 hover:text-zinc-900"
        >Logout</a
      >
    </div>
  `;

  return html`
    <div class="min-h-screen bg-zinc-50">
      <header
        class="flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-3"
      >
        <a
          href="/"
          @click=${handleLinkClick("/")}
          class="font-bold text-zinc-900"
          >My App</a
        >
        ${auth.status === "authenticated" ? loggedInNav : html`<div></div>`}
      </header>
      <main class="p-4">${children}</main>
    </div>
  `;
};
