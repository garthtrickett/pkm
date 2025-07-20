// src/features/auth/auth.handler.ts
import { AuthRpc } from "../../lib/shared/api";
<<<<<<< Updated upstream
import { PasswordRpcHandlers } from "./handlers/password.handler";
import { RegistrationRpcHandlers } from "./handlers/registration.handler";
import { SessionRpcHandlers } from "./handlers/session.handler";
=======
import { RegistrationRpcHandlers } from "./handlers/registration.handler";
import { SessionRpcHandlers } from "./handlers/session.handler";
import { PasswordRpcHandlers } from "./handlers/password.handler";
>>>>>>> Stashed changes

/**
 * The final, composed set of all authentication-related RPC handlers.
 * This object is created by merging handlers from more specific files,
 * keeping the logic organized by feature (registration, session, password).
 */
export const AuthRpcHandlers = AuthRpc.of({
  ...RegistrationRpcHandlers,
  ...SessionRpcHandlers,
  ...PasswordRpcHandlers,
});
