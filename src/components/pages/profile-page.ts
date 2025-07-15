// src/components/pages/profile-page.ts
import { LitElement, html, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { Effect, Data, Queue, Fiber, Stream } from "effect";
import { runClientUnscoped } from "../../lib/client/runtime";
import {
  authState,
  proposeAuthAction,
  type AuthModel,
} from "../../lib/client/stores/authStore";
import { RpcAuthClient } from "../../lib/client/rpc";
import { AuthError } from "../../lib/shared/api";
import { NotionButton } from "../ui/notion-button";
import { NotionInput } from "../ui/notion-input";
import styles from "./ProfilePage.module.css";
import { clientLog } from "../../lib/client/clientLog";

// --- Custom Error Types ---
class PasswordsDoNotMatchError extends Data.TaggedError(
  "PasswordsDoNotMatchError",
) {}
class IncorrectPasswordError extends Data.TaggedError(
  "IncorrectPasswordError",
) {}
class UnknownPasswordError extends Data.TaggedError("UnknownPasswordError")<{
  readonly cause: unknown;
}> {}
class AvatarUploadError extends Data.TaggedError("AvatarUploadError")<{
  readonly message: string;
  readonly cause?: unknown;
}> {}

// --- Model ---
interface Model {
  auth: AuthModel;
  status: "idle" | "loading" | "success" | "error";
  message: string | null;
  loadingAction: "upload" | "changePassword" | null;
  isChangingPassword: boolean;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// --- Actions ---
type Action =
  | { type: "AUTH_STATE_CHANGED"; payload: AuthModel }
  | { type: "UPLOAD_START"; payload: File }
  | { type: "UPLOAD_SUCCESS"; payload: string }
  | { type: "UPLOAD_ERROR"; payload: string }
  | { type: "TOGGLE_CHANGE_PASSWORD_FORM" }
  | { type: "UPDATE_OLD_PASSWORD"; payload: string }
  | { type: "UPDATE_NEW_PASSWORD"; payload: string }
  | { type: "UPDATE_CONFIRM_PASSWORD"; payload: string }
  | { type: "CHANGE_PASSWORD_START" }
  | { type: "CHANGE_PASSWORD_SUCCESS" }
  | {
      type: "CHANGE_PASSWORD_ERROR";
      payload:
        | PasswordsDoNotMatchError
        | IncorrectPasswordError
        | UnknownPasswordError;
    };

@customElement("profile-page")
export class ProfilePage extends LitElement {
  @state()
  private model: Model = {
    auth: authState.value,
    status: "idle",
    message: null,
    loadingAction: null,
    isChangingPassword: false,
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  private readonly _actionQueue = Effect.runSync(Queue.unbounded<Action>());
  private _mainFiber?: Fiber.RuntimeFiber<void, unknown>;
  private _authUnsubscribe?: () => void;

  private _propose = (action: Action) =>
    runClientUnscoped(Queue.offer(this._actionQueue, action));

  private _handleAction = (action: Action) => {
    // Pure model update
    this.model = this._update(this.model, action);

    // Side Effects
    if (action.type === "UPLOAD_START") {
      const formData = new FormData();
      formData.append("avatar", action.payload);

      const uploadEffect = Effect.tryPromise({
        try: () =>
          fetch("/api/user/avatar", { method: "POST", body: formData }),
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
        Effect.match({
          onSuccess: (json) =>
            this._propose({ type: "UPLOAD_SUCCESS", payload: json.avatarUrl }),
          onFailure: (error) =>
            this._propose({ type: "UPLOAD_ERROR", payload: error.message }),
        }),
      );

      return Effect.asVoid(uploadEffect);
    } else if (action.type === "CHANGE_PASSWORD_START") {
      const { oldPassword, newPassword, confirmPassword } = this.model;

      if (newPassword !== confirmPassword) {
        this._propose({
          type: "CHANGE_PASSWORD_ERROR",
          payload: new PasswordsDoNotMatchError(),
        });
        return Effect.void;
      }

      // --- 🪵 DEBUG LOG: Log password lengths before sending ---
      runClientUnscoped(
        clientLog("debug", "[profile-page] Dispatching changePassword RPC", {
          userId: this.model.auth.user?.id,
          oldPasswordLength: oldPassword.length,
          newPasswordLength: newPassword.length,
        }),
      );

      const changePasswordEffect = Effect.gen(function* () {
        const rpcClient = yield* RpcAuthClient;
        return yield* rpcClient
          .changePassword({ oldPassword, newPassword })
          .pipe(
            Effect.tapError((error) =>
              // --- 🪵 DEBUG LOG: Log the raw error from the server ---
              clientLog(
                "error",
                "[profile-page] Received error from changePassword RPC",
                { error },
              ),
            ),
            Effect.mapError((error) => {
              if (error instanceof AuthError) {
                if (error._tag === "Unauthorized") {
                  return new IncorrectPasswordError();
                }
              }
              return new UnknownPasswordError({ cause: error });
            }),
          );
      }).pipe(
        Effect.match({
          onSuccess: () => this._propose({ type: "CHANGE_PASSWORD_SUCCESS" }),
          onFailure: (error) =>
            this._propose({ type: "CHANGE_PASSWORD_ERROR", payload: error }),
        }),
      );
      return Effect.asVoid(changePasswordEffect);
    }

    return Effect.void;
  };

  private _update(model: Model, action: Action): Model {
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
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        };
      case "UPDATE_OLD_PASSWORD":
        return { ...model, oldPassword: action.payload, message: null };
      case "UPDATE_NEW_PASSWORD":
        return { ...model, newPassword: action.payload, message: null };
      case "UPDATE_CONFIRM_PASSWORD":
        return { ...model, confirmPassword: action.payload, message: null };
      case "CHANGE_PASSWORD_START":
        return {
          ...model,
          status: "loading",
          loadingAction: "changePassword",
          message: null,
        };
      case "CHANGE_PASSWORD_SUCCESS":
        return {
          ...model,
          status: "success",
          loadingAction: null,
          isChangingPassword: false,
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
          message: "Password changed successfully!",
        };
      case "CHANGE_PASSWORD_ERROR": {
        let message = "An unknown error occurred.";
        if (action.payload._tag === "PasswordsDoNotMatchError")
          message = "New passwords do not match.";
        if (action.payload._tag === "IncorrectPasswordError")
          message = "Incorrect old password provided.";
        return {
          ...model,
          status: "error",
          loadingAction: null,
          message,
        };
      }
    }
  }

  // ✅ THE FIX: Remove `.provide(RpcAuthClientLive)`
  // This stream will now inherit its context (including the correct HttpClient
  // needed by RpcAuthClient) from the `runClientUnscoped` function that calls it.
  private readonly _run = Stream.fromQueue(this._actionQueue).pipe(
    Stream.runForEach(this._handleAction),
  );

  override connectedCallback(): void {
    super.connectedCallback();
    this._authUnsubscribe = authState.subscribe((newAuthState) =>
      this._propose({ type: "AUTH_STATE_CHANGED", payload: newAuthState }),
    );
    this._mainFiber = runClientUnscoped(this._run);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._authUnsubscribe?.();
    if (this._mainFiber) {
      runClientUnscoped(Fiber.interrupt(this._mainFiber));
    }
  }

  protected override createRenderRoot() {
    return this;
  }

  override render() {
    const { user } = this.model.auth;
    if (!user) return html`<p>Loading...</p>`;

    const avatarUrl =
      user.avatar_url ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(user.email)}`;

    const onFileChange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) this._propose({ type: "UPLOAD_START", payload: file });
    };

    const onPasswordSubmit = (e: Event) => {
      e.preventDefault();
      this._propose({ type: "CHANGE_PASSWORD_START" });
    };

    const passwordForm = html`
      <form @submit=${onPasswordSubmit} class="mt-6 space-y-4 text-left">
        ${NotionInput({
          id: "old-password",
          label: "Old Password",
          type: "password",
          value: this.model.oldPassword,
          onInput: (e) =>
            this._propose({
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
            this._propose({
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
            this._propose({
              type: "UPDATE_CONFIRM_PASSWORD",
              payload: (e.target as HTMLInputElement).value,
            }),
          required: true,
        })}
        <div class="flex items-center gap-4 pt-2">
          ${NotionButton({
            children: "Save Password",
            type: "submit",
            loading: this.model.loadingAction === "changePassword",
            disabled: this.model.status === "loading",
          })}
          <button
            type="button"
            @click=${() =>
              this._propose({ type: "TOGGLE_CHANGE_PASSWORD_FORM" })}
            class="text-sm font-medium text-zinc-600 hover:text-zinc-500"
          >
            Cancel
          </button>
        </div>
      </form>
    `;

    return html`
      <div class=${styles.container}>
        <div class=${styles.profileCard}>
          <h2 class=${styles.title}>Your Profile</h2>
          ${this.model.message
            ? html`<div
                class="${styles.message} ${this.model.status === "success"
                  ? styles.messageSuccess
                  : styles.messageError}"
              >
                ${this.model.message}
              </div>`
            : nothing}
          <div class=${styles.avatarContainer}>
            <img src=${avatarUrl} alt="Profile avatar" class=${styles.avatar} />
            <p class=${styles.email}>${user.email}</p>
          </div>
          <div class=${styles.uploadSection}>
            ${this.model.isChangingPassword
              ? passwordForm
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
                    loading: this.model.loadingAction === "upload",
                    disabled: this.model.status === "loading",
                  })}
                  ${NotionButton({
                    children: "Change Password",
                    onClick: () =>
                      this._propose({ type: "TOGGLE_CHANGE_PASSWORD_FORM" }),
                    disabled: this.model.status === "loading",
                  })}
                </div>`}
          </div>
        </div>
      </div>
    `;
  }
}
