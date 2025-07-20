// src/features/auth/auth.handler.ts
import { AuthRpc } from "../../lib/shared/api";
import { PasswordRpcHandlers } from "./handlers/password.handler";
import { RegistrationRpcHandlers } from "./handlers/registration.handler";
import { SessionRpcHandlers } from "./handlers/session.handler";

export const AuthRpcHandlers = AuthRpc.of({
  ...RegistrationRpcHandlers,
  ...SessionRpcHandlers,
  ...PasswordRpcHandlers,
});
