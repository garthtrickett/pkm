// src/lib/client/stores/authStore.test.ts
import { vi } from "vitest";

// --- Mocks (This section is the same as the previous fix) ---

const {
  mockActivateRuntime,
  mockDeactivateRuntime,
  mockNavigate,
  mockRpcAuthClient,
} = vi.hoisted(() => ({
  mockActivateRuntime: vi.fn(() => Effect.void),
  mockDeactivateRuntime: vi.fn(() => Effect.void),
  mockNavigate: vi.fn(() => Effect.void),
  mockRpcAuthClient: {
    me: vi.fn(),
    logout: vi.fn(),
  },
}));

vi.mock("../runtime", async (importOriginal) => {
  const { Effect, Layer, Runtime, Stream, Scope, Exit } = await import(
    "effect"
  );
  const { RpcAuthClient, RpcLogClient } = await import("../rpc");
  const { LocationService } = await import("../LocationService");
  const original = await importOriginal<typeof import("../runtime")>();

  const RpcAuthClientLiveMock = Layer.succeed(
    RpcAuthClient,
    RpcAuthClient.of(mockRpcAuthClient as any),
  );
  const RpcLogClientLiveMock = Layer.succeed(
    RpcLogClient,
    RpcLogClient.of({ log: () => Effect.void } as any),
  );
  const LocationServiceLiveMock = Layer.succeed(
    LocationService,
    LocationService.of({
      navigate: mockNavigate,
      pathname: Stream.empty,
    } as any),
  );

  const TestLayer = Layer.mergeAll(
    RpcAuthClientLiveMock,
    RpcLogClientLiveMock,
    LocationServiceLiveMock,
  );

  const testAppScope = Effect.runSync(Scope.make());
  const TestRuntime = Effect.runSync(
    Scope.extend(Layer.toRuntime(TestLayer), testAppScope),
  );

  afterAll(() => {
    Effect.runSync(Scope.close(testAppScope, Exit.void));
  });

  return {
    ...original,
    AppRuntime: TestRuntime,
    runClientUnscoped: (effect: Effect.Effect<any, any, any>) =>
      Runtime.runFork(TestRuntime)(effect),
    activateReplicacheRuntime: mockActivateRuntime,
    deactivateReplicacheRuntime: mockDeactivateRuntime,
  };
});

vi.mock("../router", () => ({
  navigate: mockNavigate,
}));

// --- Test Imports ---
import { Effect } from "effect";
import { describe, it, expect, beforeEach, afterAll } from "vitest";
import type { PublicUser, UserId } from "../../shared/schemas";
import { AuthError } from "../../shared/api";

const mockUser: PublicUser = {
  id: "user-123" as UserId,
  email: "test@example.com",
  email_verified: true,
  created_at: new Date(),
  avatar_url: null,
  permissions: [],
};

describe("authStore", () => {
  let authState: typeof import("./authStore").authState;
  let proposeAuthAction: typeof import("./authStore").proposeAuthAction;

  beforeEach(async () => {
    vi.clearAllMocks();
    vi.resetModules();

    const store = await import("./authStore");
    authState = store.authState;
    proposeAuthAction = store.proposeAuthAction;

    // Manually initialize the store's process for each test.
    // This starts the background fiber that listens to the action queue.
    store.initializeAuthStore();

    authState.value = { status: "initializing", user: null };
  });

  it("[flow] on successful me() response, should transition to authenticated", async () => {
    // 1. Set up the mock response FIRST.
    mockRpcAuthClient.me.mockReturnValue(Effect.succeed(mockUser));

    // 2. NOW, trigger the action that will use the mock.
    proposeAuthAction({ type: "AUTH_CHECK_START" });

    // 3. Wait for the state to change.
    await vi.waitUntil(() => authState.value.status === "authenticated", {
      timeout: 500,
    });

    expect(authState.value.user).toEqual(mockUser);
    expect(mockDeactivateRuntime).not.toHaveBeenCalled();
  });

  it("[flow] on failed me() response, should transition to unauthenticated", async () => {
    const error = new AuthError({
      _tag: "Unauthorized",
      message: "Session expired",
    });
    // 1. Set up the mock response.
    mockRpcAuthClient.me.mockReturnValue(Effect.fail(error));

    // 2. Trigger the action.
    proposeAuthAction({ type: "AUTH_CHECK_START" });

    // 3. Wait for the state to change.
    await vi.waitUntil(() => authState.value.status === "unauthenticated", {
      timeout: 500,
    });

    expect(authState.value.user).toBeNull();
    expect(mockActivateRuntime).not.toHaveBeenCalled();
  });

  it("[flow] on LOGOUT_START, should call logout RPC and navigate", async () => {
    // 1. Set initial state and mocks.
    authState.value = { status: "authenticated", user: mockUser };
    mockRpcAuthClient.logout.mockReturnValue(Effect.void);

    // 2. Trigger the action.
    proposeAuthAction({ type: "LOGOUT_START" });

    // 3. Wait for the state to change.
    await vi.waitUntil(() => authState.value.status === "unauthenticated", {
      timeout: 500,
    });

    expect(mockRpcAuthClient.logout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/login");
    expect(authState.value.user).toBeNull();
  });
});
