// src/components/layouts/AppLayout.ts
import { html, type TemplateResult } from "lit-html";

interface Props {
  children: TemplateResult;
}

export const AppLayout = ({ children }: Props): TemplateResult => {
  return html`
    <div class="min-h-screen bg-gray-50 text-gray-900">
      <header class="flex items-center justify-between bg-white p-4 shadow-md">
        <a href="/" class="text-2xl font-bold text-zinc-800">My App</a>
        </header>
      <main class="p-4">${children}</main>
    </div>
  `;
};
