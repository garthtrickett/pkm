// src/components/pages/profile-page.ts
import { LitElement, html, nothing } from "lit";
import { customElement } from "lit/decorators.js";
import { Effect, Data } from "effect";
import {
  authState,
  proposeAuthAction,
  type AuthModel,
} from "../../lib/client/stores/authStore";
import { NotionButton } from "../ui/notion-button";
import styles from "./ProfilePage.module.css";
import { clientLog, RpcLogClient } from "../../lib/client/clientLog";
import "../features/change-password-form";
import { SamController } from "../../lib/client/sam-controller";

// --- Custom Error Types ---
class AvatarUploadError extends Data.TaggedError("AvatarUploadError")<{
  readonly message: string;
  readonly cause?: unknown;
}> {}

// --- Model ---
interface Model {
  auth: AuthModel;
  status: "idle" | "loading" | "success" | "error";
  message: string | null;
  loadingAction: "upload" | null;
  isChangingPassword: boolean;
}

// --- Actions ---
type Action =
  | { type: "AUTH_STATE_CHANGED"; payload: AuthModel }
  | { type: "UPLOAD_START"; payload: File }
  | { type: "UPLOAD_SUCCESS"; payload: string }
  | { type: "UPLOAD_ERROR"; payload: string }
  | { type: "TOGGLE_CHANGE_PASSWORD_FORM" }
  | { type: "PASSWORD_CHANGE_SUCCESS" }
  | { type: "PASSWORD_CHANGE_CANCELLED" };

// --- Pure Update Function ---
const update = (model: Model, action: Action): Model => {
  switch (action.type) {
    case "AUTH_STATE_CHANGED":
      return { ...model, auth: action.payload };
    case "UPLOAD_START":
      return {
        ...model,
        status: "loading",
        loadingAction: "upload",
        message: null,
      };
    case "UPLOAD_SUCCESS": {
      const user = model.auth.user
        ? { ...model.auth.user, avatar_url: action.payload }
        : null;
      if (user) {
        // This is a side-effect, but it's acceptable here as it updates a global store
        proposeAuthAction({ type: "SET_AUTHENTICATED", payload: user });
      }
      return {
        ...model,
        status: "success",
        loadingAction: null,
        message: "Avatar updated!",
      };
    }
    case "UPLOAD_ERROR":
      return {
        ...model,
        status: "error",
        loadingAction: null,
        message: action.payload,
      };
    case "TOGGLE_CHANGE_PASSWORD_FORM":
      return {
        ...model,
        isChangingPassword: !model.isChangingPassword,
        message: null,
        status: "idle",
      };
    case "PASSWORD_CHANGE_SUCCESS":
      return {
        ...model,
        isChangingPassword: false,
        status: "success",
        message: "Password changed successfully!",
      };
    case "PASSWORD_CHANGE_CANCELLED":
      return {
        ...model,
        isChangingPassword: false,
        status: "idle",
        message: null,
      };
    default:
      return model;
  }
};

// --- Effectful Action Handler ---
const handleAction = (
  action: Action,
  _model: Model,
  propose: (a: Action) => void,
): Effect.Effect<void, AvatarUploadError, RpcLogClient> => {
  if (action.type === "UPLOAD_START") {
    const formData = new FormData();
    formData.append("avatar", action.payload);

    const uploadEffect = Effect.tryPromise({
      try: () => fetch("/api/user/avatar", { method: "POST", body: formData }),
      catch: (cause) =>
        new AvatarUploadError({ message: String(cause), cause }),
    }).pipe(
      Effect.flatMap((response) =>
        response.ok
          ? Effect.tryPromise({
              try: () =>
                response.json() as Promise<{
                  avatarUrl: string;
                }>,
              catch: (cause) =>
                new AvatarUploadError({
                  message: "Failed to parse server response.",
                  cause,
                }),
            })
          : Effect.promise(() => response.text()).pipe(
              Effect.flatMap((text) =>
                Effect.fail(
                  new AvatarUploadError({ message: text || "Upload failed" }),
                ),
              ),
            ),
      ),
    );

    return uploadEffect.pipe(
      Effect.matchEffect({
        onSuccess: (json) =>
          Effect.sync(() =>
            propose({
              type: "UPLOAD_SUCCESS",
              payload: json.avatarUrl,
            }),
          ),
        onFailure: (error) =>
          clientLog("error", "[profile-page] Avatar upload failed.", {
            error,
          }).pipe(
            Effect.andThen(
              Effect.sync(() =>
                propose({
                  type: "UPLOAD_ERROR",
                  payload: error.message,
                }),
              ),
            ),
          ),
      }),
    );
  }
  return Effect.void;
};

@customElement("profile-page")
export class ProfilePage extends LitElement {
  private ctrl = new SamController<this, Model, Action, AvatarUploadError>(
    this,
    {
      auth: authState.value,
      status: "idle",
      message: null,
      loadingAction: null,
      isChangingPassword: false,
    },
    update,
    handleAction,
  );

  private _authUnsubscribe?: () => void;

  override connectedCallback(): void {
    super.connectedCallback();
    this._authUnsubscribe = authState.subscribe((newAuthState) =>
      this.ctrl.propose({ type: "AUTH_STATE_CHANGED", payload: newAuthState }),
    );
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._authUnsubscribe?.();
  }

  protected override createRenderRoot() {
    return this;
  }

  override render() {
    const { user } = this.ctrl.model.auth;
    if (!user) return html`<p>Loading...</p>`;

    const avatarUrl =
      user.avatar_url ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(user.email)}`;

    const onFileChange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) this.ctrl.propose({ type: "UPLOAD_START", payload: file });
    };

    return html`
      <div class=${styles.container}>
        <div
          class=${styles.profileCard}
          @password-changed-success=${() =>
            this.ctrl.propose({ type: "PASSWORD_CHANGE_SUCCESS" })}
          @change-password-cancelled=${() =>
            this.ctrl.propose({ type: "PASSWORD_CHANGE_CANCELLED" })}
        >
          <h2 class=${styles.title}>Your Profile</h2>
          ${this.ctrl.model.message
            ? html`<div
                class="${styles.message} ${this.ctrl.model.status === "success"
                  ? styles.messageSuccess
                  : styles.messageError}"
              >
                ${this.ctrl.model.message}
              </div>`
            : nothing}
          <div class=${styles.avatarContainer}>
            <img src=${avatarUrl} alt="Profile avatar" class=${styles.avatar} />
            <p class=${styles.email}>${user.email}</p>
          </div>
          <div class=${styles.uploadSection}>
            ${this.ctrl.model.isChangingPassword
              ? html`<change-password-form></change-password-form>`
              : html`<div class="mt-4 flex flex-col items-center gap-4">
                  <input
                    type="file"
                    id="avatar-upload"
                    class="hidden"
                    @change=${onFileChange}
                    accept="image/png, image/jpeg, image/webp"
                  />
                  ${NotionButton({
                    children: "Change Picture",
                    onClick: () =>
                      (
                        this.querySelector("#avatar-upload") as HTMLElement
                      )?.click(),
                    loading: this.ctrl.model.loadingAction === "upload",
                    disabled: this.ctrl.model.status === "loading",
                  })}
                  ${NotionButton({
                    children: "Change Password",
                    onClick: () =>
                      this.ctrl.propose({
                        type: "TOGGLE_CHANGE_PASSWORD_FORM",
                      }),
                    disabled: this.ctrl.model.status === "loading",
                  })}
                </div>`}
          </div>
        </div>
      </div>
    `;
  }
}
