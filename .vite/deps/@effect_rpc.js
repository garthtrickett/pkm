import {
  symbol
} from "./chunk-2YJSV6UP.js";
import {
  CloseLatch,
  Collector,
  Default,
  HttpClient,
  HttpRouter,
  HttpServerRequest,
  PlatformRunner,
  PlatformWorker,
  Socket,
  SocketCloseError,
  SocketGenericError,
  SocketServer,
  empty as empty3,
  empty2 as empty4,
  fromInput,
  mapRequest,
  merge as merge2,
  msgpackr_exports,
  prependUrl,
  stream2 as stream,
  text,
  text2,
  toWebHandlerRuntime,
  uint8Array,
  unsafeMakeCollector
} from "./chunk-EX52NJ6G.js";
import {
  Any,
  Array$,
  ChunkFromSelf,
  Class3 as Class,
  Defect,
  Exit,
  GenericTag,
  Never,
  NonEmptyArray,
  ParentSpan,
  SchemaIdAnnotationId,
  Scope,
  StreamTypeId,
  Struct,
  Tag,
  TreeFormatter,
  Type,
  Union2 as Union,
  Void,
  __export,
  _await,
  _void,
  add,
  addFinalizer2 as addFinalizer,
  addFinalizer3 as addFinalizer2,
  addFinalizerExit,
  annotateLogs,
  asSome2 as asSome,
  asVoid2 as asVoid,
  async,
  catchAll3 as catchAll,
  catchAllCause,
  catchAllDefect,
  catchIf,
  close,
  constTrue,
  constVoid,
  constant,
  context2 as context,
  contextWith,
  currentContext2 as currentContext,
  declare,
  decode2 as decode,
  decodeSync,
  decodeUnknown,
  decodeUnknown2,
  defaultRuntime,
  delay2 as delay,
  die2 as die,
  die4 as die2,
  die7 as die3,
  dieMessage,
  dual,
  effect,
  empty3 as empty,
  empty4 as empty2,
  encode,
  encodeSync,
  encodeUnknown,
  encodeUnknown2,
  ensuringWith,
  extend,
  fail5 as fail,
  failCause3 as failCause,
  failureOption,
  fiberIdWith,
  flatMap3 as flatMap,
  flatten2 as flatten,
  fnUntraced2 as fnUntraced,
  forEach2 as forEach,
  forever,
  fork3 as fork,
  forkIn2 as forkIn,
  forkScoped,
  gen2 as gen,
  get2 as get,
  getCurrentFiber,
  getOrThrow,
  globalValue,
  hasProperty,
  identity,
  ignore,
  interrupt3 as interrupt,
  interrupt4 as interrupt2,
  interrupt5 as interrupt3,
  interruptFork,
  interruptible3 as interruptible,
  interruptors,
  isDie,
  isEffect,
  isFailure,
  isInterrupted,
  isNonEmpty,
  isParseError,
  isSchema,
  isSome,
  locally,
  locallyWith,
  logDebug,
  logError,
  logFatal,
  make,
  make16 as make3,
  make18 as make4,
  make23 as make5,
  make25 as make6,
  make26 as make7,
  make27 as make8,
  make7 as make2,
  makeLatch,
  makeSemaphore,
  makeSpanScoped,
  makeWithTTL2 as makeWithTTL,
  map10 as map,
  map11 as map2,
  mapChunksEffect,
  mapInputContext2 as mapInputContext,
  matchCauseEffect2 as matchCauseEffect,
  matchEffect2 as matchEffect,
  merge,
  mergeAll,
  never,
  none,
  none3 as none2,
  omit,
  onError2 as onError,
  onExit,
  onInterrupt2 as onInterrupt,
  orDie,
  pipeArguments,
  provide,
  provide2,
  provideContext3 as provideContext,
  provideService,
  provideServiceEffect,
  raceFirst,
  retry,
  run3 as run,
  runForEach,
  runForEachChunk,
  runFork2 as runFork,
  runtime3 as runtime,
  scope,
  scope2,
  scoped2 as scoped,
  scoped3 as scoped2,
  scopedContext,
  scopedDiscard,
  serviceOption,
  some,
  spaced,
  squash,
  succeed2 as succeed,
  succeed3 as succeed2,
  succeed6 as succeed3,
  succeed7 as succeed4,
  succeedNone2 as succeedNone,
  successSchema,
  suspend2 as suspend,
  sync4 as sync,
  tap2 as tap,
  tapErrorCause,
  timeout,
  toReadonlyArray,
  toSet,
  toStream,
  uninterruptible2 as uninterruptible,
  unsafeAdd,
  unsafeGet,
  unsafeMake,
  unsafeMake5 as unsafeMake2,
  unsafeMakeLatch,
  unsafeMakeSemaphore2 as unsafeMakeSemaphore,
  unwrapScoped5 as unwrapScoped,
  useSpan,
  whileLoop,
  withFiberRuntime2 as withFiberRuntime,
  withParentSpan,
  withSpan,
  zipRight3 as zipRight
} from "./chunk-6XTNYBYF.js";

// node_modules/@effect/rpc/dist/esm/Rpc.js
var Rpc_exports = {};
__export(Rpc_exports, {
  ForkTypeId: () => ForkTypeId,
  TypeId: () => TypeId,
  exitSchema: () => exitSchema,
  fork: () => fork2,
  fromTaggedRequest: () => fromTaggedRequest,
  isFork: () => isFork,
  isRpc: () => isRpc,
  make: () => make9
});

// node_modules/@effect/rpc/dist/esm/RpcSchema.js
var RpcSchema_exports = {};
__export(RpcSchema_exports, {
  Stream: () => Stream,
  StreamSchemaId: () => StreamSchemaId,
  getStreamSchemas: () => getStreamSchemas,
  isStreamSchema: () => isStreamSchema,
  isStreamSerializable: () => isStreamSerializable
});
var StreamSchemaId = Symbol.for("@effect/rpc/RpcSchema/Stream");
var isStreamSchema = (schema) => schema.ast.annotations[SchemaIdAnnotationId] === StreamSchemaId;
var isStreamSerializable = (schema) => isStreamSchema(successSchema(schema));
var getStreamSchemas = (ast) => ast.annotations[StreamSchemaId] ? some(ast.annotations[StreamSchemaId]) : none();
var Stream = ({
  failure,
  success
}) => Object.assign(declare([success, failure], {
  decode: (success2, failure2) => parseStream(decodeUnknown(ChunkFromSelf(success2)), decodeUnknown(failure2)),
  encode: (success2, failure2) => parseStream(encodeUnknown(ChunkFromSelf(success2)), encodeUnknown(failure2))
}, {
  schemaId: StreamSchemaId,
  [StreamSchemaId]: {
    success,
    failure
  }
}), {
  success,
  failure
});
var isStream = (u) => hasProperty(u, StreamTypeId);
var parseStream = (decodeSuccess, decodeFailure) => (u, options, ast) => flatMap(context(), (context2) => {
  if (!isStream(u)) return fail(new Type(ast, u));
  return succeed3(u.pipe(mapChunksEffect((value) => decodeSuccess(value, options)), catchAll((error) => {
    if (isParseError(error)) return die3(error);
    return matchEffect(decodeFailure(error, options), {
      onFailure: die2,
      onSuccess: fail
    });
  }), provideContext(context2)));
});

// node_modules/@effect/rpc/dist/esm/Rpc.js
var TypeId = Symbol.for("@effect/rpc/Rpc");
var isRpc = (u) => hasProperty(u, TypeId);
var Proto = {
  [TypeId]: TypeId,
  pipe() {
    return pipeArguments(this, arguments);
  },
  setSuccess(successSchema2) {
    return makeProto({
      _tag: this._tag,
      payloadSchema: this.payloadSchema,
      successSchema: successSchema2,
      errorSchema: this.errorSchema,
      annotations: this.annotations,
      middlewares: this.middlewares
    });
  },
  setError(errorSchema) {
    return makeProto({
      _tag: this._tag,
      payloadSchema: this.payloadSchema,
      successSchema: this.successSchema,
      errorSchema,
      annotations: this.annotations,
      middlewares: this.middlewares
    });
  },
  setPayload(payloadSchema) {
    return makeProto({
      _tag: this._tag,
      payloadSchema: isSchema(payloadSchema) ? payloadSchema : Struct(payloadSchema),
      successSchema: this.successSchema,
      errorSchema: this.errorSchema,
      annotations: this.annotations,
      middlewares: this.middlewares
    });
  },
  middleware(middleware) {
    return makeProto({
      _tag: this._tag,
      payloadSchema: this.payloadSchema,
      successSchema: this.successSchema,
      errorSchema: this.errorSchema,
      annotations: this.annotations,
      middlewares: /* @__PURE__ */ new Set([...this.middlewares, middleware])
    });
  },
  prefix(prefix) {
    return makeProto({
      _tag: `${prefix}${this._tag}`,
      payloadSchema: this.payloadSchema,
      successSchema: this.successSchema,
      errorSchema: this.errorSchema,
      annotations: this.annotations,
      middlewares: this.middlewares
    });
  },
  annotate(tag, value) {
    return makeProto({
      _tag: this._tag,
      payloadSchema: this.payloadSchema,
      successSchema: this.successSchema,
      errorSchema: this.errorSchema,
      middlewares: this.middlewares,
      annotations: add(this.annotations, tag, value)
    });
  },
  annotateContext(context2) {
    return makeProto({
      _tag: this._tag,
      payloadSchema: this.payloadSchema,
      successSchema: this.successSchema,
      errorSchema: this.errorSchema,
      middlewares: this.middlewares,
      annotations: merge(this.annotations, context2)
    });
  }
};
var makeProto = (options) => {
  function Rpc() {
  }
  Object.setPrototypeOf(Rpc, Proto);
  Object.assign(Rpc, options);
  Rpc.key = `@effect/rpc/Rpc/${options._tag}`;
  return Rpc;
};
var make9 = (tag, options) => {
  const successSchema2 = options?.success ?? Void;
  const errorSchema = options?.error ?? Never;
  let payloadSchema;
  if (options?.primaryKey) {
    payloadSchema = class Payload extends Class(`@effect/rpc/Rpc/${tag}`)(options.payload) {
      [symbol]() {
        return options.primaryKey(this);
      }
    };
  } else {
    payloadSchema = isSchema(options?.payload) ? options?.payload : options?.payload ? Struct(options?.payload) : Void;
  }
  return makeProto({
    _tag: tag,
    payloadSchema,
    successSchema: options?.stream ? Stream({
      success: successSchema2,
      failure: errorSchema
    }) : successSchema2,
    errorSchema: options?.stream ? Never : errorSchema,
    annotations: empty2(),
    middlewares: /* @__PURE__ */ new Set()
  });
};
var fromTaggedRequest = (schema) => makeProto({
  _tag: schema._tag,
  payloadSchema: schema,
  successSchema: schema.success,
  errorSchema: schema.failure,
  annotations: empty2(),
  middlewares: /* @__PURE__ */ new Set()
});
var exitSchemaCache = globalValue("@effect/rpc/Rpc/exitSchemaCache", () => /* @__PURE__ */ new WeakMap());
var exitSchema = (self) => {
  if (exitSchemaCache.has(self)) {
    return exitSchemaCache.get(self);
  }
  const rpc = self;
  const failures = /* @__PURE__ */ new Set([rpc.errorSchema]);
  const streamSchemas = getStreamSchemas(rpc.successSchema.ast);
  if (isSome(streamSchemas)) {
    failures.add(streamSchemas.value.failure);
  }
  for (const middleware of rpc.middlewares) {
    failures.add(middleware.failure);
  }
  const schema = Exit({
    success: isSome(streamSchemas) ? Void : rpc.successSchema,
    failure: Union(...failures),
    defect: Defect
  });
  exitSchemaCache.set(self, schema);
  return schema;
};
var ForkTypeId = Symbol.for("@effect/rpc/Rpc/Fork");
var fork2 = (value) => ({
  [ForkTypeId]: ForkTypeId,
  value
});
var isFork = (u) => ForkTypeId in u;

// node_modules/@effect/rpc/dist/esm/RpcClient.js
var RpcClient_exports = {};
__export(RpcClient_exports, {
  Protocol: () => Protocol,
  currentHeaders: () => currentHeaders,
  layerProtocolHttp: () => layerProtocolHttp,
  layerProtocolSocket: () => layerProtocolSocket,
  layerProtocolWorker: () => layerProtocolWorker,
  make: () => make10,
  makeNoSerialization: () => makeNoSerialization,
  makeProtocolHttp: () => makeProtocolHttp,
  makeProtocolSocket: () => makeProtocolSocket,
  makeProtocolWorker: () => makeProtocolWorker,
  withHeaders: () => withHeaders,
  withHeadersEffect: () => withHeadersEffect
});

// node_modules/@effect/rpc/dist/esm/internal/utils.js
var withRun = () => (f) => suspend(() => {
  const semaphore = unsafeMakeSemaphore(1);
  let buffer = [];
  let write = (...args) => contextWith((context2) => {
    buffer.push([args, context2]);
  });
  return map2(f((...args) => write(...args)), (a) => ({
    ...a,
    run(f2) {
      return semaphore.withPermits(1)(gen(function* () {
        const prev = write;
        write = f2;
        for (const [args, context2] of buffer) {
          yield* provide(write(...args), context2);
        }
        buffer = [];
        return yield* onExit(never, () => {
          write = prev;
          return _void;
        });
      }));
    }
  }));
});

// node_modules/@effect/rpc/dist/esm/RpcMessage.js
var RpcMessage_exports = {};
__export(RpcMessage_exports, {
  RequestId: () => RequestId,
  RequestIdTypeId: () => RequestIdTypeId,
  ResponseDefectEncoded: () => ResponseDefectEncoded,
  ResponseIdTypeId: () => ResponseIdTypeId,
  constEof: () => constEof,
  constPing: () => constPing,
  constPong: () => constPong
});
var RequestIdTypeId = Symbol.for("@effect/rpc/RpcServer/RequestId");
var RequestId = (id) => typeof id === "bigint" ? id : BigInt(id);
var constEof = {
  _tag: "Eof"
};
var constPing = {
  _tag: "Ping"
};
var ResponseIdTypeId = Symbol.for("@effect/rpc/RpcServer/ResponseId");
var encodeDefect = encodeSync(Defect);
var ResponseDefectEncoded = (input) => ({
  _tag: "Defect",
  defect: encodeDefect(input)
});
var constPong = {
  _tag: "Pong"
};

// node_modules/@effect/rpc/dist/esm/RpcSerialization.js
var RpcSerialization_exports = {};
__export(RpcSerialization_exports, {
  RpcSerialization: () => RpcSerialization,
  json: () => json,
  jsonRpc: () => jsonRpc,
  layerJson: () => layerJson,
  layerJsonRpc: () => layerJsonRpc,
  layerMsgPack: () => layerMsgPack,
  layerNdJsonRpc: () => layerNdJsonRpc,
  layerNdjson: () => layerNdjson,
  msgPack: () => msgPack,
  ndJsonRpc: () => ndJsonRpc,
  ndjson: () => ndjson
});
var RpcSerialization = class extends Tag("@effect/rpc/RpcSerialization")() {
};
var json = RpcSerialization.of({
  contentType: "application/json",
  includesFraming: false,
  unsafeMake: () => {
    const decoder = new TextDecoder();
    return {
      decode: (bytes) => [JSON.parse(typeof bytes === "string" ? bytes : decoder.decode(bytes))],
      encode: (response) => JSON.stringify(response)
    };
  }
});
var ndjson = RpcSerialization.of({
  contentType: "application/ndjson",
  includesFraming: true,
  unsafeMake: () => {
    const decoder = new TextDecoder();
    let buffer = "";
    return {
      decode: (bytes) => {
        buffer += typeof bytes === "string" ? bytes : decoder.decode(bytes);
        let position = 0;
        let nlIndex = buffer.indexOf("\n", position);
        const items = [];
        while (nlIndex !== -1) {
          const item = JSON.parse(buffer.slice(position, nlIndex));
          items.push(item);
          position = nlIndex + 1;
          nlIndex = buffer.indexOf("\n", position);
        }
        buffer = buffer.slice(position);
        return items;
      },
      encode: (response) => {
        if (Array.isArray(response)) {
          if (response.length === 0) return void 0;
          let data = "";
          for (let i = 0; i < response.length; i++) {
            data += JSON.stringify(response[i]) + "\n";
          }
          return data;
        }
        return JSON.stringify(response) + "\n";
      }
    };
  }
});
var jsonRpc = (options) => RpcSerialization.of({
  contentType: options?.contentType ?? "application/json",
  includesFraming: false,
  unsafeMake: () => {
    const decoder = new TextDecoder();
    const batches = /* @__PURE__ */ new Map();
    return {
      decode: (bytes) => {
        const decoded = JSON.parse(typeof bytes === "string" ? bytes : decoder.decode(bytes));
        return decodeJsonRpcRaw(decoded, batches);
      },
      encode: (response) => {
        if (Array.isArray(response)) {
          if (response.length === 0) return void 0;
          return JSON.stringify(response.map(encodeJsonRpcMessage));
        }
        const encoded = encodeJsonRpcRaw(response, batches);
        return encoded && JSON.stringify(encoded);
      }
    };
  }
});
var ndJsonRpc = (options) => RpcSerialization.of({
  contentType: options?.contentType ?? "application/json-rpc",
  includesFraming: true,
  unsafeMake: () => {
    const parser = ndjson.unsafeMake();
    const batches = /* @__PURE__ */ new Map();
    return {
      decode: (bytes) => {
        const frames = parser.decode(bytes);
        if (frames.length === 0) return [];
        const messages = [];
        for (let i = 0; i < frames.length; i++) {
          const frame = frames[i];
          messages.push(...decodeJsonRpcRaw(frame, batches));
        }
        return messages;
      },
      encode: (response) => {
        if (Array.isArray(response)) {
          return parser.encode(response.map(encodeJsonRpcMessage));
        }
        const encoded = encodeJsonRpcRaw(response, batches);
        return encoded && parser.encode(encoded);
      }
    };
  }
});
function decodeJsonRpcRaw(decoded, batches) {
  if (Array.isArray(decoded)) {
    const batch = {
      size: 0,
      responses: /* @__PURE__ */ new Map()
    };
    const messages = [];
    for (let i = 0; i < decoded.length; i++) {
      const message = decodeJsonRpcMessage(decoded[i]);
      if (message._tag === "Request") {
        batch.size++;
        batches.set(message.id, batch);
      }
    }
    return messages;
  }
  return Array.isArray(decoded) ? decoded.map(decodeJsonRpcMessage) : [decodeJsonRpcMessage(decoded)];
}
function decodeJsonRpcMessage(decoded) {
  if ("method" in decoded) {
    if (!decoded.id && decoded.method.startsWith("@effect/rpc/")) {
      const tag = decoded.method.slice("@effect/rpc/".length);
      const requestId = decoded.params?.requestId;
      return requestId ? {
        _tag: tag,
        requestId: String(requestId)
      } : {
        _tag: tag
      };
    }
    return {
      _tag: "Request",
      id: decoded.id ? String(decoded.id) : "",
      tag: decoded.method,
      payload: decoded.params,
      headers: decoded.headers ?? [],
      traceId: decoded.traceId,
      spanId: decoded.spanId,
      sampled: decoded.sampled
    };
  } else if (decoded.error && decoded.error._tag === "Defect") {
    return {
      _tag: "Defect",
      defect: decoded.error.data
    };
  } else if (decoded.chunk === true) {
    return {
      _tag: "Chunk",
      requestId: String(decoded.id),
      values: decoded.result
    };
  }
  return {
    _tag: "Exit",
    requestId: String(decoded.id),
    exit: decoded.error != null ? {
      _tag: "Failure",
      cause: decoded.error._tag === "Cause" ? decoded.error.data : {
        _tag: "Die",
        defect: decoded.error
      }
    } : {
      _tag: "Success",
      value: decoded.result
    }
  };
}
function encodeJsonRpcRaw(response, batches) {
  if (!("requestId" in response)) {
    return encodeJsonRpcMessage(response);
  }
  const batch = batches.get(response.requestId);
  if (batch) {
    batches.delete(response.requestId);
    batch.responses.set(response.requestId, response);
    if (batch.size === batch.responses.size) {
      return Array.from(batch.responses.values(), encodeJsonRpcMessage);
    }
    return void 0;
  }
  return encodeJsonRpcMessage(response);
}
function encodeJsonRpcMessage(response) {
  switch (response._tag) {
    case "Request":
      return {
        jsonrpc: "2.0",
        method: response.tag,
        params: response.payload,
        id: response.id && Number(response.id),
        headers: response.headers,
        traceId: response.traceId,
        spanId: response.spanId,
        sampled: response.sampled
      };
    case "Ping":
    case "Pong":
    case "Interrupt":
    case "Ack":
    case "Eof":
      return {
        jsonrpc: "2.0",
        method: `@effect/rpc/${response._tag}`,
        params: "requestId" in response ? {
          requestId: response.requestId
        } : void 0
      };
    case "Chunk":
      return {
        jsonrpc: "2.0",
        chunk: true,
        id: Number(response.requestId),
        result: response.values
      };
    case "Exit":
      return {
        jsonrpc: "2.0",
        id: response.requestId ? Number(response.requestId) : void 0,
        result: response.exit._tag === "Success" ? response.exit.value : void 0,
        error: response.exit._tag === "Failure" ? {
          _tag: "Cause",
          code: response.exit.cause._tag === "Fail" && hasProperty(response.exit.cause.error, "code") ? Number(response.exit.cause.error.code) : 0,
          message: response.exit.cause._tag === "Fail" && hasProperty(response.exit.cause.error, "message") ? response.exit.cause.error.message : JSON.stringify(response.exit.cause),
          data: response.exit.cause
        } : void 0
      };
    case "Defect":
      return {
        jsonrpc: "2.0",
        id: jsonRpcInternalError,
        error: {
          _tag: "Defect",
          code: 1,
          message: "A defect occurred",
          data: response.defect
        }
      };
  }
}
var jsonRpcInternalError = -32603;
var msgPack = RpcSerialization.of({
  contentType: "application/msgpack",
  includesFraming: true,
  unsafeMake: () => {
    const unpackr = new msgpackr_exports.Unpackr();
    const packr = new msgpackr_exports.Packr();
    const encoder = new TextEncoder();
    return {
      decode: (bytes) => unpackr.unpackMultiple(typeof bytes === "string" ? encoder.encode(bytes) : bytes),
      encode: (response) => packr.pack(response)
    };
  }
});
var layerJson = succeed4(RpcSerialization, json);
var layerNdjson = succeed4(RpcSerialization, ndjson);
var layerJsonRpc = (options) => succeed4(RpcSerialization, jsonRpc(options));
var layerNdJsonRpc = (options) => succeed4(RpcSerialization, ndJsonRpc(options));
var layerMsgPack = succeed4(RpcSerialization, msgPack);

// node_modules/@effect/rpc/dist/esm/RpcWorker.js
var RpcWorker_exports = {};
__export(RpcWorker_exports, {
  InitialMessage: () => InitialMessage,
  initialMessage: () => initialMessage,
  layerInitialMessage: () => layerInitialMessage,
  makeInitialMessage: () => makeInitialMessage
});
var InitialMessage = class extends Tag("@effect/rpc/RpcWorker/InitialMessage")() {
};
var ProtocolTag = GenericTag("@effect/rpc/RpcServer/Protocol");
var makeInitialMessage = (schema, effect2) => flatMap(effect2, (value) => {
  const collector = unsafeMakeCollector();
  return encode(schema)(value).pipe(provideService(Collector, collector), map2((encoded) => [encoded, collector.unsafeClear()]));
});
var layerInitialMessage = (schema, build) => effect(InitialMessage, contextWith((context2) => provide(orDie(makeInitialMessage(schema, build)), context2)));
var initialMessage = (schema) => ProtocolTag.pipe(flatMap((protocol) => protocol.initialMessage), flatten, flatMap(decodeUnknown2(schema)));

// node_modules/@effect/rpc/dist/esm/RpcClient.js
var requestIdCounter = BigInt(0);
var makeNoSerialization = fnUntraced(function* (group, options) {
  const spanPrefix = options?.spanPrefix ?? "RpcClient";
  const supportsAck = options?.supportsAck ?? true;
  const disableTracing = options?.disableTracing ?? false;
  const generateRequestId = options?.generateRequestId ?? (() => requestIdCounter++);
  const context2 = yield* context();
  const scope3 = get(context2, Scope);
  const entries = /* @__PURE__ */ new Map();
  let isShutdown = false;
  yield* addFinalizer(scope3, fiberIdWith((fiberId) => {
    isShutdown = true;
    return clearEntries(interrupt(fiberId));
  }));
  const clearEntries = fnUntraced(function* (exit) {
    for (const [id, entry] of entries) {
      entries.delete(id);
      if (entry._tag === "Mailbox") {
        yield* entry.mailbox.done(exit);
      } else {
        entry.resume(exit);
      }
    }
  });
  const onRequest = (rpc) => {
    const isStream2 = isStreamSchema(rpc.successSchema);
    const middleware = getRpcClientMiddleware(rpc);
    return (payload, opts) => {
      const headers = opts?.headers ? fromInput(opts.headers) : empty3;
      const context3 = opts?.context ?? empty2();
      if (!isStream2) {
        const onRequest2 = (span) => onEffectRequest(rpc, middleware, span, rpc.payloadSchema.make ? rpc.payloadSchema.make(payload) : payload, headers, context3, opts?.discard ?? false);
        return disableTracing ? onRequest2(void 0) : useSpan(`${spanPrefix}.${rpc._tag}`, {
          captureStackTrace: false,
          attributes: options.spanAttributes
        }, onRequest2);
      }
      const mailbox = onStreamRequest(rpc, middleware, rpc.payloadSchema.make ? rpc.payloadSchema.make(payload) : payload, headers, opts?.streamBufferSize ?? 16, context3);
      if (opts?.asMailbox) return mailbox;
      return unwrapScoped(map2(mailbox, toStream));
    };
  };
  const onEffectRequest = (rpc, middleware, span, payload, headers, context3, discard) => withFiberRuntime((parentFiber) => {
    if (isShutdown) {
      return interrupt3;
    }
    const id = generateRequestId();
    const send = middleware({
      _tag: "Request",
      id,
      tag: rpc._tag,
      payload,
      traceId: span?.traceId,
      spanId: span?.spanId,
      sampled: span?.sampled,
      headers: merge2(parentFiber.getFiberRef(currentHeaders), headers)
    });
    if (discard) {
      return flatMap(send, (message) => options.onFromClient({
        message,
        context: context3,
        discard
      }));
    }
    const runtime2 = make4({
      context: parentFiber.currentContext,
      fiberRefs: parentFiber.getFiberRefs(),
      runtimeFlags: defaultRuntime.runtimeFlags
    });
    let fiber;
    return onInterrupt(async((resume) => {
      const entry = {
        _tag: "Effect",
        rpc,
        context: context3,
        resume(exit) {
          resume(exit);
          if (fiber && !fiber.unsafePoll()) {
            parentFiber.currentScheduler.scheduleTask(() => {
              fiber.unsafeInterruptAsFork(parentFiber.id());
            }, 0);
          }
        }
      };
      entries.set(id, entry);
      fiber = send.pipe(flatMap((request) => options.onFromClient({
        message: request,
        context: context3,
        discard
      })), span ? withParentSpan(span) : identity, runFork(runtime2));
      fiber.addObserver((exit) => {
        if (exit._tag === "Failure") {
          return resume(exit);
        }
      });
    }), (interruptors2) => {
      entries.delete(id);
      const ids = Array.from(interruptors2).flatMap((id2) => Array.from(toSet(id2)));
      return zipRight(interrupt2(fiber), sendInterrupt(id, ids, context3));
    });
  });
  const onStreamRequest = fnUntraced(function* (rpc, middleware, payload, headers, streamBufferSize, context3) {
    if (isShutdown) {
      return yield* interrupt3;
    }
    const span = disableTracing ? void 0 : yield* makeSpanScoped(`${spanPrefix}.${rpc._tag}`, {
      captureStackTrace: false,
      attributes: options.spanAttributes
    });
    const fiber = getOrThrow(getCurrentFiber());
    const id = generateRequestId();
    const scope4 = unsafeGet(fiber.currentContext, Scope);
    yield* addFinalizerExit(scope4, (exit) => {
      if (!entries.has(id)) return _void;
      entries.delete(id);
      return sendInterrupt(id, isFailure(exit) ? Array.from(interruptors(exit.cause)).flatMap((id2) => Array.from(toSet(id2))) : [], context3);
    });
    const mailbox = yield* make6(streamBufferSize);
    entries.set(id, {
      _tag: "Mailbox",
      rpc,
      mailbox,
      scope: scope4,
      context: context3
    });
    yield* middleware({
      _tag: "Request",
      id,
      tag: rpc._tag,
      traceId: span?.traceId,
      payload,
      spanId: span?.spanId,
      sampled: span?.sampled,
      headers: merge2(fiber.getFiberRef(currentHeaders), headers)
    }).pipe(flatMap((request) => options.onFromClient({
      message: request,
      context: context3,
      discard: false
    })), span ? withParentSpan(span) : identity, catchAllCause((error) => mailbox.failCause(error)), interruptible, forkIn(scope4));
    return mailbox;
  });
  const getRpcClientMiddleware = (rpc) => {
    const middlewares = [];
    for (const tag of rpc.middlewares.values()) {
      const middleware = context2.unsafeMap.get(`${tag.key}/Client`);
      if (!middleware) continue;
      middlewares.push(middleware);
    }
    return middlewares.length === 0 ? succeed3 : function(request) {
      let i = 0;
      return map2(whileLoop({
        while: () => i < middlewares.length,
        body: () => middlewares[i]({
          rpc,
          request
        }),
        step(nextRequest) {
          request = nextRequest;
          i++;
        }
      }), () => request);
    };
  };
  const sendInterrupt = (requestId, interruptors2, context3) => async((resume) => {
    const parentFiber = getOrThrow(getCurrentFiber());
    const runtime2 = make4({
      context: parentFiber.currentContext,
      fiberRefs: parentFiber.getFiberRefs(),
      runtimeFlags: defaultRuntime.runtimeFlags
    });
    const fiber = options.onFromClient({
      message: {
        _tag: "Interrupt",
        requestId,
        interruptors: interruptors2
      },
      context: context3,
      discard: false
    }).pipe(timeout(1e3), runFork(runtime2));
    fiber.addObserver(() => {
      resume(_void);
    });
  });
  const write = (message) => {
    switch (message._tag) {
      case "Chunk": {
        const requestId = message.requestId;
        const entry = entries.get(requestId);
        if (!entry || entry._tag !== "Mailbox") return _void;
        return entry.mailbox.offerAll(message.values).pipe(supportsAck ? zipRight(options.onFromClient({
          message: {
            _tag: "Ack",
            requestId: message.requestId
          },
          context: entry.context,
          discard: false
        })) : identity, catchAllCause((cause) => entry.mailbox.done(failCause(cause))));
      }
      case "Exit": {
        const requestId = message.requestId;
        const entry = entries.get(requestId);
        if (!entry) return _void;
        entries.delete(requestId);
        if (entry._tag === "Effect") {
          entry.resume(message.exit);
          return _void;
        }
        return entry.mailbox.done(asVoid(message.exit));
      }
      case "Defect": {
        return clearEntries(die(message.defect));
      }
      case "ClientEnd": {
        return _void;
      }
    }
  };
  let client;
  if (options.flatten) {
    const fns = /* @__PURE__ */ new Map();
    client = function client2(tag, payload, options2) {
      let fn = fns.get(tag);
      if (!fn) {
        fn = onRequest(group.requests.get(tag));
        fns.set(tag, fn);
      }
      return fn(payload, options2);
    };
  } else {
    client = {};
    for (const rpc of group.requests.values()) {
      const dot = rpc._tag.indexOf(".");
      const prefix = dot === -1 ? void 0 : rpc._tag.slice(0, dot);
      if (prefix !== void 0 && !(prefix in client)) {
        ;
        client[prefix] = {};
      }
      const target = prefix !== void 0 ? client[prefix] : client;
      const tag = prefix !== void 0 ? rpc._tag.slice(dot + 1) : rpc._tag;
      target[tag] = onRequest(rpc);
    }
  }
  return {
    client,
    write
  };
});
var make10 = fnUntraced(function* (group, options) {
  const {
    run: run2,
    send,
    supportsAck,
    supportsTransferables
  } = yield* Protocol;
  const entries = /* @__PURE__ */ new Map();
  const {
    client,
    write
  } = yield* makeNoSerialization(group, {
    ...options,
    supportsAck,
    onFromClient({
      message
    }) {
      switch (message._tag) {
        case "Request": {
          const rpc = group.requests.get(message.tag);
          const schemas = getStreamSchemas(rpc.successSchema.ast);
          const collector = supportsTransferables ? unsafeMakeCollector() : void 0;
          const fiber = getOrThrow(getCurrentFiber());
          const entry = {
            rpc,
            context: collector ? add(fiber.currentContext, Collector, collector) : fiber.currentContext,
            decodeChunk: isSome(schemas) ? decodeUnknown2(NonEmptyArray(schemas.value.success)) : void 0
          };
          entries.set(message.id, entry);
          return encode(rpc.payloadSchema)(message.payload).pipe(locally(currentContext, entry.context), orDie, flatMap((payload) => send({
            ...message,
            id: String(message.id),
            payload,
            headers: Object.entries(message.headers)
          }, collector && collector.unsafeClear())));
        }
        case "Ack": {
          const entry = entries.get(message.requestId);
          if (!entry) return _void;
          return send({
            _tag: "Ack",
            requestId: String(message.requestId)
          });
        }
        case "Interrupt": {
          const entry = entries.get(message.requestId);
          if (!entry) return _void;
          entries.delete(message.requestId);
          return send({
            _tag: "Interrupt",
            requestId: String(message.requestId)
          });
        }
        case "Eof": {
          return _void;
        }
      }
    }
  });
  yield* run2((message) => {
    switch (message._tag) {
      case "Chunk": {
        const requestId = RequestId(message.requestId);
        const entry = entries.get(requestId);
        if (!entry || !entry.decodeChunk) return _void;
        return entry.decodeChunk(message.values).pipe(locally(currentContext, entry.context), orDie, flatMap((chunk) => write({
          _tag: "Chunk",
          clientId: 0,
          requestId: RequestId(message.requestId),
          values: chunk
        })), onError((cause) => write({
          _tag: "Exit",
          clientId: 0,
          requestId: RequestId(message.requestId),
          exit: failCause(cause)
        })));
      }
      case "Exit": {
        const requestId = RequestId(message.requestId);
        const entry = entries.get(requestId);
        if (!entry) return _void;
        entries.delete(requestId);
        return decode(exitSchema(entry.rpc))(message.exit).pipe(locally(currentContext, entry.context), orDie, matchCauseEffect({
          onSuccess: (exit) => write({
            _tag: "Exit",
            clientId: 0,
            requestId,
            exit
          }),
          onFailure: (cause) => write({
            _tag: "Exit",
            clientId: 0,
            requestId,
            exit: failCause(cause)
          })
        }));
      }
      case "Defect": {
        return write({
          _tag: "Defect",
          clientId: 0,
          defect: decodeDefect(message.defect)
        });
      }
      default: {
        return _void;
      }
    }
  }).pipe(catchAllCause(logError), interruptible, forkScoped);
  return client;
});
var currentHeaders = globalValue("@effect/rpc/RpcClient/currentHeaders", () => unsafeMake2(empty3));
var withHeaders = dual(2, (effect2, headers) => locallyWith(effect2, currentHeaders, merge2(fromInput(headers))));
var withHeadersEffect = dual(2, (effect2, headers) => flatMap(headers, (headers2) => withHeaders(effect2, headers2)));
var Protocol = class extends Tag("@effect/rpc/RpcClient/Protocol")() {
  /**
   * @since 1.0.0
   */
  static make = withRun();
};
var makeProtocolHttp = (client) => Protocol.make(fnUntraced(function* (writeResponse) {
  const serialization = yield* RpcSerialization;
  const isJson = serialization.contentType === "application/json";
  const send = (request) => {
    if (request._tag !== "Request") {
      return _void;
    }
    const parser = serialization.unsafeMake();
    const encoded = parser.encode(request);
    const body = typeof encoded === "string" ? text(encoded, serialization.contentType) : uint8Array(encoded, serialization.contentType);
    if (isJson) {
      return client.post("", {
        body
      }).pipe(flatMap((r) => r.json), scoped, flatMap((u) => {
        if (!Array.isArray(u)) {
          return dieMessage(`Expected an array of responses, but got: ${u}`);
        }
        let i = 0;
        return whileLoop({
          while: () => i < u.length,
          body: () => writeResponse(u[i++]),
          step: constVoid
        });
      }), orDie);
    }
    return client.post("", {
      body
    }).pipe(flatMap((r) => runForEachChunk(r.stream, (chunk) => {
      const responses = toReadonlyArray(chunk).flatMap(parser.decode);
      if (responses.length === 0) return _void;
      let i = 0;
      return whileLoop({
        while: () => i < responses.length,
        body: () => writeResponse(responses[i++]),
        step: constVoid
      });
    })), orDie);
  };
  return {
    send,
    supportsAck: false,
    supportsTransferables: false
  };
}));
var layerProtocolHttp = (options) => scoped2(Protocol, flatMap(HttpClient, (client) => {
  client = mapRequest(client, prependUrl(options.url));
  return makeProtocolHttp(options.transformClient ? options.transformClient(client) : client);
}));
var makeProtocolSocket = (options) => Protocol.make(fnUntraced(function* (writeResponse) {
  const socket = yield* Socket;
  const serialization = yield* RpcSerialization;
  const write = yield* socket.writer;
  let parser = serialization.unsafeMake();
  const pinger = yield* makePinger(write(parser.encode(constPing)));
  yield* suspend(() => {
    parser = serialization.unsafeMake();
    pinger.reset();
    return socket.runRaw((message) => {
      try {
        const responses = parser.decode(message);
        if (responses.length === 0) return;
        let i = 0;
        return whileLoop({
          while: () => i < responses.length,
          body: () => {
            const response = responses[i++];
            if (response._tag === "Pong") {
              pinger.onPong();
            }
            return writeResponse(response);
          },
          step: constVoid
        });
      } catch (defect) {
        return writeResponse({
          _tag: "Defect",
          defect
        });
      }
    }).pipe(raceFirst(zipRight(pinger.timeout, fail(new SocketGenericError({
      reason: "OpenTimeout",
      cause: new Error("ping timeout")
    })))));
  }).pipe(zipRight(fail(new SocketCloseError({
    reason: "Close",
    code: 1e3
  }))), tapErrorCause((cause) => {
    const error = failureOption(cause);
    if (options?.retryTransientErrors && isSome(error) && (error.value.reason === "Open" || error.value.reason === "OpenTimeout")) {
      return _void;
    }
    return writeResponse({
      _tag: "Defect",
      defect: squash(cause)
    });
  }), retry(spaced(1e3)), annotateLogs({
    module: "RpcClient",
    method: "makeProtocolSocket"
  }), interruptible, forkScoped);
  return {
    send(request) {
      const encoded = parser.encode(request);
      if (encoded === void 0) return _void;
      return orDie(write(encoded));
    },
    supportsAck: true,
    supportsTransferables: false
  };
}));
var makePinger = fnUntraced(function* (writePing) {
  let recievedPong = true;
  const latch = unsafeMakeLatch();
  const reset = () => {
    recievedPong = true;
    latch.unsafeClose();
  };
  const onPong = () => {
    recievedPong = true;
  };
  yield* suspend(() => {
    if (!recievedPong) return latch.open;
    recievedPong = false;
    return writePing;
  }).pipe(delay("10 seconds"), ignore, forever, interruptible, forkScoped);
  return {
    timeout: latch.await,
    reset,
    onPong
  };
});
var makeProtocolWorker = (options) => Protocol.make(fnUntraced(function* (writeResponse) {
  const worker = yield* PlatformWorker;
  const scope3 = yield* scope;
  let workerId = 0;
  const initialMessage2 = yield* serviceOption(InitialMessage);
  const entries = /* @__PURE__ */ new Map();
  const acquire = gen(function* () {
    const id = workerId++;
    const backing = yield* worker.spawn(id);
    const readyLatch = yield* makeLatch();
    yield* backing.run((message) => {
      if (message[0] === 0) {
        return readyLatch.open;
      }
      const response = message[1];
      if (response._tag === "Exit") {
        const entry = entries.get(response.requestId);
        if (entry) {
          entries.delete(response.requestId);
          entry.latch.unsafeOpen();
          return writeResponse(response);
        }
      } else if (response._tag === "Defect") {
        for (const [requestId, entry] of entries) {
          entries.delete(requestId);
          entry.latch.unsafeOpen();
        }
        return writeResponse(response);
      }
      return writeResponse(response);
    }).pipe(tapErrorCause((cause) => writeResponse({
      _tag: "Defect",
      defect: squash(cause)
    })), retry(spaced(1e3)), annotateLogs({
      module: "RpcClient",
      method: "makeProtocolWorker"
    }), interruptible, forkScoped);
    yield* readyLatch.await;
    if (isSome(initialMessage2)) {
      const [value, transfers] = yield* initialMessage2.value;
      yield* backing.send({
        _tag: "InitialMessage",
        value
      }, transfers);
    }
    return backing;
  });
  const pool = "minSize" in options ? yield* makeWithTTL({
    acquire,
    min: options.minSize,
    max: options.maxSize,
    concurrency: options.concurrency,
    targetUtilization: options.targetUtilization,
    timeToLive: options.timeToLive
  }) : yield* make8({
    acquire,
    size: options.size,
    concurrency: options.concurrency,
    targetUtilization: options.targetUtilization
  });
  yield* addFinalizer(scope3, sync(() => {
    for (const entry of entries.values()) {
      entry.latch.unsafeOpen();
    }
    entries.clear();
  }));
  const send = (request, transferables) => {
    switch (request._tag) {
      case "Request": {
        return pool.get.pipe(flatMap((worker2) => {
          const latch = unsafeMakeLatch(false);
          entries.set(request.id, {
            worker: worker2,
            latch
          });
          return zipRight(worker2.send(request, transferables), latch.await);
        }), scoped, orDie);
      }
      case "Interrupt": {
        const entry = entries.get(request.requestId);
        if (!entry) return _void;
        entries.delete(request.requestId);
        entry.latch.unsafeOpen();
        return orDie(entry.worker.send(request));
      }
      case "Ack": {
        const entry = entries.get(request.requestId);
        if (!entry) return _void;
        return orDie(entry.worker.send(request));
      }
    }
    return _void;
  };
  yield* scoped(pool.get);
  return {
    send,
    supportsAck: true,
    supportsTransferables: true
  };
}));
var layerProtocolWorker = (options) => scoped2(Protocol, makeProtocolWorker(options));
var layerProtocolSocket = (options) => scoped2(Protocol, makeProtocolSocket(options));
var decodeDefect = decodeSync(Defect);

// node_modules/@effect/rpc/dist/esm/RpcGroup.js
var RpcGroup_exports = {};
__export(RpcGroup_exports, {
  TypeId: () => TypeId2,
  make: () => make11
});
var TypeId2 = Symbol.for("@effect/rpc/RpcGroup");
var RpcGroupProto = {
  add(...rpcs) {
    return makeProto2({
      requests: resolveInput(...this.requests.values(), ...rpcs),
      annotations: this.annotations
    });
  },
  merge(...groups) {
    const requests = new Map(this.requests);
    const annotations = new Map(this.annotations.unsafeMap);
    for (const group of groups) {
      for (const [tag, rpc] of group.requests) {
        requests.set(tag, rpc);
      }
      for (const [key, value] of group.annotations.unsafeMap) {
        annotations.set(key, value);
      }
    }
    return makeProto2({
      requests,
      annotations: unsafeMake(annotations)
    });
  },
  middleware(middleware) {
    const requests = /* @__PURE__ */ new Map();
    for (const [tag, rpc] of this.requests) {
      requests.set(tag, rpc.middleware(middleware));
    }
    return makeProto2({
      requests,
      annotations: this.annotations
    });
  },
  toHandlersContext(build) {
    return gen(this, function* () {
      const context2 = yield* context();
      const handlers = isEffect(build) ? yield* build : build;
      const contextMap = /* @__PURE__ */ new Map();
      for (const [tag, handler] of Object.entries(handlers)) {
        const rpc = this.requests.get(tag);
        contextMap.set(rpc.key, {
          handler,
          context: context2
        });
      }
      return unsafeMake(contextMap);
    });
  },
  prefix(prefix) {
    const requests = /* @__PURE__ */ new Map();
    for (const [rpc] of this.requests.values()) {
      const newRpc = rpc.prefix(prefix);
      requests.set(newRpc._tag, newRpc);
    }
    return makeProto2({
      requests,
      annotations: this.annotations
    });
  },
  toLayer(build) {
    return scopedContext(this.toHandlersContext(build));
  },
  of: identity,
  toLayerHandler(tag, build) {
    return scopedContext(gen(this, function* () {
      const context2 = yield* context();
      const handler = isEffect(build) ? yield* build : build;
      const contextMap = /* @__PURE__ */ new Map();
      const rpc = this.requests.get(tag);
      contextMap.set(rpc.key, {
        handler,
        context: context2
      });
      return unsafeMake(contextMap);
    }));
  },
  accessHandler(tag) {
    return contextWith((parentContext) => {
      const rpc = this.requests.get(tag);
      const {
        context: context2,
        handler
      } = parentContext.unsafeMap.get(rpc.key);
      return (payload, headers) => {
        const result = handler(payload, headers);
        const effectOrStream = isFork(result) ? result.value : result;
        return isEffect(effectOrStream) ? provide(effectOrStream, context2) : provideContext(effectOrStream, context2);
      };
    });
  },
  annotate(tag, value) {
    return makeProto2({
      requests: this.requests,
      annotations: add(this.annotations, tag, value)
    });
  },
  annotateRpcs(tag, value) {
    return this.annotateRpcsContext(make(tag, value));
  },
  annotateContext(context2) {
    return makeProto2({
      requests: this.requests,
      annotations: merge(this.annotations, context2)
    });
  },
  annotateRpcsContext(context2) {
    const requests = /* @__PURE__ */ new Map();
    for (const [tag, rpc] of this.requests) {
      requests.set(tag, rpc.annotateContext(merge(context2, rpc.annotations)));
    }
    return makeProto2({
      requests,
      annotations: this.annotations
    });
  }
};
var makeProto2 = (options) => Object.assign(function() {
}, RpcGroupProto, {
  requests: options.requests,
  annotations: options.annotations
});
var resolveInput = (...rpcs) => {
  const requests = /* @__PURE__ */ new Map();
  for (const rpc of rpcs) {
    requests.set(rpc._tag, isSchema(rpc) ? fromTaggedRequest(rpc) : rpc);
  }
  return requests;
};
var make11 = (...rpcs) => makeProto2({
  requests: resolveInput(...rpcs),
  annotations: empty2()
});

// node_modules/@effect/rpc/dist/esm/RpcMiddleware.js
var RpcMiddleware_exports = {};
__export(RpcMiddleware_exports, {
  SuccessValue: () => SuccessValue,
  Tag: () => Tag2,
  TypeId: () => TypeId3,
  layerClient: () => layerClient
});
var TypeId3 = Symbol.for("@effect/rpc/RpcMiddleware");
var SuccessValue = Symbol.for("@effect/rpc/RpcMiddleware/SuccessValue");
var Tag2 = () => (id, options) => {
  const Err = globalThis.Error;
  const limit = Err.stackTraceLimit;
  Err.stackTraceLimit = 2;
  const creationError = new Err();
  Err.stackTraceLimit = limit;
  function TagClass() {
  }
  const TagClass_ = TagClass;
  Object.setPrototypeOf(TagClass, Object.getPrototypeOf(GenericTag(id)));
  TagClass.key = id;
  Object.defineProperty(TagClass, "stack", {
    get() {
      return creationError.stack;
    }
  });
  TagClass_[TypeId3] = TypeId3;
  TagClass_.failure = options?.optional === true || options?.failure === void 0 ? Never : options.failure;
  if (options?.provides) {
    TagClass_.provides = options.provides;
  }
  TagClass_.optional = options?.optional ?? false;
  TagClass_.requiredForClient = options?.requiredForClient ?? false;
  TagClass_.wrap = options?.wrap ?? false;
  return TagClass;
};
var layerClient = (tag, service) => scopedContext(gen(function* () {
  const context2 = (yield* context()).pipe(omit(Scope));
  const middleware = isEffect(service) ? yield* service : service;
  return unsafeMake(/* @__PURE__ */ new Map([[`${tag.key}/Client`, (options) => mapInputContext(middleware(options), (requestContext) => merge(context2, requestContext))]]));
}));

// node_modules/@effect/rpc/dist/esm/RpcServer.js
var RpcServer_exports = {};
__export(RpcServer_exports, {
  Protocol: () => Protocol2,
  layer: () => layer,
  layerHttpRouter: () => layerHttpRouter,
  layerProtocolHttp: () => layerProtocolHttp2,
  layerProtocolHttpRouter: () => layerProtocolHttpRouter,
  layerProtocolSocketServer: () => layerProtocolSocketServer,
  layerProtocolStdio: () => layerProtocolStdio,
  layerProtocolWebsocket: () => layerProtocolWebsocket,
  layerProtocolWebsocketRouter: () => layerProtocolWebsocketRouter,
  layerProtocolWorkerRunner: () => layerProtocolWorkerRunner,
  make: () => make12,
  makeNoSerialization: () => makeNoSerialization2,
  makeProtocolHttp: () => makeProtocolHttp2,
  makeProtocolHttpRouter: () => makeProtocolHttpRouter,
  makeProtocolSocketServer: () => makeProtocolSocketServer,
  makeProtocolStdio: () => makeProtocolStdio,
  makeProtocolWebsocket: () => makeProtocolWebsocket,
  makeProtocolWebsocketRouter: () => makeProtocolWebsocketRouter,
  makeProtocolWithHttpApp: () => makeProtocolWithHttpApp,
  makeProtocolWithHttpAppWebsocket: () => makeProtocolWithHttpAppWebsocket,
  makeProtocolWorkerRunner: () => makeProtocolWorkerRunner,
  toHttpApp: () => toHttpApp,
  toHttpAppWebsocket: () => toHttpAppWebsocket,
  toWebHandler: () => toWebHandler
});
var makeNoSerialization2 = fnUntraced(function* (group, options) {
  const enableTracing = options.disableTracing !== true;
  const enableSpanPropagation = options.disableSpanPropagation !== true;
  const supportsAck = options.disableClientAcks !== true;
  const spanPrefix = options.spanPrefix ?? "RpcServer";
  const concurrency = options.concurrency ?? "unbounded";
  const disableFatalDefects = options.disableFatalDefects ?? false;
  const context2 = yield* context();
  const scope3 = get(context2, Scope);
  const fiberSet = yield* make5();
  const runFork2 = yield* runtime(fiberSet)().pipe(interruptible);
  const concurrencySemaphore = concurrency === "unbounded" ? void 0 : yield* makeSemaphore(concurrency);
  const clients = /* @__PURE__ */ new Map();
  let isShutdown = false;
  const shutdownLatch = unsafeMakeLatch(false);
  yield* addFinalizer(scope3, fiberIdWith((fiberId) => {
    isShutdown = true;
    for (const client of clients.values()) {
      client.ended = true;
      if (client.fibers.size === 0) {
        runFork2(endClient(client));
        continue;
      }
      for (const fiber of client.fibers.values()) {
        fiber.unsafeInterruptAsFork(fiberId);
      }
    }
    if (clients.size === 0) {
      return _void;
    }
    return shutdownLatch.await;
  }));
  const disconnect = (clientId) => fiberIdWith((fiberId) => {
    const client = clients.get(clientId);
    if (!client) return _void;
    for (const fiber of client.fibers.values()) {
      fiber.unsafeInterruptAsFork(fiberId);
    }
    clients.delete(clientId);
    return _void;
  });
  const write = (clientId, message) => catchAllDefect(withFiberRuntime((requestFiber) => {
    if (isShutdown) return interrupt3;
    let client = clients.get(clientId);
    if (!client) {
      client = {
        id: clientId,
        latches: /* @__PURE__ */ new Map(),
        fibers: /* @__PURE__ */ new Map(),
        ended: false
      };
      clients.set(clientId, client);
    } else if (client.ended) {
      return interrupt3;
    }
    switch (message._tag) {
      case "Request": {
        return handleRequest(requestFiber, client, message);
      }
      case "Ack": {
        const latch = client.latches.get(message.requestId);
        return latch ? latch.open : _void;
      }
      case "Interrupt": {
        const fiber = client.fibers.get(message.requestId);
        return fiber ? interruptFork(fiber) : options.onFromServer({
          _tag: "Exit",
          clientId,
          requestId: message.requestId,
          exit: interrupt(none2)
        });
      }
      case "Eof": {
        client.ended = true;
        if (client.fibers.size > 0) return _void;
        return endClient(client);
      }
      default: {
        return sendDefect(client, `Unknown request tag: ${message._tag}`);
      }
    }
  }), (defect) => sendDefect(clients.get(clientId), defect));
  const endClient = (client) => {
    clients.delete(client.id);
    const write2 = options.onFromServer({
      _tag: "ClientEnd",
      clientId: client.id
    });
    if (isShutdown && clients.size === 0) {
      return zipRight(write2, shutdownLatch.open);
    }
    return write2;
  };
  const handleRequest = (requestFiber, client, request) => {
    if (client.fibers.has(request.id)) {
      return interrupt3;
    }
    const rpc = group.requests.get(request.tag);
    const entry = context2.unsafeMap.get(rpc?.key);
    if (!rpc || !entry) {
      const write2 = catchAllDefect(options.onFromServer({
        _tag: "Exit",
        clientId: client.id,
        requestId: request.id,
        exit: die(`Unknown request tag: ${request.tag}`)
      }), (defect) => sendDefect(client, defect));
      if (!client.ended || client.fibers.size > 0) return write2;
      return zipRight(write2, endClient(client));
    }
    const isStream2 = isStreamSchema(rpc.successSchema);
    const result = entry.handler(request.payload, request.headers);
    const isFork2 = isFork(result);
    const streamOrEffect = isFork2 ? result.value : result;
    let responded = false;
    let effect2 = uninterruptible(matchCauseEffect(interruptible(applyMiddleware(rpc, context2, client.id, request.payload, request.headers, isStream2 ? streamEffect(client, request, streamOrEffect) : streamOrEffect)), {
      onSuccess: (value) => {
        responded = true;
        return options.onFromServer({
          _tag: "Exit",
          clientId: client.id,
          requestId: request.id,
          exit: succeed2(value)
        });
      },
      onFailure: (cause) => {
        responded = true;
        if (!disableFatalDefects && isDie(cause)) {
          return sendDefect(client, squash(cause));
        }
        return options.onFromServer({
          _tag: "Exit",
          clientId: client.id,
          requestId: request.id,
          exit: failCause(cause)
        });
      }
    }));
    if (enableTracing) {
      const parentSpan = requestFiber.currentContext.unsafeMap.get(ParentSpan.key);
      effect2 = withSpan(effect2, `${spanPrefix}.${request.tag}`, {
        captureStackTrace: false,
        attributes: options.spanAttributes,
        parent: enableSpanPropagation && request.spanId ? {
          _tag: "ExternalSpan",
          traceId: request.traceId,
          spanId: request.spanId,
          sampled: request.sampled,
          context: empty2()
        } : void 0,
        links: enableSpanPropagation && parentSpan ? [{
          _tag: "SpanLink",
          span: parentSpan,
          attributes: {}
        }] : void 0
      });
    }
    if (!isFork2 && concurrencySemaphore) {
      effect2 = concurrencySemaphore.withPermits(1)(effect2);
    }
    const runtime2 = make4({
      context: merge(entry.context, requestFiber.currentContext),
      fiberRefs: requestFiber.getFiberRefs(),
      runtimeFlags: defaultRuntime.runtimeFlags
    });
    const fiber = runFork(runtime2, effect2);
    unsafeAdd(fiberSet, fiber);
    client.fibers.set(request.id, fiber);
    fiber.addObserver((exit) => {
      if (!responded && exit._tag === "Failure") {
        unsafeAdd(fiberSet, runFork(runtime2, options.onFromServer({
          _tag: "Exit",
          clientId: client.id,
          requestId: request.id,
          exit: interrupt(none2)
        })));
      }
      client.fibers.delete(request.id);
      client.latches.delete(request.id);
      if (client.ended && client.fibers.size === 0) {
        unsafeAdd(fiberSet, runFork(runtime2, endClient(client)));
      }
    });
    return _void;
  };
  const streamEffect = (client, request, stream2) => {
    let latch = client.latches.get(request.id);
    if (supportsAck && !latch) {
      latch = unsafeMakeLatch(false);
      client.latches.set(request.id, latch);
    }
    if (isEffect(stream2)) {
      let done = false;
      return stream2.pipe(flatMap((mailbox) => whileLoop({
        while: () => !done,
        body: constant(flatMap(mailbox.takeAll, ([chunk, done_]) => {
          done = done_;
          if (!isNonEmpty(chunk)) return _void;
          const write2 = options.onFromServer({
            _tag: "Chunk",
            clientId: client.id,
            requestId: request.id,
            values: toReadonlyArray(chunk)
          });
          if (!latch) return write2;
          latch.unsafeClose();
          return zipRight(write2, latch.await);
        })),
        step: constVoid
      })), scoped);
    }
    return runForEachChunk(stream2, (chunk) => {
      if (!isNonEmpty(chunk)) return _void;
      const write2 = options.onFromServer({
        _tag: "Chunk",
        clientId: client.id,
        requestId: request.id,
        values: toReadonlyArray(chunk)
      });
      if (!latch) return write2;
      latch.unsafeClose();
      return zipRight(write2, latch.await);
    });
  };
  const sendDefect = (client, defect) => suspend(() => {
    const shouldEnd = client.ended && client.fibers.size === 0;
    const write2 = options.onFromServer({
      _tag: "Defect",
      clientId: client.id,
      defect
    });
    if (!shouldEnd) return write2;
    return zipRight(write2, endClient(client));
  });
  return identity({
    write,
    disconnect
  });
});
var applyMiddleware = (rpc, context2, clientId, payload, headers, handler) => {
  if (rpc.middlewares.size === 0) {
    return handler;
  }
  const options = {
    rpc,
    payload,
    headers,
    clientId
  };
  for (const tag of rpc.middlewares) {
    if (tag.wrap) {
      const middleware = unsafeGet(context2, tag);
      handler = middleware({
        ...options,
        next: handler
      });
    } else if (tag.optional) {
      const middleware = unsafeGet(context2, tag);
      const previous = handler;
      handler = matchEffect(middleware(options), {
        onFailure: () => previous,
        onSuccess: tag.provides !== void 0 ? (value) => provideService(previous, tag.provides, value) : (_) => previous
      });
    } else {
      const middleware = unsafeGet(context2, tag);
      handler = tag.provides !== void 0 ? provideServiceEffect(handler, tag.provides, middleware(options)) : zipRight(middleware(options), handler);
    }
  }
  return handler;
};
var make12 = fnUntraced(function* (group, options) {
  const {
    disconnects,
    end,
    run: run2,
    send,
    supportsAck,
    supportsSpanPropagation,
    supportsTransferables
  } = yield* Protocol2;
  const context2 = yield* context();
  const scope3 = yield* make3();
  const server = yield* makeNoSerialization2(group, {
    ...options,
    disableClientAcks: !supportsAck,
    disableSpanPropagation: !supportsSpanPropagation,
    onFromServer(response) {
      const client = clients.get(response.clientId);
      if (!client) return _void;
      switch (response._tag) {
        case "Chunk": {
          const schemas = client.schemas.get(response.requestId);
          if (!schemas) return _void;
          return handleEncode(client, response.requestId, schemas.collector, provide(schemas.encodeChunk(response.values), schemas.context), (values) => ({
            _tag: "Chunk",
            requestId: String(response.requestId),
            values
          }));
        }
        case "Exit": {
          const schemas = client.schemas.get(response.requestId);
          if (!schemas) return _void;
          client.schemas.delete(response.requestId);
          return handleEncode(client, response.requestId, schemas.collector, provide(schemas.encodeExit(response.exit), schemas.context), (exit) => ({
            _tag: "Exit",
            requestId: String(response.requestId),
            exit
          }));
        }
        case "Defect": {
          return sendDefect(client, response.defect);
        }
        case "ClientEnd": {
          clients.delete(response.clientId);
          return end(response.clientId);
        }
      }
    }
  }).pipe(extend(scope3));
  yield* fork(interruptible(whileLoop({
    while: constTrue,
    body: constant(flatMap(disconnects.take, (clientId) => {
      clients.delete(clientId);
      return server.disconnect(clientId);
    })),
    step: constVoid
  })));
  const schemasCache = /* @__PURE__ */ new WeakMap();
  const getSchemas = (rpc) => {
    let schemas = schemasCache.get(rpc);
    if (!schemas) {
      const entry = context2.unsafeMap.get(rpc.key);
      const streamSchemas = getStreamSchemas(rpc.successSchema.ast);
      schemas = {
        decode: decodeUnknown2(rpc.payloadSchema),
        encodeChunk: encodeUnknown2(Array$(isSome(streamSchemas) ? streamSchemas.value.success : Any)),
        encodeExit: encodeUnknown2(exitSchema(rpc)),
        context: entry.context
      };
      schemasCache.set(rpc, schemas);
    }
    return schemas;
  };
  const clients = /* @__PURE__ */ new Map();
  const handleEncode = (client, requestId, collector, effect2, onSuccess) => (collector ? provideService(effect2, Collector, collector) : effect2).pipe(flatMap((a) => send(client.id, onSuccess(a), collector && collector.unsafeClear())), catchAllCause((cause) => {
    client.schemas.delete(requestId);
    const defect = squash(map(cause, TreeFormatter.formatErrorSync));
    return zipRight(sendRequestDefect(client, requestId, defect), server.write(client.id, {
      _tag: "Interrupt",
      requestId,
      interruptors: []
    }));
  }));
  const sendRequestDefect = (client, requestId, defect) => catchAllCause(send(client.id, {
    _tag: "Exit",
    requestId: String(requestId),
    exit: {
      _tag: "Failure",
      cause: {
        _tag: "Die",
        defect
      }
    }
  }), (cause) => sendDefect(client, squash(cause)));
  const sendDefect = (client, defect) => catchAllCause(send(client.id, {
    _tag: "Defect",
    defect
  }), (cause) => annotateLogs(logDebug(cause), {
    module: "RpcServer",
    method: "sendDefect"
  }));
  return yield* run2((clientId, request) => {
    let client = clients.get(clientId);
    if (!client) {
      client = {
        id: clientId,
        schemas: /* @__PURE__ */ new Map()
      };
      clients.set(clientId, client);
    }
    switch (request._tag) {
      case "Request": {
        const tag = hasProperty(request, "tag") ? request.tag : "";
        const rpc = group.requests.get(tag);
        if (!rpc) {
          return sendDefect(client, `Unknown request tag: ${tag}`);
        }
        let requestId;
        switch (typeof request.id) {
          case "bigint":
          case "string": {
            requestId = RequestId(request.id);
            break;
          }
          default: {
            return sendDefect(client, `Invalid request id: ${request.id}`);
          }
        }
        const schemas = getSchemas(rpc);
        return matchEffect(provide(schemas.decode(request.payload), schemas.context), {
          onFailure: (error) => sendRequestDefect(client, requestId, TreeFormatter.formatErrorSync(error)),
          onSuccess: (payload) => {
            client.schemas.set(requestId, supportsTransferables ? {
              ...schemas,
              collector: unsafeMakeCollector()
            } : schemas);
            return server.write(clientId, {
              ...request,
              id: requestId,
              payload,
              headers: fromInput(request.headers)
            });
          }
        });
      }
      case "Ping": {
        return catchAllCause(send(client.id, constPong), (cause) => sendDefect(client, squash(cause)));
      }
      case "Eof": {
        return server.write(clientId, request);
      }
      case "Ack": {
        return server.write(clientId, {
          ...request,
          requestId: RequestId(request.requestId)
        });
      }
      case "Interrupt": {
        return server.write(clientId, {
          ...request,
          requestId: RequestId(request.requestId),
          interruptors: []
        });
      }
      default: {
        return sendDefect(client, `Unknown request tag: ${request._tag}`);
      }
    }
  }).pipe(interruptible, tapErrorCause((cause) => logFatal("BUG: RpcServer protocol crashed", cause)), onExit((exit) => close(scope3, exit)));
});
var layer = (group, options) => scopedDiscard(forkScoped(interruptible(make12(group, options))));
var layerHttpRouter = (options) => layer(options.group, options).pipe(provide2(options.protocol === "http" ? layerProtocolHttpRouter(options) : layerProtocolWebsocketRouter(options)));
var Protocol2 = class extends Tag("@effect/rpc/RpcServer/Protocol")() {
  /**
   * @since 1.0.0
   */
  static make = withRun();
};
var makeProtocolSocketServer = gen(function* () {
  const server = yield* SocketServer;
  const {
    onSocket,
    protocol
  } = yield* makeSocketProtocol;
  yield* forkScoped(interruptible(server.run(fnUntraced(onSocket, scoped))));
  return protocol;
});
var layerProtocolSocketServer = scoped2(Protocol2, makeProtocolSocketServer);
var makeProtocolWithHttpAppWebsocket = gen(function* () {
  const {
    onSocket,
    protocol
  } = yield* makeSocketProtocol;
  const httpApp = gen(function* () {
    const request = yield* HttpServerRequest;
    const socket = yield* orDie(request.upgrade);
    yield* onSocket(socket);
    return empty4();
  });
  return {
    protocol,
    httpApp
  };
});
var makeProtocolWebsocket = fnUntraced(function* (options) {
  const {
    httpApp,
    protocol
  } = yield* makeProtocolWithHttpAppWebsocket;
  const router = yield* options.routerTag ?? Default;
  yield* router.get(options.path, httpApp);
  return protocol;
});
var makeProtocolWebsocketRouter = fnUntraced(function* (options) {
  const router = yield* HttpRouter;
  const {
    httpApp,
    protocol
  } = yield* makeProtocolWithHttpAppWebsocket;
  yield* router.add("GET", options.path, httpApp);
  return protocol;
});
var layerProtocolWebsocket = (options) => {
  const routerTag = options.routerTag ?? Default;
  return effect(Protocol2, makeProtocolWebsocket(options)).pipe(provide2(routerTag.Live));
};
var layerProtocolWebsocketRouter = (options) => effect(Protocol2, makeProtocolWebsocketRouter(options));
var makeProtocolWithHttpApp = gen(function* () {
  const serialization = yield* RpcSerialization;
  const includesFraming = serialization.includesFraming;
  const disconnects = yield* make6();
  let writeRequest;
  let clientId = 0;
  const clients = /* @__PURE__ */ new Map();
  const httpApp = gen(function* () {
    const request = yield* HttpServerRequest;
    const data = yield* orDie(request.arrayBuffer);
    const id = clientId++;
    const mailbox = yield* make6();
    const parser = serialization.unsafeMake();
    const encoder = new TextEncoder();
    const offer = (data2) => typeof data2 === "string" ? mailbox.offer(encoder.encode(data2)) : mailbox.offer(data2);
    clients.set(id, {
      write: (response) => {
        try {
          if (!includesFraming) return mailbox.offer(response);
          const encoded = parser.encode(response);
          if (encoded === void 0) return _void;
          return offer(encoded);
        } catch (cause) {
          return !includesFraming ? mailbox.offer(ResponseDefectEncoded(cause)) : offer(parser.encode(ResponseDefectEncoded(cause)));
        }
      },
      end: mailbox.end
    });
    const requestIds = [];
    try {
      const decoded = parser.decode(new Uint8Array(data));
      for (const message of decoded) {
        if (message._tag === "Request") {
          requestIds.push(RequestId(message.id));
        }
        yield* writeRequest(id, message);
      }
    } catch (cause) {
      yield* offer(parser.encode(ResponseDefectEncoded(cause)));
    }
    yield* writeRequest(id, constEof);
    if (!includesFraming) {
      let done = false;
      yield* addFinalizer2(() => {
        clients.delete(id);
        disconnects.unsafeOffer(id);
        if (done) return _void;
        return forEach(requestIds, (requestId) => writeRequest(id, {
          _tag: "Interrupt",
          requestId: String(requestId)
        }), {
          discard: true
        });
      });
      const responses = empty();
      while (true) {
        const [items, done2] = yield* mailbox.takeAll;
        responses.push(...items);
        if (done2) break;
      }
      done = true;
      return text2(parser.encode(responses), {
        contentType: serialization.contentType
      });
    }
    return stream(ensuringWith(toStream(mailbox), (exit) => {
      clients.delete(id);
      disconnects.unsafeOffer(id);
      if (!isInterrupted(exit)) return _void;
      return forEach(requestIds, (requestId) => writeRequest(id, {
        _tag: "Interrupt",
        requestId: String(requestId)
      }), {
        discard: true
      });
    }), {
      contentType: serialization.contentType
    });
  }).pipe(interruptible);
  const protocol = yield* Protocol2.make((writeRequest_) => {
    writeRequest = writeRequest_;
    return succeed3({
      disconnects,
      send(clientId2, response) {
        const client = clients.get(clientId2);
        if (!client) return _void;
        return client.write(response);
      },
      end(clientId2) {
        const client = clients.get(clientId2);
        if (!client) return _void;
        return client.end;
      },
      clientIds: sync(() => clients.keys()),
      initialMessage: succeedNone,
      supportsAck: false,
      supportsTransferables: false,
      supportsSpanPropagation: false
    });
  });
  return {
    protocol,
    httpApp
  };
});
var makeProtocolHttp2 = fnUntraced(function* (options) {
  const {
    httpApp,
    protocol
  } = yield* makeProtocolWithHttpApp;
  const router = yield* options.routerTag ?? Default;
  yield* router.post(options.path, httpApp);
  return protocol;
});
var makeProtocolHttpRouter = fnUntraced(function* (options) {
  const router = yield* HttpRouter;
  const {
    httpApp,
    protocol
  } = yield* makeProtocolWithHttpApp;
  yield* router.add("POST", options.path, httpApp);
  return protocol;
});
var makeProtocolWorkerRunner = Protocol2.make(fnUntraced(function* (writeRequest) {
  const fiber = yield* withFiberRuntime(succeed3);
  const runner = yield* PlatformRunner;
  const closeLatch = yield* CloseLatch;
  const backing = yield* runner.start(closeLatch);
  const initialMessage2 = yield* make2();
  const clientIds = /* @__PURE__ */ new Set();
  const disconnects = yield* make6();
  yield* _await(closeLatch).pipe(onExit(() => {
    fiber.currentScheduler.scheduleTask(() => fiber.unsafeInterruptAsFork(fiber.id()), 0);
    return _void;
  }), forkScoped);
  yield* backing.run((clientId, message) => {
    clientIds.add(clientId);
    if (message._tag === "InitialMessage") {
      return succeed(initialMessage2, message.value);
    }
    return writeRequest(clientId, message);
  });
  yield* disconnects.take.pipe(tap((clientId) => {
    clientIds.delete(clientId);
    return disconnects.offer(clientId);
  }), forkScoped);
  return {
    disconnects,
    send: backing.send,
    end(_clientId) {
      return _void;
    },
    clientIds: sync(() => clientIds.values()),
    initialMessage: asSome(_await(initialMessage2)),
    supportsAck: true,
    supportsTransferables: true,
    supportsSpanPropagation: true
  };
}));
var layerProtocolWorkerRunner = scoped2(Protocol2, makeProtocolWorkerRunner);
var layerProtocolHttp2 = (options) => {
  const routerTag = options.routerTag ?? Default;
  return effect(Protocol2, makeProtocolHttp2(options)).pipe(provide2(routerTag.Live));
};
var layerProtocolHttpRouter = (options) => effect(Protocol2, makeProtocolHttpRouter(options));
var toHttpApp = fnUntraced(function* (group, options) {
  const {
    httpApp,
    protocol
  } = yield* makeProtocolWithHttpApp;
  yield* make12(group, options).pipe(provideService(Protocol2, protocol), interruptible, forkScoped);
  return httpApp;
});
var toHttpAppWebsocket = fnUntraced(function* (group, options) {
  const {
    httpApp,
    protocol
  } = yield* makeProtocolWithHttpAppWebsocket;
  yield* make12(group, options).pipe(provideService(Protocol2, protocol), interruptible, forkScoped);
  return httpApp;
});
var toWebHandler = (group, options) => {
  const runtime2 = make7(mergeAll(options.layer, scope2), options?.memoMap);
  let handlerCached;
  const handlerPromise = gen(function* () {
    const app = yield* toHttpApp(group, options);
    const rt = yield* runtime2.runtimeEffect;
    const handler2 = toWebHandlerRuntime(rt)(options?.middleware ? options.middleware(app) : app);
    handlerCached = handler2;
    return handler2;
  }).pipe(runtime2.runPromise);
  function handler(request, context2) {
    if (handlerCached !== void 0) {
      return handlerCached(request, context2);
    }
    return handlerPromise.then((handler2) => handler2(request, context2));
  }
  return {
    handler,
    dispose: runtime2.dispose
  };
};
var makeProtocolStdio = fnUntraced(function* (options) {
  const serialization = yield* RpcSerialization;
  return yield* Protocol2.make(fnUntraced(function* (writeRequest) {
    const mailbox = yield* make6();
    const parser = serialization.unsafeMake();
    yield* options.stdin.pipe(runForEach((data) => {
      const decoded = parser.decode(data);
      if (decoded.length === 0) return _void;
      let i = 0;
      return whileLoop({
        while: () => i < decoded.length,
        body: () => writeRequest(0, decoded[i++]),
        step: constVoid
      });
    }), retry(spaced(500)), forkScoped, interruptible);
    yield* toStream(mailbox).pipe(run(options.stdout), retry(spaced(500)), forkScoped, interruptible);
    return {
      disconnects: yield* make6(),
      send(_clientId, response) {
        const responseEncoded = parser.encode(response);
        if (responseEncoded === void 0) {
          return _void;
        }
        return mailbox.offer(responseEncoded);
      },
      end(_clientId) {
        return mailbox.end;
      },
      clientIds: succeed3([0]),
      initialMessage: succeedNone,
      supportsAck: true,
      supportsTransferables: false,
      supportsSpanPropagation: true
    };
  }));
});
var layerProtocolStdio = (options) => scoped2(Protocol2, makeProtocolStdio(options));
var makeSocketProtocol = gen(function* () {
  const serialization = yield* RpcSerialization;
  const disconnects = yield* make6();
  let clientId = 0;
  const clients = /* @__PURE__ */ new Map();
  let writeRequest;
  const onSocket = function* (socket) {
    const scope3 = yield* scope;
    const parser = serialization.unsafeMake();
    const id = clientId++;
    yield* addFinalizerExit(scope3, () => {
      clients.delete(id);
      return disconnects.offer(id);
    });
    const writeRaw = yield* socket.writer;
    const write = (response) => {
      try {
        const encoded = parser.encode(response);
        if (encoded === void 0) {
          return _void;
        }
        return orDie(writeRaw(encoded));
      } catch (cause) {
        return orDie(writeRaw(parser.encode(ResponseDefectEncoded(cause))));
      }
    };
    clients.set(id, {
      write
    });
    yield* socket.runRaw((data) => {
      try {
        const decoded = parser.decode(data);
        if (decoded.length === 0) return _void;
        let i = 0;
        return whileLoop({
          while: () => i < decoded.length,
          body: () => writeRequest(id, decoded[i++]),
          step: constVoid
        });
      } catch (cause) {
        return writeRaw(parser.encode(ResponseDefectEncoded(cause)));
      }
    }).pipe(interruptible, catchIf((error) => error.reason === "Close", () => _void), orDie);
  };
  const protocol = yield* Protocol2.make((writeRequest_) => {
    writeRequest = writeRequest_;
    return succeed3({
      disconnects,
      send: (clientId2, response) => {
        const client = clients.get(clientId2);
        if (!client) return _void;
        return orDie(client.write(response));
      },
      end(_clientId) {
        return _void;
      },
      clientIds: sync(() => clients.keys()),
      initialMessage: succeedNone,
      supportsAck: true,
      supportsTransferables: false,
      supportsSpanPropagation: true
    });
  });
  return {
    protocol,
    onSocket
  };
});

// node_modules/@effect/rpc/dist/esm/RpcTest.js
var RpcTest_exports = {};
__export(RpcTest_exports, {
  makeClient: () => makeClient
});
var makeClient = fnUntraced(function* (group) {
  let client;
  const server = yield* makeNoSerialization2(group, {
    onFromServer(response) {
      return client.write(response);
    }
  });
  client = yield* makeNoSerialization(group, {
    supportsAck: true,
    onFromClient({
      message
    }) {
      return server.write(0, message);
    }
  });
  return client.client;
});
export {
  Rpc_exports as Rpc,
  RpcClient_exports as RpcClient,
  RpcGroup_exports as RpcGroup,
  RpcMessage_exports as RpcMessage,
  RpcMiddleware_exports as RpcMiddleware,
  RpcSchema_exports as RpcSchema,
  RpcSerialization_exports as RpcSerialization,
  RpcServer_exports as RpcServer,
  RpcTest_exports as RpcTest,
  RpcWorker_exports as RpcWorker
};
//# sourceMappingURL=@effect_rpc.js.map
