// FILE: src/components/features/change-password-form.ts
import { LitElement, html, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { Effect, Schema, Either } from "effect";
import { runClientPromise } from "../../lib/client/runtime";
import { RpcAuthClient } from "../../lib/client/rpc";
import { AuthError } from "../../lib/shared/api";
import { NotionButton } from "../ui/notion-button";
import { NotionInput } from "../ui/notion-input";
import {
  IncorrectPasswordError,
  UnknownPasswordError,
} from "../../lib/client/errors";

// --- Model ---
interface Model {
  status: "idle" | "loading" | "error";
  message: string | null;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// --- Actions ---
type Action =
  | { type: "UPDATE_OLD_PASSWORD"; payload: string }
  | { type: "UPDATE_NEW_PASSWORD"; payload: string }
  | { type: "UPDATE_CONFIRM_PASSWORD"; payload: string }
  | { type: "CHANGE_PASSWORD_START" }
  | { type: "CHANGE_PASSWORD_SUCCESS" }
  | { type: "CHANGE_PASSWORD_ERROR"; payload: string };

// --- Update Function ---
const update = (model: Model, action: Action): Model => {
  switch (action.type) {
    case "UPDATE_OLD_PASSWORD":
      return {
        ...model,
        oldPassword: action.payload,
        message: null,
        status: "idle",
      };
    case "UPDATE_NEW_PASSWORD":
      return {
        ...model,
        newPassword: action.payload,
        message: null,
        status: "idle",
      };
    case "UPDATE_CONFIRM_PASSWORD":
      return {
        ...model,
        confirmPassword: action.payload,
        message: null,
        status: "idle",
      };
    case "CHANGE_PASSWORD_START":
      return { ...model, status: "loading", message: null };
    case "CHANGE_PASSWORD_SUCCESS":
      return { ...model, status: "idle" };
    case "CHANGE_PASSWORD_ERROR":
      return { ...model, status: "error", message: action.payload };
  }
};

@customElement("change-password-form")
export class ChangePasswordForm extends LitElement {
  @state()
  private model: Model = {
    status: "idle",
    message: null,
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  private _update(action: Action) {
    this.model = update(this.model, action);
  }

  private _onSubmit = async (e: Event) => {
    e.preventDefault();

    this._update({ type: "CHANGE_PASSWORD_START" });
    // no need to `await this.updateComplete` as loading state is self-contained.

    const { oldPassword, newPassword, confirmPassword } = this.model;

    if (newPassword !== confirmPassword) {
      this._update({
        type: "CHANGE_PASSWORD_ERROR",
        payload: "New passwords do not match.",
      });
      return;
    }

    const changePasswordEffect = RpcAuthClient.pipe(
      Effect.flatMap((rpc) => rpc.changePassword({ oldPassword, newPassword })),
      Effect.catchAll((error) =>
        Schema.decodeUnknown(AuthError)(error).pipe(
          Effect.matchEffect({
            onSuccess: (authError) => {
              const specificError =
                authError._tag === "Unauthorized"
                  ? new IncorrectPasswordError()
                  : new UnknownPasswordError({ cause: authError });
              return Effect.fail(specificError);
            },
            onFailure: (parseError) =>
              Effect.fail(new UnknownPasswordError({ cause: parseError })),
          }),
        ),
      ),
    );

    const result = await runClientPromise(Effect.either(changePasswordEffect));

    Either.match(result, {
      onLeft: (error) => {
        const message =
          error._tag === "IncorrectPasswordError"
            ? "Incorrect old password provided."
            : "An unknown error occurred.";
        this._update({ type: "CHANGE_PASSWORD_ERROR", payload: message });
      },
      onRight: () => {
        this._update({ type: "CHANGE_PASSWORD_SUCCESS" });
        this.dispatchEvent(
          new CustomEvent("password-changed-success", {
            bubbles: true,
            composed: true,
          }),
        );
      },
    });
  };

  private _onCancel = () => {
    this.dispatchEvent(
      new CustomEvent("change-password-cancelled", {
        bubbles: true,
        composed: true,
      }),
    );
  };

  override render() {
    return html`
      <form @submit=${this._onSubmit} class="mt-6 space-y-4 text-left">
        ${NotionInput({
          id: "old-password",
          label: "Old Password",
          type: "password",
          value: this.model.oldPassword,
          onInput: (e) =>
            this._update({
              type: "UPDATE_OLD_PASSWORD",
              payload: (e.target as HTMLInputElement).value,
            }),
          required: true,
        })}
        ${NotionInput({
          id: "new-password",
          label: "New Password",
          type: "password",
          value: this.model.newPassword,
          onInput: (e) =>
            this._update({
              type: "UPDATE_NEW_PASSWORD",
              payload: (e.target as HTMLInputElement).value,
            }),
          required: true,
        })}
        ${NotionInput({
          id: "confirm-password",
          label: "Confirm New Password",
          type: "password",
          value: this.model.confirmPassword,
          onInput: (e) =>
            this._update({
              type: "UPDATE_CONFIRM_PASSWORD",
              payload: (e.target as HTMLInputElement).value,
            }),
          required: true,
        })}
        ${this.model.message
          ? html`<div class="text-sm text-red-500">${this.model.message}</div>`
          : nothing}
        <div class="flex items-center gap-4 pt-2">
          ${NotionButton({
            children: "Save Password",
            type: "submit",
            loading: this.model.status === "loading",
            disabled: this.model.status === "loading",
          })}
          <button
            type="button"
            @click=${this._onCancel}
            class="text-sm font-medium text-zinc-600 hover:text-zinc-500"
          >
            Cancel
          </button>
        </div>
      </form>
    `;
  }

  protected override createRenderRoot() {
    return this;
  }
}
