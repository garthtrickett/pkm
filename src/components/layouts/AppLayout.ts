// src/components/layouts/AppLayout.ts
import { html, type TemplateResult } from "lit-html";

interface Props {
  children: TemplateResult;
}

export const AppLayout = ({ children }: Props): TemplateResult => {
  return html`
    <div>
      <header>
        <a href="/">My App</a>
      </header>
      <main>${children}</main>
    </div>
  `;
};
