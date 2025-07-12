import {
  Any,
  Array$,
  ArrayFormatter,
  ArrayFormatterIssue,
  BaseProto,
  Cause,
  ChunkFromSelf,
  Class,
  CurrentMemoMap,
  Defect,
  DeferredTypeId,
  DescriptionAnnotationId,
  Equivalence,
  Error as Error2,
  Forbidden,
  GenericTag,
  IdentifierAnnotationId,
  Literal,
  Never,
  NodeInspectSymbol,
  Number$,
  ParentSpan,
  Record,
  Reference,
  ScheduleTypeId,
  Scope,
  StreamTypeId,
  String$,
  Struct,
  StructuralClass,
  Tag,
  TaggedError,
  TaggedError2,
  TimeoutExceptionTypeId,
  TreeFormatter,
  Tuple,
  Type,
  TypeId4 as TypeId,
  Uint8ArrayFromSelf,
  Union,
  Union2,
  Void,
  __export,
  _await,
  _try,
  _void,
  acquireRelease2 as acquireRelease,
  acquireUseRelease2 as acquireUseRelease,
  acquireUseRelease4 as acquireUseRelease2,
  add,
  addFinalizer2 as addFinalizer,
  addFinalizer3 as addFinalizer2,
  all2 as all,
  andThen2 as andThen,
  annotateLogs,
  annotations,
  append,
  append2,
  appendAll,
  appendAll2,
  as2 as as,
  bind,
  bindTo,
  bufferChunks,
  buildWithMemoMap,
  buildWithScope,
  cached2 as cached,
  catchAll,
  catchAll3 as catchAll2,
  catchAllCause,
  catchIf,
  catchTag,
  catchTags,
  close,
  complete,
  compose,
  compose2,
  constFalse,
  constVoid,
  constant,
  context2 as context,
  contextWith,
  currentContext2 as currentContext,
  currentTracerEnabled,
  declare,
  decode,
  decode2,
  decodeBase64String,
  decodeSync,
  decodeUnknown2 as decodeUnknown,
  defaultRuntime,
  die3 as die,
  die4 as die2,
  dual,
  effect,
  effectDiscard,
  embedInput,
  empty15 as empty4,
  empty3 as empty,
  empty4 as empty2,
  empty5 as empty3,
  encode,
  encodeSync,
  encodeText,
  encodeUnknown2 as encodeUnknown,
  encodedAST,
  encodedSchema,
  ensuring2 as ensuring,
  ensuring4 as ensuring2,
  ensuringWith,
  exit2 as exit,
  extend,
  externalSpan,
  fail10 as fail7,
  fail2 as fail,
  fail3 as fail2,
  fail4 as fail3,
  fail5 as fail4,
  fail8 as fail5,
  fail9 as fail6,
  failCause2 as failCause,
  failCause3 as failCause2,
  failCause4 as failCause3,
  failCause6 as failCause4,
  failureOrCause,
  failureSchema,
  filter,
  filter2,
  filterOrElse,
  filterOrFail2 as filterOrFail,
  findFirst,
  findLast,
  flatMap,
  flatMap3 as flatMap2,
  flatMap5 as flatMap3,
  flatMap6 as flatMap4,
  flatMapNullable,
  fnUntraced2 as fnUntraced,
  forEach,
  forEach2,
  forEach4 as forEach3,
  fork2 as fork,
  forkIn2 as forkIn,
  forkScoped,
  format,
  fromAST,
  fromChannel,
  fromIterable,
  fromIterable2,
  fromIterable9 as fromIterable3,
  fromNullable,
  fromReadableStream,
  gen2 as gen,
  get,
  get2,
  get7 as get3,
  get8 as get4,
  getCurrentFiber,
  getEquivalence,
  getOption,
  getOrDefault,
  getOrElse,
  getOrElse2,
  getOrThrow,
  getOrThrowWith,
  getOrUndefined,
  getRight,
  globalValue,
  hasProperty,
  identity,
  interrupt2 as interrupt,
  interrupt4 as interrupt2,
  interruptible3 as interruptible,
  into,
  is,
  isContext,
  isEffect,
  isEmptyRecord,
  isEmptyType,
  isFailure,
  isFinite,
  isInterrupted,
  isInterrupted2,
  isLayer,
  isLeft,
  isMailbox,
  isNeverKeyword,
  isNoSuchElementException,
  isOption,
  isParseError,
  isSome,
  isTagged,
  isUnion,
  isVoidKeyword,
  itemsCount,
  join,
  left,
  locally,
  locally2,
  locallyScoped,
  locallyWith,
  log2 as log,
  logWarning2 as logWarning,
  make16 as make3,
  make2 as make,
  make23 as make4,
  make25 as make5,
  make26 as make6,
  make27 as make7,
  make28 as make8,
  make29 as make9,
  make7 as make2,
  makeWithTTL2 as makeWithTTL,
  map,
  map11 as map5,
  map14 as map6,
  map2,
  map4 as map3,
  map6 as map4,
  mapEffect,
  mapError,
  mapError4 as mapError2,
  mapInputContext2 as mapInputContext,
  mapOutEffect,
  match,
  match2,
  match3,
  matchCauseEffect2 as matchCauseEffect,
  matchEffect2 as matchEffect,
  merge,
  mergeAll,
  nominal,
  none,
  none3 as none2,
  of2 as of,
  omit,
  omit2,
  onError2 as onError,
  onExit,
  onInterrupt2 as onInterrupt,
  optional,
  or,
  orDie,
  orElse,
  parseJson,
  pipe,
  pipeArguments,
  pipeThroughChannel,
  pipeTo,
  promise,
  provide,
  provide2,
  provideContext3 as provideContext,
  provideMerge2 as provideMerge,
  provideService,
  provideServiceEffect,
  provideSomeContext2 as provideSomeContext,
  raceFirst,
  readWithCause,
  redact,
  reduce,
  reduce6 as reduce2,
  remove,
  retry,
  reverse,
  right,
  run,
  run2,
  run3,
  runForEach,
  runForEachChunk,
  runFork2 as runFork,
  runPromise,
  runSync,
  runtime,
  runtime2,
  runtime3,
  scope,
  scopeWith,
  scoped2 as scoped,
  scoped3 as scoped2,
  scopedContext,
  scopedDiscard,
  scopedWith,
  seconds,
  sequential,
  sequential2,
  serialize,
  serializeFailure,
  serializeSuccess,
  serviceFunctions,
  serviceOption,
  set,
  set8 as set2,
  some,
  some2,
  spaced,
  squash,
  stripSomeDefects,
  succeed10 as succeed5,
  succeed11 as succeed6,
  succeed2 as succeed,
  succeed6 as succeed2,
  succeed7 as succeed3,
  succeed9 as succeed4,
  succeedContext,
  successSchema,
  suspend2 as suspend,
  suspend4 as suspend2,
  suspend5 as suspend3,
  symbolRedactable,
  sync4 as sync,
  sync5 as sync2,
  sync7 as sync3,
  tagged3 as tagged,
  tap2 as tap,
  tapError,
  tapErrorCause,
  timeoutFail,
  toChannel,
  toReadableStreamRuntime,
  toReadonlyArray,
  toRuntime,
  toSeconds,
  transform,
  transformOrFail,
  tryMap,
  tryPromise,
  try_2 as try_,
  typeSchema,
  unify,
  uninterruptible2 as uninterruptible,
  uninterruptibleMask2 as uninterruptibleMask,
  unsafeAdd,
  unsafeDone,
  unsafeFromArray,
  unsafeGet,
  unsafeMake,
  unsafeMake2,
  unsafeMake5 as unsafeMake3,
  unsafeMakeLatch,
  unwrap2 as unwrap,
  unwrap3 as unwrap2,
  unwrapEffect,
  unwrapScoped,
  unwrapScoped3 as unwrapScoped2,
  unwrapScoped4 as unwrapScoped3,
  unwrapScoped5 as unwrapScoped4,
  update3 as update,
  update5 as update2,
  updateContext,
  updateService,
  useSpan,
  value3 as value,
  void_2 as void_,
  void_4 as void_2,
  withFiberRuntime2 as withFiberRuntime,
  withLogSpan,
  withParentSpan,
  write,
  zip4 as zip,
  zipRight3 as zipRight,
  zipRight5 as zipRight2
} from "./chunk-6XTNYBYF.js";

// node_modules/@effect/platform/dist/esm/ChannelSchema.js
var ChannelSchema_exports = {};
__export(ChannelSchema_exports, {
  decode: () => decode3,
  decodeUnknown: () => decodeUnknown2,
  duplex: () => duplex,
  duplexUnknown: () => duplexUnknown,
  encode: () => encode2,
  encodeUnknown: () => encodeUnknown2
});
var encode2 = (schema4) => () => {
  const encode4 = encode(ChunkFromSelf(schema4));
  const loop = readWithCause({
    onInput: (input) => zipRight2(flatMap3(encode4(input), write), loop),
    onFailure: (cause) => failCause4(cause),
    onDone: succeed4
  });
  return loop;
};
var encodeUnknown2 = encode2;
var decode3 = (schema4) => () => {
  const decode5 = decode2(ChunkFromSelf(schema4));
  const loop = readWithCause({
    onInput(chunk) {
      return decode5(chunk).pipe(flatMap3(write), zipRight2(loop));
    },
    onFailure(cause) {
      return failCause4(cause);
    },
    onDone(done) {
      return succeed4(done);
    }
  });
  return loop;
};
var decodeUnknown2 = decode3;
var duplex = dual(2, (self, options7) => {
  const decode5 = decode2(ChunkFromSelf(options7.outputSchema));
  return pipe(encode2(options7.inputSchema)(), pipeTo(self), mapOutEffect(decode5));
});
var duplexUnknown = duplex;

// node_modules/@effect/platform/dist/esm/Error.js
var Error_exports = {};
__export(Error_exports, {
  BadArgument: () => BadArgument,
  Module: () => Module,
  PlatformError: () => PlatformError,
  SystemError: () => SystemError,
  SystemErrorReason: () => SystemErrorReason,
  TypeId: () => TypeId2,
  TypeIdError: () => TypeIdError,
  isPlatformError: () => isPlatformError
});
var TypeId2 = Symbol.for("@effect/platform/Error");
var isPlatformError = (u) => hasProperty(u, TypeId2);
var TypeIdError = (typeId, tag5) => {
  class Base extends Error2 {
    _tag = tag5;
  }
  ;
  Base.prototype[typeId] = typeId;
  Base.prototype.name = tag5;
  return Base;
};
var Module = Literal("Clipboard", "Command", "FileSystem", "KeyValueStore", "Path", "Stream", "Terminal");
var BadArgument = class extends TaggedError2("@effect/platform/Error/BadArgument")("BadArgument", {
  module: Module,
  method: String$,
  description: optional(String$),
  cause: optional(Defect)
}) {
  /**
   * @since 1.0.0
   */
  [TypeId2] = TypeId2;
  /**
   * @since 1.0.0
   */
  get message() {
    return `${this.module}.${this.method}${this.description ? `: ${this.description}` : ""}`;
  }
};
var SystemErrorReason = Literal("AlreadyExists", "BadResource", "Busy", "InvalidData", "NotFound", "PermissionDenied", "TimedOut", "UnexpectedEof", "Unknown", "WouldBlock", "WriteZero");
var SystemError = class extends TaggedError2("@effect/platform/Error/SystemError")("SystemError", {
  reason: SystemErrorReason,
  module: Module,
  method: String$,
  description: optional(String$),
  syscall: optional(String$),
  pathOrDescriptor: optional(Union2(String$, Number$)),
  cause: optional(Defect)
}) {
  /**
   * @since 1.0.0
   */
  [TypeId2] = TypeId2;
  /**
   * @since 1.0.0
   */
  get message() {
    return `${this.reason}: ${this.module}.${this.method}${this.pathOrDescriptor !== void 0 ? ` (${this.pathOrDescriptor})` : ""}${this.description ? `: ${this.description}` : ""}`;
  }
};
var PlatformError = Union2(BadArgument, SystemError);

// node_modules/@effect/platform/dist/esm/Cookies.js
var Cookies_exports = {};
__export(Cookies_exports, {
  CookieTypeId: () => CookieTypeId,
  CookiesError: () => CookiesError,
  ErrorTypeId: () => ErrorTypeId,
  TypeId: () => TypeId3,
  empty: () => empty5,
  fromIterable: () => fromIterable4,
  fromReadonlyRecord: () => fromReadonlyRecord,
  fromSetCookie: () => fromSetCookie,
  get: () => get5,
  getValue: () => getValue,
  isCookies: () => isCookies,
  isEmpty: () => isEmpty,
  makeCookie: () => makeCookie,
  merge: () => merge2,
  parseHeader: () => parseHeader,
  remove: () => remove2,
  serializeCookie: () => serializeCookie,
  set: () => set3,
  setAll: () => setAll,
  setAllCookie: () => setAllCookie,
  setCookie: () => setCookie,
  toCookieHeader: () => toCookieHeader,
  toRecord: () => toRecord,
  toSetCookieHeaders: () => toSetCookieHeaders,
  unsafeMakeCookie: () => unsafeMakeCookie,
  unsafeSet: () => unsafeSet,
  unsafeSetAll: () => unsafeSetAll
});
var TypeId3 = Symbol.for("@effect/platform/Cookies");
var isCookies = (u) => hasProperty(u, TypeId3);
var CookieTypeId = Symbol.for("@effect/platform/Cookies/Cookie");
var ErrorTypeId = Symbol.for("@effect/platform/Cookies/CookieError");
var CookiesError = class extends TypeIdError(ErrorTypeId, "CookieError") {
  get message() {
    return this.reason;
  }
};
var Proto = {
  [TypeId3]: TypeId3,
  ...BaseProto,
  toJSON() {
    return {
      _id: "@effect/platform/Cookies",
      cookies: map3(this.cookies, (cookie) => cookie.toJSON())
    };
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var fromReadonlyRecord = (cookies) => {
  const self = Object.create(Proto);
  self.cookies = cookies;
  return self;
};
var fromIterable4 = (cookies) => {
  const record = {};
  for (const cookie of cookies) {
    record[cookie.name] = cookie;
  }
  return fromReadonlyRecord(record);
};
var fromSetCookie = (headers) => {
  const arrayHeaders = typeof headers === "string" ? [headers] : headers;
  const cookies = [];
  for (const header of arrayHeaders) {
    const cookie = parseSetCookie(header.trim());
    if (isSome(cookie)) {
      cookies.push(cookie.value);
    }
  }
  return fromIterable4(cookies);
};
function parseSetCookie(header) {
  const parts = header.split(";").map((_) => _.trim()).filter((_) => _ !== "");
  if (parts.length === 0) {
    return none();
  }
  const firstEqual = parts[0].indexOf("=");
  if (firstEqual === -1) {
    return none();
  }
  const name = parts[0].slice(0, firstEqual);
  if (!fieldContentRegExp.test(name)) {
    return none();
  }
  const valueEncoded = parts[0].slice(firstEqual + 1);
  const value2 = tryDecodeURIComponent(valueEncoded);
  if (parts.length === 1) {
    return some(Object.assign(Object.create(CookieProto), {
      name,
      value: value2,
      valueEncoded
    }));
  }
  const options7 = {};
  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    const equalIndex = part.indexOf("=");
    const key = equalIndex === -1 ? part : part.slice(0, equalIndex).trim();
    const value3 = equalIndex === -1 ? void 0 : part.slice(equalIndex + 1).trim();
    switch (key.toLowerCase()) {
      case "domain": {
        if (value3 === void 0) {
          break;
        }
        const domain = value3.trim().replace(/^\./, "");
        if (domain) {
          options7.domain = domain;
        }
        break;
      }
      case "expires": {
        if (value3 === void 0) {
          break;
        }
        const date = new Date(value3);
        if (!isNaN(date.getTime())) {
          options7.expires = date;
        }
        break;
      }
      case "max-age": {
        if (value3 === void 0) {
          break;
        }
        const maxAge = parseInt(value3, 10);
        if (!isNaN(maxAge)) {
          options7.maxAge = seconds(maxAge);
        }
        break;
      }
      case "path": {
        if (value3 === void 0) {
          break;
        }
        if (value3[0] === "/") {
          options7.path = value3;
        }
        break;
      }
      case "priority": {
        if (value3 === void 0) {
          break;
        }
        switch (value3.toLowerCase()) {
          case "low":
            options7.priority = "low";
            break;
          case "medium":
            options7.priority = "medium";
            break;
          case "high":
            options7.priority = "high";
            break;
        }
        break;
      }
      case "httponly": {
        options7.httpOnly = true;
        break;
      }
      case "secure": {
        options7.secure = true;
        break;
      }
      case "partitioned": {
        options7.partitioned = true;
        break;
      }
      case "samesite": {
        if (value3 === void 0) {
          break;
        }
        switch (value3.toLowerCase()) {
          case "lax":
            options7.sameSite = "lax";
            break;
          case "strict":
            options7.sameSite = "strict";
            break;
          case "none":
            options7.sameSite = "none";
            break;
        }
        break;
      }
    }
  }
  return some(Object.assign(Object.create(CookieProto), {
    name,
    value: value2,
    valueEncoded,
    options: Object.keys(options7).length > 0 ? options7 : void 0
  }));
}
var empty5 = fromIterable4([]);
var isEmpty = (self) => isEmptyRecord(self.cookies);
var fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
var CookieProto = {
  [CookieTypeId]: CookieTypeId,
  ...BaseProto,
  toJSON() {
    return {
      _id: "@effect/platform/Cookies/Cookie",
      name: this.name,
      value: this.value,
      options: this.options
    };
  }
};
function makeCookie(name, value2, options7) {
  if (!fieldContentRegExp.test(name)) {
    return left(new CookiesError({
      reason: "InvalidName"
    }));
  }
  const encodedValue = encodeURIComponent(value2);
  if (encodedValue && !fieldContentRegExp.test(encodedValue)) {
    return left(new CookiesError({
      reason: "InvalidValue"
    }));
  }
  if (options7 !== void 0) {
    if (options7.domain !== void 0 && !fieldContentRegExp.test(options7.domain)) {
      return left(new CookiesError({
        reason: "InvalidDomain"
      }));
    }
    if (options7.path !== void 0 && !fieldContentRegExp.test(options7.path)) {
      return left(new CookiesError({
        reason: "InvalidPath"
      }));
    }
    if (options7.maxAge !== void 0 && !isFinite(decode(options7.maxAge))) {
      return left(new CookiesError({
        reason: "InfinityMaxAge"
      }));
    }
  }
  return right(Object.assign(Object.create(CookieProto), {
    name,
    value: value2,
    valueEncoded: encodedValue,
    options: options7
  }));
}
var unsafeMakeCookie = (name, value2, options7) => getOrThrowWith(makeCookie(name, value2, options7), identity);
var setCookie = dual(2, (self, cookie) => fromReadonlyRecord(set(self.cookies, cookie.name, cookie)));
var setAllCookie = dual(2, (self, cookies) => {
  const record = {
    ...self.cookies
  };
  for (const cookie of cookies) {
    record[cookie.name] = cookie;
  }
  return fromReadonlyRecord(record);
});
var merge2 = dual(2, (self, that) => fromReadonlyRecord({
  ...self.cookies,
  ...that.cookies
}));
var remove2 = dual(2, (self, name) => fromReadonlyRecord(remove(self.cookies, name)));
var get5 = dual((args) => isCookies(args[0]), (self, name) => get(self.cookies, name));
var getValue = dual((args) => isCookies(args[0]), (self, name) => map2(get(self.cookies, name), (cookie) => cookie.value));
var set3 = dual((args) => isCookies(args[0]), (self, name, value2, options7) => map(makeCookie(name, value2, options7), (cookie) => fromReadonlyRecord(set(self.cookies, name, cookie))));
var unsafeSet = dual((args) => isCookies(args[0]), (self, name, value2, options7) => fromReadonlyRecord(set(self.cookies, name, unsafeMakeCookie(name, value2, options7))));
var setAll = dual(2, (self, cookies) => {
  const record = {
    ...self.cookies
  };
  for (const [name, value2, options7] of cookies) {
    const either = makeCookie(name, value2, options7);
    if (isLeft(either)) {
      return either;
    }
    record[name] = either.right;
  }
  return right(fromReadonlyRecord(record));
});
var unsafeSetAll = dual(2, (self, cookies) => getOrThrowWith(setAll(self, cookies), identity));
function serializeCookie(self) {
  let str = self.name + "=" + self.valueEncoded;
  if (self.options === void 0) {
    return str;
  }
  const options7 = self.options;
  if (options7.maxAge !== void 0) {
    const maxAge = toSeconds(options7.maxAge);
    str += "; Max-Age=" + Math.trunc(maxAge);
  }
  if (options7.domain !== void 0) {
    str += "; Domain=" + options7.domain;
  }
  if (options7.path !== void 0) {
    str += "; Path=" + options7.path;
  }
  if (options7.priority !== void 0) {
    switch (options7.priority) {
      case "low":
        str += "; Priority=Low";
        break;
      case "medium":
        str += "; Priority=Medium";
        break;
      case "high":
        str += "; Priority=High";
        break;
    }
  }
  if (options7.expires !== void 0) {
    str += "; Expires=" + options7.expires.toUTCString();
  }
  if (options7.httpOnly) {
    str += "; HttpOnly";
  }
  if (options7.secure) {
    str += "; Secure";
  }
  if (options7.partitioned) {
    str += "; Partitioned";
  }
  if (options7.sameSite !== void 0) {
    switch (options7.sameSite) {
      case "lax":
        str += "; SameSite=Lax";
        break;
      case "strict":
        str += "; SameSite=Strict";
        break;
      case "none":
        str += "; SameSite=None";
        break;
    }
  }
  return str;
}
var toCookieHeader = (self) => Object.values(self.cookies).map((cookie) => `${cookie.name}=${cookie.valueEncoded}`).join("; ");
var toRecord = (self) => {
  const record = {};
  const cookies = Object.values(self.cookies);
  for (let index = 0; index < cookies.length; index++) {
    const cookie = cookies[index];
    record[cookie.name] = cookie.value;
  }
  return record;
};
var toSetCookieHeaders = (self) => Object.values(self.cookies).map(serializeCookie);
function parseHeader(header) {
  const result = {};
  const strLen = header.length;
  let pos = 0;
  let terminatorPos = 0;
  while (true) {
    if (terminatorPos === strLen) break;
    terminatorPos = header.indexOf(";", pos);
    if (terminatorPos === -1) terminatorPos = strLen;
    let eqIdx = header.indexOf("=", pos);
    if (eqIdx === -1) break;
    if (eqIdx > terminatorPos) {
      pos = terminatorPos + 1;
      continue;
    }
    const key = header.substring(pos, eqIdx++).trim();
    if (result[key] === void 0) {
      const val = header.charCodeAt(eqIdx) === 34 ? header.substring(eqIdx + 1, terminatorPos - 1).trim() : header.substring(eqIdx, terminatorPos).trim();
      result[key] = !(val.indexOf("%") === -1) ? tryDecodeURIComponent(val) : val;
    }
    pos = terminatorPos + 1;
  }
  return result;
}
var tryDecodeURIComponent = (str) => {
  try {
    return decodeURIComponent(str);
  } catch {
    return str;
  }
};

// node_modules/@effect/platform/dist/esm/Etag.js
var Etag_exports = {};
__export(Etag_exports, {
  Generator: () => Generator,
  GeneratorTypeId: () => GeneratorTypeId2,
  layer: () => layer2,
  layerWeak: () => layerWeak2,
  toString: () => toString2
});

// node_modules/@effect/platform/dist/esm/internal/etag.js
var GeneratorTypeId = Symbol.for("@effect/platform/Etag/Generator");
var tag = GenericTag("@effect/platform/Etag/Generator");
var toString = (self) => {
  switch (self._tag) {
    case "Weak":
      return `W/"${self.value}"`;
    case "Strong":
      return `"${self.value}"`;
  }
};
var fromFileInfo = (info) => {
  const mtime = info.mtime._tag === "Some" ? info.mtime.value.getTime().toString(16) : "0";
  return `${info.size.toString(16)}-${mtime}`;
};
var fromFileWeb = (file5) => {
  return `${file5.size.toString(16)}-${file5.lastModified.toString(16)}`;
};
var layer = succeed3(tag, tag.of({
  [GeneratorTypeId]: GeneratorTypeId,
  fromFileInfo(info) {
    return sync(() => ({
      _tag: "Strong",
      value: fromFileInfo(info)
    }));
  },
  fromFileWeb(file5) {
    return sync(() => ({
      _tag: "Strong",
      value: fromFileWeb(file5)
    }));
  }
}));
var layerWeak = succeed3(tag, tag.of({
  [GeneratorTypeId]: GeneratorTypeId,
  fromFileInfo(info) {
    return sync(() => ({
      _tag: "Weak",
      value: fromFileInfo(info)
    }));
  },
  fromFileWeb(file5) {
    return sync(() => ({
      _tag: "Weak",
      value: fromFileWeb(file5)
    }));
  }
}));

// node_modules/@effect/platform/dist/esm/Etag.js
var toString2 = toString;
var GeneratorTypeId2 = GeneratorTypeId;
var Generator = tag;
var layer2 = layer;
var layerWeak2 = layerWeak;

// node_modules/@effect/platform/dist/esm/Headers.js
var Headers_exports = {};
__export(Headers_exports, {
  HeadersTypeId: () => HeadersTypeId,
  currentRedactedNames: () => currentRedactedNames,
  empty: () => empty6,
  fromInput: () => fromInput,
  get: () => get6,
  has: () => has,
  isHeaders: () => isHeaders,
  merge: () => merge3,
  redact: () => redact2,
  remove: () => remove3,
  schema: () => schema,
  schemaFromSelf: () => schemaFromSelf,
  set: () => set4,
  setAll: () => setAll2,
  unsafeFromRecord: () => unsafeFromRecord
});
var HeadersTypeId = Symbol.for("@effect/platform/Headers");
var isHeaders = (u) => hasProperty(u, HeadersTypeId);
var Proto2 = Object.assign(/* @__PURE__ */ Object.create(null), {
  [HeadersTypeId]: HeadersTypeId,
  [symbolRedactable](fiberRefs) {
    return redact2(this, getOrDefault(fiberRefs, currentRedactedNames));
  }
});
var make10 = (input) => Object.assign(Object.create(Proto2), input);
var schemaFromSelf = declare(isHeaders, {
  identifier: "Headers",
  equivalence: () => getEquivalence(Equivalence)
});
var schema = transform(Record({
  key: String$,
  value: String$
}), schemaFromSelf, {
  strict: true,
  decode: (record) => fromInput(record),
  encode: identity
});
var empty6 = Object.create(Proto2);
var fromInput = (input) => {
  if (input === void 0) {
    return empty6;
  } else if (Symbol.iterator in input) {
    const out2 = Object.create(Proto2);
    for (const [k, v] of input) {
      out2[k.toLowerCase()] = v;
    }
    return out2;
  }
  const out = Object.create(Proto2);
  for (const [k, v] of Object.entries(input)) {
    if (Array.isArray(v)) {
      out[k.toLowerCase()] = v.join(", ");
    } else if (v !== void 0) {
      out[k.toLowerCase()] = v;
    }
  }
  return out;
};
var unsafeFromRecord = (input) => Object.setPrototypeOf(input, Proto2);
var has = dual(2, (self, key) => key.toLowerCase() in self);
var get6 = dual(2, (self, key) => get(self, key.toLowerCase()));
var set4 = dual(3, (self, key, value2) => {
  const out = make10(self);
  out[key.toLowerCase()] = value2;
  return out;
});
var setAll2 = dual(2, (self, headers) => make10({
  ...self,
  ...fromInput(headers)
}));
var merge3 = dual(2, (self, headers) => {
  const out = make10(self);
  Object.assign(out, headers);
  return out;
});
var remove3 = dual(2, (self, key) => {
  const out = make10(self);
  const modify3 = (key2) => {
    if (typeof key2 === "string") {
      const k = key2.toLowerCase();
      if (k in self) {
        delete out[k];
      }
    } else {
      for (const name in self) {
        if (key2.test(name)) {
          delete out[name];
        }
      }
    }
  };
  if (Array.isArray(key)) {
    for (let i = 0; i < key.length; i++) {
      modify3(key[i]);
    }
  } else {
    modify3(key);
  }
  return out;
});
var redact2 = dual(2, (self, key) => {
  const out = {
    ...self
  };
  const modify3 = (key2) => {
    if (typeof key2 === "string") {
      const k = key2.toLowerCase();
      if (k in self) {
        out[k] = make8(self[k]);
      }
    } else {
      for (const name in self) {
        if (key2.test(name)) {
          out[name] = make8(self[name]);
        }
      }
    }
  };
  if (Array.isArray(key)) {
    for (let i = 0; i < key.length; i++) {
      modify3(key[i]);
    }
  } else {
    modify3(key);
  }
  return out;
});
var currentRedactedNames = globalValue("@effect/platform/Headers/currentRedactedNames", () => unsafeMake3(["authorization", "cookie", "set-cookie", "x-api-key"]));

// node_modules/@effect/platform/dist/esm/HttpClientError.js
var HttpClientError_exports = {};
__export(HttpClientError_exports, {
  RequestError: () => RequestError,
  ResponseError: () => ResponseError,
  TypeId: () => TypeId5,
  isHttpClientError: () => isHttpClientError
});

// node_modules/@effect/platform/dist/esm/internal/httpClientError.js
var TypeId4 = Symbol.for("@effect/platform/HttpClientError");

// node_modules/@effect/platform/dist/esm/HttpClientError.js
var TypeId5 = TypeId4;
var isHttpClientError = (u) => hasProperty(u, TypeId5);
var RequestError = class extends TypeIdError(TypeId5, "RequestError") {
  get methodAndUrl() {
    return `${this.request.method} ${this.request.url}`;
  }
  get message() {
    return this.description ? `${this.reason}: ${this.description} (${this.methodAndUrl})` : `${this.reason} error (${this.methodAndUrl})`;
  }
};
var ResponseError = class extends TypeIdError(TypeId5, "ResponseError") {
  get methodAndUrl() {
    return `${this.request.method} ${this.request.url}`;
  }
  get message() {
    const info = `${this.response.status} ${this.methodAndUrl}`;
    return this.description ? `${this.reason}: ${this.description} (${info})` : `${this.reason} error (${info})`;
  }
};

// node_modules/@effect/platform/dist/esm/FileSystem.js
var FileSystem_exports = {};
__export(FileSystem_exports, {
  FileDescriptor: () => FileDescriptor,
  FileSystem: () => FileSystem,
  FileTypeId: () => FileTypeId,
  GiB: () => GiB2,
  KiB: () => KiB2,
  MiB: () => MiB2,
  PiB: () => PiB2,
  Size: () => Size2,
  TiB: () => TiB2,
  WatchBackend: () => WatchBackend,
  WatchEventCreate: () => WatchEventCreate,
  WatchEventRemove: () => WatchEventRemove,
  WatchEventUpdate: () => WatchEventUpdate,
  isFile: () => isFile,
  layerNoop: () => layerNoop2,
  make: () => make12,
  makeNoop: () => makeNoop2
});

// node_modules/@effect/platform/dist/esm/internal/fileSystem.js
var tag2 = GenericTag("@effect/platform/FileSystem");
var Size = (bytes) => typeof bytes === "bigint" ? bytes : BigInt(bytes);
var KiB = (n) => Size(n * 1024);
var MiB = (n) => Size(n * 1024 * 1024);
var GiB = (n) => Size(n * 1024 * 1024 * 1024);
var TiB = (n) => Size(n * 1024 * 1024 * 1024 * 1024);
var bigint1024 = BigInt(1024);
var bigintPiB = bigint1024 * bigint1024 * bigint1024 * bigint1024 * bigint1024;
var PiB = (n) => Size(BigInt(n) * bigintPiB);
var make11 = (impl) => {
  return tag2.of({
    ...impl,
    exists: (path) => pipe(impl.access(path), as(true), catchTag("SystemError", (e) => e.reason === "NotFound" ? succeed2(false) : fail4(e))),
    readFileString: (path, encoding) => tryMap(impl.readFile(path), {
      try: (_) => new TextDecoder(encoding).decode(_),
      catch: (cause) => new BadArgument({
        module: "FileSystem",
        method: "readFileString",
        description: "invalid encoding",
        cause
      })
    }),
    stream: (path, options7) => pipe(impl.open(path, {
      flag: "r"
    }), options7?.offset ? tap((file5) => file5.seek(options7.offset, "start")) : identity, map5((file5) => stream(file5, options7)), unwrapScoped4),
    sink: (path, options7) => pipe(impl.open(path, {
      flag: "w",
      ...options7
    }), map5((file5) => forEach3((_) => file5.writeAll(_))), unwrapScoped3),
    writeFileString: (path, data, options7) => flatMap2(try_({
      try: () => new TextEncoder().encode(data),
      catch: (cause) => new BadArgument({
        module: "FileSystem",
        method: "writeFileString",
        description: "could not encode string",
        cause
      })
    }), (_) => impl.writeFile(path, _, options7))
  });
};
var notFound = (method, path) => new SystemError({
  module: "FileSystem",
  method,
  reason: "NotFound",
  description: "No such file or directory",
  pathOrDescriptor: path
});
var makeNoop = (fileSystem) => {
  return {
    access(path) {
      return fail4(notFound("access", path));
    },
    chmod(path) {
      return fail4(notFound("chmod", path));
    },
    chown(path) {
      return fail4(notFound("chown", path));
    },
    copy(path) {
      return fail4(notFound("copy", path));
    },
    copyFile(path) {
      return fail4(notFound("copyFile", path));
    },
    exists() {
      return succeed2(false);
    },
    link(path) {
      return fail4(notFound("link", path));
    },
    makeDirectory() {
      return die2("not implemented");
    },
    makeTempDirectory() {
      return die2("not implemented");
    },
    makeTempDirectoryScoped() {
      return die2("not implemented");
    },
    makeTempFile() {
      return die2("not implemented");
    },
    makeTempFileScoped() {
      return die2("not implemented");
    },
    open(path) {
      return fail4(notFound("open", path));
    },
    readDirectory(path) {
      return fail4(notFound("readDirectory", path));
    },
    readFile(path) {
      return fail4(notFound("readFile", path));
    },
    readFileString(path) {
      return fail4(notFound("readFileString", path));
    },
    readLink(path) {
      return fail4(notFound("readLink", path));
    },
    realPath(path) {
      return fail4(notFound("realPath", path));
    },
    remove() {
      return _void;
    },
    rename(oldPath) {
      return fail4(notFound("rename", oldPath));
    },
    sink(path) {
      return fail6(notFound("sink", path));
    },
    stat(path) {
      return fail4(notFound("stat", path));
    },
    stream(path) {
      return fail7(notFound("stream", path));
    },
    symlink(fromPath) {
      return fail4(notFound("symlink", fromPath));
    },
    truncate(path) {
      return fail4(notFound("truncate", path));
    },
    utimes(path) {
      return fail4(notFound("utimes", path));
    },
    watch(path) {
      return fail7(notFound("watch", path));
    },
    writeFile(path) {
      return fail4(notFound("writeFile", path));
    },
    writeFileString(path) {
      return fail4(notFound("writeFileString", path));
    },
    ...fileSystem
  };
};
var layerNoop = (fileSystem) => succeed3(tag2, makeNoop(fileSystem));
var stream = (file5, {
  bufferSize = 16,
  bytesToRead: bytesToRead_,
  chunkSize: chunkSize_ = Size(64 * 1024)
} = {}) => {
  const bytesToRead = bytesToRead_ !== void 0 ? Size(bytesToRead_) : void 0;
  const chunkSize = Size(chunkSize_);
  function loop(totalBytesRead) {
    if (bytesToRead !== void 0 && bytesToRead <= totalBytesRead) {
      return void_2;
    }
    const toRead = bytesToRead !== void 0 && bytesToRead - totalBytesRead < chunkSize ? bytesToRead - totalBytesRead : chunkSize;
    return flatMap3(file5.readAlloc(toRead), match2({
      onNone: () => void_2,
      onSome: (buf) => flatMap3(write(of(buf)), (_) => loop(totalBytesRead + BigInt(buf.length)))
    }));
  }
  return bufferChunks(fromChannel(loop(BigInt(0))), {
    capacity: bufferSize
  });
};

// node_modules/@effect/platform/dist/esm/FileSystem.js
var Size2 = Size;
var KiB2 = KiB;
var MiB2 = MiB;
var GiB2 = GiB;
var TiB2 = TiB;
var PiB2 = PiB;
var FileSystem = tag2;
var make12 = make11;
var makeNoop2 = makeNoop;
var layerNoop2 = layerNoop;
var FileTypeId = Symbol.for("@effect/platform/FileSystem/File");
var isFile = (u) => typeof u === "object" && u !== null && FileTypeId in u;
var FileDescriptor = nominal();
var WatchEventCreate = tagged("Create");
var WatchEventUpdate = tagged("Update");
var WatchEventRemove = tagged("Remove");
var WatchBackend = class extends Tag("@effect/platform/FileSystem/WatchBackend")() {
};

// node_modules/@effect/platform/dist/esm/UrlParams.js
var UrlParams_exports = {};
__export(UrlParams_exports, {
  append: () => append3,
  appendAll: () => appendAll3,
  empty: () => empty7,
  fromInput: () => fromInput2,
  getAll: () => getAll,
  getFirst: () => getFirst,
  getLast: () => getLast,
  makeUrl: () => makeUrl,
  remove: () => remove4,
  schemaFromSelf: () => schemaFromSelf2,
  schemaFromString: () => schemaFromString,
  schemaJson: () => schemaJson,
  schemaParse: () => schemaParse,
  schemaRecord: () => schemaRecord,
  schemaStruct: () => schemaStruct,
  set: () => set5,
  setAll: () => setAll3,
  toRecord: () => toRecord2,
  toString: () => toString3
});
var fromInput2 = (input) => {
  const parsed = fromInputNested(input);
  const out = [];
  for (let i = 0; i < parsed.length; i++) {
    if (Array.isArray(parsed[i][0])) {
      const [keys, value2] = parsed[i];
      out.push([`${keys[0]}[${keys.slice(1).join("][")}]`, value2]);
    } else {
      out.push(parsed[i]);
    }
  }
  return out;
};
var fromInputNested = (input) => {
  const entries = Symbol.iterator in input ? fromIterable(input) : Object.entries(input);
  const out = [];
  for (const [key, value2] of entries) {
    if (Array.isArray(value2)) {
      for (let i = 0; i < value2.length; i++) {
        if (value2[i] !== void 0) {
          out.push([key, String(value2[i])]);
        }
      }
    } else if (typeof value2 === "object") {
      const nested = fromInputNested(value2);
      for (const [k, v] of nested) {
        out.push([[key, ...typeof k === "string" ? [k] : k], v]);
      }
    } else if (value2 !== void 0) {
      out.push([key, String(value2)]);
    }
  }
  return out;
};
var schemaFromSelf2 = Array$(Tuple(String$, String$)).annotations({
  identifier: "UrlParams"
});
var empty7 = [];
var getAll = dual(2, (self, key) => reduce(self, [], (acc, [k, value2]) => {
  if (k === key) {
    acc.push(value2);
  }
  return acc;
}));
var getFirst = dual(2, (self, key) => map2(findFirst(self, ([k]) => k === key), ([, value2]) => value2));
var getLast = dual(2, (self, key) => map2(findLast(self, ([k]) => k === key), ([, value2]) => value2));
var set5 = dual(3, (self, key, value2) => append(filter2(self, ([k]) => k !== key), [key, String(value2)]));
var setAll3 = dual(2, (self, input) => {
  const toSet = fromInput2(input);
  const keys = toSet.map(([k]) => k);
  return appendAll(filter2(self, ([k]) => keys.includes(k)), toSet);
});
var append3 = dual(3, (self, key, value2) => append(self, [key, String(value2)]));
var appendAll3 = dual(2, (self, input) => appendAll(self, fromInput2(input)));
var remove4 = dual(2, (self, key) => filter2(self, ([k]) => k !== key));
var makeUrl = (url, params3, hash) => {
  try {
    const urlInstance = new URL(url, baseUrl());
    for (let i = 0; i < params3.length; i++) {
      const [key, value2] = params3[i];
      if (value2 !== void 0) {
        urlInstance.searchParams.append(key, value2);
      }
    }
    if (hash._tag === "Some") {
      urlInstance.hash = hash.value;
    }
    return right(urlInstance);
  } catch (e) {
    return left(e);
  }
};
var toString3 = (self) => new URLSearchParams(self).toString();
var baseUrl = () => {
  if ("location" in globalThis && globalThis.location !== void 0 && globalThis.location.origin !== void 0 && globalThis.location.pathname !== void 0) {
    return location.origin + location.pathname;
  }
  return void 0;
};
var toRecord2 = (self) => {
  const out = /* @__PURE__ */ Object.create(null);
  for (const [k, value2] of self) {
    const curr = out[k];
    if (curr === void 0) {
      out[k] = value2;
    } else if (typeof curr === "string") {
      out[k] = [curr, value2];
    } else {
      curr.push(value2);
    }
  }
  return {
    ...out
  };
};
var schemaJson = (schema4, options7) => {
  const parse3 = decodeUnknown(parseJson(schema4), options7);
  return dual(2, (self, field) => parse3(getOrElse(getLast(self, field), () => "")));
};
var schemaStruct = (schema4, options7) => (self) => {
  const parse3 = decodeUnknown(schema4, options7);
  return parse3(toRecord2(self));
};
var schemaFromString = transform(String$, schemaFromSelf2, {
  decode(fromA) {
    return fromInput2(new URLSearchParams(fromA));
  },
  encode(toI) {
    return toString3(toI);
  }
});
var schemaRecord = (schema4) => transform(schemaFromSelf2, schema4, {
  decode(fromA) {
    return toRecord2(fromA);
  },
  encode(toI) {
    return fromInput2(toI);
  }
});
var schemaParse = (schema4) => compose2(schemaFromString, schemaRecord(schema4));

// node_modules/@effect/platform/dist/esm/HttpIncomingMessage.js
var HttpIncomingMessage_exports = {};
__export(HttpIncomingMessage_exports, {
  MaxBodySize: () => MaxBodySize,
  TypeId: () => TypeId6,
  inspect: () => inspect,
  schemaBodyJson: () => schemaBodyJson,
  schemaBodyUrlParams: () => schemaBodyUrlParams,
  schemaHeaders: () => schemaHeaders,
  withMaxBodySize: () => withMaxBodySize
});
var TypeId6 = Symbol.for("@effect/platform/HttpIncomingMessage");
var schemaBodyJson = (schema4, options7) => {
  const parse3 = decodeUnknown(schema4, options7);
  return (self) => flatMap2(self.json, parse3);
};
var schemaBodyUrlParams = (schema4, options7) => {
  const decode5 = schemaStruct(schema4, options7);
  return (self) => flatMap2(self.urlParamsBody, decode5);
};
var schemaHeaders = (schema4, options7) => {
  const parse3 = decodeUnknown(schema4, options7);
  return (self) => parse3(self.headers);
};
var MaxBodySize = class extends Reference()("@effect/platform/HttpIncomingMessage/MaxBodySize", {
  defaultValue: none
}) {
};
var withMaxBodySize = dual(2, (effect2, size) => provideService(effect2, MaxBodySize, map2(size, Size2)));
var inspect = (self, that) => {
  const contentType = self.headers["content-type"] ?? "";
  let body;
  if (contentType.includes("application/json")) {
    try {
      body = runSync(self.json);
    } catch {
    }
  } else if (contentType.includes("text/") || contentType.includes("urlencoded")) {
    try {
      body = runSync(self.text);
    } catch {
    }
  }
  const obj = {
    ...that,
    headers: redact(self.headers),
    remoteAddress: self.remoteAddress.toJSON()
  };
  if (body !== void 0) {
    obj.body = body;
  }
  return obj;
};

// node_modules/@effect/platform/dist/esm/HttpTraceContext.js
var HttpTraceContext_exports = {};
__export(HttpTraceContext_exports, {
  b3: () => b3,
  fromHeaders: () => fromHeaders,
  toHeaders: () => toHeaders,
  w3c: () => w3c,
  xb3: () => xb3
});
var toHeaders = (span) => unsafeFromRecord({
  b3: `${span.traceId}-${span.spanId}-${span.sampled ? "1" : "0"}${span.parent._tag === "Some" ? `-${span.parent.value.spanId}` : ""}`,
  traceparent: `00-${span.traceId}-${span.spanId}-${span.sampled ? "01" : "00"}`
});
var fromHeaders = (headers) => {
  let span = w3c(headers);
  if (span._tag === "Some") {
    return span;
  }
  span = b3(headers);
  if (span._tag === "Some") {
    return span;
  }
  return xb3(headers);
};
var b3 = (headers) => {
  if (!("b3" in headers)) {
    return none();
  }
  const parts = headers["b3"].split("-");
  if (parts.length < 2) {
    return none();
  }
  return some(externalSpan({
    traceId: parts[0],
    spanId: parts[1],
    sampled: parts[2] ? parts[2] === "1" : true
  }));
};
var xb3 = (headers) => {
  if (!headers["x-b3-traceid"] || !headers["x-b3-spanid"]) {
    return none();
  }
  return some(externalSpan({
    traceId: headers["x-b3-traceid"],
    spanId: headers["x-b3-spanid"],
    sampled: headers["x-b3-sampled"] ? headers["x-b3-sampled"] === "1" : true
  }));
};
var w3cTraceId = /^[0-9a-f]{32}$/i;
var w3cSpanId = /^[0-9a-f]{16}$/i;
var w3c = (headers) => {
  if (!headers["traceparent"]) {
    return none();
  }
  const parts = headers["traceparent"].split("-");
  if (parts.length !== 4) {
    return none();
  }
  const [version, traceId, spanId, flags] = parts;
  switch (version) {
    case "00": {
      if (w3cTraceId.test(traceId) === false || w3cSpanId.test(spanId) === false) {
        return none();
      }
      return some(externalSpan({
        traceId,
        spanId,
        sampled: (parseInt(flags, 16) & 1) === 1
      }));
    }
    default: {
      return none();
    }
  }
};

// node_modules/@effect/platform/dist/esm/HttpApiSchema.js
var HttpApiSchema_exports = {};
__export(HttpApiSchema_exports, {
  Accepted: () => Accepted,
  AnnotationEmptyDecodeable: () => AnnotationEmptyDecodeable,
  AnnotationEncoding: () => AnnotationEncoding,
  AnnotationMultipart: () => AnnotationMultipart,
  AnnotationMultipartStream: () => AnnotationMultipartStream,
  AnnotationParam: () => AnnotationParam,
  AnnotationStatus: () => AnnotationStatus,
  Created: () => Created,
  Empty: () => Empty,
  EmptyError: () => EmptyError,
  Multipart: () => Multipart,
  MultipartStream: () => MultipartStream,
  MultipartStreamTypeId: () => MultipartStreamTypeId,
  MultipartTypeId: () => MultipartTypeId,
  NoContent: () => NoContent,
  Text: () => Text,
  Uint8Array: () => Uint8Array2,
  UnionUnify: () => UnionUnify,
  UnionUnifyAST: () => UnionUnifyAST,
  annotations: () => annotations2,
  asEmpty: () => asEmpty,
  deunionize: () => deunionize,
  extractAnnotations: () => extractAnnotations,
  extractUnionTypes: () => extractUnionTypes,
  getEmptyDecodeable: () => getEmptyDecodeable,
  getEncoding: () => getEncoding,
  getMultipart: () => getMultipart,
  getMultipartStream: () => getMultipartStream,
  getParam: () => getParam,
  getStatus: () => getStatus,
  getStatusError: () => getStatusError,
  getStatusErrorAST: () => getStatusErrorAST,
  getStatusSuccess: () => getStatusSuccess,
  getStatusSuccessAST: () => getStatusSuccessAST,
  isVoid: () => isVoid,
  param: () => param,
  withEncoding: () => withEncoding
});
var AnnotationMultipart = Symbol.for("@effect/platform/HttpApiSchema/AnnotationMultipart");
var AnnotationMultipartStream = Symbol.for("@effect/platform/HttpApiSchema/AnnotationMultipartStream");
var AnnotationStatus = Symbol.for("@effect/platform/HttpApiSchema/AnnotationStatus");
var AnnotationEmptyDecodeable = Symbol.for("@effect/platform/HttpApiSchema/AnnotationEmptyDecodeable");
var AnnotationEncoding = Symbol.for("@effect/platform/HttpApiSchema/AnnotationEncoding");
var AnnotationParam = Symbol.for("@effect/platform/HttpApiSchema/AnnotationParam");
var extractAnnotations = (ast) => {
  const result = {};
  if (AnnotationStatus in ast) {
    result[AnnotationStatus] = ast[AnnotationStatus];
  }
  if (AnnotationEmptyDecodeable in ast) {
    result[AnnotationEmptyDecodeable] = ast[AnnotationEmptyDecodeable];
  }
  if (AnnotationEncoding in ast) {
    result[AnnotationEncoding] = ast[AnnotationEncoding];
  }
  if (AnnotationParam in ast) {
    result[AnnotationParam] = ast[AnnotationParam];
  }
  if (AnnotationMultipart in ast) {
    result[AnnotationMultipart] = ast[AnnotationMultipart];
  }
  if (AnnotationMultipartStream in ast) {
    result[AnnotationMultipartStream] = ast[AnnotationMultipartStream];
  }
  return result;
};
var mergedAnnotations = (ast) => ast._tag === "Transformation" ? {
  ...ast.to.annotations,
  ...ast.annotations
} : ast.annotations;
var getAnnotation = (ast, key) => mergedAnnotations(ast)[key];
var getStatus = (ast, defaultStatus) => getAnnotation(ast, AnnotationStatus) ?? defaultStatus;
var getEmptyDecodeable = (ast) => getAnnotation(ast, AnnotationEmptyDecodeable) ?? false;
var getMultipart = (ast) => getAnnotation(ast, AnnotationMultipart);
var getMultipartStream = (ast) => getAnnotation(ast, AnnotationMultipartStream);
var encodingJson = {
  kind: "Json",
  contentType: "application/json"
};
var getEncoding = (ast, fallback = encodingJson) => getAnnotation(ast, AnnotationEncoding) ?? fallback;
var getParam = (ast) => {
  const annotations4 = ast._tag === "PropertySignatureTransformation" ? ast.to.annotations : ast.annotations;
  return annotations4[AnnotationParam]?.name;
};
var annotations2 = (annotations4) => {
  const result = omit2(annotations4, "status");
  if (annotations4.status !== void 0) {
    result[AnnotationStatus] = annotations4.status;
  }
  return result;
};
var isVoid = (ast) => {
  switch (ast._tag) {
    case "VoidKeyword": {
      return true;
    }
    case "Transformation": {
      return isVoid(ast.from);
    }
    case "Suspend": {
      return isVoid(ast.f());
    }
    default: {
      return false;
    }
  }
};
var getStatusSuccessAST = (ast) => getStatus(ast, isVoid(ast) ? 204 : 200);
var getStatusSuccess = (self) => getStatusSuccessAST(self.ast);
var getStatusErrorAST = (ast) => getStatus(ast, 500);
var getStatusError = (self) => getStatusErrorAST(self.ast);
var extractUnionTypes = (ast) => {
  function process(ast2) {
    if (isUnion(ast2)) {
      for (const type of ast2.types) {
        process(type);
      }
    } else {
      out.push(ast2);
    }
  }
  const out = [];
  process(ast);
  return out;
};
var UnionUnifyAST = (self, that) => Union.make(Array.from(/* @__PURE__ */ new Set([...extractUnionTypes(self), ...extractUnionTypes(that)])));
var UnionUnify = (self, that) => make9(UnionUnifyAST(self.ast, that.ast));
var param = dual(2, (name, schema4) => schema4.annotations({
  [AnnotationParam]: {
    name,
    schema: schema4
  }
}));
var Empty = (status) => Void.annotations(annotations2({
  status
}));
var asEmpty = dual(2, (self, options7) => transform(Void.annotations(self.ast.annotations), typeSchema(self), {
  decode: options7.decode,
  encode: constVoid
}).annotations(annotations2({
  status: options7.status,
  [AnnotationEmptyDecodeable]: true
})));
var Created = Empty(201);
var Accepted = Empty(202);
var NoContent = Empty(204);
var MultipartTypeId = Symbol.for("@effect/platform/HttpApiSchema/Multipart");
var Multipart = (self, options7) => self.annotations({
  [AnnotationMultipart]: options7 ?? {}
});
var MultipartStreamTypeId = Symbol.for("@effect/platform/HttpApiSchema/MultipartStream");
var MultipartStream = (self, options7) => self.annotations({
  [AnnotationMultipartStream]: options7 ?? {}
});
var defaultContentType = (encoding) => {
  switch (encoding) {
    case "Json": {
      return "application/json";
    }
    case "UrlParams": {
      return "application/x-www-form-urlencoded";
    }
    case "Uint8Array": {
      return "application/octet-stream";
    }
    case "Text": {
      return "text/plain";
    }
  }
};
var withEncoding = dual(2, (self, options7) => self.annotations({
  [AnnotationEncoding]: {
    kind: options7.kind,
    contentType: options7.contentType ?? defaultContentType(options7.kind)
  },
  ...options7.kind === "Uint8Array" ? {
    jsonSchema: {
      type: "string",
      format: "binary"
    }
  } : void 0
}));
var Text = (options7) => withEncoding(String$, {
  kind: "Text",
  ...options7
});
var Uint8Array2 = (options7) => withEncoding(Uint8ArrayFromSelf, {
  kind: "Uint8Array",
  ...options7
});
var astCache = globalValue("@effect/platform/HttpApiSchema/astCache", () => /* @__PURE__ */ new WeakMap());
var deunionize = (schemas, schema4) => {
  if (astCache.has(schema4.ast)) {
    schemas.add(astCache.get(schema4.ast));
    return;
  }
  const ast = schema4.ast;
  if (ast._tag === "Union") {
    for (const astType of ast.types) {
      if (astCache.has(astType)) {
        schemas.add(astCache.get(astType));
        continue;
      }
      const memberSchema = make9(annotations(astType, {
        ...ast.annotations,
        ...astType.annotations
      }));
      astCache.set(astType, memberSchema);
      schemas.add(memberSchema);
    }
  } else {
    astCache.set(ast, schema4);
    schemas.add(schema4);
  }
};
var EmptyError = () => (options7) => {
  const symbol2 = Symbol.for(`@effect/platform/HttpApiSchema/EmptyError/${options7.tag}`);
  class EmptyError2 extends StructuralClass {
    _tag = options7.tag;
    commit() {
      return fail4(this);
    }
  }
  ;
  EmptyError2.prototype[symbol2] = symbol2;
  Object.assign(EmptyError2, {
    [TypeId]: Void[TypeId],
    pipe: Void.pipe,
    annotations(annotations4) {
      return make9(this.ast).annotations(annotations4);
    }
  });
  let transform6;
  Object.defineProperty(EmptyError2, "ast", {
    get() {
      if (transform6) {
        return transform6.ast;
      }
      const self = this;
      transform6 = asEmpty(declare((u) => hasProperty(u, symbol2), {
        identifier: options7.tag,
        title: options7.tag
      }), {
        status: options7.status,
        decode: constant(new self())
      });
      return transform6.ast;
    }
  });
  return EmptyError2;
};

// node_modules/@effect/platform/dist/esm/HttpApiError.js
var HttpApiError_exports = {};
__export(HttpApiError_exports, {
  BadRequest: () => BadRequest,
  Conflict: () => Conflict,
  Forbidden: () => Forbidden2,
  Gone: () => Gone,
  HttpApiDecodeError: () => HttpApiDecodeError,
  InternalServerError: () => InternalServerError,
  Issue: () => Issue,
  MethodNotAllowed: () => MethodNotAllowed,
  NotAcceptable: () => NotAcceptable,
  NotFound: () => NotFound,
  NotImplemented: () => NotImplemented,
  RequestTimeout: () => RequestTimeout,
  ServiceUnavailable: () => ServiceUnavailable,
  TypeId: () => TypeId7,
  Unauthorized: () => Unauthorized
});
var TypeId7 = Symbol.for("@effect/platform/HttpApiError");
var Issue = class extends ArrayFormatterIssue.annotations({
  identifier: "Issue",
  description: "Represents an error encountered while parsing a value to match the schema"
}) {
};
var HttpApiDecodeError = class _HttpApiDecodeError extends TaggedError2()("HttpApiDecodeError", {
  issues: Array$(Issue),
  message: String$
}, annotations2({
  status: 400,
  description: "The request did not match the expected schema"
})) {
  /**
   * @since 1.0.0
   */
  static fromParseError(error) {
    return ArrayFormatter.formatError(error).pipe(zip(TreeFormatter.formatError(error)), map5(([issues, message]) => new _HttpApiDecodeError({
      issues,
      message
    })));
  }
  /**
   * @since 1.0.0
   */
  static refailParseError(error) {
    return flatMap2(_HttpApiDecodeError.fromParseError(error), fail4);
  }
};
var BadRequest = class extends EmptyError()({
  tag: "BadRequest",
  status: 400
}) {
};
var Unauthorized = class extends EmptyError()({
  tag: "Unauthorized",
  status: 401
}) {
};
var Forbidden2 = class extends EmptyError()({
  tag: "Forbidden",
  status: 403
}) {
};
var NotFound = class extends EmptyError()({
  tag: "NotFound",
  status: 404
}) {
};
var MethodNotAllowed = class extends EmptyError()({
  tag: "MethodNotAllowed",
  status: 405
}) {
};
var NotAcceptable = class extends EmptyError()({
  tag: "NotAcceptable",
  status: 406
}) {
};
var RequestTimeout = class extends EmptyError()({
  tag: "RequestTimeout",
  status: 408
}) {
};
var Conflict = class extends EmptyError()({
  tag: "Conflict",
  status: 409
}) {
};
var Gone = class extends EmptyError()({
  tag: "Gone",
  status: 410
}) {
};
var InternalServerError = class extends EmptyError()({
  tag: "InternalServerError",
  status: 500
}) {
};
var NotImplemented = class extends EmptyError()({
  tag: "NotImplemented",
  status: 501
}) {
};
var ServiceUnavailable = class extends EmptyError()({
  tag: "ServiceUnavailable",
  status: 503
}) {
};

// node_modules/@effect/platform/dist/esm/HttpApi.js
var HttpApi_exports = {};
__export(HttpApi_exports, {
  AdditionalSchemas: () => AdditionalSchemas,
  Api: () => Api,
  TypeId: () => TypeId8,
  isHttpApi: () => isHttpApi,
  make: () => make13,
  reflect: () => reflect
});
var TypeId8 = Symbol.for("@effect/platform/HttpApi");
var isHttpApi = (u) => hasProperty(u, TypeId8);
var Api = class extends Tag("@effect/platform/HttpApi/Api")() {
};
var Proto3 = {
  [TypeId8]: TypeId8,
  pipe() {
    return pipeArguments(this, arguments);
  },
  add(group2) {
    return makeProto({
      identifier: this.identifier,
      groups: set(this.groups, group2.identifier, group2),
      errorSchema: this.errorSchema,
      annotations: this.annotations,
      middlewares: this.middlewares
    });
  },
  addHttpApi(api2) {
    const newGroups = {
      ...this.groups
    };
    for (const key in api2.groups) {
      const newGroup = api2.groups[key].annotateContext(empty2());
      newGroup.annotations = merge(api2.annotations, newGroup.annotations);
      newGroup.middlewares = /* @__PURE__ */ new Set([...api2.middlewares, ...newGroup.middlewares]);
      newGroups[key] = newGroup;
    }
    return makeProto({
      identifier: this.identifier,
      groups: newGroups,
      errorSchema: UnionUnify(this.errorSchema, api2.errorSchema),
      annotations: this.annotations,
      middlewares: this.middlewares
    });
  },
  addError(schema4, annotations4) {
    return makeProto({
      identifier: this.identifier,
      groups: this.groups,
      errorSchema: UnionUnify(this.errorSchema, annotations4?.status ? schema4.annotations(annotations2({
        status: annotations4.status
      })) : schema4),
      annotations: this.annotations,
      middlewares: this.middlewares
    });
  },
  prefix(prefix) {
    return makeProto({
      identifier: this.identifier,
      groups: map3(this.groups, (group2) => group2.prefix(prefix)),
      errorSchema: this.errorSchema,
      annotations: this.annotations,
      middlewares: this.middlewares
    });
  },
  middleware(tag5) {
    return makeProto({
      identifier: this.identifier,
      groups: this.groups,
      errorSchema: UnionUnify(this.errorSchema, tag5.failure),
      annotations: this.annotations,
      middlewares: /* @__PURE__ */ new Set([...this.middlewares, tag5])
    });
  },
  annotate(tag5, value2) {
    return makeProto({
      identifier: this.identifier,
      groups: this.groups,
      errorSchema: this.errorSchema,
      annotations: add(this.annotations, tag5, value2),
      middlewares: this.middlewares
    });
  },
  annotateContext(context2) {
    return makeProto({
      identifier: this.identifier,
      groups: this.groups,
      errorSchema: this.errorSchema,
      annotations: merge(this.annotations, context2),
      middlewares: this.middlewares
    });
  }
};
var makeProto = (options7) => {
  function HttpApi() {
  }
  Object.setPrototypeOf(HttpApi, Proto3);
  HttpApi.groups = options7.groups;
  HttpApi.errorSchema = options7.errorSchema;
  HttpApi.annotations = options7.annotations;
  HttpApi.middlewares = options7.middlewares;
  return HttpApi;
};
var make13 = (identifier) => makeProto({
  identifier,
  groups: /* @__PURE__ */ new Map(),
  errorSchema: HttpApiDecodeError,
  annotations: empty2(),
  middlewares: /* @__PURE__ */ new Set()
});
var reflect = (self, options7) => {
  const apiErrors = extractMembers(self.errorSchema.ast, /* @__PURE__ */ new Map(), getStatusErrorAST);
  const groups = Object.values(self.groups);
  for (const group2 of groups) {
    const groupErrors = extractMembers(group2.errorSchema.ast, apiErrors, getStatusErrorAST);
    const groupAnnotations = merge(self.annotations, group2.annotations);
    options7.onGroup({
      group: group2,
      mergedAnnotations: groupAnnotations
    });
    const endpoints = Object.values(group2.endpoints);
    for (const endpoint of endpoints) {
      if (options7.predicate && !options7.predicate({
        endpoint,
        group: group2
      })) continue;
      const errors2 = extractMembers(endpoint.errorSchema.ast, groupErrors, getStatusErrorAST);
      options7.onEndpoint({
        group: group2,
        endpoint,
        middleware: /* @__PURE__ */ new Set([...group2.middlewares, ...endpoint.middlewares]),
        mergedAnnotations: merge(groupAnnotations, endpoint.annotations),
        payloads: endpoint.payloadSchema._tag === "Some" ? extractPayloads(endpoint.payloadSchema.value.ast) : emptyMap,
        successes: extractMembers(endpoint.successSchema.ast, /* @__PURE__ */ new Map(), getStatusSuccessAST),
        errors: errors2
      });
    }
  }
};
var emptyMap = /* @__PURE__ */ new Map();
var extractMembers = (ast, inherited, getStatus2) => {
  const members = new Map(inherited);
  function process(type) {
    if (isNeverKeyword(type)) {
      return;
    }
    const annotations4 = extractAnnotations(ast.annotations);
    if (!isEmptyRecord(annotations4)) {
      type = annotations(type, {
        ...annotations4,
        ...type.annotations
      });
    }
    const status = getStatus2(type);
    const emptyDecodeable = getEmptyDecodeable(type);
    const current = members.get(status);
    members.set(status, {
      description: (current ? current.description : none()).pipe(orElse(() => getDescriptionOrIdentifier(type))),
      ast: (current ? current.ast : none()).pipe(
        // Deduplicate the ASTs
        map2((current2) => UnionUnifyAST(current2, type)),
        orElse(() => !emptyDecodeable && isVoidKeyword(encodedAST(type)) ? none() : some(type))
      )
    });
  }
  extractUnionTypes(ast).forEach(process);
  return members;
};
var extractPayloads = (topAst) => {
  const members = /* @__PURE__ */ new Map();
  function process(ast) {
    if (ast._tag === "NeverKeyword") {
      return;
    }
    ast = annotations(ast, {
      ...extractAnnotations(topAst.annotations),
      ...ast.annotations
    });
    const encoding = getEncoding(ast);
    const contentType = getMultipart(ast) || getMultipartStream(ast) ? "multipart/form-data" : encoding.contentType;
    const current = members.get(contentType);
    if (current === void 0) {
      members.set(contentType, {
        encoding,
        ast
      });
    } else {
      current.ast = Union.make([current.ast, ast]);
    }
  }
  if (topAst._tag === "Union") {
    for (const type of topAst.types) {
      process(type);
    }
  } else {
    process(topAst);
  }
  return members;
};
var getDescriptionOrIdentifier = (ast) => {
  const annotations4 = "to" in ast ? {
    ...ast.to.annotations,
    ...ast.annotations
  } : ast.annotations;
  return fromNullable(annotations4[DescriptionAnnotationId] ?? annotations4[IdentifierAnnotationId]);
};
var AdditionalSchemas = class extends Tag("@effect/platform/HttpApi/AdditionalSchemas")() {
};

// node_modules/@effect/platform/dist/esm/HttpApiMiddleware.js
var HttpApiMiddleware_exports = {};
__export(HttpApiMiddleware_exports, {
  SecurityTypeId: () => SecurityTypeId,
  Tag: () => Tag2,
  TypeId: () => TypeId9,
  isSecurity: () => isSecurity
});
var TypeId9 = Symbol.for("@effect/platform/HttpApiMiddleware");
var SecurityTypeId = Symbol.for("@effect/platform/HttpApiMiddleware/Security");
var isSecurity = (u) => hasProperty(u, SecurityTypeId);
var Tag2 = () => (id, options7) => {
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
  TagClass_[TypeId9] = TypeId9;
  TagClass_.failure = options7?.optional === true || options7?.failure === void 0 ? Never : options7.failure;
  if (options7?.provides) {
    TagClass_.provides = options7.provides;
  }
  TagClass_.optional = options7?.optional ?? false;
  if (options7?.security) {
    if (Object.keys(options7.security).length === 0) {
      throw new Error("HttpApiMiddleware.Tag: security object must not be empty");
    }
    TagClass_[SecurityTypeId] = SecurityTypeId;
    TagClass_.security = options7.security;
  }
  return TagClass;
};

// node_modules/@effect/platform/dist/esm/HttpBody.js
var HttpBody_exports = {};
__export(HttpBody_exports, {
  ErrorTypeId: () => ErrorTypeId3,
  HttpBodyError: () => HttpBodyError2,
  TypeId: () => TypeId11,
  empty: () => empty9,
  file: () => file2,
  fileInfo: () => fileInfo2,
  fileWeb: () => fileWeb2,
  formData: () => formData2,
  formDataRecord: () => formDataRecord2,
  isHttpBody: () => isHttpBody,
  json: () => json2,
  jsonSchema: () => jsonSchema2,
  raw: () => raw2,
  stream: () => stream3,
  text: () => text2,
  uint8Array: () => uint8Array2,
  unsafeJson: () => unsafeJson2,
  urlParams: () => urlParams2
});

// node_modules/@effect/platform/dist/esm/internal/httpBody.js
var TypeId10 = Symbol.for("@effect/platform/HttpBody");
var ErrorTypeId2 = Symbol.for("@effect/platform/HttpBody/HttpBodyError");
var bodyError = tagged("HttpBodyError");
var HttpBodyError = (reason) => bodyError({
  [ErrorTypeId2]: ErrorTypeId2,
  reason
});
var BodyBase = class {
  [TypeId10];
  constructor() {
    this[TypeId10] = TypeId10;
  }
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
  toString() {
    return format(this);
  }
};
var EmptyImpl = class extends BodyBase {
  _tag = "Empty";
  toJSON() {
    return {
      _id: "@effect/platform/HttpBody",
      _tag: "Empty"
    };
  }
};
var empty8 = new EmptyImpl();
var RawImpl = class extends BodyBase {
  body;
  contentType;
  contentLength;
  _tag = "Raw";
  constructor(body, contentType, contentLength) {
    super();
    this.body = body;
    this.contentType = contentType;
    this.contentLength = contentLength;
  }
  toJSON() {
    return {
      _id: "@effect/platform/HttpBody",
      _tag: "Raw",
      body: this.body,
      contentType: this.contentType,
      contentLength: this.contentLength
    };
  }
};
var raw = (body, options7) => new RawImpl(body, options7?.contentType, options7?.contentLength);
var Uint8ArrayImpl = class extends BodyBase {
  body;
  contentType;
  _tag = "Uint8Array";
  constructor(body, contentType) {
    super();
    this.body = body;
    this.contentType = contentType;
  }
  get contentLength() {
    return this.body.length;
  }
  toJSON() {
    const toString4 = this.contentType.startsWith("text/") || this.contentType.endsWith("json");
    return {
      _id: "@effect/platform/HttpBody",
      _tag: "Uint8Array",
      body: toString4 ? new TextDecoder().decode(this.body) : `Uint8Array(${this.body.length})`,
      contentType: this.contentType,
      contentLength: this.contentLength
    };
  }
};
var uint8Array = (body, contentType) => new Uint8ArrayImpl(body, contentType ?? "application/octet-stream");
var encoder = new TextEncoder();
var text = (body, contentType) => uint8Array(encoder.encode(body), contentType ?? "text/plain");
var unsafeJson = (body) => text(JSON.stringify(body), "application/json");
var json = (body) => try_({
  try: () => unsafeJson(body),
  catch: (error) => HttpBodyError({
    _tag: "JsonError",
    error
  })
});
var urlParams = (urlParams5) => text(toString3(urlParams5), "application/x-www-form-urlencoded");
var jsonSchema = (schema4, options7) => {
  const encode4 = encode(schema4, options7);
  return (body) => flatMap2(mapError(encode4(body), (error) => HttpBodyError({
    _tag: "SchemaError",
    error
  })), json);
};
var file = (path, options7) => flatMap2(FileSystem, (fs) => map5(fs.stat(path), (info) => stream2(fs.stream(path, options7), options7?.contentType, Number(info.size))));
var fileInfo = (path, info, options7) => map5(FileSystem, (fs) => stream2(fs.stream(path, options7), options7?.contentType, Number(info.size)));
var fileWeb = (file5) => stream2(fromReadableStream(() => file5.stream(), identity), file5.type, file5.size);
var FormDataImpl = class extends BodyBase {
  formData;
  _tag = "FormData";
  constructor(formData5) {
    super();
    this.formData = formData5;
  }
  toJSON() {
    return {
      _id: "@effect/platform/HttpBody",
      _tag: "FormData",
      formData: this.formData
    };
  }
};
var formData = (body) => new FormDataImpl(body);
var formDataRecord = (entries) => {
  const formData5 = new FormData();
  for (const [key, value2] of Object.entries(entries)) {
    if (Array.isArray(value2)) {
      for (const item of value2) {
        if (item == null) continue;
        formData5.append(key, typeof value2 === "object" ? item : String(item));
      }
    } else if (value2 != null) {
      formData5.append(key, typeof value2 === "object" ? value2 : String(value2));
    }
  }
  return new FormDataImpl(formData5);
};
var StreamImpl = class extends BodyBase {
  stream;
  contentType;
  contentLength;
  _tag = "Stream";
  constructor(stream8, contentType, contentLength) {
    super();
    this.stream = stream8;
    this.contentType = contentType;
    this.contentLength = contentLength;
  }
  toJSON() {
    return {
      _id: "@effect/platform/HttpBody",
      _tag: "Stream",
      contentType: this.contentType,
      contentLength: this.contentLength
    };
  }
};
var stream2 = (body, contentType, contentLength) => new StreamImpl(body, contentType ?? "application/octet-stream", contentLength);

// node_modules/@effect/platform/dist/esm/HttpBody.js
var TypeId11 = TypeId10;
var isHttpBody = (u) => hasProperty(u, TypeId11);
var ErrorTypeId3 = ErrorTypeId2;
var HttpBodyError2 = HttpBodyError;
var empty9 = empty8;
var raw2 = raw;
var uint8Array2 = uint8Array;
var text2 = text;
var unsafeJson2 = unsafeJson;
var json2 = json;
var jsonSchema2 = jsonSchema;
var urlParams2 = urlParams;
var formData2 = formData;
var formDataRecord2 = formDataRecord;
var stream3 = stream2;
var file2 = file;
var fileInfo2 = fileInfo;
var fileWeb2 = fileWeb;

// node_modules/@effect/platform/dist/esm/Template.js
var Template_exports = {};
__export(Template_exports, {
  make: () => make14,
  stream: () => stream4
});
function make14(strings2, ...args) {
  const argsLength = args.length;
  const values = new Array(argsLength);
  const effects = [];
  for (let i = 0; i < argsLength; i++) {
    const arg = args[i];
    if (isOption(arg)) {
      values[i] = arg._tag === "Some" ? primitiveToString(arg.value) : "";
    } else if (isSuccess(arg)) {
      values[i] = primitiveToString(arg.effect_instruction_i0);
    } else if (isEffect(arg)) {
      effects.push([i, arg]);
    } else {
      values[i] = primitiveToString(arg);
    }
  }
  if (effects.length === 0) {
    return succeed2(consolidate(strings2, values));
  }
  return map5(forEach2(effects, ([index, effect2]) => tap(effect2, (value2) => {
    values[index] = primitiveToString(value2);
  }), {
    concurrency: "inherit",
    discard: true
  }), (_) => consolidate(strings2, values));
}
function stream4(strings2, ...args) {
  const chunks = [];
  let buffer = "";
  for (let i = 0, len = args.length; i < len; i++) {
    buffer += strings2[i];
    const arg = args[i];
    if (isOption(arg)) {
      buffer += arg._tag === "Some" ? primitiveToString(arg.value) : "";
    } else if (isSuccess(arg)) {
      buffer += primitiveToString(arg.effect_instruction_i0);
    } else if (hasProperty(arg, StreamTypeId)) {
      if (buffer.length > 0) {
        chunks.push(buffer);
        buffer = "";
      }
      if (isEffect(arg)) {
        chunks.push(map5(arg, primitiveToString));
      } else {
        chunks.push(map6(arg, primitiveToString));
      }
    } else {
      buffer += primitiveToString(arg);
    }
  }
  buffer += strings2[strings2.length - 1];
  if (buffer.length > 0) {
    chunks.push(buffer);
    buffer = "";
  }
  return flatMap4(fromIterable3(chunks), (chunk) => typeof chunk === "string" ? succeed6(chunk) : chunk, {
    concurrency: "unbounded"
  });
}
function primitiveToString(value2) {
  if (Array.isArray(value2)) {
    return value2.map(primitiveToString).join("");
  }
  switch (typeof value2) {
    case "string": {
      return value2;
    }
    case "number":
    case "bigint": {
      return value2.toString();
    }
    case "boolean": {
      return value2 ? "true" : "false";
    }
    default: {
      return "";
    }
  }
}
function consolidate(strings2, values) {
  let out = "";
  for (let i = 0, len = values.length; i < len; i++) {
    out += strings2[i];
    out += values[i];
  }
  return out + strings2[strings2.length - 1];
}
function isSuccess(u) {
  return isEffect(u) && u._op === "Success";
}

// node_modules/@effect/platform/dist/esm/HttpServerResponse.js
var HttpServerResponse_exports = {};
__export(HttpServerResponse_exports, {
  TypeId: () => TypeId13,
  empty: () => empty11,
  file: () => file4,
  fileWeb: () => fileWeb4,
  formData: () => formData4,
  html: () => html2,
  htmlStream: () => htmlStream2,
  isServerResponse: () => isServerResponse2,
  json: () => json4,
  mergeCookies: () => mergeCookies2,
  raw: () => raw4,
  redirect: () => redirect2,
  removeCookie: () => removeCookie2,
  replaceCookies: () => replaceCookies2,
  schemaJson: () => schemaJson3,
  setBody: () => setBody2,
  setCookie: () => setCookie3,
  setCookies: () => setCookies2,
  setHeader: () => setHeader2,
  setHeaders: () => setHeaders2,
  setStatus: () => setStatus2,
  stream: () => stream6,
  text: () => text4,
  toWeb: () => toWeb2,
  uint8Array: () => uint8Array4,
  unsafeJson: () => unsafeJson4,
  unsafeSetCookie: () => unsafeSetCookie2,
  unsafeSetCookies: () => unsafeSetCookies2,
  updateCookies: () => updateCookies2,
  urlParams: () => urlParams4
});

// node_modules/@effect/platform/dist/esm/internal/httpServerResponse.js
var TypeId12 = Symbol.for("@effect/platform/HttpServerResponse");
var respondableSymbol = Symbol.for("@effect/platform/HttpServerRespondable");
var ServerResponseImpl = class extends StructuralClass {
  status;
  statusText;
  cookies;
  body;
  [TypeId12];
  headers;
  constructor(status, statusText, headers, cookies, body) {
    super();
    this.status = status;
    this.statusText = statusText;
    this.cookies = cookies;
    this.body = body;
    this[TypeId12] = TypeId12;
    if (body.contentType || body.contentLength) {
      const newHeaders = {
        ...headers
      };
      if (body.contentType) {
        newHeaders["content-type"] = body.contentType;
      }
      if (body.contentLength) {
        newHeaders["content-length"] = body.contentLength.toString();
      }
      this.headers = newHeaders;
    } else {
      this.headers = headers;
    }
  }
  commit() {
    return succeed2(this);
  }
  [respondableSymbol]() {
    return succeed2(this);
  }
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
  toString() {
    return format(this);
  }
  toJSON() {
    return {
      _id: "@effect/platform/HttpServerResponse",
      status: this.status,
      statusText: this.statusText,
      headers: redact(this.headers),
      cookies: this.cookies.toJSON(),
      body: this.body.toJSON()
    };
  }
};
var isServerResponse = (u) => typeof u === "object" && u !== null && TypeId12 in u;
var empty10 = (options7) => new ServerResponseImpl(options7?.status ?? 204, options7?.statusText, options7?.headers ? fromInput(options7.headers) : empty6, options7?.cookies ?? empty5, empty8);
var redirect = (location2, options7) => {
  const headers = unsafeFromRecord({
    location: location2.toString()
  });
  return new ServerResponseImpl(options7?.status ?? 301, options7?.statusText, options7?.headers ? merge3(headers, fromInput(options7.headers)) : headers, options7?.cookies ?? empty5, empty8);
};
var uint8Array3 = (body, options7) => {
  const headers = options7?.headers ? fromInput(options7.headers) : empty6;
  return new ServerResponseImpl(options7?.status ?? 200, options7?.statusText, headers, options7?.cookies ?? empty5, uint8Array(body, getContentType(options7, headers)));
};
var text3 = (body, options7) => {
  const headers = options7?.headers ? fromInput(options7.headers) : empty6;
  return new ServerResponseImpl(options7?.status ?? 200, options7?.statusText, headers, options7?.cookies ?? empty5, text(body, getContentType(options7, headers)));
};
var html = (strings2, ...args) => {
  if (typeof strings2 === "string") {
    return text3(strings2, {
      contentType: "text/html"
    });
  }
  return map5(make14(strings2, ...args), (_) => text3(_, {
    contentType: "text/html"
  }));
};
var htmlStream = (strings2, ...args) => map5(context(), (context2) => stream5(provideContext(encodeText(stream4(strings2, ...args)), context2), {
  contentType: "text/html"
}));
var json3 = (body, options7) => map5(json(body), (body2) => new ServerResponseImpl(options7?.status ?? 200, options7?.statusText, options7?.headers ? fromInput(options7.headers) : empty6, options7?.cookies ?? empty5, body2));
var unsafeJson3 = (body, options7) => new ServerResponseImpl(options7?.status ?? 200, options7?.statusText, options7?.headers ? fromInput(options7.headers) : empty6, options7?.cookies ?? empty5, unsafeJson(body));
var schemaJson2 = (schema4, options7) => {
  const encode4 = jsonSchema(schema4, options7);
  return (body, options8) => map5(encode4(body), (body2) => new ServerResponseImpl(options8?.status ?? 200, options8?.statusText, options8?.headers ? fromInput(options8.headers) : empty6, options8?.cookies ?? empty5, body2));
};
var httpPlatform = GenericTag("@effect/platform/HttpPlatform");
var file3 = (path, options7) => flatMap2(httpPlatform, (platform) => platform.fileResponse(path, options7));
var fileWeb3 = (file5, options7) => flatMap2(httpPlatform, (platform) => platform.fileWebResponse(file5, options7));
var urlParams3 = (body, options7) => new ServerResponseImpl(options7?.status ?? 200, options7?.statusText, options7?.headers ? fromInput(options7.headers) : empty6, options7?.cookies ?? empty5, text(toString3(fromInput2(body)), "application/x-www-form-urlencoded"));
var raw3 = (body, options7) => new ServerResponseImpl(options7?.status ?? 200, options7?.statusText, options7?.headers ? fromInput(options7.headers) : empty6, options7?.cookies ?? empty5, raw(body, {
  contentType: options7?.contentType,
  contentLength: options7?.contentLength
}));
var formData3 = (body, options7) => new ServerResponseImpl(options7?.status ?? 200, options7?.statusText, options7?.headers ? fromInput(options7.headers) : empty6, options7?.cookies ?? empty5, formData(body));
var stream5 = (body, options7) => {
  const headers = options7?.headers ? fromInput(options7.headers) : empty6;
  return new ServerResponseImpl(options7?.status ?? 200, options7?.statusText, headers, options7?.cookies ?? empty5, stream2(body, getContentType(options7, headers), options7?.contentLength));
};
var getContentType = (options7, headers) => {
  if (options7?.contentType) {
    return options7.contentType;
  } else if (options7?.headers) {
    return headers["content-type"];
  } else {
    return;
  }
};
var setHeader = dual(3, (self, key, value2) => new ServerResponseImpl(self.status, self.statusText, set4(self.headers, key, value2), self.cookies, self.body));
var replaceCookies = dual(2, (self, cookies) => new ServerResponseImpl(self.status, self.statusText, self.headers, cookies, self.body));
var setCookie2 = dual((args) => isServerResponse(args[0]), (self, name, value2, options7) => map5(set3(self.cookies, name, value2, options7), (cookies) => new ServerResponseImpl(self.status, self.statusText, self.headers, cookies, self.body)));
var unsafeSetCookie = dual((args) => isServerResponse(args[0]), (self, name, value2, options7) => new ServerResponseImpl(self.status, self.statusText, self.headers, unsafeSet(self.cookies, name, value2, options7), self.body));
var updateCookies = dual(2, (self, f) => new ServerResponseImpl(self.status, self.statusText, self.headers, f(self.cookies), self.body));
var setCookies = dual(2, (self, cookies) => map5(setAll(self.cookies, cookies), (cookies2) => new ServerResponseImpl(self.status, self.statusText, self.headers, cookies2, self.body)));
var mergeCookies = dual(2, (self, cookies) => new ServerResponseImpl(self.status, self.statusText, self.headers, merge2(self.cookies, cookies), self.body));
var unsafeSetCookies = dual(2, (self, cookies) => new ServerResponseImpl(self.status, self.statusText, self.headers, unsafeSetAll(self.cookies, cookies), self.body));
var removeCookie = dual(2, (self, name) => new ServerResponseImpl(self.status, self.statusText, self.headers, remove2(self.cookies, name), self.body));
var setHeaders = dual(2, (self, input) => new ServerResponseImpl(self.status, self.statusText, setAll2(self.headers, input), self.cookies, self.body));
var setStatus = dual((args) => isServerResponse(args[0]), (self, status, statusText) => new ServerResponseImpl(status, statusText, self.headers, self.cookies, self.body));
var setBody = dual(2, (self, body) => {
  let headers = self.headers;
  if (body._tag === "Empty") {
    headers = remove3(remove3(headers, "Content-Type"), "Content-length");
  }
  return new ServerResponseImpl(self.status, self.statusText, headers, self.cookies, body);
});
var toWeb = (response, options7) => {
  const headers = new globalThis.Headers(response.headers);
  if (!isEmpty(response.cookies)) {
    const toAdd = toSetCookieHeaders(response.cookies);
    for (const header of toAdd) {
      headers.append("set-cookie", header);
    }
  }
  if (options7?.withoutBody) {
    return new Response(void 0, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  }
  const body = response.body;
  switch (body._tag) {
    case "Empty": {
      return new Response(void 0, {
        status: response.status,
        statusText: response.statusText,
        headers
      });
    }
    case "Uint8Array":
    case "Raw": {
      if (body.body instanceof Response) {
        for (const [key, value2] of headers) {
          body.body.headers.set(key, value2);
        }
        return body.body;
      }
      return new Response(body.body, {
        status: response.status,
        statusText: response.statusText,
        headers
      });
    }
    case "FormData": {
      return new Response(body.formData, {
        status: response.status,
        statusText: response.statusText,
        headers
      });
    }
    case "Stream": {
      return new Response(toReadableStreamRuntime(body.stream, options7?.runtime ?? defaultRuntime), {
        status: response.status,
        statusText: response.statusText,
        headers
      });
    }
  }
};

// node_modules/@effect/platform/dist/esm/HttpServerResponse.js
var TypeId13 = Symbol.for("@effect/platform/HttpServerResponse");
var isServerResponse2 = isServerResponse;
var empty11 = empty10;
var redirect2 = redirect;
var uint8Array4 = uint8Array3;
var text4 = text3;
var html2 = html;
var htmlStream2 = htmlStream;
var json4 = json3;
var schemaJson3 = schemaJson2;
var unsafeJson4 = unsafeJson3;
var urlParams4 = urlParams3;
var raw4 = raw3;
var formData4 = formData3;
var stream6 = stream5;
var file4 = file3;
var fileWeb4 = fileWeb3;
var setHeader2 = setHeader;
var setHeaders2 = setHeaders;
var removeCookie2 = removeCookie;
var replaceCookies2 = replaceCookies;
var setCookie3 = setCookie2;
var unsafeSetCookie2 = unsafeSetCookie;
var updateCookies2 = updateCookies;
var mergeCookies2 = mergeCookies;
var setCookies2 = setCookies;
var unsafeSetCookies2 = unsafeSetCookies;
var setBody2 = setBody;
var setStatus2 = setStatus;
var toWeb2 = toWeb;

// node_modules/@effect/platform/dist/esm/HttpServerRespondable.js
var HttpServerRespondable_exports = {};
__export(HttpServerRespondable_exports, {
  isRespondable: () => isRespondable,
  symbol: () => symbol,
  toResponse: () => toResponse,
  toResponseOrElse: () => toResponseOrElse,
  toResponseOrElseDefect: () => toResponseOrElseDefect
});
var symbol = Symbol.for("@effect/platform/HttpServerRespondable");
var isRespondable = (u) => hasProperty(u, symbol);
var badRequest = empty11({
  status: 400
});
var notFound2 = empty11({
  status: 404
});
var toResponse = (self) => {
  if (isServerResponse2(self)) {
    return succeed2(self);
  }
  return orDie(self[symbol]());
};
var toResponseOrElse = (u, orElse2) => {
  if (isServerResponse2(u)) {
    return succeed2(u);
  } else if (isRespondable(u)) {
    return catchAllCause(u[symbol](), () => succeed2(orElse2));
  } else if (isParseError(u)) {
    return succeed2(badRequest);
  } else if (isNoSuchElementException(u)) {
    return succeed2(notFound2);
  }
  return succeed2(orElse2);
};
var toResponseOrElseDefect = (u, orElse2) => {
  if (isServerResponse2(u)) {
    return succeed2(u);
  } else if (isRespondable(u)) {
    return catchAllCause(u[symbol](), () => succeed2(orElse2));
  }
  return succeed2(orElse2);
};

// node_modules/@effect/platform/dist/esm/HttpServerError.js
var HttpServerError_exports = {};
__export(HttpServerError_exports, {
  RequestError: () => RequestError2,
  ResponseError: () => ResponseError2,
  RouteNotFound: () => RouteNotFound,
  ServeError: () => ServeError,
  TypeId: () => TypeId15,
  causeResponse: () => causeResponse2,
  causeResponseStripped: () => causeResponseStripped2,
  clientAbortFiberId: () => clientAbortFiberId2,
  exitResponse: () => exitResponse2,
  isServerError: () => isServerError2
});

// node_modules/@effect/platform/dist/esm/internal/httpServerError.js
var TypeId14 = Symbol.for("@effect/platform/HttpServerError");
var isServerError = (u) => hasProperty(u, TypeId14);
var clientAbortFiberId = globalValue("@effect/platform/HttpServerError/clientAbortFiberId", () => runtime(-499, 0));
var causeResponse = (cause) => {
  const [effect2, stripped] = reduce2(cause, [succeed2(internalServerError), empty4], (acc, cause2) => {
    switch (cause2._tag) {
      case "Empty": {
        return some(acc);
      }
      case "Fail": {
        return some([toResponseOrElse(cause2.error, internalServerError), cause2]);
      }
      case "Die": {
        return some([toResponseOrElseDefect(cause2.defect, internalServerError), cause2]);
      }
      case "Interrupt": {
        if (acc[1]._tag !== "Empty") {
          return none();
        }
        const response = cause2.fiberId === clientAbortFiberId ? clientAbortError : serverAbortError;
        return some([succeed2(response), cause2]);
      }
      default: {
        return none();
      }
    }
  });
  return map5(effect2, (response) => {
    if (isEmptyType(stripped)) {
      return [response, die(response)];
    }
    return [response, sequential2(stripped, die(response))];
  });
};
var causeResponseStripped = (cause) => {
  let response;
  const stripped = stripSomeDefects(cause, (defect) => {
    if (isServerResponse(defect)) {
      response = defect;
      return some(empty4);
    }
    return none();
  });
  return [response ?? internalServerError, stripped];
};
var internalServerError = empty10({
  status: 500
});
var clientAbortError = empty10({
  status: 499
});
var serverAbortError = empty10({
  status: 503
});
var exitResponse = (exit2) => {
  if (exit2._tag === "Success") {
    return exit2.value;
  }
  return causeResponseStripped(exit2.cause)[0];
};

// node_modules/@effect/platform/dist/esm/HttpServerError.js
var TypeId15 = TypeId14;
var RequestError2 = class extends TypeIdError(TypeId15, "RequestError") {
  /**
   * @since 1.0.0
   */
  [symbol]() {
    return empty11({
      status: 400
    });
  }
  get methodAndUrl() {
    return `${this.request.method} ${this.request.url}`;
  }
  get message() {
    return this.description ? `${this.reason}: ${this.description} (${this.methodAndUrl})` : `${this.reason} error (${this.methodAndUrl})`;
  }
};
var isServerError2 = isServerError;
var RouteNotFound = class extends TypeIdError(TypeId15, "RouteNotFound") {
  constructor(options7) {
    super(options7);
    this.stack = `${this.name}: ${this.message}`;
  }
  /**
   * @since 1.0.0
   */
  [symbol]() {
    return empty11({
      status: 404
    });
  }
  get message() {
    return `${this.request.method} ${this.request.url} not found`;
  }
};
var ResponseError2 = class extends TypeIdError(TypeId15, "ResponseError") {
  /**
   * @since 1.0.0
   */
  [symbol]() {
    return empty11({
      status: 500
    });
  }
  get methodAndUrl() {
    return `${this.request.method} ${this.request.url}`;
  }
  get message() {
    const info = `${this.response.status} ${this.methodAndUrl}`;
    return this.description ? `${this.description} (${info})` : `${this.reason} error (${info})`;
  }
};
var ServeError = class extends TypeIdError(TypeId15, "ServeError") {
};
var clientAbortFiberId2 = clientAbortFiberId;
var causeResponse2 = causeResponse;
var causeResponseStripped2 = causeResponseStripped;
var exitResponse2 = exitResponse;

// node_modules/@effect/platform/dist/esm/Path.js
var Path_exports = {};
__export(Path_exports, {
  Path: () => Path2,
  TypeId: () => TypeId17,
  layer: () => layer4
});

// node_modules/@effect/platform/dist/esm/internal/path.js
var TypeId16 = Symbol.for("@effect/platform/Path");
var Path = GenericTag("@effect/platform/Path");
function normalizeStringPosix(path, allowAboveRoot) {
  let res = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let code;
  for (let i = 0; i <= path.length; ++i) {
    if (i < path.length) {
      code = path.charCodeAt(i);
    } else if (code === 47) {
      break;
    } else {
      code = 47;
    }
    if (code === 47) {
      if (lastSlash === i - 1 || dots === 1) {
      } else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 || res.charCodeAt(res.length - 2) !== 46) {
          if (res.length > 2) {
            const lastSlashIndex = res.lastIndexOf("/");
            if (lastSlashIndex !== res.length - 1) {
              if (lastSlashIndex === -1) {
                res = "";
                lastSegmentLength = 0;
              } else {
                res = res.slice(0, lastSlashIndex);
                lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
              }
              lastSlash = i;
              dots = 0;
              continue;
            }
          } else if (res.length === 2 || res.length === 1) {
            res = "";
            lastSegmentLength = 0;
            lastSlash = i;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0) {
            res += "/..";
          } else {
            res = "..";
          }
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0) {
          res += "/" + path.slice(lastSlash + 1, i);
        } else {
          res = path.slice(lastSlash + 1, i);
        }
        lastSegmentLength = i - lastSlash - 1;
      }
      lastSlash = i;
      dots = 0;
    } else if (code === 46 && dots !== -1) {
      ;
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}
function _format(sep, pathObject) {
  const dir = pathObject.dir || pathObject.root;
  const base = pathObject.base || (pathObject.name || "") + (pathObject.ext || "");
  if (!dir) {
    return base;
  }
  if (dir === pathObject.root) {
    return dir + base;
  }
  return dir + sep + base;
}
function fromFileUrl(url) {
  if (url.protocol !== "file:") {
    return fail4(new BadArgument({
      module: "Path",
      method: "fromFileUrl",
      description: "URL must be of scheme file"
    }));
  } else if (url.hostname !== "") {
    return fail4(new BadArgument({
      module: "Path",
      method: "fromFileUrl",
      description: "Invalid file URL host"
    }));
  }
  const pathname = url.pathname;
  for (let n = 0; n < pathname.length; n++) {
    if (pathname[n] === "%") {
      const third = pathname.codePointAt(n + 2) | 32;
      if (pathname[n + 1] === "2" && third === 102) {
        return fail4(new BadArgument({
          module: "Path",
          method: "fromFileUrl",
          description: "must not include encoded / characters"
        }));
      }
    }
  }
  return succeed2(decodeURIComponent(pathname));
}
var resolve = function resolve2() {
  let resolvedPath = "";
  let resolvedAbsolute = false;
  let cwd = void 0;
  for (let i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    let path;
    if (i >= 0) {
      path = arguments[i];
    } else {
      const process = globalThis.process;
      if (cwd === void 0 && "process" in globalThis && typeof process === "object" && process !== null && typeof process.cwd === "function") {
        cwd = process.cwd();
      }
      path = cwd;
    }
    if (path.length === 0) {
      continue;
    }
    resolvedPath = path + "/" + resolvedPath;
    resolvedAbsolute = path.charCodeAt(0) === 47;
  }
  resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);
  if (resolvedAbsolute) {
    if (resolvedPath.length > 0) {
      return "/" + resolvedPath;
    } else {
      return "/";
    }
  } else if (resolvedPath.length > 0) {
    return resolvedPath;
  } else {
    return ".";
  }
};
var CHAR_FORWARD_SLASH = 47;
function toFileUrl(filepath) {
  const outURL = new URL("file://");
  let resolved = resolve(filepath);
  const filePathLast = filepath.charCodeAt(filepath.length - 1);
  if (filePathLast === CHAR_FORWARD_SLASH && resolved[resolved.length - 1] !== "/") {
    resolved += "/";
  }
  outURL.pathname = encodePathChars(resolved);
  return succeed2(outURL);
}
var percentRegEx = /%/g;
var backslashRegEx = /\\/g;
var newlineRegEx = /\n/g;
var carriageReturnRegEx = /\r/g;
var tabRegEx = /\t/g;
function encodePathChars(filepath) {
  if (filepath.includes("%")) {
    filepath = filepath.replace(percentRegEx, "%25");
  }
  if (filepath.includes("\\")) {
    filepath = filepath.replace(backslashRegEx, "%5C");
  }
  if (filepath.includes("\n")) {
    filepath = filepath.replace(newlineRegEx, "%0A");
  }
  if (filepath.includes("\r")) {
    filepath = filepath.replace(carriageReturnRegEx, "%0D");
  }
  if (filepath.includes("	")) {
    filepath = filepath.replace(tabRegEx, "%09");
  }
  return filepath;
}
var posixImpl = Path.of({
  [TypeId16]: TypeId16,
  resolve,
  normalize(path) {
    if (path.length === 0) return ".";
    const isAbsolute = path.charCodeAt(0) === 47;
    const trailingSeparator = path.charCodeAt(path.length - 1) === 47;
    path = normalizeStringPosix(path, !isAbsolute);
    if (path.length === 0 && !isAbsolute) path = ".";
    if (path.length > 0 && trailingSeparator) path += "/";
    if (isAbsolute) return "/" + path;
    return path;
  },
  isAbsolute(path) {
    return path.length > 0 && path.charCodeAt(0) === 47;
  },
  join() {
    if (arguments.length === 0) {
      return ".";
    }
    let joined;
    for (let i = 0; i < arguments.length; ++i) {
      const arg = arguments[i];
      if (arg.length > 0) {
        if (joined === void 0) {
          joined = arg;
        } else {
          joined += "/" + arg;
        }
      }
    }
    if (joined === void 0) {
      return ".";
    }
    return posixImpl.normalize(joined);
  },
  relative(from, to) {
    if (from === to) return "";
    from = posixImpl.resolve(from);
    to = posixImpl.resolve(to);
    if (from === to) return "";
    let fromStart = 1;
    for (; fromStart < from.length; ++fromStart) {
      if (from.charCodeAt(fromStart) !== 47) {
        break;
      }
    }
    const fromEnd = from.length;
    const fromLen = fromEnd - fromStart;
    let toStart = 1;
    for (; toStart < to.length; ++toStart) {
      if (to.charCodeAt(toStart) !== 47) {
        break;
      }
    }
    const toEnd = to.length;
    const toLen = toEnd - toStart;
    const length = fromLen < toLen ? fromLen : toLen;
    let lastCommonSep = -1;
    let i = 0;
    for (; i <= length; ++i) {
      if (i === length) {
        if (toLen > length) {
          if (to.charCodeAt(toStart + i) === 47) {
            return to.slice(toStart + i + 1);
          } else if (i === 0) {
            return to.slice(toStart + i);
          }
        } else if (fromLen > length) {
          if (from.charCodeAt(fromStart + i) === 47) {
            lastCommonSep = i;
          } else if (i === 0) {
            lastCommonSep = 0;
          }
        }
        break;
      }
      const fromCode = from.charCodeAt(fromStart + i);
      const toCode = to.charCodeAt(toStart + i);
      if (fromCode !== toCode) {
        break;
      } else if (fromCode === 47) {
        lastCommonSep = i;
      }
    }
    let out = "";
    for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
      if (i === fromEnd || from.charCodeAt(i) === 47) {
        if (out.length === 0) {
          out += "..";
        } else {
          out += "/..";
        }
      }
    }
    if (out.length > 0) {
      return out + to.slice(toStart + lastCommonSep);
    } else {
      toStart += lastCommonSep;
      if (to.charCodeAt(toStart) === 47) {
        ;
        ++toStart;
      }
      return to.slice(toStart);
    }
  },
  dirname(path) {
    if (path.length === 0) return ".";
    let code = path.charCodeAt(0);
    const hasRoot = code === 47;
    let end = -1;
    let matchedSlash = true;
    for (let i = path.length - 1; i >= 1; --i) {
      code = path.charCodeAt(i);
      if (code === 47) {
        if (!matchedSlash) {
          end = i;
          break;
        }
      } else {
        matchedSlash = false;
      }
    }
    if (end === -1) return hasRoot ? "/" : ".";
    if (hasRoot && end === 1) return "//";
    return path.slice(0, end);
  },
  basename(path, ext) {
    let start = 0;
    let end = -1;
    let matchedSlash = true;
    let i;
    if (ext !== void 0 && ext.length > 0 && ext.length <= path.length) {
      if (ext.length === path.length && ext === path) return "";
      let extIdx = ext.length - 1;
      let firstNonSlashEnd = -1;
      for (i = path.length - 1; i >= 0; --i) {
        const code = path.charCodeAt(i);
        if (code === 47) {
          if (!matchedSlash) {
            start = i + 1;
            break;
          }
        } else {
          if (firstNonSlashEnd === -1) {
            matchedSlash = false;
            firstNonSlashEnd = i + 1;
          }
          if (extIdx >= 0) {
            if (code === ext.charCodeAt(extIdx)) {
              if (--extIdx === -1) {
                end = i;
              }
            } else {
              extIdx = -1;
              end = firstNonSlashEnd;
            }
          }
        }
      }
      if (start === end) end = firstNonSlashEnd;
      else if (end === -1) end = path.length;
      return path.slice(start, end);
    } else {
      for (i = path.length - 1; i >= 0; --i) {
        if (path.charCodeAt(i) === 47) {
          if (!matchedSlash) {
            start = i + 1;
            break;
          }
        } else if (end === -1) {
          matchedSlash = false;
          end = i + 1;
        }
      }
      if (end === -1) return "";
      return path.slice(start, end);
    }
  },
  extname(path) {
    let startDot = -1;
    let startPart = 0;
    let end = -1;
    let matchedSlash = true;
    let preDotState = 0;
    for (let i = path.length - 1; i >= 0; --i) {
      const code = path.charCodeAt(i);
      if (code === 47) {
        if (!matchedSlash) {
          startPart = i + 1;
          break;
        }
        continue;
      }
      if (end === -1) {
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46) {
        if (startDot === -1) {
          startDot = i;
        } else if (preDotState !== 1) {
          preDotState = 1;
        }
      } else if (startDot !== -1) {
        preDotState = -1;
      }
    }
    if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
    preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
    preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      return "";
    }
    return path.slice(startDot, end);
  },
  format: function format2(pathObject) {
    if (pathObject === null || typeof pathObject !== "object") {
      throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
    }
    return _format("/", pathObject);
  },
  parse(path) {
    const ret = {
      root: "",
      dir: "",
      base: "",
      ext: "",
      name: ""
    };
    if (path.length === 0) return ret;
    let code = path.charCodeAt(0);
    const isAbsolute = code === 47;
    let start;
    if (isAbsolute) {
      ret.root = "/";
      start = 1;
    } else {
      start = 0;
    }
    let startDot = -1;
    let startPart = 0;
    let end = -1;
    let matchedSlash = true;
    let i = path.length - 1;
    let preDotState = 0;
    for (; i >= start; --i) {
      code = path.charCodeAt(i);
      if (code === 47) {
        if (!matchedSlash) {
          startPart = i + 1;
          break;
        }
        continue;
      }
      if (end === -1) {
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46) {
        if (startDot === -1) startDot = i;
        else if (preDotState !== 1) preDotState = 1;
      } else if (startDot !== -1) {
        preDotState = -1;
      }
    }
    if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
    preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
    preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      if (end !== -1) {
        if (startPart === 0 && isAbsolute) ret.base = ret.name = path.slice(1, end);
        else ret.base = ret.name = path.slice(startPart, end);
      }
    } else {
      if (startPart === 0 && isAbsolute) {
        ret.name = path.slice(1, startDot);
        ret.base = path.slice(1, end);
      } else {
        ret.name = path.slice(startPart, startDot);
        ret.base = path.slice(startPart, end);
      }
      ret.ext = path.slice(startDot, end);
    }
    if (startPart > 0) ret.dir = path.slice(0, startPart - 1);
    else if (isAbsolute) ret.dir = "/";
    return ret;
  },
  sep: "/",
  fromFileUrl,
  toFileUrl,
  toNamespacedPath: identity
});
var layer3 = succeed3(Path, posixImpl);

// node_modules/@effect/platform/dist/esm/Path.js
var TypeId17 = TypeId16;
var Path2 = Path;
var layer4 = layer3;

// node_modules/@effect/platform/dist/esm/Multipart.js
var Multipart_exports = {};
__export(Multipart_exports, {
  ErrorTypeId: () => ErrorTypeId4,
  FieldMimeTypes: () => FieldMimeTypes,
  FileSchema: () => FileSchema,
  FilesSchema: () => FilesSchema,
  MaxFieldSize: () => MaxFieldSize,
  MaxFileSize: () => MaxFileSize,
  MaxParts: () => MaxParts,
  MultipartError: () => MultipartError,
  SingleFileSchema: () => SingleFileSchema,
  TypeId: () => TypeId18,
  collectUint8Array: () => collectUint8Array,
  isField: () => isField,
  isFile: () => isFile2,
  isPart: () => isPart,
  isPersistedFile: () => isPersistedFile,
  makeChannel: () => makeChannel,
  makeConfig: () => makeConfig,
  schemaJson: () => schemaJson4,
  schemaPersisted: () => schemaPersisted,
  toPersisted: () => toPersisted,
  withFieldMimeTypes: () => withFieldMimeTypes,
  withLimits: () => withLimits,
  withLimitsStream: () => withLimitsStream,
  withMaxFieldSize: () => withMaxFieldSize,
  withMaxFileSize: () => withMaxFileSize,
  withMaxParts: () => withMaxParts
});

// node_modules/multipasta/dist/esm/internal/contentType.js
var paramRE = /; *([!#$%&'*+.^\w`|~-]+)=("(?:[\v\u0020\u0021\u0023-\u005b\u005d-\u007e\u0080-\u00ff]|\\[\v\u0020-\u00ff])*"|[!#$%&'*+.^\w`|~-]+) */gu;
var quotedPairRE = /\\([\v\u0020-\u00ff])/gu;
var mediaTypeRE = /^[!#$%&'*+.^\w|~-]+\/[!#$%&'*+.^\w|~-]+$/u;
var mediaTypeRENoSlash = /^[!#$%&'*+.^\w|~-]+$/u;
var defaultContentType2 = {
  value: "",
  parameters: /* @__PURE__ */ Object.create(null)
};
function parse(header, withoutSlash = false) {
  if (typeof header !== "string") {
    return defaultContentType2;
  }
  let index = header.indexOf(";");
  const type = index !== -1 ? header.slice(0, index).trim() : header.trim();
  const mediaRE = withoutSlash ? mediaTypeRENoSlash : mediaTypeRE;
  if (mediaRE.test(type) === false) {
    return defaultContentType2;
  }
  const result = {
    value: type.toLowerCase(),
    parameters: /* @__PURE__ */ Object.create(null)
  };
  if (index === -1) {
    return result;
  }
  let key;
  let match4;
  let value2;
  paramRE.lastIndex = index;
  while (match4 = paramRE.exec(header)) {
    if (match4.index !== index) {
      return defaultContentType2;
    }
    index += match4[0].length;
    key = match4[1].toLowerCase();
    value2 = match4[2];
    if (value2[0] === '"') {
      value2 = value2.slice(1, value2.length - 1);
      !withoutSlash && quotedPairRE.test(value2) && (value2 = value2.replace(quotedPairRE, "$1"));
    }
    result.parameters[key] = value2;
  }
  if (index !== header.length) {
    return defaultContentType2;
  }
  return result;
}

// node_modules/multipasta/dist/esm/internal/headers.js
var constMaxPairs = 100;
var constMaxSize = 16 * 1024;
var State;
(function(State3) {
  State3[State3["key"] = 0] = "key";
  State3[State3["whitespace"] = 1] = "whitespace";
  State3[State3["value"] = 2] = "value";
})(State || (State = {}));
var constContinue = {
  _tag: "Continue"
};
var constNameChars = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1];
var constValueChars = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
function make15() {
  const decoder2 = new TextDecoder();
  const state = {
    state: State.key,
    headers: /* @__PURE__ */ Object.create(null),
    key: "",
    value: void 0,
    crlf: 0,
    previousChunk: void 0,
    pairs: 0,
    size: 0
  };
  function reset(value2) {
    state.state = State.key;
    state.headers = /* @__PURE__ */ Object.create(null);
    state.key = "";
    state.value = void 0;
    state.crlf = 0;
    state.previousChunk = void 0;
    state.pairs = 0;
    state.size = 0;
    return value2;
  }
  function concatUint8Array(a, b) {
    const newUint8Array = new Uint8Array(a.length + b.length);
    newUint8Array.set(a);
    newUint8Array.set(b, a.length);
    return newUint8Array;
  }
  function error(reason) {
    return reset({
      _tag: "Failure",
      reason,
      headers: state.headers
    });
  }
  return function write2(chunk, start) {
    let endOffset = 0;
    let previousCursor;
    if (state.previousChunk !== void 0) {
      endOffset = state.previousChunk.length;
      previousCursor = endOffset;
      const newChunk = new Uint8Array(chunk.length + endOffset);
      newChunk.set(state.previousChunk);
      newChunk.set(chunk, endOffset);
      state.previousChunk = void 0;
      chunk = newChunk;
    }
    const end = chunk.length;
    outer: while (start < end) {
      if (state.state === State.key) {
        let i = start;
        for (; i < end; i++) {
          if (state.size++ > constMaxSize) {
            return error("HeaderTooLarge");
          }
          if (chunk[i] === 58) {
            state.key += decoder2.decode(chunk.subarray(start, i)).toLowerCase();
            if (state.key.length === 0) {
              return error("InvalidHeaderName");
            }
            if (chunk[i + 1] === 32 && chunk[i + 2] !== 32 && chunk[i + 2] !== 9) {
              start = i + 2;
              state.state = State.value;
              state.size++;
            } else if (chunk[i + 1] !== 32 && chunk[i + 1] !== 9) {
              start = i + 1;
              state.state = State.value;
            } else {
              start = i + 1;
              state.state = State.whitespace;
            }
            break;
          } else if (constNameChars[chunk[i]] !== 1) {
            return error("InvalidHeaderName");
          }
        }
        if (i === end) {
          state.key += decoder2.decode(chunk.subarray(start, end)).toLowerCase();
          return constContinue;
        }
      }
      if (state.state === State.whitespace) {
        for (; start < end; start++) {
          if (state.size++ > constMaxSize) {
            return error("HeaderTooLarge");
          }
          if (chunk[start] !== 32 && chunk[start] !== 9) {
            state.state = State.value;
            break;
          }
        }
        if (start === end) {
          return constContinue;
        }
      }
      if (state.state === State.value) {
        let i = start;
        if (previousCursor !== void 0) {
          i = previousCursor;
          previousCursor = void 0;
        }
        for (; i < end; i++) {
          if (state.size++ > constMaxSize) {
            return error("HeaderTooLarge");
          }
          if (chunk[i] === 13 || state.crlf > 0) {
            let byte = chunk[i];
            if (byte === 13 && state.crlf === 0) {
              state.crlf = 1;
              i++;
              state.size++;
              byte = chunk[i];
            }
            if (byte === 10 && state.crlf === 1) {
              state.crlf = 2;
              i++;
              state.size++;
              byte = chunk[i];
            }
            if (byte === 13 && state.crlf === 2) {
              state.crlf = 3;
              i++;
              state.size++;
              byte = chunk[i];
            }
            if (byte === 10 && state.crlf === 3) {
              state.crlf = 4;
              i++;
              state.size++;
            }
            if (state.crlf < 4 && i >= end) {
              state.previousChunk = chunk.subarray(start);
              return constContinue;
            } else if (state.crlf >= 2) {
              state.value = state.value === void 0 ? chunk.subarray(start, i - state.crlf) : concatUint8Array(state.value, chunk.subarray(start, i - state.crlf));
              const value2 = decoder2.decode(state.value);
              if (state.headers[state.key] === void 0) {
                state.headers[state.key] = value2;
              } else if (typeof state.headers[state.key] === "string") {
                state.headers[state.key] = [state.headers[state.key], value2];
              } else {
                ;
                state.headers[state.key].push(value2);
              }
              start = i;
              state.size--;
              if (state.crlf !== 4 && state.pairs === constMaxPairs) {
                return error("TooManyHeaders");
              } else if (state.crlf === 3) {
                return error("InvalidHeaderValue");
              } else if (state.crlf === 4) {
                return reset({
                  _tag: "Headers",
                  headers: state.headers,
                  endPosition: start - endOffset
                });
              }
              state.pairs++;
              state.key = "";
              state.value = void 0;
              state.crlf = 0;
              state.state = State.key;
              continue outer;
            }
          } else if (constValueChars[chunk[i]] !== 1) {
            return error("InvalidHeaderValue");
          }
        }
        if (i === end) {
          state.value = state.value === void 0 ? chunk.subarray(start, end) : concatUint8Array(state.value, chunk.subarray(start, end));
          return constContinue;
        }
      }
    }
    if (start > end) {
      state.size += end - start;
    }
    return constContinue;
  };
}

// node_modules/multipasta/dist/esm/internal/search.js
function makeState(needle_) {
  const needle = new TextEncoder().encode(needle_);
  const needleLength = needle.length;
  const indexes = {};
  for (let i = 0; i < needleLength; i++) {
    const b = needle[i];
    if (indexes[b] === void 0) indexes[b] = [];
    indexes[b].push(i);
  }
  return {
    needle,
    needleLength,
    indexes,
    firstByte: needle[0],
    previousChunk: void 0,
    previousChunkLength: 0,
    matchIndex: 0
  };
}
function make16(needle, callback, seed) {
  const state = makeState(needle);
  if (seed !== void 0) {
    state.previousChunk = seed;
    state.previousChunkLength = seed.length;
  }
  function makeIndexOf() {
    if ("Buffer" in globalThis && !("Bun" in globalThis || "Deno" in globalThis)) {
      return function(chunk, needle2, fromIndex) {
        return Buffer.prototype.indexOf.call(chunk, needle2, fromIndex);
      };
    }
    const skipTable = new Uint8Array(256).fill(state.needle.length);
    for (let i = 0, lastIndex = state.needle.length - 1; i < lastIndex; ++i) {
      skipTable[state.needle[i]] = lastIndex - i;
    }
    return function(chunk, needle2, fromIndex) {
      const lengthTotal = chunk.length;
      let i = fromIndex + state.needleLength - 1;
      while (i < lengthTotal) {
        for (let j = state.needleLength - 1, k = i; j >= 0 && chunk[k] === needle2[j]; j--, k--) {
          if (j === 0) return k;
        }
        i += skipTable[chunk[i]];
      }
      return -1;
    };
  }
  const indexOf = makeIndexOf();
  function write2(chunk) {
    let chunkLength = chunk.length;
    if (state.previousChunk !== void 0) {
      const newChunk = new Uint8Array(state.previousChunkLength + chunkLength);
      newChunk.set(state.previousChunk);
      newChunk.set(chunk, state.previousChunkLength);
      chunk = newChunk;
      chunkLength = state.previousChunkLength + chunkLength;
      state.previousChunk = void 0;
    }
    if (chunkLength < state.needleLength) {
      state.previousChunk = chunk;
      state.previousChunkLength = chunkLength;
      return;
    }
    let pos = 0;
    while (pos < chunkLength) {
      const match4 = indexOf(chunk, state.needle, pos);
      if (match4 > -1) {
        if (match4 > pos) {
          callback(state.matchIndex, chunk.subarray(pos, match4));
        }
        state.matchIndex += 1;
        pos = match4 + state.needleLength;
        continue;
      } else if (chunk[chunkLength - 1] in state.indexes) {
        const indexes = state.indexes[chunk[chunkLength - 1]];
        let earliestIndex = -1;
        for (let i = 0, len = indexes.length; i < len; i++) {
          const index = indexes[i];
          if (chunk[chunkLength - 1 - index] === state.firstByte && i > earliestIndex) {
            earliestIndex = index;
          }
        }
        if (earliestIndex === -1) {
          if (pos === 0) {
            callback(state.matchIndex, chunk);
          } else {
            callback(state.matchIndex, chunk.subarray(pos));
          }
        } else {
          if (chunkLength - 1 - earliestIndex > pos) {
            callback(state.matchIndex, chunk.subarray(pos, chunkLength - 1 - earliestIndex));
          }
          state.previousChunk = chunk.subarray(chunkLength - 1 - earliestIndex);
          state.previousChunkLength = earliestIndex + 1;
        }
      } else if (pos === 0) {
        callback(state.matchIndex, chunk);
      } else {
        callback(state.matchIndex, chunk.subarray(pos));
      }
      break;
    }
  }
  function end() {
    if (state.previousChunk !== void 0 && state.previousChunk !== seed) {
      callback(state.matchIndex, state.previousChunk);
    }
    state.previousChunk = seed;
    state.previousChunkLength = seed?.length ?? 0;
    state.matchIndex = 0;
  }
  return {
    write: write2,
    end
  };
}

// node_modules/multipasta/dist/esm/internal/multipart.js
var State2;
(function(State3) {
  State3[State3["headers"] = 0] = "headers";
  State3[State3["body"] = 1] = "body";
})(State2 || (State2 = {}));
var errInvalidDisposition = {
  _tag: "InvalidDisposition"
};
var errEndNotReached = {
  _tag: "EndNotReached"
};
var errMaxParts = {
  _tag: "ReachedLimit",
  limit: "MaxParts"
};
var errMaxTotalSize = {
  _tag: "ReachedLimit",
  limit: "MaxTotalSize"
};
var errMaxPartSize = {
  _tag: "ReachedLimit",
  limit: "MaxPartSize"
};
var errMaxFieldSize = {
  _tag: "ReachedLimit",
  limit: "MaxFieldSize"
};
var constCR = new TextEncoder().encode("\r\n");
function defaultIsFile(info) {
  return info.filename !== void 0 || info.contentType === "application/octet-stream";
}
function parseBoundary(headers) {
  const contentType = parse(headers["content-type"]);
  return contentType.parameters.boundary;
}
function noopOnChunk(_chunk) {
}
function make17({
  headers,
  onFile: onPart,
  onField,
  onError: onError2,
  onDone,
  isFile: isFile3 = defaultIsFile,
  maxParts = Infinity,
  maxTotalSize = Infinity,
  maxPartSize = Infinity,
  maxFieldSize = 1024 * 1024
}) {
  const boundary = parseBoundary(headers);
  if (boundary === void 0) {
    onError2({
      _tag: "InvalidBoundary"
    });
    return {
      write: noopOnChunk,
      end() {
      }
    };
  }
  const state = {
    state: State2.headers,
    index: 0,
    parts: 0,
    onChunk: noopOnChunk,
    info: void 0,
    headerSkip: 0,
    partSize: 0,
    totalSize: 0,
    isFile: false,
    fieldChunks: [],
    fieldSize: 0
  };
  function skipBody() {
    state.state = State2.body;
    state.isFile = true;
    state.onChunk = noopOnChunk;
  }
  const headerParser = make15();
  const split = make16(`\r
--${boundary}`, function(index, chunk) {
    if (index === 0) {
      skipBody();
      return;
    } else if (index !== state.index) {
      if (state.index > 0) {
        if (state.isFile) {
          state.onChunk(null);
          state.partSize = 0;
        } else {
          if (state.fieldChunks.length === 1) {
            onField(state.info, state.fieldChunks[0]);
          } else {
            const buf = new Uint8Array(state.fieldSize);
            let offset = 0;
            for (let i = 0; i < state.fieldChunks.length; i++) {
              const chunk2 = state.fieldChunks[i];
              buf.set(chunk2, offset);
              offset += chunk2.length;
            }
            onField(state.info, buf);
          }
          state.fieldSize = 0;
          state.fieldChunks = [];
        }
      }
      state.state = State2.headers;
      state.index = index;
      state.headerSkip = 2;
      if (chunk[0] === 45 && chunk[1] === 45) {
        return onDone();
      }
      state.parts++;
      if (state.parts > maxParts) {
        onError2(errMaxParts);
      }
    }
    if ((state.partSize += chunk.length) > maxPartSize) {
      onError2(errMaxPartSize);
    }
    if (state.state === State2.headers) {
      const result = headerParser(chunk, state.headerSkip);
      state.headerSkip = 0;
      if (result._tag === "Continue") {
        return;
      } else if (result._tag === "Failure") {
        skipBody();
        return onError2({
          _tag: "BadHeaders",
          error: result
        });
      }
      const contentType = parse(result.headers["content-type"]);
      const contentDisposition = parse(result.headers["content-disposition"], true);
      if ("form-data" === contentDisposition.value && !("name" in contentDisposition.parameters)) {
        skipBody();
        return onError2(errInvalidDisposition);
      }
      let encodedFilename;
      if ("filename*" in contentDisposition.parameters) {
        const parts = contentDisposition.parameters["filename*"].split("''");
        if (parts.length === 2) {
          encodedFilename = decodeURIComponent(parts[1]);
        }
      }
      state.info = {
        name: contentDisposition.parameters.name ?? "",
        filename: encodedFilename ?? contentDisposition.parameters.filename,
        contentType: contentType.value === "" ? contentDisposition.parameters.filename !== void 0 ? "application/octet-stream" : "text/plain" : contentType.value,
        contentTypeParameters: contentType.parameters,
        contentDisposition: contentDisposition.value,
        contentDispositionParameters: contentDisposition.parameters,
        headers: result.headers
      };
      state.state = State2.body;
      state.isFile = isFile3(state.info);
      if (state.isFile) {
        state.onChunk = onPart(state.info);
      }
      if (result.endPosition < chunk.length) {
        if (state.isFile) {
          state.onChunk(chunk.subarray(result.endPosition));
        } else {
          const buf = chunk.subarray(result.endPosition);
          if ((state.fieldSize += buf.length) > maxFieldSize) {
            onError2(errMaxFieldSize);
          }
          state.fieldChunks.push(buf);
        }
      }
    } else if (state.isFile) {
      state.onChunk(chunk);
    } else {
      if ((state.fieldSize += chunk.length) > maxFieldSize) {
        onError2(errMaxFieldSize);
      }
      state.fieldChunks.push(chunk);
    }
  }, constCR);
  return {
    write(chunk) {
      if ((state.totalSize += chunk.length) > maxTotalSize) {
        return onError2(errMaxTotalSize);
      }
      return split.write(chunk);
    },
    end() {
      split.end();
      if (state.state === State2.body) {
        onError2(errEndNotReached);
      }
      state.state = State2.headers;
      state.index = 0;
      state.parts = 0;
      state.onChunk = noopOnChunk;
      state.info = void 0;
      state.totalSize = 0;
      state.partSize = 0;
      state.fieldChunks = [];
      state.fieldSize = 0;
    }
  };
}
var utf8Decoder = new TextDecoder("utf-8");
function getDecoder(charset) {
  if (charset === "utf-8" || charset === "utf8" || charset === "") {
    return utf8Decoder;
  }
  try {
    return new TextDecoder(charset);
  } catch (error) {
    return utf8Decoder;
  }
}
function decodeField(info, value2) {
  return getDecoder(info.contentTypeParameters.charset ?? "utf-8").decode(value2);
}

// node_modules/multipasta/dist/esm/index.js
var make18 = make17;
var defaultIsFile2 = defaultIsFile;
var decodeField2 = decodeField;

// node_modules/@effect/platform/dist/esm/Multipart.js
var TypeId18 = Symbol.for("@effect/platform/Multipart");
var isPart = (u) => hasProperty(u, TypeId18);
var isField = (u) => isPart(u) && u._tag === "Field";
var isFile2 = (u) => isPart(u) && u._tag === "File";
var isPersistedFile = (u) => hasProperty(u, TypeId18) && isTagged(u, "PersistedFile");
var ErrorTypeId4 = Symbol.for("@effect/platform/Multipart/MultipartError");
var MultipartError = class extends TaggedError2()("MultipartError", {
  reason: Literal("FileTooLarge", "FieldTooLarge", "BodyTooLarge", "TooManyParts", "InternalError", "Parse"),
  cause: Defect
}) {
  /**
   * @since 1.0.0
   */
  [ErrorTypeId4] = ErrorTypeId4;
  /**
   * @since 1.0.0
   */
  get message() {
    return this.reason;
  }
};
var FileSchema = declare(isPersistedFile, {
  identifier: "PersistedFile",
  jsonSchema: {
    type: "string",
    format: "binary"
  }
});
var FilesSchema = Array$(FileSchema);
var SingleFileSchema = transform(FilesSchema.pipe(itemsCount(1)), FileSchema, {
  strict: true,
  decode: ([file5]) => file5,
  encode: (file5) => [file5]
});
var schemaPersisted = (schema4, options7) => decodeUnknown(schema4, options7);
var schemaJson4 = (schema4, options7) => {
  const fromJson = parseJson(schema4);
  return dual(2, (persisted, field) => map5(decodeUnknown(Struct({
    [field]: fromJson
  }), options7)(persisted), (_) => _[field]));
};
var makeConfig = (headers) => withFiberRuntime((fiber) => {
  const mimeTypes = get2(fiber.currentContext, FieldMimeTypes);
  return succeed2({
    headers,
    maxParts: getOrUndefined(get2(fiber.currentContext, MaxParts)),
    maxFieldSize: Number(get2(fiber.currentContext, MaxFieldSize)),
    maxPartSize: get2(fiber.currentContext, MaxFileSize).pipe(map2(Number), getOrUndefined),
    maxTotalSize: get2(fiber.currentContext, MaxBodySize).pipe(map2(Number), getOrUndefined),
    isFile: mimeTypes.length === 0 ? void 0 : (info) => !some2(mimeTypes, (_) => info.contentType.includes(_)) && defaultIsFile2(info)
  });
});
var makeChannel = (headers, bufferSize = 16) => acquireUseRelease2(all([makeConfig(headers), make5(bufferSize)]), ([config, mailbox]) => {
  let partsBuffer = [];
  let exit2 = none();
  const input = {
    awaitRead: () => _void,
    emit(element) {
      return mailbox.offer(element);
    },
    error(cause) {
      exit2 = some(failCause2(cause));
      return mailbox.end;
    },
    done(_value) {
      return mailbox.end;
    }
  };
  const parser = make18({
    ...config,
    onField(info, value2) {
      partsBuffer.push(new FieldImpl(info.name, info.contentType, decodeField2(info, value2)));
    },
    onFile(info) {
      let chunks = [];
      let finished = false;
      const take = suspend2(() => {
        if (chunks.length === 0) {
          return finished ? void_2 : zipRight2(pump, take);
        }
        const chunk = unsafeFromArray(chunks);
        chunks = [];
        return finished ? write(chunk) : zipRight2(write(chunk), zipRight2(pump, take));
      });
      partsBuffer.push(new FileImpl(info, take));
      return function(chunk) {
        if (chunk === null) {
          finished = true;
        } else {
          chunks.push(chunk);
        }
      };
    },
    onError(error_) {
      exit2 = some(fail2(convertError(error_)));
    },
    onDone() {
      exit2 = some(void_);
    }
  });
  const pump = flatMap3(mailbox.takeAll, ([chunks, done]) => sync3(() => {
    forEach(chunks, forEach(parser.write));
    if (done) {
      parser.end();
    }
  }));
  const partsChannel = flatMap3(pump, () => {
    if (partsBuffer.length === 0) {
      return exit2._tag === "None" ? partsChannel : writeExit(exit2.value);
    }
    const chunk = unsafeFromArray(partsBuffer);
    partsBuffer = [];
    return zipRight2(write(chunk), exit2._tag === "None" ? partsChannel : writeExit(exit2.value));
  });
  return embedInput(partsChannel, input);
}, ([, mailbox]) => mailbox.shutdown);
var writeExit = (self) => self._tag === "Success" ? void_2 : failCause4(self.cause);
function convertError(cause) {
  switch (cause._tag) {
    case "ReachedLimit": {
      switch (cause.limit) {
        case "MaxParts": {
          return new MultipartError({
            reason: "TooManyParts",
            cause
          });
        }
        case "MaxFieldSize": {
          return new MultipartError({
            reason: "FieldTooLarge",
            cause
          });
        }
        case "MaxPartSize": {
          return new MultipartError({
            reason: "FileTooLarge",
            cause
          });
        }
        case "MaxTotalSize": {
          return new MultipartError({
            reason: "BodyTooLarge",
            cause
          });
        }
      }
    }
    default: {
      return new MultipartError({
        reason: "Parse",
        cause
      });
    }
  }
}
var PartBase = class extends Class {
  [TypeId18];
  constructor() {
    super();
    this[TypeId18] = TypeId18;
  }
};
var FieldImpl = class extends PartBase {
  key;
  contentType;
  value;
  _tag = "Field";
  constructor(key, contentType, value2) {
    super();
    this.key = key;
    this.contentType = contentType;
    this.value = value2;
  }
  toJSON() {
    return {
      _id: "@effect/platform/Multipart/Part",
      _tag: "Field",
      key: this.key,
      contentType: this.contentType,
      value: this.value
    };
  }
};
var FileImpl = class extends PartBase {
  _tag = "File";
  key;
  name;
  contentType;
  content;
  contentEffect;
  constructor(info, channel) {
    super();
    this.key = info.name;
    this.name = info.filename ?? info.name;
    this.contentType = info.contentType;
    this.content = fromChannel(channel);
    this.contentEffect = channel.pipe(pipeTo(collectUint8Array), run, mapError((cause) => new MultipartError({
      reason: "InternalError",
      cause
    })));
  }
  toJSON() {
    return {
      _id: "@effect/platform/Multipart/Part",
      _tag: "File",
      key: this.key,
      name: this.name,
      contentType: this.contentType
    };
  }
};
var defaultWriteFile = (path, file5) => flatMap2(FileSystem, (fs) => mapError(run3(file5.content, fs.sink(path)), (cause) => new MultipartError({
  reason: "InternalError",
  cause
})));
var collectUint8Array = suspend2(() => {
  let accumulator = new Uint8Array(0);
  const loop = readWithCause({
    onInput(chunk) {
      for (const element of chunk) {
        const newAccumulator = new Uint8Array(accumulator.length + element.length);
        newAccumulator.set(accumulator, 0);
        newAccumulator.set(element, accumulator.length);
        accumulator = newAccumulator;
      }
      return loop;
    },
    onFailure: (cause) => failCause4(cause),
    onDone: () => succeed4(accumulator)
  });
  return loop;
});
var toPersisted = (stream8, writeFile = defaultWriteFile) => gen(function* () {
  const fs = yield* FileSystem;
  const path_ = yield* Path2;
  const dir = yield* fs.makeTempDirectoryScoped();
  const persisted = /* @__PURE__ */ Object.create(null);
  yield* runForEach(stream8, (part) => {
    if (part._tag === "Field") {
      if (!(part.key in persisted)) {
        persisted[part.key] = part.value;
      } else if (typeof persisted[part.key] === "string") {
        persisted[part.key] = [persisted[part.key], part.value];
      } else {
        ;
        persisted[part.key].push(part.value);
      }
      return _void;
    } else if (part.name === "") {
      return _void;
    }
    const file5 = part;
    const path = path_.join(dir, path_.basename(file5.name).slice(-128));
    const filePart = new PersistedFileImpl(file5.key, file5.name, file5.contentType, path);
    if (Array.isArray(persisted[part.key])) {
      ;
      persisted[part.key].push(filePart);
    } else {
      persisted[part.key] = [filePart];
    }
    return writeFile(path, file5);
  });
  return persisted;
}).pipe(catchTags({
  SystemError: (cause) => fail4(new MultipartError({
    reason: "InternalError",
    cause
  })),
  BadArgument: (cause) => fail4(new MultipartError({
    reason: "InternalError",
    cause
  }))
}));
var PersistedFileImpl = class extends PartBase {
  key;
  name;
  contentType;
  path;
  _tag = "PersistedFile";
  constructor(key, name, contentType, path) {
    super();
    this.key = key;
    this.name = name;
    this.contentType = contentType;
    this.path = path;
  }
  toJSON() {
    return {
      _id: "@effect/platform/Multipart/Part",
      _tag: "PersistedFile",
      key: this.key,
      name: this.name,
      contentType: this.contentType,
      path: this.path
    };
  }
};
var withLimits = dual(2, (effect2, options7) => provide(effect2, withLimitsContext(options7)));
var withLimitsContext = (options7) => {
  const contextMap = /* @__PURE__ */ new Map();
  if (options7.maxParts !== void 0) {
    contextMap.set(MaxParts.key, options7.maxParts);
  }
  if (options7.maxFieldSize !== void 0) {
    contextMap.set(MaxFieldSize.key, Size2(options7.maxFieldSize));
  }
  if (options7.maxFileSize !== void 0) {
    contextMap.set(MaxFileSize.key, map2(options7.maxFileSize, Size2));
  }
  if (options7.maxTotalSize !== void 0) {
    contextMap.set(MaxBodySize.key, map2(options7.maxTotalSize, Size2));
  }
  if (options7.fieldMimeTypes !== void 0) {
    contextMap.set(FieldMimeTypes.key, fromIterable2(options7.fieldMimeTypes));
  }
  return unsafeMake(contextMap);
};
var withLimitsStream = dual(2, (stream8, options7) => provideSomeContext(stream8, withLimitsContext(options7)));
var MaxParts = class extends Reference()("@effect/platform/Multipart/MaxParts", {
  defaultValue: none
}) {
};
var withMaxParts = dual(2, (effect2, count) => provideService(effect2, MaxParts, count));
var MaxFieldSize = class extends Reference()("@effect/platform/Multipart/MaxFieldSize", {
  defaultValue: constant(Size2(10 * 1024 * 1024))
}) {
};
var withMaxFieldSize = dual(2, (effect2, size) => provideService(effect2, MaxFieldSize, Size2(size)));
var MaxFileSize = class extends Reference()("@effect/platform/Multipart/MaxFileSize", {
  defaultValue: none
}) {
};
var withMaxFileSize = dual(2, (effect2, size) => provideService(effect2, MaxFileSize, map2(size, Size2)));
var FieldMimeTypes = class extends Reference()("@effect/platform/Multipart/FieldMimeTypes", {
  defaultValue: constant(make("application/json"))
}) {
};
var withFieldMimeTypes = dual(2, (effect2, mimeTypes) => provideService(effect2, FieldMimeTypes, fromIterable2(mimeTypes)));

// node_modules/@effect/platform/dist/esm/Socket.js
var Socket_exports = {};
__export(Socket_exports, {
  CloseEvent: () => CloseEvent,
  CloseEventTypeId: () => CloseEventTypeId,
  Socket: () => Socket,
  SocketCloseError: () => SocketCloseError,
  SocketErrorTypeId: () => SocketErrorTypeId,
  SocketGenericError: () => SocketGenericError,
  TypeId: () => TypeId19,
  WebSocket: () => WebSocket,
  WebSocketConstructor: () => WebSocketConstructor,
  currentSendQueueCapacity: () => currentSendQueueCapacity,
  defaultCloseCodeIsError: () => defaultCloseCodeIsError,
  fromTransformStream: () => fromTransformStream,
  fromWebSocket: () => fromWebSocket,
  isCloseEvent: () => isCloseEvent,
  isSocket: () => isSocket,
  isSocketError: () => isSocketError,
  layerWebSocket: () => layerWebSocket,
  layerWebSocketConstructorGlobal: () => layerWebSocketConstructorGlobal,
  makeChannel: () => makeChannel2,
  makeWebSocket: () => makeWebSocket,
  makeWebSocketChannel: () => makeWebSocketChannel,
  toChannel: () => toChannel2,
  toChannelMap: () => toChannelMap,
  toChannelString: () => toChannelString,
  toChannelWith: () => toChannelWith
});
var TypeId19 = Symbol.for("@effect/platform/Socket");
var isSocket = (u) => hasProperty(u, TypeId19);
var Socket = GenericTag("@effect/platform/Socket");
var CloseEventTypeId = Symbol.for("@effect/platform/Socket/CloseEvent");
var CloseEvent = class {
  code;
  reason;
  /**
   * @since 1.0.0
   */
  [CloseEventTypeId];
  constructor(code = 1e3, reason) {
    this.code = code;
    this.reason = reason;
    this[CloseEventTypeId] = CloseEventTypeId;
  }
  /**
   * @since 1.0.0
   */
  toString() {
    return this.reason ? `${this.code}: ${this.reason}` : `${this.code}`;
  }
};
var isCloseEvent = (u) => hasProperty(u, CloseEventTypeId);
var SocketErrorTypeId = Symbol.for("@effect/platform/Socket/SocketError");
var isSocketError = (u) => hasProperty(u, SocketErrorTypeId);
var SocketGenericError = class extends TypeIdError(SocketErrorTypeId, "SocketError") {
  get message() {
    return `An error occurred during ${this.reason}`;
  }
};
var SocketCloseError = class _SocketCloseError extends TypeIdError(SocketErrorTypeId, "SocketError") {
  /**
   * @since 1.0.0
   */
  static is(u) {
    return isSocketError(u) && u.reason === "Close";
  }
  /**
   * @since 1.0.0
   */
  static isClean(isClean) {
    return function(u) {
      return _SocketCloseError.is(u) && isClean(u.code);
    };
  }
  get message() {
    if (this.closeReason) {
      return `${this.reason}: ${this.code}: ${this.closeReason}`;
    }
    return `${this.reason}: ${this.code}`;
  }
};
var toChannelMap = (self, f) => gen(function* () {
  const scope2 = yield* scope;
  const mailbox = yield* make5();
  const writeScope = yield* fork(scope2, sequential);
  const write2 = yield* extend(self.writer, writeScope);
  function* emit(chunk) {
    for (const data of chunk) {
      yield* write2(data);
    }
  }
  const input = {
    awaitRead: () => _void,
    emit(chunk) {
      return catchAllCause(gen(() => emit(chunk)), (cause) => mailbox.failCause(cause));
    },
    error(error) {
      return zipRight(close(writeScope, void_), mailbox.failCause(error));
    },
    done() {
      return close(writeScope, void_);
    }
  };
  yield* self.runRaw((data) => {
    mailbox.unsafeOffer(f(data));
  }).pipe(into(mailbox), forkIn(scope2), interruptible);
  return embedInput(toChannel(mailbox), input);
}).pipe(unwrapScoped2);
var toChannel2 = (self) => {
  const encoder2 = new TextEncoder();
  return toChannelMap(self, (data) => typeof data === "string" ? encoder2.encode(data) : data);
};
var toChannelString = dual((args) => isSocket(args[0]), (self, encoding) => {
  const decoder2 = new TextDecoder(encoding);
  return toChannelMap(self, (data) => typeof data === "string" ? data : decoder2.decode(data));
});
var toChannelWith = () => (self) => toChannel2(self);
var makeChannel2 = () => unwrap(map5(Socket, toChannelWith()));
var defaultCloseCodeIsError = (code) => code !== 1e3 && code !== 1006;
var WebSocket = GenericTag("@effect/platform/Socket/WebSocket");
var WebSocketConstructor = GenericTag("@effect/platform/Socket/WebSocketConstructor");
var layerWebSocketConstructorGlobal = succeed3(WebSocketConstructor, (url, protocols) => new globalThis.WebSocket(url, protocols));
var makeWebSocket = (url, options7) => fromWebSocket(acquireRelease((typeof url === "string" ? succeed2(url) : url).pipe(flatMap2((url2) => map5(WebSocketConstructor, (f) => f(url2, options7?.protocols)))), (ws) => sync(() => ws.close(1e3))), options7);
var fromWebSocket = (acquire, options7) => withFiberRuntime((fiber) => {
  let currentWS;
  const latch = unsafeMakeLatch(false);
  const acquireContext = fiber.currentContext;
  const closeCodeIsError = options7?.closeCodeIsError ?? defaultCloseCodeIsError;
  const runRaw = (handler2) => scopedWith((scope2) => gen(function* () {
    const fiberSet = yield* make4().pipe(extend(scope2));
    const ws = yield* extend(acquire, scope2);
    const run5 = yield* provideService(runtime3(fiberSet)(), WebSocket, ws);
    let open = false;
    function onMessage(event) {
      if (event.data instanceof Blob) {
        return promise(() => event.data.arrayBuffer()).pipe(andThen((buffer) => handler2(new Uint8Array(buffer))), run5);
      }
      const result = handler2(event.data);
      if (isEffect(result)) {
        run5(result);
      }
    }
    function onError2(cause) {
      ws.removeEventListener("message", onMessage);
      ws.removeEventListener("close", onClose);
      unsafeDone(fiberSet.deferred, fail4(new SocketGenericError({
        reason: open ? "Read" : "Open",
        cause
      })));
    }
    function onClose(event) {
      ws.removeEventListener("message", onMessage);
      ws.removeEventListener("error", onError2);
      unsafeDone(fiberSet.deferred, fail4(new SocketCloseError({
        reason: "Close",
        code: event.code,
        closeReason: event.reason
      })));
    }
    ws.addEventListener("close", onClose, {
      once: true
    });
    ws.addEventListener("error", onError2, {
      once: true
    });
    ws.addEventListener("message", onMessage);
    if (ws.readyState !== 1) {
      const openDeferred = unsafeMake2(fiber.id());
      ws.addEventListener("open", () => {
        open = true;
        unsafeDone(openDeferred, _void);
      }, {
        once: true
      });
      yield* _await(openDeferred).pipe(timeoutFail({
        duration: options7?.openTimeout ?? 1e4,
        onTimeout: () => new SocketGenericError({
          reason: "OpenTimeout",
          cause: 'timeout waiting for "open"'
        })
      }), raceFirst(join(fiberSet)));
    }
    open = true;
    currentWS = ws;
    yield* latch.open;
    return yield* join(fiberSet).pipe(catchIf(SocketCloseError.isClean((_) => !closeCodeIsError(_)), (_) => _void));
  })).pipe(mapInputContext((input) => merge(acquireContext, input)), ensuring(sync(() => {
    latch.unsafeClose();
    currentWS = void 0;
  })), interruptible);
  const encoder2 = new TextEncoder();
  const run4 = (handler2) => runRaw((data) => typeof data === "string" ? handler2(encoder2.encode(data)) : data instanceof Uint8Array ? handler2(data) : handler2(new Uint8Array(data)));
  const write2 = (chunk) => latch.whenOpen(sync(() => {
    const ws = currentWS;
    if (isCloseEvent(chunk)) {
      ws.close(chunk.code, chunk.reason);
    } else {
      ws.send(chunk);
    }
  }));
  const writer = succeed2(write2);
  return succeed2(Socket.of({
    [TypeId19]: TypeId19,
    run: run4,
    runRaw,
    writer
  }));
});
var makeWebSocketChannel = (url, options7) => unwrapScoped2(map5(makeWebSocket(url, options7), toChannelWith()));
var layerWebSocket = (url, options7) => effect(Socket, makeWebSocket(url, options7));
var currentSendQueueCapacity = globalValue("@effect/platform/Socket/currentSendQueueCapacity", () => unsafeMake3(16));
var fromTransformStream = (acquire, options7) => withFiberRuntime((fiber) => {
  const latch = unsafeMakeLatch(false);
  let currentStream;
  const acquireContext = fiber.currentContext;
  const closeCodeIsError = options7?.closeCodeIsError ?? defaultCloseCodeIsError;
  const runRaw = (handler2) => scopedWith((scope2) => gen(function* () {
    const stream8 = yield* extend(acquire, scope2);
    const reader = stream8.readable.getReader();
    yield* addFinalizer(scope2, promise(() => reader.cancel()));
    const fiberSet = yield* make4().pipe(extend(scope2));
    const runFork2 = yield* runtime3(fiberSet)();
    yield* tryPromise({
      try: async () => {
        while (true) {
          const {
            done,
            value: value2
          } = await reader.read();
          if (done) {
            throw new SocketCloseError({
              reason: "Close",
              code: 1e3
            });
          }
          const result = handler2(value2);
          if (isEffect(result)) {
            runFork2(result);
          }
        }
      },
      catch: (cause) => isSocketError(cause) ? cause : new SocketGenericError({
        reason: "Read",
        cause
      })
    }).pipe(run2(fiberSet));
    currentStream = {
      stream: stream8,
      fiberSet
    };
    yield* latch.open;
    return yield* join(fiberSet).pipe(catchIf(SocketCloseError.isClean((_) => !closeCodeIsError(_)), (_) => _void));
  })).pipe((_) => _, mapInputContext((input) => merge(acquireContext, input)), ensuring(sync(() => {
    latch.unsafeClose();
    currentStream = void 0;
  })), interruptible);
  const encoder2 = new TextEncoder();
  const run4 = (handler2) => runRaw((data) => typeof data === "string" ? handler2(encoder2.encode(data)) : handler2(data));
  const writers = /* @__PURE__ */ new WeakMap();
  const getWriter = (stream8) => {
    let writer2 = writers.get(stream8);
    if (!writer2) {
      writer2 = stream8.writable.getWriter();
      writers.set(stream8, writer2);
    }
    return writer2;
  };
  const write2 = (chunk) => latch.whenOpen(suspend(() => {
    const {
      fiberSet,
      stream: stream8
    } = currentStream;
    if (isCloseEvent(chunk)) {
      return fail(fiberSet.deferred, new SocketCloseError({
        reason: "Close",
        code: chunk.code,
        closeReason: chunk.reason
      }));
    }
    return promise(() => getWriter(stream8).write(typeof chunk === "string" ? encoder2.encode(chunk) : chunk));
  }));
  const writer = acquireRelease(succeed2(write2), () => promise(async () => {
    if (!currentStream) return;
    await getWriter(currentStream.stream).close();
  }));
  return succeed2(Socket.of({
    [TypeId19]: TypeId19,
    run: run4,
    runRaw,
    writer
  }));
});

// node_modules/@effect/platform/dist/esm/HttpServerRequest.js
var HttpServerRequest_exports = {};
__export(HttpServerRequest_exports, {
  HttpServerRequest: () => HttpServerRequest,
  MaxBodySize: () => MaxBodySize,
  ParsedSearchParams: () => ParsedSearchParams,
  TypeId: () => TypeId21,
  fromWeb: () => fromWeb2,
  persistedMultipart: () => persistedMultipart,
  schemaBodyForm: () => schemaBodyForm2,
  schemaBodyFormJson: () => schemaBodyFormJson2,
  schemaBodyJson: () => schemaBodyJson3,
  schemaBodyMultipart: () => schemaBodyMultipart2,
  schemaBodyUrlParams: () => schemaBodyUrlParams3,
  schemaCookies: () => schemaCookies2,
  schemaHeaders: () => schemaHeaders3,
  schemaSearchParams: () => schemaSearchParams2,
  searchParamsFromURL: () => searchParamsFromURL2,
  toURL: () => toURL2,
  upgrade: () => upgrade2,
  upgradeChannel: () => upgradeChannel2,
  withMaxBodySize: () => withMaxBodySize
});

// node_modules/@effect/platform/dist/esm/internal/httpServerRequest.js
var TypeId20 = Symbol.for("@effect/platform/HttpServerRequest");
var serverRequestTag = GenericTag("@effect/platform/HttpServerRequest");
var parsedSearchParamsTag = GenericTag("@effect/platform/HttpServerRequest/ParsedSearchParams");
var upgrade = flatMap2(serverRequestTag, (request) => request.upgrade);
var upgradeChannel = () => unwrap(map5(upgrade, toChannelWith()));
var multipartPersisted = flatMap2(serverRequestTag, (request) => request.multipart);
var searchParamsFromURL = (url) => {
  const out = {};
  for (const [key, value2] of url.searchParams.entries()) {
    const entry = out[key];
    if (entry !== void 0) {
      if (Array.isArray(entry)) {
        entry.push(value2);
      } else {
        out[key] = [entry, value2];
      }
    } else {
      out[key] = value2;
    }
  }
  return out;
};
var schemaCookies = (schema4, options7) => {
  const parse3 = decodeUnknown(schema4, options7);
  return flatMap2(serverRequestTag, (req) => parse3(req.cookies));
};
var schemaHeaders2 = (schema4, options7) => {
  const parse3 = schemaHeaders(schema4, options7);
  return flatMap2(serverRequestTag, parse3);
};
var schemaSearchParams = (schema4, options7) => {
  const parse3 = decodeUnknown(schema4, options7);
  return flatMap2(parsedSearchParamsTag, parse3);
};
var schemaBodyJson2 = (schema4, options7) => {
  const parse3 = schemaBodyJson(schema4, options7);
  return flatMap2(serverRequestTag, parse3);
};
var isMultipart = (request) => request.headers["content-type"]?.toLowerCase().includes("multipart/form-data");
var schemaBodyForm = (schema4, options7) => {
  const parseMultipart = schemaPersisted(schema4, options7);
  const parseUrlParams = schemaBodyUrlParams(schema4, options7);
  return flatMap2(serverRequestTag, (request) => {
    if (isMultipart(request)) {
      return flatMap2(request.multipart, parseMultipart);
    }
    return parseUrlParams(request);
  });
};
var schemaBodyUrlParams2 = (schema4, options7) => {
  const parse3 = schemaBodyUrlParams(schema4, options7);
  return flatMap2(serverRequestTag, parse3);
};
var schemaBodyMultipart = (schema4, options7) => {
  const parse3 = schemaPersisted(schema4, options7);
  return flatMap2(multipartPersisted, parse3);
};
var schemaBodyFormJson = (schema4, options7) => {
  const parseMultipart = schemaJson4(schema4, options7);
  const parseUrlParams = schemaJson(schema4, options7);
  return (field) => flatMap2(serverRequestTag, (request) => {
    if (isMultipart(request)) {
      return flatMap2(mapError(request.multipart, (cause) => new RequestError2({
        request,
        reason: "Decode",
        cause
      })), parseMultipart(field));
    }
    return flatMap2(request.urlParamsBody, parseUrlParams(field));
  });
};
var fromWeb = (request) => new ServerRequestImpl(request, removeHost(request.url));
var removeHost = (url) => {
  if (url[0] === "/") {
    return url;
  }
  const index = url.indexOf("/", url.indexOf("//") + 2);
  return index === -1 ? "/" : url.slice(index);
};
var ServerRequestImpl = class _ServerRequestImpl extends Class {
  source;
  url;
  headersOverride;
  remoteAddressOverride;
  [TypeId20];
  [TypeId6];
  constructor(source, url, headersOverride, remoteAddressOverride) {
    super();
    this.source = source;
    this.url = url;
    this.headersOverride = headersOverride;
    this.remoteAddressOverride = remoteAddressOverride;
    this[TypeId20] = TypeId20;
    this[TypeId6] = TypeId6;
  }
  toJSON() {
    return inspect(this, {
      _id: "@effect/platform/HttpServerRequest",
      method: this.method,
      url: this.originalUrl
    });
  }
  modify(options7) {
    return new _ServerRequestImpl(this.source, options7.url ?? this.url, options7.headers ?? this.headersOverride, options7.remoteAddress ?? this.remoteAddressOverride);
  }
  get method() {
    return this.source.method.toUpperCase();
  }
  get originalUrl() {
    return this.source.url;
  }
  get remoteAddress() {
    return this.remoteAddressOverride ? some(this.remoteAddressOverride) : none();
  }
  get headers() {
    this.headersOverride ??= fromInput(this.source.headers);
    return this.headersOverride;
  }
  cachedCookies;
  get cookies() {
    if (this.cachedCookies) {
      return this.cachedCookies;
    }
    return this.cachedCookies = parseHeader(this.headers.cookie ?? "");
  }
  get stream() {
    return this.source.body ? fromReadableStream(() => this.source.body, (cause) => new RequestError2({
      request: this,
      reason: "Decode",
      cause
    })) : fail7(new RequestError2({
      request: this,
      reason: "Decode",
      description: "can not create stream from empty body"
    }));
  }
  textEffect;
  get text() {
    if (this.textEffect) {
      return this.textEffect;
    }
    this.textEffect = runSync(cached(tryPromise({
      try: () => this.source.text(),
      catch: (cause) => new RequestError2({
        request: this,
        reason: "Decode",
        cause
      })
    })));
    return this.textEffect;
  }
  get json() {
    return tryMap(this.text, {
      try: (_) => JSON.parse(_),
      catch: (cause) => new RequestError2({
        request: this,
        reason: "Decode",
        cause
      })
    });
  }
  get urlParamsBody() {
    return flatMap2(this.text, (_) => try_({
      try: () => fromInput2(new URLSearchParams(_)),
      catch: (cause) => new RequestError2({
        request: this,
        reason: "Decode",
        cause
      })
    }));
  }
  multipartEffect;
  get multipart() {
    if (this.multipartEffect) {
      return this.multipartEffect;
    }
    this.multipartEffect = runSync(cached(toPersisted(this.multipartStream)));
    return this.multipartEffect;
  }
  get multipartStream() {
    return pipeThroughChannel(mapError2(this.stream, (cause) => new MultipartError({
      reason: "InternalError",
      cause
    })), makeChannel(this.headers));
  }
  arrayBufferEffect;
  get arrayBuffer() {
    if (this.arrayBufferEffect) {
      return this.arrayBufferEffect;
    }
    this.arrayBufferEffect = runSync(cached(tryPromise({
      try: () => this.source.arrayBuffer(),
      catch: (cause) => new RequestError2({
        request: this,
        reason: "Decode",
        cause
      })
    })));
    return this.arrayBufferEffect;
  }
  get upgrade() {
    return fail4(new RequestError2({
      request: this,
      reason: "Decode",
      description: "Not an upgradeable ServerRequest"
    }));
  }
};
var toURL = (self) => {
  const host = self.headers.host ?? "localhost";
  const protocol = self.headers["x-forwarded-proto"] === "https" ? "https" : "http";
  try {
    return some(new URL(self.url, `${protocol}://${host}`));
  } catch {
    return none();
  }
};

// node_modules/@effect/platform/dist/esm/HttpServerRequest.js
var TypeId21 = TypeId20;
var HttpServerRequest = serverRequestTag;
var ParsedSearchParams = parsedSearchParamsTag;
var searchParamsFromURL2 = searchParamsFromURL;
var persistedMultipart = multipartPersisted;
var upgrade2 = upgrade;
var upgradeChannel2 = upgradeChannel;
var schemaCookies2 = schemaCookies;
var schemaHeaders3 = schemaHeaders2;
var schemaSearchParams2 = schemaSearchParams;
var schemaBodyJson3 = schemaBodyJson2;
var schemaBodyForm2 = schemaBodyForm;
var schemaBodyUrlParams3 = schemaBodyUrlParams2;
var schemaBodyMultipart2 = schemaBodyMultipart;
var schemaBodyFormJson2 = schemaBodyFormJson;
var fromWeb2 = fromWeb;
var toURL2 = toURL;

// node_modules/@effect/platform/dist/esm/HttpApp.js
var HttpApp_exports = {};
__export(HttpApp_exports, {
  appendPreResponseHandler: () => appendPreResponseHandler2,
  currentPreResponseHandlers: () => currentPreResponseHandlers2,
  ejectDefaultScopeClose: () => ejectDefaultScopeClose,
  toHandled: () => toHandled,
  toWebHandler: () => toWebHandler,
  toWebHandlerLayer: () => toWebHandlerLayer,
  toWebHandlerRuntime: () => toWebHandlerRuntime,
  unsafeEjectStreamScope: () => unsafeEjectStreamScope,
  withPreResponseHandler: () => withPreResponseHandler2
});

// node_modules/@effect/platform/dist/esm/internal/httpApp.js
var currentPreResponseHandlers = globalValue(Symbol.for("@effect/platform/HttpApp/preResponseHandlers"), () => unsafeMake3(none()));
var appendPreResponseHandler = (handler2) => update2(currentPreResponseHandlers, match2({
  onNone: () => some(handler2),
  onSome: (prev) => some((request, response) => flatMap2(prev(request, response), (response2) => handler2(request, response2)))
}));
var withPreResponseHandler = dual(2, (self, handler2) => locallyWith(self, currentPreResponseHandlers, match2({
  onNone: () => some(handler2),
  onSome: (prev) => some((request, response) => flatMap2(prev(request, response), (response2) => handler2(request, response2)))
})));

// node_modules/@effect/platform/dist/esm/internal/httpMiddleware.js
var make19 = (middleware3) => middleware3;
var loggerDisabled = globalValue(Symbol.for("@effect/platform/HttpMiddleware/loggerDisabled"), () => unsafeMake3(false));
var withLoggerDisabled = (self) => zipRight(set2(loggerDisabled, true), self);
var currentTracerDisabledWhen = globalValue(Symbol.for("@effect/platform/HttpMiddleware/tracerDisabledWhen"), () => unsafeMake3(constFalse));
var withTracerDisabledWhen = dual(2, (self, pred) => locally2(self, currentTracerDisabledWhen, pred));
var withTracerDisabledWhenEffect = dual(2, (self, pred) => locally(self, currentTracerDisabledWhen, pred));
var withTracerDisabledForUrls = dual(2, (self, urls) => locally2(self, currentTracerDisabledWhen, (req) => urls.includes(req.url)));
var SpanNameGenerator = Reference()("@effect/platform/HttpMiddleware/SpanNameGenerator", {
  defaultValue: () => (request) => `http.server ${request.method}`
});
var withSpanNameGenerator = dual(2, (self, f) => provide2(self, succeed3(SpanNameGenerator, f)));
var logger = make19((httpApp2) => {
  let counter = 0;
  return withFiberRuntime((fiber) => {
    const request = unsafeGet(fiber.currentContext, HttpServerRequest);
    return withLogSpan(flatMap2(exit(httpApp2), (exit2) => {
      if (fiber.getFiberRef(loggerDisabled)) {
        return exit2;
      } else if (exit2._tag === "Failure") {
        const [response, cause] = causeResponseStripped2(exit2.cause);
        return zipRight(annotateLogs(log(cause._tag === "Some" ? cause.value : "Sent HTTP Response"), {
          "http.method": request.method,
          "http.url": request.url,
          "http.status": response.status
        }), exit2);
      }
      return zipRight(annotateLogs(log("Sent HTTP response"), {
        "http.method": request.method,
        "http.url": request.url,
        "http.status": exit2.value.status
      }), exit2);
    }), `http.span.${++counter}`);
  });
});
var tracer = make19((httpApp2) => withFiberRuntime((fiber) => {
  const request = unsafeGet(fiber.currentContext, HttpServerRequest);
  const disabled = fiber.getFiberRef(currentTracerDisabledWhen)(request);
  if (disabled) {
    return httpApp2;
  }
  const url = getOrUndefined(toURL2(request));
  if (url !== void 0 && (url.username !== "" || url.password !== "")) {
    url.username = "REDACTED";
    url.password = "REDACTED";
  }
  const redactedHeaderNames = fiber.getFiberRef(currentRedactedNames);
  const redactedHeaders = redact2(request.headers, redactedHeaderNames);
  const nameGenerator = get2(fiber.currentContext, SpanNameGenerator);
  return useSpan(nameGenerator(request), {
    parent: getOrUndefined(fromHeaders(request.headers)),
    kind: "server",
    captureStackTrace: false
  }, (span) => {
    span.attribute("http.request.method", request.method);
    if (url !== void 0) {
      span.attribute("url.full", url.toString());
      span.attribute("url.path", url.pathname);
      const query = url.search.slice(1);
      if (query !== "") {
        span.attribute("url.query", url.search.slice(1));
      }
      span.attribute("url.scheme", url.protocol.slice(0, -1));
    }
    if (request.headers["user-agent"] !== void 0) {
      span.attribute("user_agent.original", request.headers["user-agent"]);
    }
    for (const name in redactedHeaders) {
      span.attribute(`http.request.header.${name}`, String(redactedHeaders[name]));
    }
    if (request.remoteAddress._tag === "Some") {
      span.attribute("client.address", request.remoteAddress.value);
    }
    return flatMap2(exit(withParentSpan(httpApp2, span)), (exit2) => {
      const response = exitResponse2(exit2);
      span.attribute("http.response.status_code", response.status);
      const redactedHeaders2 = redact2(response.headers, redactedHeaderNames);
      for (const name in redactedHeaders2) {
        span.attribute(`http.response.header.${name}`, String(redactedHeaders2[name]));
      }
      return exit2;
    });
  });
}));
var xForwardedHeaders = make19((httpApp2) => updateService(httpApp2, HttpServerRequest, (request) => request.headers["x-forwarded-host"] ? request.modify({
  headers: set4(request.headers, "host", request.headers["x-forwarded-host"]),
  remoteAddress: request.headers["x-forwarded-for"]?.split(",")[0].trim()
}) : request));
var searchParamsParser = (httpApp2) => withFiberRuntime((fiber) => {
  const context2 = fiber.currentContext;
  const request = unsafeGet(context2, HttpServerRequest);
  const params3 = searchParamsFromURL2(new URL(request.originalUrl));
  return locally(httpApp2, currentContext, add(context2, ParsedSearchParams, params3));
});
var cors = (options7) => {
  const opts = {
    allowedOrigins: ["*"],
    allowedMethods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    allowedHeaders: [],
    exposedHeaders: [],
    credentials: false,
    ...options7
  };
  const isAllowedOrigin = (origin) => opts.allowedOrigins.includes(origin);
  const allowOrigin = (originHeader) => {
    if (opts.allowedOrigins.length === 0) {
      return {
        "access-control-allow-origin": "*"
      };
    }
    if (opts.allowedOrigins.length === 1) {
      return {
        "access-control-allow-origin": opts.allowedOrigins[0],
        vary: "Origin"
      };
    }
    if (isAllowedOrigin(originHeader)) {
      return {
        "access-control-allow-origin": originHeader,
        vary: "Origin"
      };
    }
    return void 0;
  };
  const allowMethods = opts.allowedMethods.length > 0 ? {
    "access-control-allow-methods": opts.allowedMethods.join(", ")
  } : void 0;
  const allowCredentials = opts.credentials ? {
    "access-control-allow-credentials": "true"
  } : void 0;
  const allowHeaders = (accessControlRequestHeaders) => {
    if (opts.allowedHeaders.length === 0 && accessControlRequestHeaders) {
      return {
        vary: "Access-Control-Request-Headers",
        "access-control-allow-headers": accessControlRequestHeaders
      };
    }
    if (opts.allowedHeaders) {
      return {
        "access-control-allow-headers": opts.allowedHeaders.join(",")
      };
    }
    return void 0;
  };
  const exposeHeaders = opts.exposedHeaders.length > 0 ? {
    "access-control-expose-headers": opts.exposedHeaders.join(",")
  } : void 0;
  const maxAge = opts.maxAge ? {
    "access-control-max-age": opts.maxAge.toString()
  } : void 0;
  const headersFromRequest = (request) => {
    const origin = request.headers["origin"];
    return unsafeFromRecord({
      ...allowOrigin(origin),
      ...allowCredentials,
      ...exposeHeaders
    });
  };
  const headersFromRequestOptions = (request) => {
    const origin = request.headers["origin"];
    const accessControlRequestHeaders = request.headers["access-control-request-headers"];
    return unsafeFromRecord({
      ...allowOrigin(origin),
      ...allowCredentials,
      ...exposeHeaders,
      ...allowMethods,
      ...allowHeaders(accessControlRequestHeaders),
      ...maxAge
    });
  };
  const preResponseHandler = (request, response) => succeed2(setHeaders2(response, headersFromRequest(request)));
  return (httpApp2) => withFiberRuntime((fiber) => {
    const request = unsafeGet(fiber.currentContext, HttpServerRequest);
    if (request.method === "OPTIONS") {
      return succeed2(empty11({
        status: 204,
        headers: headersFromRequestOptions(request)
      }));
    }
    return zipRight(appendPreResponseHandler(preResponseHandler), httpApp2);
  });
};

// node_modules/@effect/platform/dist/esm/HttpApp.js
var handledSymbol = Symbol.for("@effect/platform/HttpApp/handled");
var toHandled = (self, handleResponse, middleware3) => {
  const responded = withFiberRuntime((fiber) => flatMap2(self, (response) => {
    const request = unsafeGet(fiber.currentContext, HttpServerRequest);
    const handler2 = fiber.getFiberRef(currentPreResponseHandlers2);
    if (handler2._tag === "None") {
      ;
      request[handledSymbol] = true;
      return as(handleResponse(request, response), response);
    }
    return tap(handler2.value(request, response), (response2) => {
      ;
      request[handledSymbol] = true;
      return handleResponse(request, response2);
    });
  }));
  const withErrorHandling = catchAllCause(responded, (cause) => withFiberRuntime((fiber) => flatMap2(causeResponse2(cause), ([response, cause2]) => {
    const request = unsafeGet(fiber.currentContext, HttpServerRequest);
    const handler2 = fiber.getFiberRef(currentPreResponseHandlers2);
    if (handler2._tag === "None") {
      ;
      request[handledSymbol] = true;
      return zipRight(handleResponse(request, response), failCause3(cause2));
    }
    return zipRight(tap(handler2.value(request, response), (response2) => {
      ;
      request[handledSymbol] = true;
      return handleResponse(request, response2);
    }), failCause3(cause2));
  })));
  const withMiddleware = unify(middleware3 === void 0 ? tracer(withErrorHandling) : matchCauseEffect(middleware3(tracer(withErrorHandling)), {
    onFailure: (cause) => withFiberRuntime((fiber) => {
      const request = unsafeGet(fiber.currentContext, HttpServerRequest);
      if (handledSymbol in request) {
        return _void;
      }
      return matchCauseEffect(causeResponse2(cause), {
        onFailure: (_cause) => handleResponse(request, empty11({
          status: 500
        })),
        onSuccess: ([response]) => handleResponse(request, response)
      });
    }),
    onSuccess: (response) => withFiberRuntime((fiber) => {
      const request = unsafeGet(fiber.currentContext, HttpServerRequest);
      return handledSymbol in request ? _void : handleResponse(request, response);
    })
  }));
  return uninterruptible(scoped3(withMiddleware));
};
var ejectDefaultScopeClose = (scope2) => {
  ejectedScopes.add(scope2);
};
var unsafeEjectStreamScope = (response) => {
  if (response.body._tag !== "Stream") {
    return response;
  }
  const fiber = getOrThrow(getCurrentFiber());
  const scope2 = unsafeGet(fiber.currentContext, Scope);
  ejectDefaultScopeClose(scope2);
  return setBody2(response, stream3(ensuring2(response.body.stream, close(scope2, void_)), response.body.contentType, response.body.contentLength));
};
var ejectedScopes = globalValue("@effect/platform/HttpApp/ejectedScopes", () => /* @__PURE__ */ new WeakSet());
var scoped3 = (effect2) => flatMap2(make3(), (scope2) => onExit(extend(effect2, scope2), (exit2) => {
  if (ejectedScopes.has(scope2)) {
    return _void;
  }
  return close(scope2, exit2);
}));
var currentPreResponseHandlers2 = currentPreResponseHandlers;
var appendPreResponseHandler2 = appendPreResponseHandler;
var withPreResponseHandler2 = withPreResponseHandler;
var toWebHandlerRuntime = (runtime4) => {
  const run4 = runFork(runtime4);
  return (self, middleware3) => {
    const resolveSymbol = Symbol.for("@effect/platform/HttpApp/resolve");
    const httpApp2 = toHandled(self, (request, response) => {
      response = unsafeEjectStreamScope(response);
      request[resolveSymbol](toWeb2(response, {
        withoutBody: request.method === "HEAD",
        runtime: runtime4
      }));
      return _void;
    }, middleware3);
    return (request, context2) => new Promise((resolve3) => {
      const contextMap = new Map(runtime4.context.unsafeMap);
      if (isContext(context2)) {
        for (const [key, value2] of context2.unsafeMap) {
          contextMap.set(key, value2);
        }
      }
      const httpServerRequest = fromWeb2(request);
      contextMap.set(HttpServerRequest.key, httpServerRequest);
      httpServerRequest[resolveSymbol] = resolve3;
      const fiber = run4(locally(httpApp2, currentContext, unsafeMake(contextMap)));
      request.signal?.addEventListener("abort", () => {
        fiber.unsafeInterruptAsFork(clientAbortFiberId2);
      }, {
        once: true
      });
    });
  };
};
var toWebHandler = toWebHandlerRuntime(defaultRuntime);
var toWebHandlerLayer = (self, layer9, middleware3) => {
  const scope2 = runSync(make3());
  const close2 = () => runPromise(close(scope2, void_));
  const build = map5(toRuntime(layer9), (_) => toWebHandlerRuntime(_)(self, middleware3));
  const runner = runPromise(extend(build, scope2));
  const handler2 = (request, context2) => runner.then((handler3) => handler3(request, context2));
  return {
    close: close2,
    handler: handler2
  };
};

// node_modules/@effect/platform/dist/esm/HttpMethod.js
var HttpMethod_exports = {};
__export(HttpMethod_exports, {
  all: () => all2,
  hasBody: () => hasBody,
  isHttpMethod: () => isHttpMethod
});
var hasBody = (method) => method !== "GET" && method !== "HEAD" && method !== "OPTIONS";
var all2 = /* @__PURE__ */ new Set(["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"]);
var isHttpMethod = (u) => all2.has(u);

// node_modules/@effect/platform/dist/esm/HttpMiddleware.js
var HttpMiddleware_exports = {};
__export(HttpMiddleware_exports, {
  SpanNameGenerator: () => SpanNameGenerator2,
  cors: () => cors2,
  currentTracerDisabledWhen: () => currentTracerDisabledWhen2,
  logger: () => logger2,
  loggerDisabled: () => loggerDisabled2,
  make: () => make20,
  searchParamsParser: () => searchParamsParser2,
  withLoggerDisabled: () => withLoggerDisabled2,
  withSpanNameGenerator: () => withSpanNameGenerator2,
  withTracerDisabledForUrls: () => withTracerDisabledForUrls2,
  withTracerDisabledWhen: () => withTracerDisabledWhen2,
  withTracerDisabledWhenEffect: () => withTracerDisabledWhenEffect2,
  xForwardedHeaders: () => xForwardedHeaders2
});
var make20 = make19;
var logger2 = logger;
var loggerDisabled2 = loggerDisabled;
var withLoggerDisabled2 = withLoggerDisabled;
var currentTracerDisabledWhen2 = currentTracerDisabledWhen;
var withTracerDisabledWhen2 = withTracerDisabledWhen;
var withTracerDisabledWhenEffect2 = withTracerDisabledWhenEffect;
var withTracerDisabledForUrls2 = withTracerDisabledForUrls;
var xForwardedHeaders2 = xForwardedHeaders;
var searchParamsParser2 = searchParamsParser;
var cors2 = cors;
var SpanNameGenerator2 = SpanNameGenerator;
var withSpanNameGenerator2 = withSpanNameGenerator;

// node_modules/@effect/platform/dist/esm/HttpClient.js
var HttpClient_exports = {};
__export(HttpClient_exports, {
  HttpClient: () => HttpClient,
  SpanNameGenerator: () => SpanNameGenerator4,
  TypeId: () => TypeId25,
  catchAll: () => catchAll4,
  catchTag: () => catchTag3,
  catchTags: () => catchTags3,
  currentTracerDisabledWhen: () => currentTracerDisabledWhen4,
  currentTracerPropagation: () => currentTracerPropagation2,
  del: () => del3,
  execute: () => execute2,
  filterOrElse: () => filterOrElse3,
  filterOrFail: () => filterOrFail3,
  filterStatus: () => filterStatus3,
  filterStatusOk: () => filterStatusOk3,
  followRedirects: () => followRedirects2,
  get: () => get9,
  head: () => head3,
  layerMergedContext: () => layerMergedContext2,
  make: () => make23,
  makeWith: () => makeWith2,
  mapRequest: () => mapRequest2,
  mapRequestEffect: () => mapRequestEffect2,
  mapRequestInput: () => mapRequestInput2,
  mapRequestInputEffect: () => mapRequestInputEffect2,
  options: () => options3,
  patch: () => patch3,
  post: () => post3,
  put: () => put3,
  retry: () => retry3,
  retryTransient: () => retryTransient2,
  tap: () => tap3,
  tapError: () => tapError3,
  tapRequest: () => tapRequest2,
  transform: () => transform3,
  transformResponse: () => transformResponse2,
  withCookiesRef: () => withCookiesRef2,
  withScope: () => withScope2,
  withSpanNameGenerator: () => withSpanNameGenerator4,
  withTracerDisabledWhen: () => withTracerDisabledWhen4,
  withTracerPropagation: () => withTracerPropagation2
});

// node_modules/@effect/platform/dist/esm/internal/httpClientRequest.js
var TypeId22 = Symbol.for("@effect/platform/HttpClientRequest");
var Proto4 = {
  [TypeId22]: TypeId22,
  ...BaseProto,
  toJSON() {
    return {
      _id: "@effect/platform/HttpClientRequest",
      method: this.method,
      url: this.url,
      urlParams: this.urlParams,
      hash: this.hash,
      headers: redact(this.headers),
      body: this.body.toJSON()
    };
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
function makeInternal(method, url, urlParams5, hash, headers, body) {
  const self = Object.create(Proto4);
  self.method = method;
  self.url = url;
  self.urlParams = urlParams5;
  self.hash = hash;
  self.headers = headers;
  self.body = body;
  return self;
}
var isClientRequest = (u) => typeof u === "object" && u !== null && TypeId22 in u;
var empty12 = makeInternal("GET", "", empty7, none(), empty6, empty8);
var make21 = (method) => (url, options7) => modify(empty12, {
  method,
  url,
  ...options7 ?? void 0
});
var get7 = make21("GET");
var post = make21("POST");
var put = make21("PUT");
var patch = make21("PATCH");
var del = make21("DELETE");
var head = make21("HEAD");
var options = make21("OPTIONS");
var modify = dual(2, (self, options7) => {
  let result = self;
  if (options7.method) {
    result = setMethod(result, options7.method);
  }
  if (options7.url) {
    result = setUrl(result, options7.url);
  }
  if (options7.headers) {
    result = setHeaders3(result, options7.headers);
  }
  if (options7.urlParams) {
    result = setUrlParams(result, options7.urlParams);
  }
  if (options7.hash) {
    result = setHash(result, options7.hash);
  }
  if (options7.body) {
    result = setBody3(result, options7.body);
  }
  if (options7.accept) {
    result = accept(result, options7.accept);
  }
  if (options7.acceptJson) {
    result = acceptJson(result);
  }
  return result;
});
var setHeader3 = dual(3, (self, key, value2) => makeInternal(self.method, self.url, self.urlParams, self.hash, set4(self.headers, key, value2), self.body));
var setHeaders3 = dual(2, (self, input) => makeInternal(self.method, self.url, self.urlParams, self.hash, setAll2(self.headers, input), self.body));
var stringOrRedacted = (value2) => typeof value2 === "string" ? value2 : value(value2);
var basicAuth = dual(3, (self, username, password) => setHeader3(self, "Authorization", `Basic ${btoa(`${stringOrRedacted(username)}:${stringOrRedacted(password)}`)}`));
var bearerToken = dual(2, (self, token) => setHeader3(self, "Authorization", `Bearer ${stringOrRedacted(token)}`));
var accept = dual(2, (self, mediaType) => setHeader3(self, "Accept", mediaType));
var acceptJson = accept("application/json");
var setMethod = dual(2, (self, method) => makeInternal(method, self.url, self.urlParams, self.hash, self.headers, self.body));
var setUrl = dual(2, (self, url) => {
  if (typeof url === "string") {
    return makeInternal(self.method, url, self.urlParams, self.hash, self.headers, self.body);
  }
  const clone = new URL(url.toString());
  const urlParams5 = fromInput2(clone.searchParams);
  const hash = clone.hash ? some(clone.hash.slice(1)) : none();
  clone.search = "";
  clone.hash = "";
  return makeInternal(self.method, clone.toString(), urlParams5, hash, self.headers, self.body);
});
var appendUrl = dual(2, (self, url) => makeInternal(self.method, self.url.endsWith("/") && url.startsWith("/") ? self.url + url.slice(1) : self.url + url, self.urlParams, self.hash, self.headers, self.body));
var prependUrl = dual(2, (self, url) => makeInternal(self.method, url.endsWith("/") && self.url.startsWith("/") ? url + self.url.slice(1) : url + self.url, self.urlParams, self.hash, self.headers, self.body));
var updateUrl = dual(2, (self, f) => makeInternal(self.method, f(self.url), self.urlParams, self.hash, self.headers, self.body));
var appendUrlParam = dual(3, (self, key, value2) => makeInternal(self.method, self.url, append3(self.urlParams, key, value2), self.hash, self.headers, self.body));
var appendUrlParams = dual(2, (self, input) => makeInternal(self.method, self.url, appendAll3(self.urlParams, input), self.hash, self.headers, self.body));
var setUrlParam = dual(3, (self, key, value2) => makeInternal(self.method, self.url, set5(self.urlParams, key, value2), self.hash, self.headers, self.body));
var setUrlParams = dual(2, (self, input) => makeInternal(self.method, self.url, setAll3(self.urlParams, input), self.hash, self.headers, self.body));
var setHash = dual(2, (self, hash) => makeInternal(self.method, self.url, self.urlParams, some(hash), self.headers, self.body));
var removeHash = (self) => makeInternal(self.method, self.url, self.urlParams, none(), self.headers, self.body);
var toUrl = (self) => getRight(makeUrl(self.url, self.urlParams, self.hash));
var setBody3 = dual(2, (self, body) => {
  let headers = self.headers;
  if (body._tag === "Empty" || body._tag === "FormData") {
    headers = remove3(headers, ["Content-type", "Content-length"]);
  } else {
    const contentType = body.contentType;
    if (contentType) {
      headers = set4(headers, "content-type", contentType);
    }
    const contentLength = body.contentLength;
    if (contentLength) {
      headers = set4(headers, "content-length", contentLength.toString());
    }
  }
  return makeInternal(self.method, self.url, self.urlParams, self.hash, headers, body);
});
var bodyUint8Array = dual((args) => isClientRequest(args[0]), (self, body, contentType = "application/octet-stream") => setBody3(self, uint8Array(body, contentType)));
var bodyText = dual((args) => isClientRequest(args[0]), (self, body, contentType = "text/plain") => setBody3(self, text(body, contentType)));
var bodyJson = dual(2, (self, body) => map5(json(body), (body2) => setBody3(self, body2)));
var bodyUnsafeJson = dual(2, (self, body) => setBody3(self, unsafeJson(body)));
var bodyFile = dual((args) => isClientRequest(args[0]), (self, path, options7) => map5(file(path, options7), (body) => setBody3(self, body)));
var bodyFileWeb = dual(2, (self, file5) => setBody3(self, fileWeb(file5)));
var schemaBodyJson4 = (schema4, options7) => {
  const encode4 = jsonSchema(schema4, options7);
  return dual(2, (self, body) => map5(encode4(body), (body2) => setBody3(self, body2)));
};
var bodyUrlParams = dual(2, (self, body) => setBody3(self, text(toString3(fromInput2(body)), "application/x-www-form-urlencoded")));
var bodyFormData = dual(2, (self, body) => setBody3(self, formData(body)));
var bodyFormDataRecord = dual(2, (self, entries) => setBody3(self, formDataRecord(entries)));
var bodyStream = dual((args) => isClientRequest(args[0]), (self, body, {
  contentLength,
  contentType = "application/octet-stream"
} = {}) => setBody3(self, stream2(body, contentType, contentLength)));

// node_modules/@effect/platform/dist/esm/internal/httpClientResponse.js
var TypeId23 = Symbol.for("@effect/platform/HttpClientResponse");
var fromWeb3 = (request, source) => new ClientResponseImpl(request, source);
var ClientResponseImpl = class extends Class {
  request;
  source;
  [TypeId6];
  [TypeId23];
  constructor(request, source) {
    super();
    this.request = request;
    this.source = source;
    this[TypeId6] = TypeId6;
    this[TypeId23] = TypeId23;
  }
  toJSON() {
    return inspect(this, {
      _id: "@effect/platform/HttpClientResponse",
      request: this.request.toJSON(),
      status: this.status
    });
  }
  get status() {
    return this.source.status;
  }
  get headers() {
    return fromInput(this.source.headers);
  }
  cachedCookies;
  get cookies() {
    if (this.cachedCookies) {
      return this.cachedCookies;
    }
    return this.cachedCookies = fromSetCookie(this.source.headers.getSetCookie());
  }
  get remoteAddress() {
    return none();
  }
  get stream() {
    return this.source.body ? fromReadableStream(() => this.source.body, (cause) => new ResponseError({
      request: this.request,
      response: this,
      reason: "Decode",
      cause
    })) : fail7(new ResponseError({
      request: this.request,
      response: this,
      reason: "EmptyBody",
      description: "can not create stream from empty body"
    }));
  }
  get json() {
    return tryMap(this.text, {
      try: (text5) => text5 === "" ? null : JSON.parse(text5),
      catch: (cause) => new ResponseError({
        request: this.request,
        response: this,
        reason: "Decode",
        cause
      })
    });
  }
  textBody;
  get text() {
    return this.textBody ??= tryPromise({
      try: () => this.source.text(),
      catch: (cause) => new ResponseError({
        request: this.request,
        response: this,
        reason: "Decode",
        cause
      })
    }).pipe(cached, runSync);
  }
  get urlParamsBody() {
    return flatMap2(this.text, (_) => try_({
      try: () => fromInput2(new URLSearchParams(_)),
      catch: (cause) => new ResponseError({
        request: this.request,
        response: this,
        reason: "Decode",
        cause
      })
    }));
  }
  formDataBody;
  get formData() {
    return this.formDataBody ??= tryPromise({
      try: () => this.source.formData(),
      catch: (cause) => new ResponseError({
        request: this.request,
        response: this,
        reason: "Decode",
        cause
      })
    }).pipe(cached, runSync);
  }
  arrayBufferBody;
  get arrayBuffer() {
    return this.arrayBufferBody ??= tryPromise({
      try: () => this.source.arrayBuffer(),
      catch: (cause) => new ResponseError({
        request: this.request,
        response: this,
        reason: "Decode",
        cause
      })
    }).pipe(cached, runSync);
  }
};
var schemaJson5 = (schema4, options7) => {
  const parse3 = decodeUnknown(schema4, options7);
  return (self) => flatMap2(self.json, (body) => parse3({
    status: self.status,
    headers: self.headers,
    body
  }));
};
var schemaNoBody = (schema4, options7) => {
  const parse3 = decodeUnknown(schema4, options7);
  return (self) => parse3({
    status: self.status,
    headers: self.headers
  });
};
var stream7 = (effect2) => unwrap2(map5(effect2, (_) => _.stream));
var matchStatus = dual(2, (self, cases) => {
  const status = self.status;
  if (cases[status]) {
    return cases[status](self);
  } else if (status >= 200 && status < 300 && cases["2xx"]) {
    return cases["2xx"](self);
  } else if (status >= 300 && status < 400 && cases["3xx"]) {
    return cases["3xx"](self);
  } else if (status >= 400 && status < 500 && cases["4xx"]) {
    return cases["4xx"](self);
  } else if (status >= 500 && status < 600 && cases["5xx"]) {
    return cases["5xx"](self);
  }
  return cases.orElse(self);
});
var filterStatus = dual(2, (self, f) => suspend(() => f(self.status) ? succeed2(self) : fail4(new ResponseError({
  response: self,
  request: self.request,
  reason: "StatusCode",
  description: "invalid status code"
}))));
var filterStatusOk = (self) => self.status >= 200 && self.status < 300 ? succeed2(self) : fail4(new ResponseError({
  response: self,
  request: self.request,
  reason: "StatusCode",
  description: "non 2xx status code"
}));

// node_modules/@effect/platform/dist/esm/internal/httpClient.js
var TypeId24 = Symbol.for("@effect/platform/HttpClient");
var tag3 = GenericTag("@effect/platform/HttpClient");
var currentTracerDisabledWhen3 = globalValue(Symbol.for("@effect/platform/HttpClient/tracerDisabledWhen"), () => unsafeMake3(constFalse));
var withTracerDisabledWhen3 = dual(2, (self, pred) => transformResponse(self, locally(currentTracerDisabledWhen3, pred)));
var currentTracerPropagation = globalValue(Symbol.for("@effect/platform/HttpClient/currentTracerPropagation"), () => unsafeMake3(true));
var withTracerPropagation = dual(2, (self, enabled) => transformResponse(self, locally(currentTracerPropagation, enabled)));
var SpanNameGenerator3 = Reference()("@effect/platform/HttpClient/SpanNameGenerator", {
  defaultValue: () => (request) => `http.client ${request.method}`
});
var withSpanNameGenerator3 = dual(2, (self, f) => transformResponse(self, provideService(SpanNameGenerator3, f)));
var ClientProto = {
  [TypeId24]: TypeId24,
  pipe() {
    return pipeArguments(this, arguments);
  },
  ...BaseProto,
  toJSON() {
    return {
      _id: "@effect/platform/HttpClient"
    };
  },
  get(url, options7) {
    return this.execute(get7(url, options7));
  },
  head(url, options7) {
    return this.execute(head(url, options7));
  },
  post(url, options7) {
    return this.execute(post(url, options7));
  },
  put(url, options7) {
    return this.execute(put(url, options7));
  },
  patch(url, options7) {
    return this.execute(patch(url, options7));
  },
  del(url, options7) {
    return this.execute(del(url, options7));
  },
  options(url, options7) {
    return this.execute(options(url, options7));
  }
};
var isClient = (u) => hasProperty(u, TypeId24);
var makeWith = (postprocess, preprocess) => {
  const self = Object.create(ClientProto);
  self.preprocess = preprocess;
  self.postprocess = postprocess;
  self.execute = function(request) {
    return postprocess(preprocess(request));
  };
  return self;
};
var responseRegistry = globalValue("@effect/platform/HttpClient/responseRegistry", () => {
  if ("FinalizationRegistry" in globalThis && globalThis.FinalizationRegistry) {
    const registry = new FinalizationRegistry((controller) => {
      controller.abort();
    });
    return {
      register(response, controller) {
        registry.register(response, controller, response);
      },
      unregister(response) {
        registry.unregister(response);
      }
    };
  }
  const timers = /* @__PURE__ */ new Map();
  return {
    register(response, controller) {
      timers.set(response, setTimeout(() => controller.abort(), 5e3));
    },
    unregister(response) {
      const timer = timers.get(response);
      if (timer === void 0) return;
      clearTimeout(timer);
      timers.delete(response);
    }
  };
});
var scopedRequests = globalValue("@effect/platform/HttpClient/scopedRequests", () => /* @__PURE__ */ new WeakMap());
var make22 = (f) => makeWith((effect2) => flatMap2(effect2, (request) => withFiberRuntime((fiber) => {
  const scopedController = scopedRequests.get(request);
  const controller = scopedController ?? new AbortController();
  const urlResult = makeUrl(request.url, request.urlParams, request.hash);
  if (urlResult._tag === "Left") {
    return fail4(new RequestError({
      request,
      reason: "InvalidUrl",
      cause: urlResult.left
    }));
  }
  const url = urlResult.right;
  const tracerDisabled = !fiber.getFiberRef(currentTracerEnabled) || fiber.getFiberRef(currentTracerDisabledWhen3)(request);
  if (tracerDisabled) {
    const effect3 = f(request, url, controller.signal, fiber);
    if (scopedController) return effect3;
    return uninterruptibleMask((restore) => matchCauseEffect(restore(effect3), {
      onSuccess(response) {
        responseRegistry.register(response, controller);
        return succeed2(new InterruptibleResponse(response, controller));
      },
      onFailure(cause) {
        if (isInterrupted2(cause)) {
          controller.abort();
        }
        return failCause3(cause);
      }
    }));
  }
  const nameGenerator = get2(fiber.currentContext, SpanNameGenerator3);
  return useSpan(nameGenerator(request), {
    kind: "client",
    captureStackTrace: false
  }, (span) => {
    span.attribute("http.request.method", request.method);
    span.attribute("server.address", url.origin);
    if (url.port !== "") {
      span.attribute("server.port", +url.port);
    }
    span.attribute("url.full", url.toString());
    span.attribute("url.path", url.pathname);
    span.attribute("url.scheme", url.protocol.slice(0, -1));
    const query = url.search.slice(1);
    if (query !== "") {
      span.attribute("url.query", query);
    }
    const redactedHeaderNames = fiber.getFiberRef(currentRedactedNames);
    const redactedHeaders = redact2(request.headers, redactedHeaderNames);
    for (const name in redactedHeaders) {
      span.attribute(`http.request.header.${name}`, String(redactedHeaders[name]));
    }
    request = fiber.getFiberRef(currentTracerPropagation) ? setHeaders3(request, toHeaders(span)) : request;
    return uninterruptibleMask((restore) => restore(f(request, url, controller.signal, fiber)).pipe(withParentSpan(span), matchCauseEffect({
      onSuccess: (response) => {
        span.attribute("http.response.status_code", response.status);
        const redactedHeaders2 = redact2(response.headers, redactedHeaderNames);
        for (const name in redactedHeaders2) {
          span.attribute(`http.response.header.${name}`, String(redactedHeaders2[name]));
        }
        if (scopedController) return succeed2(response);
        responseRegistry.register(response, controller);
        return succeed2(new InterruptibleResponse(response, controller));
      },
      onFailure(cause) {
        if (!scopedController && isInterrupted2(cause)) {
          controller.abort();
        }
        return failCause3(cause);
      }
    })));
  });
})), succeed2);
var InterruptibleResponse = class {
  original;
  controller;
  constructor(original, controller) {
    this.original = original;
    this.controller = controller;
  }
  [TypeId23] = TypeId23;
  [TypeId6] = TypeId6;
  applyInterrupt(effect2) {
    return suspend(() => {
      responseRegistry.unregister(this.original);
      return onInterrupt(effect2, () => sync(() => {
        this.controller.abort();
      }));
    });
  }
  get request() {
    return this.original.request;
  }
  get status() {
    return this.original.status;
  }
  get headers() {
    return this.original.headers;
  }
  get cookies() {
    return this.original.cookies;
  }
  get remoteAddress() {
    return this.original.remoteAddress;
  }
  get formData() {
    return this.applyInterrupt(this.original.formData);
  }
  get text() {
    return this.applyInterrupt(this.original.text);
  }
  get json() {
    return this.applyInterrupt(this.original.json);
  }
  get urlParamsBody() {
    return this.applyInterrupt(this.original.urlParamsBody);
  }
  get arrayBuffer() {
    return this.applyInterrupt(this.original.arrayBuffer);
  }
  get stream() {
    return suspend3(() => {
      responseRegistry.unregister(this.original);
      return ensuringWith(this.original.stream, (exit2) => {
        if (isInterrupted(exit2)) {
          this.controller.abort();
        }
        return _void;
      });
    });
  }
  toJSON() {
    return this.original.toJSON();
  }
  [NodeInspectSymbol]() {
    return this.original[NodeInspectSymbol]();
  }
};
var withScope = (self) => transform2(self, (effect2, request) => {
  const controller = new AbortController();
  scopedRequests.set(request, controller);
  return zipRight(scopeWith((scope2) => addFinalizer(scope2, sync(() => controller.abort()))), effect2);
});
var {
  /** @internal */
  del: del2,
  /** @internal */
  execute,
  /** @internal */
  get: get8,
  /** @internal */
  head: head2,
  /** @internal */
  options: options2,
  /** @internal */
  patch: patch2,
  /** @internal */
  post: post2,
  /** @internal */
  put: put2
} = serviceFunctions(tag3);
var transform2 = dual(2, (self, f) => {
  const client = self;
  return makeWith(flatMap2((request) => f(client.postprocess(succeed2(request)), request)), client.preprocess);
});
var filterStatus2 = dual(2, (self, f) => transformResponse(self, flatMap2(filterStatus(f))));
var filterStatusOk2 = (self) => transformResponse(self, flatMap2(filterStatusOk));
var transformResponse = dual(2, (self, f) => {
  const client = self;
  return makeWith((request) => f(client.postprocess(request)), client.preprocess);
});
var catchTag2 = dual(3, (self, tag5, f) => transformResponse(self, catchTag(tag5, f)));
var catchTags2 = dual(2, (self, cases) => transformResponse(self, catchTags(cases)));
var catchAll3 = dual(2, (self, f) => transformResponse(self, catchAll(f)));
var filterOrElse2 = dual(3, (self, f, orElse2) => transformResponse(self, filterOrElse(f, orElse2)));
var filterOrFail2 = dual(3, (self, f, orFailWith) => transformResponse(self, filterOrFail(f, orFailWith)));
var mapRequest = dual(2, (self, f) => {
  const client = self;
  return makeWith(client.postprocess, (request) => map5(client.preprocess(request), f));
});
var mapRequestEffect = dual(2, (self, f) => {
  const client = self;
  return makeWith(client.postprocess, (request) => flatMap2(client.preprocess(request), f));
});
var mapRequestInput = dual(2, (self, f) => {
  const client = self;
  return makeWith(client.postprocess, (request) => client.preprocess(f(request)));
});
var mapRequestInputEffect = dual(2, (self, f) => {
  const client = self;
  return makeWith(client.postprocess, (request) => flatMap2(f(request), client.preprocess));
});
var retry2 = dual(2, (self, policy) => transformResponse(self, retry(policy)));
var retryTransient = dual(2, (self, options7) => transformResponse(self, retry({
  while: ScheduleTypeId in options7 || options7.while === void 0 ? isTransientError : or(isTransientError, options7.while),
  schedule: ScheduleTypeId in options7 ? options7 : options7.schedule,
  times: ScheduleTypeId in options7 ? void 0 : options7.times
})));
var isTransientError = (error) => hasProperty(error, TimeoutExceptionTypeId) || isTransientHttpError(error);
var isTransientHttpError = (error) => isHttpClientError(error) && (error._tag === "RequestError" && error.reason === "Transport" || error._tag === "ResponseError" && error.response.status >= 429);
var tap2 = dual(2, (self, f) => transformResponse(self, tap(f)));
var tapError2 = dual(2, (self, f) => transformResponse(self, tapError(f)));
var tapRequest = dual(2, (self, f) => {
  const client = self;
  return makeWith(client.postprocess, (request) => tap(client.preprocess(request), f));
});
var withCookiesRef = dual(2, (self, ref) => {
  const client = self;
  return makeWith((request) => tap(client.postprocess(request), (response) => update(ref, (cookies) => merge2(cookies, response.cookies))), (request) => flatMap2(client.preprocess(request), (request2) => map5(get3(ref), (cookies) => isEmpty(cookies) ? request2 : setHeader3(request2, "cookie", toCookieHeader(cookies)))));
});
var followRedirects = dual((args) => isClient(args[0]), (self, maxRedirects) => {
  const client = self;
  return makeWith((request) => {
    const loop = (request2, redirects) => flatMap2(client.postprocess(succeed2(request2)), (response) => response.status >= 300 && response.status < 400 && response.headers.location && redirects < (maxRedirects ?? 10) ? loop(setUrl(request2, new URL(response.headers.location, response.request.url)), redirects + 1) : succeed2(response));
    return flatMap2(request, (request2) => loop(request2, 0));
  }, client.preprocess);
});
var layerMergedContext = (effect2) => effect(tag3, flatMap2(context(), (context2) => map5(effect2, (client) => transformResponse(client, mapInputContext((input) => merge(context2, input))))));

// node_modules/@effect/platform/dist/esm/HttpClient.js
var TypeId25 = TypeId24;
var HttpClient = tag3;
var execute2 = execute;
var get9 = get8;
var head3 = head2;
var post3 = post2;
var patch3 = patch2;
var put3 = put2;
var del3 = del2;
var options3 = options2;
var catchAll4 = catchAll3;
var catchTag3 = catchTag2;
var catchTags3 = catchTags2;
var filterOrElse3 = filterOrElse2;
var filterOrFail3 = filterOrFail2;
var filterStatus3 = filterStatus2;
var filterStatusOk3 = filterStatusOk2;
var makeWith2 = makeWith;
var make23 = make22;
var transform3 = transform2;
var transformResponse2 = transformResponse;
var mapRequest2 = mapRequest;
var mapRequestEffect2 = mapRequestEffect;
var mapRequestInput2 = mapRequestInput;
var mapRequestInputEffect2 = mapRequestInputEffect;
var retry3 = retry2;
var retryTransient2 = retryTransient;
var tap3 = tap2;
var tapError3 = tapError2;
var tapRequest2 = tapRequest;
var withCookiesRef2 = withCookiesRef;
var followRedirects2 = followRedirects;
var currentTracerDisabledWhen4 = currentTracerDisabledWhen3;
var withTracerDisabledWhen4 = withTracerDisabledWhen3;
var currentTracerPropagation2 = currentTracerPropagation;
var withTracerPropagation2 = withTracerPropagation;
var layerMergedContext2 = layerMergedContext;
var SpanNameGenerator4 = SpanNameGenerator3;
var withSpanNameGenerator4 = withSpanNameGenerator3;
var withScope2 = withScope;

// node_modules/@effect/platform/dist/esm/HttpClientRequest.js
var HttpClientRequest_exports = {};
__export(HttpClientRequest_exports, {
  TypeId: () => TypeId26,
  accept: () => accept2,
  acceptJson: () => acceptJson2,
  appendUrl: () => appendUrl2,
  appendUrlParam: () => appendUrlParam2,
  appendUrlParams: () => appendUrlParams2,
  basicAuth: () => basicAuth2,
  bearerToken: () => bearerToken2,
  bodyFile: () => bodyFile2,
  bodyFileWeb: () => bodyFileWeb2,
  bodyFormData: () => bodyFormData2,
  bodyFormDataRecord: () => bodyFormDataRecord2,
  bodyJson: () => bodyJson2,
  bodyStream: () => bodyStream2,
  bodyText: () => bodyText2,
  bodyUint8Array: () => bodyUint8Array2,
  bodyUnsafeJson: () => bodyUnsafeJson2,
  bodyUrlParams: () => bodyUrlParams2,
  del: () => del4,
  get: () => get10,
  head: () => head4,
  make: () => make24,
  modify: () => modify2,
  options: () => options4,
  patch: () => patch4,
  post: () => post4,
  prependUrl: () => prependUrl2,
  put: () => put4,
  removeHash: () => removeHash2,
  schemaBodyJson: () => schemaBodyJson5,
  setBody: () => setBody4,
  setHash: () => setHash2,
  setHeader: () => setHeader4,
  setHeaders: () => setHeaders4,
  setMethod: () => setMethod2,
  setUrl: () => setUrl2,
  setUrlParam: () => setUrlParam2,
  setUrlParams: () => setUrlParams2,
  toUrl: () => toUrl2,
  updateUrl: () => updateUrl2
});
var TypeId26 = Symbol.for("@effect/platform/HttpClientRequest");
var make24 = make21;
var get10 = get7;
var post4 = post;
var patch4 = patch;
var put4 = put;
var del4 = del;
var head4 = head;
var options4 = options;
var modify2 = modify;
var setMethod2 = setMethod;
var setHeader4 = setHeader3;
var setHeaders4 = setHeaders3;
var basicAuth2 = basicAuth;
var bearerToken2 = bearerToken;
var accept2 = accept;
var acceptJson2 = acceptJson;
var setUrl2 = setUrl;
var prependUrl2 = prependUrl;
var appendUrl2 = appendUrl;
var updateUrl2 = updateUrl;
var setUrlParam2 = setUrlParam;
var setUrlParams2 = setUrlParams;
var appendUrlParam2 = appendUrlParam;
var appendUrlParams2 = appendUrlParams;
var setHash2 = setHash;
var removeHash2 = removeHash;
var toUrl2 = toUrl;
var setBody4 = setBody3;
var bodyUint8Array2 = bodyUint8Array;
var bodyText2 = bodyText;
var bodyJson2 = bodyJson;
var bodyUnsafeJson2 = bodyUnsafeJson;
var schemaBodyJson5 = schemaBodyJson4;
var bodyUrlParams2 = bodyUrlParams;
var bodyFormData2 = bodyFormData;
var bodyFormDataRecord2 = bodyFormDataRecord;
var bodyStream2 = bodyStream;
var bodyFile2 = bodyFile;
var bodyFileWeb2 = bodyFileWeb;

// node_modules/@effect/platform/dist/esm/HttpServer.js
var HttpServer_exports = {};
__export(HttpServer_exports, {
  HttpServer: () => HttpServer,
  TypeId: () => TypeId29,
  addressFormattedWith: () => addressFormattedWith2,
  addressWith: () => addressWith2,
  formatAddress: () => formatAddress2,
  layerContext: () => layerContext2,
  layerTestClient: () => layerTestClient2,
  logAddress: () => logAddress2,
  make: () => make27,
  serve: () => serve2,
  serveEffect: () => serveEffect2,
  withLogAddress: () => withLogAddress2
});

// node_modules/@effect/platform/dist/esm/internal/httpPlatform.js
var TypeId27 = Symbol.for("@effect/platform/HttpPlatform");
var tag4 = GenericTag("@effect/platform/HttpPlatform");
var make25 = (impl) => gen(function* () {
  const fs = yield* FileSystem;
  const etagGen = yield* Generator;
  return tag4.of({
    [TypeId27]: TypeId27,
    fileResponse(path, options7) {
      return pipe(bindTo(fs.stat(path), "info"), bind("etag", ({
        info
      }) => etagGen.fromFileInfo(info)), map5(({
        etag,
        info
      }) => {
        const start = Number(options7?.offset ?? 0);
        const end = options7?.bytesToRead !== void 0 ? start + Number(options7.bytesToRead) : void 0;
        const headers = set4(options7?.headers ? fromInput(options7.headers) : empty6, "etag", toString2(etag));
        if (info.mtime._tag === "Some") {
          ;
          headers["last-modified"] = info.mtime.value.toUTCString();
        }
        const contentLength = end !== void 0 ? end - start : Number(info.size) - start;
        return impl.fileResponse(path, options7?.status ?? 200, options7?.statusText, headers, start, end, contentLength);
      }));
    },
    fileWebResponse(file5, options7) {
      return map5(etagGen.fromFileWeb(file5), (etag) => {
        const headers = merge3(options7?.headers ? fromInput(options7.headers) : empty6, unsafeFromRecord({
          etag: toString2(etag),
          "last-modified": new Date(file5.lastModified).toUTCString()
        }));
        return impl.fileWebResponse(file5, options7?.status ?? 200, options7?.statusText, headers, options7);
      });
    }
  });
});
var layer5 = effect(tag4, flatMap2(FileSystem, (fs) => make25({
  fileResponse(path, status, statusText, headers, start, end, contentLength) {
    return stream5(fs.stream(path, {
      offset: start,
      bytesToRead: end !== void 0 ? end - start : void 0
    }), {
      contentLength,
      headers,
      status,
      statusText
    });
  },
  fileWebResponse(file5, status, statusText, headers, _options) {
    return stream5(fromReadableStream(() => file5.stream(), identity), {
      headers,
      status,
      statusText
    });
  }
}))).pipe(provide2(layerWeak2));

// node_modules/@effect/platform/dist/esm/internal/httpServer.js
var TypeId28 = Symbol.for("@effect/platform/HttpServer");
var serverTag = GenericTag("@effect/platform/HttpServer");
var serverProto = {
  [TypeId28]: TypeId28
};
var make26 = (options7) => Object.assign(Object.create(serverProto), options7);
var serve = dual((args) => isEffect(args[0]), (httpApp2, middleware3) => scopedDiscard(flatMap2(serverTag, (server) => server.serve(httpApp2, middleware3))));
var serveEffect = dual((args) => isEffect(args[0]), (httpApp2, middleware3) => flatMap2(serverTag, (server) => server.serve(httpApp2, middleware3)));
var formatAddress = (address) => {
  switch (address._tag) {
    case "UnixAddress":
      return `unix://${address.path}`;
    case "TcpAddress":
      return `http://${address.hostname}:${address.port}`;
  }
};
var addressWith = (effect2) => flatMap2(serverTag, (server) => effect2(server.address));
var addressFormattedWith = (effect2) => flatMap2(serverTag, (server) => effect2(formatAddress(server.address)));
var logAddress = addressFormattedWith((_) => log(`Listening on ${_}`));
var withLogAddress = (layer9) => effectDiscard(logAddress).pipe(provideMerge(layer9));
var makeTestClient = addressWith((address) => flatMap2(HttpClient, (client) => {
  if (address._tag === "UnixAddress") {
    return die2(new Error("HttpServer.layerTestClient: UnixAddress not supported"));
  }
  const host = address.hostname === "0.0.0.0" ? "127.0.0.1" : address.hostname;
  const url = `http://${host}:${address.port}`;
  return succeed2(mapRequest2(client, prependUrl2(url)));
}));
var layerTestClient = effect(HttpClient, makeTestClient);
var layerContext = mergeAll(layer5, layer3, layerWeak).pipe(provideMerge(layerNoop({})));

// node_modules/@effect/platform/dist/esm/HttpServer.js
var TypeId29 = TypeId28;
var HttpServer = serverTag;
var make27 = make26;
var serve2 = serve;
var serveEffect2 = serveEffect;
var formatAddress2 = formatAddress;
var addressWith2 = addressWith;
var addressFormattedWith2 = addressFormattedWith;
var logAddress2 = logAddress;
var withLogAddress2 = withLogAddress;
var layerTestClient2 = layerTestClient;
var layerContext2 = layerContext;

// node_modules/@effect/platform/dist/esm/HttpRouter.js
var HttpRouter_exports = {};
__export(HttpRouter_exports, {
  Default: () => Default,
  RouteContext: () => RouteContext2,
  RouteContextTypeId: () => RouteContextTypeId2,
  RouteTypeId: () => RouteTypeId2,
  Tag: () => Tag4,
  TypeId: () => TypeId31,
  all: () => all4,
  append: () => append5,
  catchAll: () => catchAll6,
  catchAllCause: () => catchAllCause3,
  catchTag: () => catchTag5,
  catchTags: () => catchTags5,
  concat: () => concat2,
  concatAll: () => concatAll2,
  currentRouterConfig: () => currentRouterConfig2,
  del: () => del6,
  empty: () => empty14,
  fromIterable: () => fromIterable6,
  get: () => get12,
  head: () => head6,
  makeRoute: () => makeRoute2,
  mount: () => mount2,
  mountApp: () => mountApp2,
  options: () => options6,
  params: () => params2,
  patch: () => patch6,
  post: () => post6,
  prefixAll: () => prefixAll2,
  prefixPath: () => prefixPath2,
  provideService: () => provideService3,
  provideServiceEffect: () => provideServiceEffect3,
  put: () => put6,
  route: () => route2,
  schemaJson: () => schemaJson7,
  schemaNoBody: () => schemaNoBody3,
  schemaParams: () => schemaParams2,
  schemaPathParams: () => schemaPathParams2,
  setRouterConfig: () => setRouterConfig2,
  transform: () => transform5,
  use: () => use2,
  withRouterConfig: () => withRouterConfig2
});

// node_modules/find-my-way-ts/dist/esm/index.js
var esm_exports2 = {};
__export(esm_exports2, {
  make: () => make29
});

// node_modules/find-my-way-ts/dist/esm/QueryString.js
var plusRegex = /\+/g;
var Empty2 = function() {
};
Empty2.prototype = /* @__PURE__ */ Object.create(null);
function parse2(input) {
  const result = new Empty2();
  if (typeof input !== "string") {
    return result;
  }
  const inputLength = input.length;
  let key = "";
  let value2 = "";
  let startingIndex = -1;
  let equalityIndex = -1;
  let shouldDecodeKey = false;
  let shouldDecodeValue = false;
  let keyHasPlus = false;
  let valueHasPlus = false;
  let hasBothKeyValuePair = false;
  let c = 0;
  for (let i = 0; i < inputLength + 1; i++) {
    c = i !== inputLength ? input.charCodeAt(i) : 38;
    if (c === 38) {
      hasBothKeyValuePair = equalityIndex > startingIndex;
      if (!hasBothKeyValuePair) {
        equalityIndex = i;
      }
      key = input.slice(startingIndex + 1, equalityIndex);
      if (hasBothKeyValuePair || key.length > 0) {
        if (keyHasPlus) {
          key = key.replace(plusRegex, " ");
        }
        if (shouldDecodeKey) {
          try {
            key = decodeURIComponent(key) || key;
          } catch {
          }
        }
        if (hasBothKeyValuePair) {
          value2 = input.slice(equalityIndex + 1, i);
          if (valueHasPlus) {
            value2 = value2.replace(plusRegex, " ");
          }
          if (shouldDecodeValue) {
            try {
              value2 = decodeURIComponent(value2) || value2;
            } catch {
            }
          }
        }
        const currentValue = result[key];
        if (currentValue === void 0) {
          result[key] = value2;
        } else {
          if (currentValue.pop) {
            currentValue.push(value2);
          } else {
            result[key] = [currentValue, value2];
          }
        }
      }
      value2 = "";
      startingIndex = i;
      equalityIndex = i;
      shouldDecodeKey = false;
      shouldDecodeValue = false;
      keyHasPlus = false;
      valueHasPlus = false;
    } else if (c === 61) {
      if (equalityIndex <= startingIndex) {
        equalityIndex = i;
      } else {
        shouldDecodeValue = true;
      }
    } else if (c === 43) {
      if (equalityIndex > startingIndex) {
        valueHasPlus = true;
      } else {
        keyHasPlus = true;
      }
    } else if (c === 37) {
      if (equalityIndex > startingIndex) {
        shouldDecodeValue = true;
      } else {
        shouldDecodeKey = true;
      }
    }
  }
  return result;
}
var hexTable = Array.from({
  length: 256
}, (_, i) => "%" + ((i < 16 ? "0" : "") + i.toString(16)).toUpperCase());
var noEscape = new Int8Array([
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  // 0 - 15
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  // 16 - 31
  0,
  1,
  0,
  0,
  0,
  0,
  0,
  1,
  1,
  1,
  1,
  0,
  0,
  1,
  1,
  0,
  // 32 - 47
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  0,
  0,
  0,
  0,
  0,
  0,
  // 48 - 63
  0,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  // 64 - 79
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  0,
  0,
  0,
  0,
  1,
  // 80 - 95
  0,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  // 96 - 111
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  0,
  0,
  0,
  1,
  0
  // 112 - 127
]);

// node_modules/find-my-way-ts/dist/esm/internal/router.js
var FULL_PATH_REGEXP = /^https?:\/\/.*?\//;
var OPTIONAL_PARAM_REGEXP = /(\/:[^/()]*?)\?(\/?)/;
var make28 = (options7 = {}) => new RouterImpl(options7);
var RouterImpl = class {
  constructor(options7 = {}) {
    this.options = {
      ignoreTrailingSlash: true,
      ignoreDuplicateSlashes: true,
      caseSensitive: false,
      maxParamLength: 100,
      ...options7
    };
  }
  options;
  routes = [];
  trees = {};
  on(method, path, handler2) {
    const optionalParamMatch = path.match(OPTIONAL_PARAM_REGEXP);
    if (optionalParamMatch && optionalParamMatch.index !== void 0) {
      assert(path.length === optionalParamMatch.index + optionalParamMatch[0].length, "Optional Parameter needs to be the last parameter of the path");
      const pathFull = path.replace(OPTIONAL_PARAM_REGEXP, "$1$2");
      const pathOptional = path.replace(OPTIONAL_PARAM_REGEXP, "$2");
      this.on(method, pathFull, handler2);
      this.on(method, pathOptional, handler2);
      return;
    }
    if (this.options.ignoreDuplicateSlashes) {
      path = removeDuplicateSlashes(path);
    }
    if (this.options.ignoreTrailingSlash) {
      path = trimLastSlash(path);
    }
    const methods = typeof method === "string" ? [method] : method;
    for (const method2 of methods) {
      this._on(method2, path, handler2);
    }
  }
  all(path, handler2) {
    this.on(httpMethods, path, handler2);
  }
  _on(method, path, handler2) {
    if (this.trees[method] === void 0) {
      this.trees[method] = new StaticNode("/");
    }
    let pattern = path;
    if (pattern === "*" && this.trees[method].prefix.length !== 0) {
      const currentRoot = this.trees[method];
      this.trees[method] = new StaticNode("");
      this.trees[method].staticChildren["/"] = currentRoot;
    }
    let parentNodePathIndex = this.trees[method].prefix.length;
    let currentNode = this.trees[method];
    const params3 = [];
    for (let i = 0; i <= pattern.length; i++) {
      if (pattern.charCodeAt(i) === 58 && pattern.charCodeAt(i + 1) === 58) {
        i++;
        continue;
      }
      const isParametricNode = pattern.charCodeAt(i) === 58 && pattern.charCodeAt(i + 1) !== 58;
      const isWildcardNode = pattern.charCodeAt(i) === 42;
      if (isParametricNode || isWildcardNode || i === pattern.length && i !== parentNodePathIndex) {
        let staticNodePath = pattern.slice(parentNodePathIndex, i);
        if (!this.options.caseSensitive) {
          staticNodePath = staticNodePath.toLowerCase();
        }
        staticNodePath = staticNodePath.split("::").join(":");
        staticNodePath = staticNodePath.split("%").join("%25");
        currentNode = currentNode.createStaticChild(staticNodePath);
      }
      if (isParametricNode) {
        let isRegexNode = false;
        const regexps = [];
        let lastParamStartIndex = i + 1;
        for (let j = lastParamStartIndex; ; j++) {
          const charCode = pattern.charCodeAt(j);
          const isRegexParam = charCode === 40;
          const isStaticPart = charCode === 45 || charCode === 46;
          const isEndOfNode = charCode === 47 || j === pattern.length;
          if (isRegexParam || isStaticPart || isEndOfNode) {
            const paramName = pattern.slice(lastParamStartIndex, j);
            params3.push(paramName);
            isRegexNode = isRegexNode || isRegexParam || isStaticPart;
            if (isRegexParam) {
              const endOfRegexIndex = getClosingParenthensePosition(pattern, j);
              const regexString = pattern.slice(j, endOfRegexIndex + 1);
              regexps.push(trimRegExpStartAndEnd(regexString));
              j = endOfRegexIndex + 1;
            } else {
              regexps.push("(.*?)");
            }
            const staticPartStartIndex = j;
            for (; j < pattern.length; j++) {
              const charCode2 = pattern.charCodeAt(j);
              if (charCode2 === 47) break;
              if (charCode2 === 58) {
                const nextCharCode = pattern.charCodeAt(j + 1);
                if (nextCharCode === 58) j++;
                else break;
              }
            }
            let staticPart = pattern.slice(staticPartStartIndex, j);
            if (staticPart) {
              staticPart = staticPart.split("::").join(":");
              staticPart = staticPart.split("%").join("%25");
              regexps.push(escapeRegExp(staticPart));
            }
            lastParamStartIndex = j + 1;
            if (isEndOfNode || pattern.charCodeAt(j) === 47 || j === pattern.length) {
              const nodePattern = isRegexNode ? "()" + staticPart : staticPart;
              const nodePath = pattern.slice(i, j);
              pattern = pattern.slice(0, i + 1) + nodePattern + pattern.slice(j);
              i += nodePattern.length;
              const regex = isRegexNode ? new RegExp("^" + regexps.join("") + "$") : void 0;
              currentNode = currentNode.createParametricChild(regex, staticPart, nodePath);
              parentNodePathIndex = i + 1;
              break;
            }
          }
        }
      } else if (isWildcardNode) {
        params3.push("*");
        currentNode = currentNode.createWildcardChild();
        parentNodePathIndex = i + 1;
        if (i !== pattern.length - 1) {
          throw new Error("Wildcard must be the last character in the route");
        }
      }
    }
    if (!this.options.caseSensitive) {
      pattern = pattern.toLowerCase();
    }
    if (pattern === "*") {
      pattern = "/*";
    }
    for (const existRoute of this.routes) {
      if (existRoute.method === method && existRoute.pattern === pattern) {
        throw new Error(`Method '${method}' already declared for route '${pattern}'`);
      }
    }
    const route4 = {
      method,
      path,
      pattern,
      params: params3,
      handler: handler2
    };
    this.routes.push(route4);
    currentNode.addRoute(route4);
  }
  has(method, path) {
    const node = this.trees[method];
    if (node === void 0) {
      return false;
    }
    const staticNode = node.getStaticChild(path);
    if (staticNode === void 0) {
      return false;
    }
    return staticNode.isLeafNode;
  }
  find(method, path) {
    let currentNode = this.trees[method];
    if (currentNode === void 0) return void 0;
    if (path.charCodeAt(0) !== 47) {
      path = path.replace(FULL_PATH_REGEXP, "/");
    }
    if (this.options.ignoreDuplicateSlashes) {
      path = removeDuplicateSlashes(path);
    }
    let sanitizedUrl;
    let querystring;
    let shouldDecodeParam;
    try {
      sanitizedUrl = safeDecodeURI(path);
      path = sanitizedUrl.path;
      querystring = sanitizedUrl.querystring;
      shouldDecodeParam = sanitizedUrl.shouldDecodeParam;
    } catch (error) {
      return void 0;
    }
    if (this.options.ignoreTrailingSlash) {
      path = trimLastSlash(path);
    }
    const originPath = path;
    if (this.options.caseSensitive === false) {
      path = path.toLowerCase();
    }
    const maxParamLength = this.options.maxParamLength;
    let pathIndex = currentNode.prefix.length;
    const params3 = [];
    const pathLen = path.length;
    const brothersNodesStack = [];
    while (true) {
      if (pathIndex === pathLen && currentNode.isLeafNode) {
        const handle = currentNode.handlerStorage?.find();
        if (handle !== void 0) {
          return {
            handler: handle.handler,
            params: handle.createParams(params3),
            searchParams: parse2(querystring)
          };
        }
      }
      let node = currentNode.getNextNode(path, pathIndex, brothersNodesStack, params3.length);
      if (node === void 0) {
        if (brothersNodesStack.length === 0) {
          return void 0;
        }
        const brotherNodeState = brothersNodesStack.pop();
        pathIndex = brotherNodeState.brotherPathIndex;
        params3.splice(brotherNodeState.paramsCount);
        node = brotherNodeState.brotherNode;
      }
      currentNode = node;
      if (currentNode._tag === "StaticNode") {
        pathIndex += currentNode.prefix.length;
        continue;
      }
      if (currentNode._tag === "WildcardNode") {
        let param2 = originPath.slice(pathIndex);
        if (shouldDecodeParam) {
          param2 = safeDecodeURIComponent(param2);
        }
        params3.push(param2);
        pathIndex = pathLen;
        continue;
      }
      if (currentNode._tag === "ParametricNode") {
        let paramEndIndex = originPath.indexOf("/", pathIndex);
        if (paramEndIndex === -1) {
          paramEndIndex = pathLen;
        }
        let param2 = originPath.slice(pathIndex, paramEndIndex);
        if (shouldDecodeParam) {
          param2 = safeDecodeURIComponent(param2);
        }
        if (currentNode.regex !== void 0) {
          const matchedParameters = currentNode.regex.exec(param2);
          if (matchedParameters === null) continue;
          for (let i = 1; i < matchedParameters.length; i++) {
            const matchedParam = matchedParameters[i];
            if (matchedParam.length > maxParamLength) {
              return void 0;
            }
            params3.push(matchedParam);
          }
        } else {
          if (param2.length > maxParamLength) {
            return void 0;
          }
          params3.push(param2);
        }
        pathIndex = paramEndIndex;
      }
    }
  }
};
var HandlerStorage = class {
  handlers = [];
  unconstrainedHandler;
  find() {
    return this.unconstrainedHandler;
  }
  add(route4) {
    const handler2 = {
      params: route4.params,
      handler: route4.handler,
      createParams: compileCreateParams(route4.params)
    };
    this.handlers.push(handler2);
    this.unconstrainedHandler = this.handlers[0];
  }
};
var NodeBase = class {
  isLeafNode = false;
  routes;
  handlerStorage;
  addRoute(route4) {
    if (this.routes === void 0) {
      this.routes = [route4];
    } else {
      this.routes.push(route4);
    }
    if (this.handlerStorage === void 0) {
      this.handlerStorage = new HandlerStorage();
    }
    this.isLeafNode = true;
    this.handlerStorage.add(route4);
  }
};
var ParentNode = class extends NodeBase {
  staticChildren = {};
  findStaticMatchingChild(path, pathIndex) {
    const staticChild = this.staticChildren[path.charAt(pathIndex)];
    if (staticChild === void 0 || !staticChild.matchPrefix(path, pathIndex)) {
      return void 0;
    }
    return staticChild;
  }
  getStaticChild(path, pathIndex = 0) {
    if (path.length === pathIndex) {
      return this;
    }
    const staticChild = this.findStaticMatchingChild(path, pathIndex);
    if (staticChild === void 0) {
      return void 0;
    }
    return staticChild.getStaticChild(path, pathIndex + staticChild.prefix.length);
  }
  createStaticChild(path) {
    if (path.length === 0) {
      return this;
    }
    let staticChild = this.staticChildren[path.charAt(0)];
    if (staticChild) {
      let i = 1;
      for (; i < staticChild.prefix.length; i++) {
        if (path.charCodeAt(i) !== staticChild.prefix.charCodeAt(i)) {
          staticChild = staticChild.split(this, i);
          break;
        }
      }
      return staticChild.createStaticChild(path.slice(i));
    }
    const label = path.charAt(0);
    this.staticChildren[label] = new StaticNode(path);
    return this.staticChildren[label];
  }
};
var StaticNode = class _StaticNode extends ParentNode {
  _tag = "StaticNode";
  constructor(prefix) {
    super();
    this.setPrefix(prefix);
  }
  prefix;
  matchPrefix;
  parametricChildren = [];
  wildcardChild;
  setPrefix(prefix) {
    this.prefix = prefix;
    if (prefix.length === 1) {
      this.matchPrefix = (_path, _pathIndex) => true;
    } else {
      const len = prefix.length;
      this.matchPrefix = function(path, pathIndex) {
        for (let i = 1; i < len; i++) {
          if (path.charCodeAt(pathIndex + i) !== this.prefix.charCodeAt(i)) {
            return false;
          }
        }
        return true;
      };
    }
  }
  getParametricChild(regex) {
    if (regex === void 0) {
      return this.parametricChildren.find((child) => child.isRegex === false);
    }
    const source = regex.source;
    return this.parametricChildren.find((child) => {
      if (child.regex === void 0) {
        return false;
      }
      return child.regex.source === source;
    });
  }
  createParametricChild(regex, staticSuffix, nodePath) {
    let child = this.getParametricChild(regex);
    if (child !== void 0) {
      child.nodePaths.add(nodePath);
      return child;
    }
    child = new ParametricNode(regex, staticSuffix, nodePath);
    this.parametricChildren.push(child);
    this.parametricChildren.sort((child1, child2) => {
      if (!child1.isRegex) return 1;
      if (!child2.isRegex) return -1;
      if (child1.staticSuffix === void 0) return 1;
      if (child2.staticSuffix === void 0) return -1;
      if (child2.staticSuffix.endsWith(child1.staticSuffix)) return 1;
      if (child1.staticSuffix.endsWith(child2.staticSuffix)) return -1;
      return 0;
    });
    return child;
  }
  createWildcardChild() {
    if (this.wildcardChild === void 0) {
      this.wildcardChild = new WildcardNode();
    }
    return this.wildcardChild;
  }
  split(parentNode, length) {
    const parentPrefix = this.prefix.slice(0, length);
    const childPrefix = this.prefix.slice(length);
    this.setPrefix(childPrefix);
    const staticNode = new _StaticNode(parentPrefix);
    staticNode.staticChildren[childPrefix.charAt(0)] = this;
    parentNode.staticChildren[parentPrefix.charAt(0)] = staticNode;
    return staticNode;
  }
  getNextNode(path, pathIndex, nodeStack, paramsCount) {
    let node = this.findStaticMatchingChild(path, pathIndex);
    let parametricBrotherNodeIndex = 0;
    if (node === void 0) {
      if (this.parametricChildren.length === 0) {
        return this.wildcardChild;
      }
      node = this.parametricChildren[0];
      parametricBrotherNodeIndex = 1;
    }
    if (this.wildcardChild !== void 0) {
      nodeStack.push({
        paramsCount,
        brotherPathIndex: pathIndex,
        brotherNode: this.wildcardChild
      });
    }
    for (let i = this.parametricChildren.length - 1; i >= parametricBrotherNodeIndex; i--) {
      nodeStack.push({
        paramsCount,
        brotherPathIndex: pathIndex,
        brotherNode: this.parametricChildren[i]
      });
    }
    return node;
  }
};
var ParametricNode = class extends ParentNode {
  regex;
  staticSuffix;
  _tag = "ParametricNode";
  constructor(regex, staticSuffix, nodePath) {
    super();
    this.regex = regex;
    this.staticSuffix = staticSuffix;
    this.isRegex = !!regex;
    this.nodePaths = /* @__PURE__ */ new Set([nodePath]);
  }
  isRegex;
  nodePaths;
  getNextNode(path, pathIndex) {
    return this.findStaticMatchingChild(path, pathIndex);
  }
};
var WildcardNode = class extends NodeBase {
  _tag = "WildcardNode";
  getNextNode(_path, _pathIndex, _nodeStack, _paramsCount) {
    return void 0;
  }
};
var assert = (condition, message) => {
  if (!condition) {
    throw new Error(message);
  }
};
function removeDuplicateSlashes(path) {
  return path.replace(/\/\/+/g, "/");
}
function trimLastSlash(path) {
  if (path.length > 1 && path.charCodeAt(path.length - 1) === 47) {
    return path.slice(0, -1);
  }
  return path;
}
function compileCreateParams(params3) {
  const len = params3.length;
  return function(paramsArray) {
    const paramsObject = {};
    for (let i = 0; i < len; i++) {
      paramsObject[params3[i]] = paramsArray[i];
    }
    return paramsObject;
  };
}
function getClosingParenthensePosition(path, idx) {
  let parentheses = 1;
  while (idx < path.length) {
    idx++;
    if (path[idx] === "\\") {
      idx++;
      continue;
    }
    if (path[idx] === ")") {
      parentheses--;
    } else if (path[idx] === "(") {
      parentheses++;
    }
    if (!parentheses) return idx;
  }
  throw new TypeError('Invalid regexp expression in "' + path + '"');
}
function trimRegExpStartAndEnd(regexString) {
  if (regexString.charCodeAt(1) === 94) {
    regexString = regexString.slice(0, 1) + regexString.slice(2);
  }
  if (regexString.charCodeAt(regexString.length - 2) === 36) {
    regexString = regexString.slice(0, regexString.length - 2) + regexString.slice(regexString.length - 1);
  }
  return regexString;
}
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function decodeComponentChar(highCharCode, lowCharCode) {
  if (highCharCode === 50) {
    if (lowCharCode === 53) return "%";
    if (lowCharCode === 51) return "#";
    if (lowCharCode === 52) return "$";
    if (lowCharCode === 54) return "&";
    if (lowCharCode === 66) return "+";
    if (lowCharCode === 98) return "+";
    if (lowCharCode === 67) return ",";
    if (lowCharCode === 99) return ",";
    if (lowCharCode === 70) return "/";
    if (lowCharCode === 102) return "/";
    return void 0;
  }
  if (highCharCode === 51) {
    if (lowCharCode === 65) return ":";
    if (lowCharCode === 97) return ":";
    if (lowCharCode === 66) return ";";
    if (lowCharCode === 98) return ";";
    if (lowCharCode === 68) return "=";
    if (lowCharCode === 100) return "=";
    if (lowCharCode === 70) return "?";
    if (lowCharCode === 102) return "?";
    return void 0;
  }
  if (highCharCode === 52 && lowCharCode === 48) {
    return "@";
  }
  return void 0;
}
function safeDecodeURI(path) {
  let shouldDecode = false;
  let shouldDecodeParam = false;
  let querystring = "";
  for (let i = 1; i < path.length; i++) {
    const charCode = path.charCodeAt(i);
    if (charCode === 37) {
      const highCharCode = path.charCodeAt(i + 1);
      const lowCharCode = path.charCodeAt(i + 2);
      if (decodeComponentChar(highCharCode, lowCharCode) === void 0) {
        shouldDecode = true;
      } else {
        shouldDecodeParam = true;
        if (highCharCode === 50 && lowCharCode === 53) {
          shouldDecode = true;
          path = path.slice(0, i + 1) + "25" + path.slice(i + 1);
          i += 2;
        }
        i += 2;
      }
    } else if (charCode === 63 || charCode === 59 || charCode === 35) {
      querystring = path.slice(i + 1);
      path = path.slice(0, i);
      break;
    }
  }
  const decodedPath = shouldDecode ? decodeURI(path) : path;
  return {
    path: decodedPath,
    querystring,
    shouldDecodeParam
  };
}
function safeDecodeURIComponent(uriComponent) {
  const startIndex = uriComponent.indexOf("%");
  if (startIndex === -1) return uriComponent;
  let decoded = "";
  let lastIndex = startIndex;
  for (let i = startIndex; i < uriComponent.length; i++) {
    if (uriComponent.charCodeAt(i) === 37) {
      const highCharCode = uriComponent.charCodeAt(i + 1);
      const lowCharCode = uriComponent.charCodeAt(i + 2);
      const decodedChar = decodeComponentChar(highCharCode, lowCharCode);
      decoded += uriComponent.slice(lastIndex, i) + decodedChar;
      lastIndex = i + 3;
    }
  }
  return uriComponent.slice(0, startIndex) + decoded + uriComponent.slice(lastIndex);
}
var httpMethods = ["ACL", "BIND", "CHECKOUT", "CONNECT", "COPY", "DELETE", "GET", "HEAD", "LINK", "LOCK", "M-SEARCH", "MERGE", "MKACTIVITY", "MKCALENDAR", "MKCOL", "MOVE", "NOTIFY", "OPTIONS", "PATCH", "POST", "PROPFIND", "PROPPATCH", "PURGE", "PUT", "REBIND", "REPORT", "SEARCH", "SOURCE", "SUBSCRIBE", "TRACE", "UNBIND", "UNLINK", "UNLOCK", "UNSUBSCRIBE"];

// node_modules/find-my-way-ts/dist/esm/index.js
var make29 = make28;

// node_modules/@effect/platform/dist/esm/internal/httpRouter.js
var TypeId30 = Symbol.for("@effect/platform/HttpRouter");
var RouteTypeId = Symbol.for("@effect/platform/HttpRouter/Route");
var RouteContextTypeId = Symbol.for("@effect/platform/HttpRouter/RouteContext");
var RouteContext = GenericTag("@effect/platform/HttpRouter/RouteContext");
var isRouter = (u) => hasProperty(u, TypeId30);
var params = map5(RouteContext, (_) => _.params);
var schemaJson6 = (schema4, options7) => {
  const parse3 = decodeUnknown(schema4, options7);
  return flatMap2(context(), (context2) => {
    const request = get2(context2, HttpServerRequest);
    const searchParams = get2(context2, ParsedSearchParams);
    const routeContext = get2(context2, RouteContext);
    return flatMap2(request.json, (body) => parse3({
      method: request.method,
      url: request.url,
      headers: request.headers,
      cookies: request.cookies,
      pathParams: routeContext.params,
      searchParams,
      body
    }));
  });
};
var schemaNoBody2 = (schema4, options7) => {
  const parse3 = decodeUnknown(schema4, options7);
  return flatMap2(context(), (context2) => {
    const request = get2(context2, HttpServerRequest);
    const searchParams = get2(context2, ParsedSearchParams);
    const routeContext = get2(context2, RouteContext);
    return parse3({
      method: request.method,
      url: request.url,
      headers: request.headers,
      cookies: request.cookies,
      pathParams: routeContext.params,
      searchParams
    });
  });
};
var schemaParams = (schema4, options7) => {
  const parse3 = decodeUnknown(schema4, options7);
  return flatMap2(context(), (context2) => {
    const searchParams = get2(context2, ParsedSearchParams);
    const routeContext = get2(context2, RouteContext);
    return parse3({
      ...searchParams,
      ...routeContext.params
    });
  });
};
var schemaPathParams = (schema4, options7) => {
  const parse3 = decodeUnknown(schema4, options7);
  return flatMap2(RouteContext, (_) => parse3(_.params));
};
var currentRouterConfig = globalValue("@effect/platform/HttpRouter/currentRouterConfig", () => unsafeMake3({}));
var withRouterConfig = dual(2, (effect2, config) => locally(effect2, currentRouterConfig, config));
var setRouterConfig = (config) => locallyScoped(currentRouterConfig, config);
var RouterImpl2 = class extends StructuralClass {
  routes;
  mounts;
  [TypeId30];
  constructor(routes, mounts) {
    super();
    this.routes = routes;
    this.mounts = mounts;
    this[TypeId30] = TypeId30;
    this.httpApp = get4(currentRouterConfig).pipe(flatMap2((config) => this.httpApp = toHttpApp(this, config)));
  }
  httpApp;
  commit() {
    return this.httpApp;
  }
  toJSON() {
    return {
      _id: "Router",
      routes: this.routes.toJSON(),
      mounts: this.mounts.toJSON()
    };
  }
  toString() {
    return format(this);
  }
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
};
var toHttpApp = (self, config) => {
  const router = make29(config);
  const mounts = toReadonlyArray(self.mounts).map(([path, app, options7]) => [path, new RouteContextImpl(new RouteImpl("*", options7?.includePrefix ? `${path}/*` : "/*", app, options7?.includePrefix ? none() : some(path), false), {}), options7]);
  const mountsLen = mounts.length;
  forEach(self.routes, (route4) => {
    if (route4.method === "*") {
      router.all(route4.path, route4);
    } else {
      router.on(route4.method, route4.path, route4);
    }
  });
  return withFiberRuntime((fiber) => {
    const context2 = unsafeMake(new Map(fiber.getFiberRef(currentContext).unsafeMap));
    const request = unsafeGet(context2, HttpServerRequest);
    if (mountsLen > 0) {
      const searchIndex = request.url.indexOf("?");
      const pathname = searchIndex === -1 ? request.url : request.url.slice(0, searchIndex);
      for (let i = 0; i < mountsLen; i++) {
        const [path, routeContext, options7] = mounts[i];
        if (pathname === path || pathname.startsWith(path + "/")) {
          context2.unsafeMap.set(RouteContext.key, routeContext);
          if (options7?.includePrefix !== true) {
            context2.unsafeMap.set(HttpServerRequest.key, sliceRequestUrl(request, path));
          }
          return locally(flatMap2(routeContext.route.handler, toResponse), currentContext, context2);
        }
      }
    }
    let result = router.find(request.method, request.url);
    if (result === void 0 && request.method === "HEAD") {
      result = router.find("GET", request.url);
    }
    if (result === void 0) {
      return fail4(new RouteNotFound({
        request
      }));
    }
    const route4 = result.handler;
    if (route4.prefix._tag === "Some") {
      context2.unsafeMap.set(HttpServerRequest.key, sliceRequestUrl(request, route4.prefix.value));
    }
    context2.unsafeMap.set(ParsedSearchParams.key, result.searchParams);
    context2.unsafeMap.set(RouteContext.key, new RouteContextImpl(route4, result.params));
    const span = getOption(context2, ParentSpan);
    if (span._tag === "Some" && span.value._tag === "Span") {
      span.value.attribute("http.route", route4.path);
    }
    const handlerResponse = flatMap2(route4.handler, toResponse);
    return locally(route4.uninterruptible ? handlerResponse : interruptible(handlerResponse), currentContext, context2);
  });
};
function sliceRequestUrl(request, prefix) {
  const prefexLen = prefix.length;
  return request.modify({
    url: request.url.length <= prefexLen ? "/" : request.url.slice(prefexLen)
  });
}
var RouteImpl = class extends Class {
  method;
  path;
  handler;
  prefix;
  uninterruptible;
  [RouteTypeId];
  constructor(method, path, handler2, prefix = none(), uninterruptible2 = false) {
    super();
    this.method = method;
    this.path = path;
    this.handler = handler2;
    this.prefix = prefix;
    this.uninterruptible = uninterruptible2;
    this[RouteTypeId] = RouteTypeId;
  }
  toJSON() {
    return {
      _id: "@effect/platform/HttpRouter/Route",
      method: this.method,
      path: this.path,
      prefix: this.prefix.toJSON()
    };
  }
};
var RouteContextImpl = class {
  route;
  params;
  [RouteContextTypeId];
  constructor(route4, params3) {
    this.route = route4;
    this.params = params3;
    this[RouteContextTypeId] = RouteContextTypeId;
  }
};
var empty13 = new RouterImpl2(empty3(), empty3());
var fromIterable5 = (routes) => new RouterImpl2(fromIterable2(routes), empty3());
var makeRoute = (method, path, handler2, options7) => new RouteImpl(method, path, handler2, options7?.prefix ? some(options7.prefix) : none(), options7?.uninterruptible ?? false);
var append4 = dual(2, (self, route4) => new RouterImpl2(append2(self.routes, route4), self.mounts));
var concat = dual(2, (self, that) => concatAll(self, that));
var concatAll = (...routers) => new RouterImpl2(routers.reduce((cur, acc) => appendAll2(cur, acc.routes), empty3()), routers.reduce((cur, acc) => appendAll2(cur, acc.mounts), empty3()));
var removeTrailingSlash = (path) => path.endsWith("/") ? path.slice(0, -1) : path;
var prefixPath = dual(2, (self, prefix) => {
  prefix = removeTrailingSlash(prefix);
  return self === "/" ? prefix : prefix + self;
});
var prefixAll = dual(2, (self, prefix) => {
  prefix = removeTrailingSlash(prefix);
  return new RouterImpl2(map4(self.routes, (route4) => new RouteImpl(route4.method, route4.path === "/" ? prefix : prefix + route4.path, route4.handler, orElse(map2(route4.prefix, (_) => prefix + _), () => some(prefix)), route4.uninterruptible)), map4(self.mounts, ([path, app]) => [path === "/" ? prefix : prefix + path, app]));
});
var mount = dual(3, (self, path, that) => concat(self, prefixAll(that, path)));
var mountApp = dual((args) => hasProperty(args[0], TypeId30), (self, path, that, options7) => new RouterImpl2(self.routes, append2(self.mounts, [removeTrailingSlash(path), that, options7])));
var route = (method) => dual((args) => isRouter(args[0]), (self, path, handler2, options7) => new RouterImpl2(append2(self.routes, new RouteImpl(method, path, handler2, none(), options7?.uninterruptible ?? false)), self.mounts));
var all3 = route("*");
var get11 = route("GET");
var post5 = route("POST");
var put5 = route("PUT");
var patch5 = route("PATCH");
var del5 = route("DELETE");
var head5 = route("HEAD");
var options5 = route("OPTIONS");
var use = dual(2, (self, f) => new RouterImpl2(map4(self.routes, (route4) => new RouteImpl(route4.method, route4.path, f(flatMap2(route4.handler, toResponse)), route4.prefix, route4.uninterruptible)), map4(self.mounts, ([path, app]) => [path, f(app)])));
var transform4 = dual(2, (self, f) => new RouterImpl2(map4(self.routes, (route4) => new RouteImpl(route4.method, route4.path, f(route4.handler), route4.prefix, route4.uninterruptible)), map4(self.mounts, ([path, app]) => [path, flatMap2(f(app), toResponse)])));
var catchAll5 = dual(2, (self, f) => transform4(self, catchAll(f)));
var catchAllCause2 = dual(2, (self, f) => transform4(self, catchAllCause(f)));
var catchTag4 = dual(3, (self, k, f) => transform4(self, catchTag(k, f)));
var catchTags4 = dual(2, (self, cases) => use(self, catchTags(cases)));
var provideService2 = dual(3, (self, tag5, service) => use(self, provideService(tag5, service)));
var provideServiceEffect2 = dual(3, (self, tag5, effect2) => use(self, provideServiceEffect(tag5, effect2)));
var makeService = () => {
  let router = empty13;
  return {
    addRoute(route4) {
      return sync(() => {
        router = append4(router, route4);
      });
    },
    all(path, handler2, options7) {
      return sync(() => {
        router = all3(router, path, handler2, options7);
      });
    },
    get(path, handler2, options7) {
      return sync(() => {
        router = get11(router, path, handler2, options7);
      });
    },
    post(path, handler2, options7) {
      return sync(() => {
        router = post5(router, path, handler2, options7);
      });
    },
    put(path, handler2, options7) {
      return sync(() => {
        router = put5(router, path, handler2, options7);
      });
    },
    patch(path, handler2, options7) {
      return sync(() => {
        router = patch5(router, path, handler2, options7);
      });
    },
    del(path, handler2, options7) {
      return sync(() => {
        router = del5(router, path, handler2, options7);
      });
    },
    head(path, handler2, options7) {
      return sync(() => {
        router = head5(router, path, handler2, options7);
      });
    },
    options(path, handler2, opts) {
      return sync(() => {
        router = options5(router, path, handler2, opts);
      });
    },
    router: sync(() => router),
    mount(path, that) {
      return sync(() => {
        router = mount(router, path, that);
      });
    },
    mountApp(path, app, options7) {
      return sync(() => {
        router = mountApp(router, path, app, options7);
      });
    },
    concat(that) {
      return sync(() => {
        router = concat(router, that);
      });
    }
  };
};
var Tag3 = (id) => () => {
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
  TagClass_.Live = sync2(TagClass_, makeService);
  TagClass_.router = flatMap2(TagClass_, (_) => _.router);
  TagClass_.use = (f) => TagClass_.pipe(flatMap2(f), scopedDiscard, provide2(TagClass_.Live));
  TagClass_.unwrap = (f) => TagClass_.pipe(flatMap2((_) => _.router), map5(f), unwrapEffect, provide2(TagClass_.Live));
  TagClass_.serve = (middleware3) => TagClass_.unwrap(serve2(middleware3));
  return TagClass;
};

// node_modules/@effect/platform/dist/esm/HttpRouter.js
var TypeId31 = TypeId30;
var RouteTypeId2 = RouteTypeId;
var RouteContextTypeId2 = RouteContextTypeId;
var RouteContext2 = RouteContext;
var params2 = params;
var schemaJson7 = schemaJson6;
var schemaNoBody3 = schemaNoBody2;
var schemaParams2 = schemaParams;
var schemaPathParams2 = schemaPathParams;
var currentRouterConfig2 = currentRouterConfig;
var withRouterConfig2 = withRouterConfig;
var setRouterConfig2 = setRouterConfig;
var empty14 = empty13;
var fromIterable6 = fromIterable5;
var makeRoute2 = makeRoute;
var prefixPath2 = prefixPath;
var prefixAll2 = prefixAll;
var append5 = append4;
var concat2 = concat;
var concatAll2 = concatAll;
var mount2 = mount;
var mountApp2 = mountApp;
var route2 = route;
var all4 = all3;
var get12 = get11;
var post6 = post5;
var patch6 = patch5;
var put6 = put5;
var del6 = del5;
var head6 = head5;
var options6 = options5;
var use2 = use;
var transform5 = transform4;
var catchAll6 = catchAll5;
var catchAllCause3 = catchAllCause2;
var catchTag5 = catchTag4;
var catchTags5 = catchTags4;
var provideService3 = provideService2;
var provideServiceEffect3 = provideServiceEffect2;
var Tag4 = Tag3;
var Default = class extends Tag4("@effect/platform/HttpRouter/Default")() {
};

// node_modules/@effect/platform/dist/esm/OpenApiJsonSchema.js
var OpenApiJsonSchema_exports = {};
__export(OpenApiJsonSchema_exports, {
  fromAST: () => fromAST2,
  make: () => make30,
  makeWithDefs: () => makeWithDefs
});
var make30 = (schema4) => {
  const defs = {};
  const out = makeWithDefs(schema4, {
    defs
  });
  if (!isEmptyRecord(defs)) {
    out.$defs = defs;
  }
  return out;
};
var makeWithDefs = (schema4, options7) => fromAST2(schema4.ast, options7);
var fromAST2 = (ast, options7) => {
  const jsonSchema3 = fromAST(ast, {
    definitions: options7.defs,
    definitionPath: options7.defsPath ?? "#/components/schemas/",
    target: "openApi3.1",
    topLevelReferenceStrategy: options7.topLevelReferenceStrategy,
    additionalPropertiesStrategy: options7.additionalPropertiesStrategy
  });
  return jsonSchema3;
};

// node_modules/@effect/platform/dist/esm/OpenApi.js
var OpenApi_exports = {};
__export(OpenApi_exports, {
  Deprecated: () => Deprecated,
  Description: () => Description,
  Exclude: () => Exclude,
  ExternalDocs: () => ExternalDocs,
  Format: () => Format,
  Identifier: () => Identifier,
  License: () => License,
  Override: () => Override,
  Servers: () => Servers,
  Summary: () => Summary,
  Title: () => Title,
  Transform: () => Transform,
  Version: () => Version,
  annotations: () => annotations3,
  fromApi: () => fromApi
});
var Identifier = class extends Tag("@effect/platform/OpenApi/Identifier")() {
};
var Title = class extends Tag("@effect/platform/OpenApi/Title")() {
};
var Version = class extends Tag("@effect/platform/OpenApi/Version")() {
};
var Description = class extends Tag("@effect/platform/OpenApi/Description")() {
};
var License = class extends Tag("@effect/platform/OpenApi/License")() {
};
var ExternalDocs = class extends Tag("@effect/platform/OpenApi/ExternalDocs")() {
};
var Servers = class extends Tag("@effect/platform/OpenApi/Servers")() {
};
var Format = class extends Tag("@effect/platform/OpenApi/Format")() {
};
var Summary = class extends Tag("@effect/platform/OpenApi/Summary")() {
};
var Deprecated = class extends Tag("@effect/platform/OpenApi/Deprecated")() {
};
var Override = class extends Tag("@effect/platform/OpenApi/Override")() {
};
var Exclude = class extends Reference()("@effect/platform/OpenApi/Exclude", {
  defaultValue: constFalse
}) {
};
var Transform = class extends Tag("@effect/platform/OpenApi/Transform")() {
};
var contextPartial = (tags) => {
  const entries = Object.entries(tags);
  return (options7) => {
    let context2 = empty2();
    for (const [key, tag5] of entries) {
      if (options7[key] !== void 0) {
        context2 = add(context2, tag5, options7[key]);
      }
    }
    return context2;
  };
};
var annotations3 = contextPartial({
  identifier: Identifier,
  title: Title,
  version: Version,
  description: Description,
  license: License,
  summary: Summary,
  deprecated: Deprecated,
  externalDocs: ExternalDocs,
  servers: Servers,
  format: Format,
  override: Override,
  exclude: Exclude,
  transform: Transform
});
var apiCache = globalValue("@effect/platform/OpenApi/apiCache", () => /* @__PURE__ */ new WeakMap());
function processAnnotation(ctx, tag5, f) {
  const o = getOption(ctx, tag5);
  if (isSome(o)) {
    f(o.value);
  }
}
var fromApi = (api2, options7) => {
  const cached2 = apiCache.get(api2);
  if (cached2 !== void 0) {
    return cached2;
  }
  const jsonSchemaDefs = {};
  let spec = {
    openapi: "3.1.0",
    info: {
      title: getOrElse2(api2.annotations, Title, () => "Api"),
      version: getOrElse2(api2.annotations, Version, () => "0.0.1")
    },
    paths: {},
    components: {
      schemas: jsonSchemaDefs,
      securitySchemes: {}
    },
    security: [],
    tags: []
  };
  function processAST(ast) {
    return fromAST2(ast, {
      defs: jsonSchemaDefs,
      additionalPropertiesStrategy: options7?.additionalPropertiesStrategy
    });
  }
  function processHttpApiSecurity(name, security) {
    if (spec.components.securitySchemes[name] !== void 0) {
      return;
    }
    spec.components.securitySchemes[name] = makeSecurityScheme(security);
  }
  processAnnotation(api2.annotations, AdditionalSchemas, (componentSchemas) => {
    componentSchemas.forEach((componentSchema) => processAST(componentSchema.ast));
  });
  processAnnotation(api2.annotations, Description, (description) => {
    spec.info.description = description;
  });
  processAnnotation(api2.annotations, License, (license) => {
    spec.info.license = license;
  });
  processAnnotation(api2.annotations, Summary, (summary) => {
    spec.info.summary = summary;
  });
  processAnnotation(api2.annotations, Servers, (servers) => {
    spec.servers = [...servers];
  });
  api2.middlewares.forEach((middleware3) => {
    if (!isSecurity(middleware3)) {
      return;
    }
    for (const [name, security] of Object.entries(middleware3.security)) {
      processHttpApiSecurity(name, security);
      spec.security.push({
        [name]: []
      });
    }
  });
  reflect(api2, {
    onGroup({
      group: group2
    }) {
      if (get2(group2.annotations, Exclude)) {
        return;
      }
      let tag5 = {
        name: getOrElse2(group2.annotations, Title, () => group2.identifier)
      };
      processAnnotation(group2.annotations, Description, (description) => {
        tag5.description = description;
      });
      processAnnotation(group2.annotations, ExternalDocs, (externalDocs) => {
        tag5.externalDocs = externalDocs;
      });
      processAnnotation(group2.annotations, Override, (override) => {
        Object.assign(tag5, override);
      });
      processAnnotation(group2.annotations, Transform, (transformFn) => {
        tag5 = transformFn(tag5);
      });
      spec.tags.push(tag5);
    },
    onEndpoint({
      endpoint,
      errors: errors2,
      group: group2,
      mergedAnnotations: mergedAnnotations2,
      middleware: middleware3,
      payloads,
      successes
    }) {
      if (get2(mergedAnnotations2, Exclude)) {
        return;
      }
      let op = {
        tags: [getOrElse2(group2.annotations, Title, () => group2.identifier)],
        operationId: getOrElse2(endpoint.annotations, Identifier, () => group2.topLevel ? endpoint.name : `${group2.identifier}.${endpoint.name}`),
        parameters: [],
        security: [],
        responses: {}
      };
      function processResponseMap(map7, defaultDescription) {
        for (const [status, {
          ast,
          description
        }] of map7) {
          if (op.responses[status]) continue;
          op.responses[status] = {
            description: getOrElse(description, defaultDescription)
          };
          ast.pipe(filter((ast2) => !getEmptyDecodeable(ast2)), map2((ast2) => {
            const encoding = getEncoding(ast2);
            op.responses[status].content = {
              [encoding.contentType]: {
                schema: processAST(ast2)
              }
            };
          }));
        }
      }
      function processParameters(schema4, i) {
        if (isSome(schema4)) {
          const jsonSchema3 = processAST(schema4.value.ast);
          if ("properties" in jsonSchema3) {
            Object.entries(jsonSchema3.properties).forEach(([name, psJsonSchema]) => {
              op.parameters.push({
                name,
                in: i,
                schema: psJsonSchema,
                required: jsonSchema3.required.includes(name),
                ...psJsonSchema.description !== void 0 ? {
                  description: psJsonSchema.description
                } : void 0
              });
            });
          }
        }
      }
      processAnnotation(endpoint.annotations, Description, (description) => {
        op.description = description;
      });
      processAnnotation(endpoint.annotations, Summary, (summary) => {
        op.summary = summary;
      });
      processAnnotation(endpoint.annotations, Deprecated, (deprecated) => {
        op.deprecated = deprecated;
      });
      processAnnotation(endpoint.annotations, ExternalDocs, (externalDocs) => {
        op.externalDocs = externalDocs;
      });
      middleware3.forEach((middleware4) => {
        if (!isSecurity(middleware4)) {
          return;
        }
        for (const [name, security] of Object.entries(middleware4.security)) {
          processHttpApiSecurity(name, security);
          op.security.push({
            [name]: []
          });
        }
      });
      const hasBody2 = hasBody(endpoint.method);
      if (hasBody2 && payloads.size > 0) {
        const content = {};
        payloads.forEach(({
          ast
        }, contentType) => {
          content[contentType] = {
            schema: processAST(ast)
          };
        });
        op.requestBody = {
          content,
          required: true
        };
      }
      processParameters(endpoint.pathSchema, "path");
      if (!hasBody2) {
        processParameters(endpoint.payloadSchema, "query");
      }
      processParameters(endpoint.headersSchema, "header");
      processParameters(endpoint.urlParamsSchema, "query");
      processResponseMap(successes, () => "Success");
      processResponseMap(errors2, () => "Error");
      const path = endpoint.path.replace(/:(\w+)\??/g, "{$1}");
      const method = endpoint.method.toLowerCase();
      if (!spec.paths[path]) {
        spec.paths[path] = {};
      }
      processAnnotation(endpoint.annotations, Override, (override) => {
        Object.assign(op, override);
      });
      processAnnotation(endpoint.annotations, Transform, (transformFn) => {
        op = transformFn(op);
      });
      spec.paths[path][method] = op;
    }
  });
  processAnnotation(api2.annotations, Override, (override) => {
    Object.assign(spec, override);
  });
  processAnnotation(api2.annotations, Transform, (transformFn) => {
    spec = transformFn(spec);
  });
  apiCache.set(api2, spec);
  return spec;
};
var makeSecurityScheme = (security) => {
  const meta = {};
  processAnnotation(security.annotations, Description, (description) => {
    meta.description = description;
  });
  switch (security._tag) {
    case "Basic": {
      return {
        ...meta,
        type: "http",
        scheme: "basic"
      };
    }
    case "Bearer": {
      const format3 = getOption(security.annotations, Format).pipe(map2((format4) => ({
        bearerFormat: format4
      })), getOrUndefined);
      return {
        ...meta,
        type: "http",
        scheme: "bearer",
        ...format3
      };
    }
    case "ApiKey": {
      return {
        ...meta,
        type: "apiKey",
        name: security.key,
        in: security.in
      };
    }
  }
};

// node_modules/@effect/platform/dist/esm/HttpApiBuilder.js
var HttpApiBuilder_exports = {};
__export(HttpApiBuilder_exports, {
  HandlersTypeId: () => HandlersTypeId,
  Middleware: () => Middleware,
  Router: () => Router,
  api: () => api,
  buildMiddleware: () => buildMiddleware,
  group: () => group,
  handler: () => handler,
  httpApp: () => httpApp,
  middleware: () => middleware,
  middlewareCors: () => middlewareCors,
  middlewareOpenApi: () => middlewareOpenApi,
  normalizeUrlParams: () => normalizeUrlParams,
  securityDecode: () => securityDecode,
  securitySetCookie: () => securitySetCookie,
  serve: () => serve3,
  toWebHandler: () => toWebHandler2
});
var Router = class extends Tag4("@effect/platform/HttpApiBuilder/Router")() {
};
var api = (api2) => effect(Api, map5(context(), (context2) => ({
  api: api2,
  context: context2
})));
var serve3 = (middleware3) => httpApp.pipe(map5((app) => serve2(app, middleware3)), unwrapEffect, provide2([Router.Live, Middleware.layer]));
var httpApp = gen(function* () {
  const {
    api: api2,
    context: context2
  } = yield* Api;
  const middleware3 = makeMiddlewareMap(api2.middlewares, context2);
  const router = applyMiddleware(middleware3, yield* Router.router);
  const apiMiddlewareService = yield* Middleware;
  const apiMiddleware = yield* apiMiddlewareService.retrieve;
  const errorSchema = makeErrorSchema(api2);
  const encodeError = encodeUnknown(errorSchema);
  return router.pipe(apiMiddleware, catchAllCause((cause) => matchEffect(provide(encodeError(squash(cause)), context2), {
    onFailure: () => failCause3(cause),
    onSuccess: succeed2
  })));
});
var buildMiddleware = fnUntraced(function* (api2) {
  const context2 = yield* context();
  const middlewareMap = makeMiddlewareMap(api2.middlewares, context2);
  const errorSchema = makeErrorSchema(api2);
  const encodeError = encodeUnknown(errorSchema);
  return (effect2) => catchAllCause(applyMiddleware(middlewareMap, effect2), (cause) => matchEffect(provide(encodeError(squash(cause)), context2), {
    onFailure: () => failCause3(cause),
    onSuccess: succeed2
  }));
});
var toWebHandler2 = (layer9, options7) => {
  const runtime4 = make6(mergeAll(layer9, Router.Live, Middleware.layer), options7?.memoMap);
  let handlerCached;
  const handlerPromise = gen(function* () {
    const app = yield* httpApp;
    const rt = yield* runtime4.runtimeEffect;
    const handler3 = toWebHandlerRuntime(rt)(options7?.middleware ? options7.middleware(app) : app);
    handlerCached = handler3;
    return handler3;
  }).pipe(runtime4.runPromise);
  function handler2(request, context2) {
    if (handlerCached !== void 0) {
      return handlerCached(request, context2);
    }
    return handlerPromise.then((handler3) => handler3(request, context2));
  }
  return {
    handler: handler2,
    dispose: runtime4.dispose
  };
};
var HandlersTypeId = Symbol.for("@effect/platform/HttpApiBuilder/Handlers");
var HandlersProto = {
  [HandlersTypeId]: {
    _Endpoints: identity
  },
  pipe() {
    return pipeArguments(this, arguments);
  },
  handle(name, handler2, options7) {
    const endpoint = this.group.endpoints[name];
    return makeHandlers({
      group: this.group,
      handlers: append2(this.handlers, {
        endpoint,
        handler: handler2,
        withFullRequest: false,
        uninterruptible: options7?.uninterruptible ?? false
      })
    });
  },
  handleRaw(name, handler2, options7) {
    const endpoint = this.group.endpoints[name];
    return makeHandlers({
      group: this.group,
      handlers: append2(this.handlers, {
        endpoint,
        handler: handler2,
        withFullRequest: true,
        uninterruptible: options7?.uninterruptible ?? false
      })
    });
  }
};
var makeHandlers = (options7) => {
  const self = Object.create(HandlersProto);
  self.group = options7.group;
  self.handlers = options7.handlers;
  return self;
};
var group = (api2, groupName, build) => Router.use((router) => gen(function* () {
  const context2 = yield* context();
  const group2 = api2.groups[groupName];
  const result = build(makeHandlers({
    group: group2,
    handlers: empty3()
  }));
  const handlers = isEffect(result) ? yield* result : result;
  const groupMiddleware = makeMiddlewareMap(group2.middlewares, context2);
  const routes = [];
  for (const item of handlers.handlers) {
    const middleware3 = makeMiddlewareMap(item.endpoint.middlewares, context2, groupMiddleware);
    routes.push(handlerToRoute(item.endpoint, middleware3, function(request) {
      return mapInputContext(item.handler(request), (input) => merge(context2, input));
    }, item.withFullRequest, item.uninterruptible));
  }
  yield* router.concat(fromIterable6(routes));
}));
var handler = (_api, _groupName, _name, f) => f;
var requestPayload = (request, urlParams5, multipartLimits) => {
  if (!hasBody(request.method)) {
    return succeed2(urlParams5);
  }
  const contentType = request.headers["content-type"] ? request.headers["content-type"].toLowerCase().trim() : "application/json";
  if (contentType.includes("application/json")) {
    return orDie(request.json);
  } else if (contentType.includes("multipart/form-data")) {
    return orDie(match2(multipartLimits, {
      onNone: () => request.multipart,
      onSome: (limits) => withLimits(request.multipart, limits)
    }));
  } else if (contentType.includes("x-www-form-urlencoded")) {
    return map5(orDie(request.urlParamsBody), toRecord2);
  } else if (contentType.startsWith("text/")) {
    return orDie(request.text);
  }
  return map5(orDie(request.arrayBuffer), (buffer) => new Uint8Array(buffer));
};
var makeMiddlewareMap = (middleware3, context2, initial) => {
  const map7 = new Map(initial);
  middleware3.forEach((tag5) => {
    map7.set(tag5.key, {
      tag: tag5,
      effect: unsafeGet(context2, tag5)
    });
  });
  return map7;
};
function isSingleStringType(ast, key) {
  switch (ast._tag) {
    case "StringKeyword":
    case "Literal":
    case "TemplateLiteral":
    case "Enums":
      return true;
    case "TypeLiteral": {
      if (key !== void 0) {
        const ps = ast.propertySignatures.find((ps2) => ps2.name === key);
        return ps !== void 0 ? isSingleStringType(ps.type, key) : ast.indexSignatures.some((is2) => is(make9(is2.parameter))(key) && isSingleStringType(is2.type));
      }
      return false;
    }
    case "Union":
      return ast.types.some((type) => isSingleStringType(type, key));
    case "Suspend":
      return isSingleStringType(ast.f(), key);
    case "Refinement":
    case "Transformation":
      return isSingleStringType(ast.from, key);
  }
  return false;
}
function normalizeUrlParams(params3, ast) {
  const out = {};
  for (const key in params3) {
    const value2 = params3[key];
    out[key] = Array.isArray(value2) || isSingleStringType(ast, key) ? value2 : [value2];
  }
  return out;
}
var handlerToRoute = (endpoint_, middleware3, handler2, isFullRequest, uninterruptible2) => {
  const endpoint = endpoint_;
  const isMultipartStream = endpoint.payloadSchema.pipe(map2(({
    ast
  }) => getMultipartStream(ast) !== void 0), getOrElse(constFalse));
  const multipartLimits = endpoint.payloadSchema.pipe(flatMapNullable(({
    ast
  }) => getMultipart(ast) || getMultipartStream(ast)));
  const decodePath = map2(endpoint.pathSchema, decodeUnknown);
  const decodePayload = isFullRequest || isMultipartStream ? none() : map2(endpoint.payloadSchema, decodeUnknown);
  const decodeHeaders = map2(endpoint.headersSchema, decodeUnknown);
  const encodeSuccess = encode(makeSuccessSchema(endpoint.successSchema));
  return makeRoute2(endpoint.method, endpoint.path, applyMiddleware(middleware3, gen(function* () {
    const fiber = getOrThrow(getCurrentFiber());
    const context2 = fiber.currentContext;
    const httpRequest = unsafeGet(context2, HttpServerRequest);
    const routeContext = unsafeGet(context2, RouteContext2);
    const urlParams5 = unsafeGet(context2, ParsedSearchParams);
    const request = {
      request: httpRequest
    };
    if (decodePath._tag === "Some") {
      request.path = yield* decodePath.value(routeContext.params);
    }
    if (decodePayload._tag === "Some") {
      request.payload = yield* flatMap2(requestPayload(httpRequest, urlParams5, multipartLimits), decodePayload.value);
    } else if (isMultipartStream) {
      request.payload = match2(multipartLimits, {
        onNone: () => httpRequest.multipartStream,
        onSome: (limits) => withLimitsStream(httpRequest.multipartStream, limits)
      });
    }
    if (decodeHeaders._tag === "Some") {
      request.headers = yield* decodeHeaders.value(httpRequest.headers);
    }
    if (endpoint.urlParamsSchema._tag === "Some") {
      const schema4 = endpoint.urlParamsSchema.value;
      request.urlParams = yield* decodeUnknown(schema4)(normalizeUrlParams(urlParams5, schema4.ast));
    }
    const response = yield* handler2(request);
    return isServerResponse2(response) ? response : yield* encodeSuccess(response);
  }).pipe(catchIf(isParseError, HttpApiDecodeError.refailParseError))), {
    uninterruptible: uninterruptible2
  });
};
var applyMiddleware = (middleware3, handler2) => {
  for (const entry of middleware3.values()) {
    const effect2 = SecurityTypeId in entry.tag ? makeSecurityMiddleware(entry) : entry.effect;
    if (entry.tag.optional) {
      const previous = handler2;
      handler2 = matchEffect(effect2, {
        onFailure: () => previous,
        onSuccess: entry.tag.provides !== void 0 ? (value2) => provideService(previous, entry.tag.provides, value2) : (_) => previous
      });
    } else {
      handler2 = entry.tag.provides !== void 0 ? provideServiceEffect(handler2, entry.tag.provides, effect2) : zipRight(effect2, handler2);
    }
  }
  return handler2;
};
var securityMiddlewareCache = globalValue("securityMiddlewareCache", () => /* @__PURE__ */ new WeakMap());
var makeSecurityMiddleware = (entry) => {
  if (securityMiddlewareCache.has(entry)) {
    return securityMiddlewareCache.get(entry);
  }
  let effect2;
  for (const [key, security] of Object.entries(entry.tag.security)) {
    const decode5 = securityDecode(security);
    const handler2 = entry.effect[key];
    const middleware3 = flatMap2(decode5, handler2);
    effect2 = effect2 === void 0 ? middleware3 : catchAll(effect2, () => middleware3);
  }
  if (effect2 === void 0) {
    effect2 = _void;
  }
  securityMiddlewareCache.set(entry, effect2);
  return effect2;
};
var responseSchema = declare(isServerResponse2);
var makeSuccessSchema = (schema4) => {
  const schemas = /* @__PURE__ */ new Set();
  deunionize(schemas, schema4);
  return Union2(...Array.from(schemas, toResponseSuccess));
};
var makeErrorSchema = (api2) => {
  const schemas = /* @__PURE__ */ new Set();
  deunionize(schemas, api2.errorSchema);
  for (const group2 of Object.values(api2.groups)) {
    for (const endpoint of Object.values(group2.endpoints)) {
      deunionize(schemas, endpoint.errorSchema);
    }
    deunionize(schemas, group2.errorSchema);
  }
  return Union2(...Array.from(schemas, toResponseError));
};
var decodeForbidden = (_, __, ast) => fail5(new Forbidden(ast, _, "Encode only schema"));
var toResponseSchema = (getStatus2) => {
  const cache = /* @__PURE__ */ new WeakMap();
  const schemaToResponse = (data, _, ast) => {
    const isEmpty2 = isVoid(ast.to);
    const status = getStatus2(ast.to);
    if (isEmpty2) {
      return empty11({
        status
      });
    }
    const encoding = getEncoding(ast.to);
    switch (encoding.kind) {
      case "Json": {
        return mapError(json4(data, {
          status,
          contentType: encoding.contentType
        }), (error) => new Type(ast, error, "Could not encode to JSON"));
      }
      case "Text": {
        return succeed5(text4(data, {
          status,
          contentType: encoding.contentType
        }));
      }
      case "Uint8Array": {
        return succeed5(uint8Array4(data, {
          status,
          contentType: encoding.contentType
        }));
      }
      case "UrlParams": {
        return succeed5(urlParams4(data, {
          status,
          contentType: encoding.contentType
        }));
      }
    }
  };
  return (schema4) => {
    if (cache.has(schema4.ast)) {
      return cache.get(schema4.ast);
    }
    const transform6 = transformOrFail(responseSchema, schema4, {
      decode: decodeForbidden,
      encode: schemaToResponse
    });
    cache.set(transform6.ast, transform6);
    return transform6;
  };
};
var toResponseSuccess = toResponseSchema(getStatusSuccessAST);
var toResponseError = toResponseSchema(getStatusErrorAST);
var Middleware = class _Middleware extends Tag("@effect/platform/HttpApiBuilder/Middleware")() {
  /**
   * @since 1.0.0
   */
  static layer = sync2(_Middleware, () => {
    let middleware3 = identity;
    return _Middleware.of({
      add: (f) => sync(() => {
        const prev = middleware3;
        middleware3 = (app) => f(prev(app));
      }),
      retrieve: sync(() => middleware3)
    });
  });
};
var middlewareAdd = (middleware3) => gen(function* () {
  const context2 = yield* context();
  const service = yield* Middleware;
  yield* service.add((httpApp2) => mapInputContext(middleware3(httpApp2), (input) => merge(context2, input)));
});
var middlewareAddNoContext = (middleware3) => gen(function* () {
  const service = yield* Middleware;
  yield* service.add(middleware3);
});
var middleware = (...args) => {
  const apiFirst = isHttpApi(args[0]);
  const withContext = apiFirst ? args[2]?.withContext === true : args[1]?.withContext === true;
  const add3 = withContext ? middlewareAdd : middlewareAddNoContext;
  const middleware3 = apiFirst ? args[1] : args[0];
  return (isEffect(middleware3) ? scopedDiscard(flatMap2(middleware3, add3)) : scopedDiscard(add3(middleware3))).pipe(provide2(Middleware.layer));
};
var middlewareCors = (options7) => middleware(cors2(options7));
var middlewareOpenApi = (options7) => Router.use((router) => gen(function* () {
  const {
    api: api2
  } = yield* Api;
  const spec = fromApi(api2, {
    additionalPropertiesStrategy: options7?.additionalPropertiesStrategy
  });
  const response = yield* json4(spec).pipe(orDie);
  yield* router.get(options7?.path ?? "/openapi.json", succeed2(response));
}));
var bearerLen = `Bearer `.length;
var basicLen = `Basic `.length;
var securityDecode = (self) => {
  switch (self._tag) {
    case "Bearer": {
      return map5(HttpServerRequest, (request) => make8((request.headers.authorization ?? "").slice(bearerLen)));
    }
    case "ApiKey": {
      const key = self.in === "header" ? self.key.toLowerCase() : self.key;
      const schema4 = Struct({
        [key]: String$
      });
      const decode5 = unify(self.in === "query" ? schemaSearchParams2(schema4) : self.in === "cookie" ? schemaCookies2(schema4) : schemaHeaders3(schema4));
      return match3(decode5, {
        onFailure: () => make8(""),
        onSuccess: (match4) => make8(match4[key])
      });
    }
    case "Basic": {
      const empty15 = {
        username: "",
        password: make8("")
      };
      return HttpServerRequest.pipe(flatMap2((request) => decodeBase64String((request.headers.authorization ?? "").slice(basicLen))), match3({
        onFailure: () => empty15,
        onSuccess: (header) => {
          const parts = header.split(":");
          if (parts.length !== 2) {
            return empty15;
          }
          return {
            username: parts[0],
            password: make8(parts[1])
          };
        }
      }));
    }
  }
};
var securitySetCookie = (self, value2, options7) => {
  const stringValue = typeof value2 === "string" ? value2 : value(value2);
  return appendPreResponseHandler2((_req, response) => orDie(setCookie3(response, self.key, stringValue, {
    secure: true,
    httpOnly: true,
    ...options7
  })));
};

// node_modules/@effect/platform/dist/esm/HttpLayerRouter.js
var HttpLayerRouter_exports = {};
__export(HttpLayerRouter_exports, {
  FindMyWay: () => esm_exports2,
  HttpRouter: () => HttpRouter,
  MiddlewareTypeId: () => MiddlewareTypeId,
  RouteContext: () => RouteContext2,
  RouteTypeId: () => RouteTypeId3,
  RouterConfig: () => RouterConfig,
  TypeId: () => TypeId32,
  add: () => add2,
  addAll: () => addAll,
  addHttpApi: () => addHttpApi,
  cors: () => cors3,
  disableLogger: () => disableLogger,
  layer: () => layer6,
  make: () => make31,
  middleware: () => middleware2,
  params: () => params2,
  prefixPath: () => prefixPath3,
  prefixRoute: () => prefixRoute,
  route: () => route3,
  schemaJson: () => schemaJson7,
  schemaNoBody: () => schemaNoBody3,
  schemaParams: () => schemaParams2,
  schemaPathParams: () => schemaPathParams2,
  serve: () => serve4,
  toHttpEffect: () => toHttpEffect,
  toWebHandler: () => toWebHandler3,
  use: () => use3
});
var TypeId32 = Symbol.for("@effect/platform/HttpLayerRouter/HttpRouter");
var HttpRouter = GenericTag("@effect/platform/HttpLayerRouter");
var make31 = gen(function* () {
  const router = make29(yield* RouterConfig);
  const middleware3 = /* @__PURE__ */ new Set();
  const addAll3 = (routes) => contextWith((context2) => {
    const middleware4 = getMiddleware(context2);
    const applyMiddleware2 = (effect2) => {
      for (let i = 0; i < middleware4.length; i++) {
        effect2 = middleware4[i](effect2);
      }
      return effect2;
    };
    for (let i = 0; i < routes.length; i++) {
      const route4 = middleware4.length === 0 ? routes[i] : makeRoute3({
        ...routes[i],
        handler: applyMiddleware2(routes[i].handler)
      });
      if (route4.method === "*") {
        router.all(route4.path, route4);
      } else {
        router.on(route4.method, route4.path, route4);
      }
    }
  });
  return HttpRouter.of({
    [TypeId32]: TypeId32,
    prefixed(prefix) {
      return HttpRouter.of({
        ...this,
        prefixed: (newPrefix) => this.prefixed(prefixPath3(prefix, newPrefix)),
        addAll: (routes) => addAll3(routes.map(prefixRoute(prefix))),
        add: (method, path, handler2, options7) => addAll3([makeRoute3({
          method,
          path: prefixPath3(path, prefix),
          handler: isEffect(handler2) ? handler2 : flatMap2(HttpServerRequest, handler2),
          uninterruptible: options7?.uninterruptible ?? false,
          prefix: some(prefix)
        })])
      });
    },
    addAll: addAll3,
    add: (method, path, handler2, options7) => addAll3([route3(method, path, handler2, options7)]),
    addGlobalMiddleware: (middleware_) => sync(() => {
      middleware3.add(middleware_);
    }),
    asHttpEffect() {
      let handler2 = withFiberRuntime((fiber) => {
        const contextMap = new Map(fiber.currentContext.unsafeMap);
        const request = contextMap.get(HttpServerRequest.key);
        let result = router.find(request.method, request.url);
        if (result === void 0 && request.method === "HEAD") {
          result = router.find("GET", request.url);
        }
        if (result === void 0) {
          return fail4(new RouteNotFound({
            request
          }));
        }
        const route4 = result.handler;
        if (route4.prefix._tag === "Some") {
          contextMap.set(HttpServerRequest.key, sliceRequestUrl2(request, route4.prefix.value));
        }
        contextMap.set(ParsedSearchParams.key, result.searchParams);
        contextMap.set(RouteContext2.key, {
          [RouteContextTypeId2]: RouteContextTypeId2,
          route: route4,
          params: result.params
        });
        const span = contextMap.get(ParentSpan.key);
        if (span && span._tag === "Span") {
          span.attribute("http.route", route4.path);
        }
        return locally(route4.uninterruptible ? route4.handler : interruptible(route4.handler), currentContext, unsafeMake(contextMap));
      });
      if (middleware3.size === 0) return handler2;
      for (const fn of reverse(middleware3)) {
        handler2 = fn(handler2);
      }
      return handler2;
    }
  });
});
function sliceRequestUrl2(request, prefix) {
  const prefexLen = prefix.length;
  return request.modify({
    url: request.url.length <= prefexLen ? "/" : request.url.slice(prefexLen)
  });
}
var RouterConfig = class extends Reference()("@effect/platform/HttpLayerRouter/RouterConfig", {
  defaultValue: constant({})
}) {
};
var use3 = (f) => scopedDiscard(flatMap2(HttpRouter, f));
var add2 = (method, path, handler2, options7) => use3((router) => router.add(method, path, handler2, options7));
var addAll = (routes, options7) => scopedDiscard(gen(function* () {
  const toAdd = isEffect(routes) ? yield* routes : routes;
  let router = yield* HttpRouter;
  if (options7?.prefix) {
    router = router.prefixed(options7.prefix);
  }
  yield* router.addAll(toAdd);
}));
var layer6 = effect(HttpRouter, make31);
var toHttpEffect = (appLayer) => gen(function* () {
  const scope2 = yield* scope;
  const memoMap = yield* CurrentMemoMap;
  const context2 = yield* buildWithMemoMap(provideMerge(appLayer, layer6), memoMap, scope2);
  const router = get2(context2, HttpRouter);
  return router.asHttpEffect();
});
var RouteTypeId3 = Symbol.for("@effect/platform/HttpLayerRouter/Route");
var makeRoute3 = (options7) => ({
  ...options7,
  uninterruptible: options7.uninterruptible ?? false,
  prefix: options7.prefix ?? none(),
  [RouteTypeId3]: RouteTypeId3
});
var route3 = (method, path, handler2, options7) => makeRoute3({
  ...options7,
  method,
  path,
  handler: isEffect(handler2) ? handler2 : flatMap2(HttpServerRequest, handler2),
  uninterruptible: options7?.uninterruptible ?? false
});
var removeTrailingSlash2 = (path) => path.endsWith("/") ? path.slice(0, -1) : path;
var prefixPath3 = dual(2, (self, prefix) => {
  prefix = removeTrailingSlash2(prefix);
  return self === "/" ? prefix : prefix + self;
});
var prefixRoute = dual(2, (self, prefix) => makeRoute3({
  ...self,
  path: prefixPath3(self.path, prefix),
  prefix: match2(self.prefix, {
    onNone: () => some(prefix),
    onSome: (existingPrefix) => some(prefixPath3(existingPrefix, prefix))
  })
}));
var MiddlewareTypeId = Symbol.for("@effect/platform/HttpLayerRouter/Middleware");
var middleware2 = function() {
  if (arguments.length === 0) {
    return makeMiddleware;
  }
  return makeMiddleware(arguments[0], arguments[1]);
};
var makeMiddleware = (middleware3, options7) => options7?.global ? scopedDiscard(gen(function* () {
  const router = yield* HttpRouter;
  const fn = isEffect(middleware3) ? yield* middleware3 : middleware3;
  yield* router.addGlobalMiddleware(fn);
})) : new MiddlewareImpl(isEffect(middleware3) ? scopedContext(map5(middleware3, (fn) => unsafeMake(/* @__PURE__ */ new Map([[fnContextKey, fn]])))) : succeedContext(unsafeMake(/* @__PURE__ */ new Map([[fnContextKey, middleware3]]))));
var middlewareId = 0;
var fnContextKey = "@effect/platform/HttpLayerRouter/MiddlewareFn";
var MiddlewareImpl = class _MiddlewareImpl {
  layerFn;
  dependencies;
  [MiddlewareTypeId] = {};
  constructor(layerFn, dependencies) {
    this.layerFn = layerFn;
    this.dependencies = dependencies;
    const contextKey = `@effect/platform/HttpLayerRouter/Middleware-${++middlewareId}`;
    this.layer = scopedContext(gen(this, function* () {
      const context2 = yield* context();
      const stack = [context2.unsafeMap.get(fnContextKey)];
      if (this.dependencies) {
        const memoMap = yield* CurrentMemoMap;
        const scope2 = get2(context2, Scope);
        const depsContext = yield* buildWithMemoMap(this.dependencies, memoMap, scope2);
        stack.push(...getMiddleware(depsContext));
      }
      return unsafeMake(/* @__PURE__ */ new Map([[contextKey, stack]]));
    })).pipe(provide2(this.layerFn));
  }
  layer;
  combine(other) {
    return new _MiddlewareImpl(this.layerFn, this.dependencies ? provideMerge(this.dependencies, other.layer) : other.layer);
  }
};
var middlewareCache = /* @__PURE__ */ new WeakMap();
var getMiddleware = (context2) => {
  let arr = middlewareCache.get(context2);
  if (arr) return arr;
  const topLevel = empty();
  let maxLength = 0;
  for (const [key, value2] of context2.unsafeMap) {
    if (key.startsWith("@effect/platform/HttpLayerRouter/Middleware-")) {
      topLevel.push(value2);
      if (value2.length > maxLength) {
        maxLength = value2.length;
      }
    }
  }
  if (topLevel.length === 0) {
    arr = [];
  } else {
    const middleware3 = /* @__PURE__ */ new Set();
    for (let i = maxLength - 1; i >= 0; i--) {
      for (const arr2 of topLevel) {
        if (i < arr2.length) {
          middleware3.add(arr2[i]);
        }
      }
    }
    arr = fromIterable(middleware3).reverse();
  }
  middlewareCache.set(context2, arr);
  return arr;
};
var cors3 = (options7) => middleware2(cors2(options7), {
  global: true
});
var disableLogger = middleware2(withLoggerDisabled2).layer;
var addHttpApi = (api2, options7) => {
  const ApiMiddleware = middleware2(buildMiddleware(api2)).layer;
  return Router.unwrap(fnUntraced(function* (router_) {
    const router = yield* HttpRouter;
    const context2 = yield* context();
    const routes = empty();
    for (const route4 of router_.routes) {
      routes.push(makeRoute3({
        ...route4,
        handler: provide(route4.handler, context2)
      }));
    }
    yield* router.addAll(routes);
    if (options7?.openapiPath) {
      const spec = fromApi(api2);
      yield* router.add("GET", options7.openapiPath, succeed2(unsafeJson4(spec)));
    }
  }, effectDiscard)).pipe(provide2(ApiMiddleware));
};
var serve4 = (appLayer, options7) => {
  let middleware3 = options7?.middleware;
  if (options7?.disableLogger !== true) {
    middleware3 = middleware3 ? compose(middleware3, logger2) : logger2;
  }
  const RouterLayer = options7?.routerConfig ? provide2(layer6, succeed3(RouterConfig, options7.routerConfig)) : layer6;
  return gen(function* () {
    const router = yield* HttpRouter;
    const handler2 = router.asHttpEffect();
    return middleware3 ? serve2(handler2, middleware3) : serve2(handler2);
  }).pipe(unwrapScoped, provide2(appLayer), provide2(RouterLayer), options7?.disableListenLog ? identity : withLogAddress2);
};
var toWebHandler3 = (appLayer, options7) => {
  let middleware3 = options7?.middleware;
  if (options7?.disableLogger !== true) {
    middleware3 = middleware3 ? compose(middleware3, logger2) : logger2;
  }
  const RouterLayer = options7?.routerConfig ? provide2(layer6, succeed3(RouterConfig, options7.routerConfig)) : layer6;
  const runtime4 = make6(provideMerge(appLayer, RouterLayer), options7?.memoMap);
  let handlerCached;
  const handlerPromise = gen(function* () {
    const router = yield* HttpRouter;
    const effect2 = router.asHttpEffect();
    const rt = yield* runtime4.runtimeEffect;
    const handler3 = toWebHandlerRuntime(rt)(effect2, middleware3);
    handlerCached = handler3;
    return handler3;
  }).pipe(runtime4.runPromise);
  function handler2(request, context2) {
    if (handlerCached !== void 0) {
      return handlerCached(request, context2);
    }
    return handlerPromise.then((handler3) => handler3(request, context2));
  }
  return {
    handler: handler2,
    dispose: runtime4.dispose
  };
};

// node_modules/@effect/platform/dist/esm/MsgPack.js
var MsgPack_exports = {};
__export(MsgPack_exports, {
  ErrorTypeId: () => ErrorTypeId5,
  MsgPackError: () => MsgPackError,
  Msgpackr: () => msgpackr_exports,
  duplex: () => duplex2,
  duplexSchema: () => duplexSchema,
  pack: () => pack2,
  packSchema: () => packSchema,
  schema: () => schema2,
  unpack: () => unpack2,
  unpackSchema: () => unpackSchema
});

// node_modules/msgpackr/index.js
var msgpackr_exports = {};
__export(msgpackr_exports, {
  ALWAYS: () => ALWAYS,
  C1: () => C1,
  DECIMAL_FIT: () => DECIMAL_FIT,
  DECIMAL_ROUND: () => DECIMAL_ROUND,
  Decoder: () => Decoder,
  Encoder: () => Encoder,
  FLOAT32_OPTIONS: () => FLOAT32_OPTIONS,
  NEVER: () => NEVER,
  Packr: () => Packr,
  RESERVE_START_SPACE: () => RESERVE_START_SPACE,
  RESET_BUFFER_MODE: () => RESET_BUFFER_MODE,
  REUSE_BUFFER_MODE: () => REUSE_BUFFER_MODE,
  Unpackr: () => Unpackr,
  addExtension: () => addExtension2,
  clearSource: () => clearSource,
  decode: () => decode4,
  decodeIter: () => decodeIter,
  encode: () => encode3,
  encodeIter: () => encodeIter,
  isNativeAccelerationEnabled: () => isNativeAccelerationEnabled,
  mapsAsObjects: () => mapsAsObjects,
  pack: () => pack,
  roundFloat32: () => roundFloat32,
  unpack: () => unpack,
  unpackMultiple: () => unpackMultiple,
  useRecords: () => useRecords
});

// node_modules/msgpackr/unpack.js
var decoder;
try {
  decoder = new TextDecoder();
} catch (error) {
}
var src;
var srcEnd;
var position = 0;
var EMPTY_ARRAY = [];
var strings = EMPTY_ARRAY;
var stringPosition = 0;
var currentUnpackr = {};
var currentStructures;
var srcString;
var srcStringStart = 0;
var srcStringEnd = 0;
var bundledStrings;
var referenceMap;
var currentExtensions = [];
var dataView;
var defaultOptions = {
  useRecords: false,
  mapsAsObjects: true
};
var C1Type = class {
};
var C1 = new C1Type();
C1.name = "MessagePack 0xC1";
var sequentialMode = false;
var inlineObjectReadThreshold = 2;
var readStruct;
var onLoadedStructures;
var onSaveState;
try {
  new Function("");
} catch (error) {
  inlineObjectReadThreshold = Infinity;
}
var Unpackr = class _Unpackr {
  constructor(options7) {
    if (options7) {
      if (options7.useRecords === false && options7.mapsAsObjects === void 0)
        options7.mapsAsObjects = true;
      if (options7.sequential && options7.trusted !== false) {
        options7.trusted = true;
        if (!options7.structures && options7.useRecords != false) {
          options7.structures = [];
          if (!options7.maxSharedStructures)
            options7.maxSharedStructures = 0;
        }
      }
      if (options7.structures)
        options7.structures.sharedLength = options7.structures.length;
      else if (options7.getStructures) {
        (options7.structures = []).uninitialized = true;
        options7.structures.sharedLength = 0;
      }
      if (options7.int64AsNumber) {
        options7.int64AsType = "number";
      }
    }
    Object.assign(this, options7);
  }
  unpack(source, options7) {
    if (src) {
      return saveState(() => {
        clearSource();
        return this ? this.unpack(source, options7) : _Unpackr.prototype.unpack.call(defaultOptions, source, options7);
      });
    }
    if (!source.buffer && source.constructor === ArrayBuffer)
      source = typeof Buffer !== "undefined" ? Buffer.from(source) : new Uint8Array(source);
    if (typeof options7 === "object") {
      srcEnd = options7.end || source.length;
      position = options7.start || 0;
    } else {
      position = 0;
      srcEnd = options7 > -1 ? options7 : source.length;
    }
    stringPosition = 0;
    srcStringEnd = 0;
    srcString = null;
    strings = EMPTY_ARRAY;
    bundledStrings = null;
    src = source;
    try {
      dataView = source.dataView || (source.dataView = new DataView(source.buffer, source.byteOffset, source.byteLength));
    } catch (error) {
      src = null;
      if (source instanceof Uint8Array)
        throw error;
      throw new Error("Source must be a Uint8Array or Buffer but was a " + (source && typeof source == "object" ? source.constructor.name : typeof source));
    }
    if (this instanceof _Unpackr) {
      currentUnpackr = this;
      if (this.structures) {
        currentStructures = this.structures;
        return checkedRead(options7);
      } else if (!currentStructures || currentStructures.length > 0) {
        currentStructures = [];
      }
    } else {
      currentUnpackr = defaultOptions;
      if (!currentStructures || currentStructures.length > 0)
        currentStructures = [];
    }
    return checkedRead(options7);
  }
  unpackMultiple(source, forEach4) {
    let values, lastPosition = 0;
    try {
      sequentialMode = true;
      let size = source.length;
      let value2 = this ? this.unpack(source, size) : defaultUnpackr.unpack(source, size);
      if (forEach4) {
        if (forEach4(value2, lastPosition, position) === false) return;
        while (position < size) {
          lastPosition = position;
          if (forEach4(checkedRead(), lastPosition, position) === false) {
            return;
          }
        }
      } else {
        values = [value2];
        while (position < size) {
          lastPosition = position;
          values.push(checkedRead());
        }
        return values;
      }
    } catch (error) {
      error.lastPosition = lastPosition;
      error.values = values;
      throw error;
    } finally {
      sequentialMode = false;
      clearSource();
    }
  }
  _mergeStructures(loadedStructures, existingStructures) {
    if (onLoadedStructures)
      loadedStructures = onLoadedStructures.call(this, loadedStructures);
    loadedStructures = loadedStructures || [];
    if (Object.isFrozen(loadedStructures))
      loadedStructures = loadedStructures.map((structure) => structure.slice(0));
    for (let i = 0, l = loadedStructures.length; i < l; i++) {
      let structure = loadedStructures[i];
      if (structure) {
        structure.isShared = true;
        if (i >= 32)
          structure.highByte = i - 32 >> 5;
      }
    }
    loadedStructures.sharedLength = loadedStructures.length;
    for (let id in existingStructures || []) {
      if (id >= 0) {
        let structure = loadedStructures[id];
        let existing = existingStructures[id];
        if (existing) {
          if (structure)
            (loadedStructures.restoreStructures || (loadedStructures.restoreStructures = []))[id] = structure;
          loadedStructures[id] = existing;
        }
      }
    }
    return this.structures = loadedStructures;
  }
  decode(source, options7) {
    return this.unpack(source, options7);
  }
};
function checkedRead(options7) {
  try {
    if (!currentUnpackr.trusted && !sequentialMode) {
      let sharedLength = currentStructures.sharedLength || 0;
      if (sharedLength < currentStructures.length)
        currentStructures.length = sharedLength;
    }
    let result;
    if (currentUnpackr.randomAccessStructure && src[position] < 64 && src[position] >= 32 && readStruct) {
      result = readStruct(src, position, srcEnd, currentUnpackr);
      src = null;
      if (!(options7 && options7.lazy) && result)
        result = result.toJSON();
      position = srcEnd;
    } else
      result = read();
    if (bundledStrings) {
      position = bundledStrings.postBundlePosition;
      bundledStrings = null;
    }
    if (sequentialMode)
      currentStructures.restoreStructures = null;
    if (position == srcEnd) {
      if (currentStructures && currentStructures.restoreStructures)
        restoreStructures();
      currentStructures = null;
      src = null;
      if (referenceMap)
        referenceMap = null;
    } else if (position > srcEnd) {
      throw new Error("Unexpected end of MessagePack data");
    } else if (!sequentialMode) {
      let jsonView;
      try {
        jsonView = JSON.stringify(result, (_, value2) => typeof value2 === "bigint" ? `${value2}n` : value2).slice(0, 100);
      } catch (error) {
        jsonView = "(JSON view not available " + error + ")";
      }
      throw new Error("Data read, but end of buffer not reached " + jsonView);
    }
    return result;
  } catch (error) {
    if (currentStructures && currentStructures.restoreStructures)
      restoreStructures();
    clearSource();
    if (error instanceof RangeError || error.message.startsWith("Unexpected end of buffer") || position > srcEnd) {
      error.incomplete = true;
    }
    throw error;
  }
}
function restoreStructures() {
  for (let id in currentStructures.restoreStructures) {
    currentStructures[id] = currentStructures.restoreStructures[id];
  }
  currentStructures.restoreStructures = null;
}
function read() {
  let token = src[position++];
  if (token < 160) {
    if (token < 128) {
      if (token < 64)
        return token;
      else {
        let structure = currentStructures[token & 63] || currentUnpackr.getStructures && loadStructures()[token & 63];
        if (structure) {
          if (!structure.read) {
            structure.read = createStructureReader(structure, token & 63);
          }
          return structure.read();
        } else
          return token;
      }
    } else if (token < 144) {
      token -= 128;
      if (currentUnpackr.mapsAsObjects) {
        let object = {};
        for (let i = 0; i < token; i++) {
          let key = readKey();
          if (key === "__proto__")
            key = "__proto_";
          object[key] = read();
        }
        return object;
      } else {
        let map7 = /* @__PURE__ */ new Map();
        for (let i = 0; i < token; i++) {
          map7.set(read(), read());
        }
        return map7;
      }
    } else {
      token -= 144;
      let array = new Array(token);
      for (let i = 0; i < token; i++) {
        array[i] = read();
      }
      if (currentUnpackr.freezeData)
        return Object.freeze(array);
      return array;
    }
  } else if (token < 192) {
    let length = token - 160;
    if (srcStringEnd >= position) {
      return srcString.slice(position - srcStringStart, (position += length) - srcStringStart);
    }
    if (srcStringEnd == 0 && srcEnd < 140) {
      let string = length < 16 ? shortStringInJS(length) : longStringInJS(length);
      if (string != null)
        return string;
    }
    return readFixedString(length);
  } else {
    let value2;
    switch (token) {
      case 192:
        return null;
      case 193:
        if (bundledStrings) {
          value2 = read();
          if (value2 > 0)
            return bundledStrings[1].slice(bundledStrings.position1, bundledStrings.position1 += value2);
          else
            return bundledStrings[0].slice(bundledStrings.position0, bundledStrings.position0 -= value2);
        }
        return C1;
      // "never-used", return special object to denote that
      case 194:
        return false;
      case 195:
        return true;
      case 196:
        value2 = src[position++];
        if (value2 === void 0)
          throw new Error("Unexpected end of buffer");
        return readBin(value2);
      case 197:
        value2 = dataView.getUint16(position);
        position += 2;
        return readBin(value2);
      case 198:
        value2 = dataView.getUint32(position);
        position += 4;
        return readBin(value2);
      case 199:
        return readExt(src[position++]);
      case 200:
        value2 = dataView.getUint16(position);
        position += 2;
        return readExt(value2);
      case 201:
        value2 = dataView.getUint32(position);
        position += 4;
        return readExt(value2);
      case 202:
        value2 = dataView.getFloat32(position);
        if (currentUnpackr.useFloat32 > 2) {
          let multiplier = mult10[(src[position] & 127) << 1 | src[position + 1] >> 7];
          position += 4;
          return (multiplier * value2 + (value2 > 0 ? 0.5 : -0.5) >> 0) / multiplier;
        }
        position += 4;
        return value2;
      case 203:
        value2 = dataView.getFloat64(position);
        position += 8;
        return value2;
      // uint handlers
      case 204:
        return src[position++];
      case 205:
        value2 = dataView.getUint16(position);
        position += 2;
        return value2;
      case 206:
        value2 = dataView.getUint32(position);
        position += 4;
        return value2;
      case 207:
        if (currentUnpackr.int64AsType === "number") {
          value2 = dataView.getUint32(position) * 4294967296;
          value2 += dataView.getUint32(position + 4);
        } else if (currentUnpackr.int64AsType === "string") {
          value2 = dataView.getBigUint64(position).toString();
        } else if (currentUnpackr.int64AsType === "auto") {
          value2 = dataView.getBigUint64(position);
          if (value2 <= BigInt(2) << BigInt(52)) value2 = Number(value2);
        } else
          value2 = dataView.getBigUint64(position);
        position += 8;
        return value2;
      // int handlers
      case 208:
        return dataView.getInt8(position++);
      case 209:
        value2 = dataView.getInt16(position);
        position += 2;
        return value2;
      case 210:
        value2 = dataView.getInt32(position);
        position += 4;
        return value2;
      case 211:
        if (currentUnpackr.int64AsType === "number") {
          value2 = dataView.getInt32(position) * 4294967296;
          value2 += dataView.getUint32(position + 4);
        } else if (currentUnpackr.int64AsType === "string") {
          value2 = dataView.getBigInt64(position).toString();
        } else if (currentUnpackr.int64AsType === "auto") {
          value2 = dataView.getBigInt64(position);
          if (value2 >= BigInt(-2) << BigInt(52) && value2 <= BigInt(2) << BigInt(52)) value2 = Number(value2);
        } else
          value2 = dataView.getBigInt64(position);
        position += 8;
        return value2;
      case 212:
        value2 = src[position++];
        if (value2 == 114) {
          return recordDefinition(src[position++] & 63);
        } else {
          let extension = currentExtensions[value2];
          if (extension) {
            if (extension.read) {
              position++;
              return extension.read(read());
            } else if (extension.noBuffer) {
              position++;
              return extension();
            } else
              return extension(src.subarray(position, ++position));
          } else
            throw new Error("Unknown extension " + value2);
        }
      case 213:
        value2 = src[position];
        if (value2 == 114) {
          position++;
          return recordDefinition(src[position++] & 63, src[position++]);
        } else
          return readExt(2);
      case 214:
        return readExt(4);
      case 215:
        return readExt(8);
      case 216:
        return readExt(16);
      case 217:
        value2 = src[position++];
        if (srcStringEnd >= position) {
          return srcString.slice(position - srcStringStart, (position += value2) - srcStringStart);
        }
        return readString8(value2);
      case 218:
        value2 = dataView.getUint16(position);
        position += 2;
        if (srcStringEnd >= position) {
          return srcString.slice(position - srcStringStart, (position += value2) - srcStringStart);
        }
        return readString16(value2);
      case 219:
        value2 = dataView.getUint32(position);
        position += 4;
        if (srcStringEnd >= position) {
          return srcString.slice(position - srcStringStart, (position += value2) - srcStringStart);
        }
        return readString32(value2);
      case 220:
        value2 = dataView.getUint16(position);
        position += 2;
        return readArray(value2);
      case 221:
        value2 = dataView.getUint32(position);
        position += 4;
        return readArray(value2);
      case 222:
        value2 = dataView.getUint16(position);
        position += 2;
        return readMap(value2);
      case 223:
        value2 = dataView.getUint32(position);
        position += 4;
        return readMap(value2);
      default:
        if (token >= 224)
          return token - 256;
        if (token === void 0) {
          let error = new Error("Unexpected end of MessagePack data");
          error.incomplete = true;
          throw error;
        }
        throw new Error("Unknown MessagePack token " + token);
    }
  }
}
var validName = /^[a-zA-Z_$][a-zA-Z\d_$]*$/;
function createStructureReader(structure, firstId) {
  function readObject() {
    if (readObject.count++ > inlineObjectReadThreshold) {
      let readObject2 = structure.read = new Function("r", "return function(){return " + (currentUnpackr.freezeData ? "Object.freeze" : "") + "({" + structure.map((key) => key === "__proto__" ? "__proto_:r()" : validName.test(key) ? key + ":r()" : "[" + JSON.stringify(key) + "]:r()").join(",") + "})}")(read);
      if (structure.highByte === 0)
        structure.read = createSecondByteReader(firstId, structure.read);
      return readObject2();
    }
    let object = {};
    for (let i = 0, l = structure.length; i < l; i++) {
      let key = structure[i];
      if (key === "__proto__")
        key = "__proto_";
      object[key] = read();
    }
    if (currentUnpackr.freezeData)
      return Object.freeze(object);
    return object;
  }
  readObject.count = 0;
  if (structure.highByte === 0) {
    return createSecondByteReader(firstId, readObject);
  }
  return readObject;
}
var createSecondByteReader = (firstId, read0) => {
  return function() {
    let highByte = src[position++];
    if (highByte === 0)
      return read0();
    let id = firstId < 32 ? -(firstId + (highByte << 5)) : firstId + (highByte << 5);
    let structure = currentStructures[id] || loadStructures()[id];
    if (!structure) {
      throw new Error("Record id is not defined for " + id);
    }
    if (!structure.read)
      structure.read = createStructureReader(structure, firstId);
    return structure.read();
  };
};
function loadStructures() {
  let loadedStructures = saveState(() => {
    src = null;
    return currentUnpackr.getStructures();
  });
  return currentStructures = currentUnpackr._mergeStructures(loadedStructures, currentStructures);
}
var readFixedString = readStringJS;
var readString8 = readStringJS;
var readString16 = readStringJS;
var readString32 = readStringJS;
var isNativeAccelerationEnabled = false;
function readStringJS(length) {
  let result;
  if (length < 16) {
    if (result = shortStringInJS(length))
      return result;
  }
  if (length > 64 && decoder)
    return decoder.decode(src.subarray(position, position += length));
  const end = position + length;
  const units = [];
  result = "";
  while (position < end) {
    const byte1 = src[position++];
    if ((byte1 & 128) === 0) {
      units.push(byte1);
    } else if ((byte1 & 224) === 192) {
      const byte2 = src[position++] & 63;
      units.push((byte1 & 31) << 6 | byte2);
    } else if ((byte1 & 240) === 224) {
      const byte2 = src[position++] & 63;
      const byte3 = src[position++] & 63;
      units.push((byte1 & 31) << 12 | byte2 << 6 | byte3);
    } else if ((byte1 & 248) === 240) {
      const byte2 = src[position++] & 63;
      const byte3 = src[position++] & 63;
      const byte4 = src[position++] & 63;
      let unit = (byte1 & 7) << 18 | byte2 << 12 | byte3 << 6 | byte4;
      if (unit > 65535) {
        unit -= 65536;
        units.push(unit >>> 10 & 1023 | 55296);
        unit = 56320 | unit & 1023;
      }
      units.push(unit);
    } else {
      units.push(byte1);
    }
    if (units.length >= 4096) {
      result += fromCharCode.apply(String, units);
      units.length = 0;
    }
  }
  if (units.length > 0) {
    result += fromCharCode.apply(String, units);
  }
  return result;
}
function readArray(length) {
  let array = new Array(length);
  for (let i = 0; i < length; i++) {
    array[i] = read();
  }
  if (currentUnpackr.freezeData)
    return Object.freeze(array);
  return array;
}
function readMap(length) {
  if (currentUnpackr.mapsAsObjects) {
    let object = {};
    for (let i = 0; i < length; i++) {
      let key = readKey();
      if (key === "__proto__")
        key = "__proto_";
      object[key] = read();
    }
    return object;
  } else {
    let map7 = /* @__PURE__ */ new Map();
    for (let i = 0; i < length; i++) {
      map7.set(read(), read());
    }
    return map7;
  }
}
var fromCharCode = String.fromCharCode;
function longStringInJS(length) {
  let start = position;
  let bytes = new Array(length);
  for (let i = 0; i < length; i++) {
    const byte = src[position++];
    if ((byte & 128) > 0) {
      position = start;
      return;
    }
    bytes[i] = byte;
  }
  return fromCharCode.apply(String, bytes);
}
function shortStringInJS(length) {
  if (length < 4) {
    if (length < 2) {
      if (length === 0)
        return "";
      else {
        let a = src[position++];
        if ((a & 128) > 1) {
          position -= 1;
          return;
        }
        return fromCharCode(a);
      }
    } else {
      let a = src[position++];
      let b = src[position++];
      if ((a & 128) > 0 || (b & 128) > 0) {
        position -= 2;
        return;
      }
      if (length < 3)
        return fromCharCode(a, b);
      let c = src[position++];
      if ((c & 128) > 0) {
        position -= 3;
        return;
      }
      return fromCharCode(a, b, c);
    }
  } else {
    let a = src[position++];
    let b = src[position++];
    let c = src[position++];
    let d = src[position++];
    if ((a & 128) > 0 || (b & 128) > 0 || (c & 128) > 0 || (d & 128) > 0) {
      position -= 4;
      return;
    }
    if (length < 6) {
      if (length === 4)
        return fromCharCode(a, b, c, d);
      else {
        let e = src[position++];
        if ((e & 128) > 0) {
          position -= 5;
          return;
        }
        return fromCharCode(a, b, c, d, e);
      }
    } else if (length < 8) {
      let e = src[position++];
      let f = src[position++];
      if ((e & 128) > 0 || (f & 128) > 0) {
        position -= 6;
        return;
      }
      if (length < 7)
        return fromCharCode(a, b, c, d, e, f);
      let g = src[position++];
      if ((g & 128) > 0) {
        position -= 7;
        return;
      }
      return fromCharCode(a, b, c, d, e, f, g);
    } else {
      let e = src[position++];
      let f = src[position++];
      let g = src[position++];
      let h = src[position++];
      if ((e & 128) > 0 || (f & 128) > 0 || (g & 128) > 0 || (h & 128) > 0) {
        position -= 8;
        return;
      }
      if (length < 10) {
        if (length === 8)
          return fromCharCode(a, b, c, d, e, f, g, h);
        else {
          let i = src[position++];
          if ((i & 128) > 0) {
            position -= 9;
            return;
          }
          return fromCharCode(a, b, c, d, e, f, g, h, i);
        }
      } else if (length < 12) {
        let i = src[position++];
        let j = src[position++];
        if ((i & 128) > 0 || (j & 128) > 0) {
          position -= 10;
          return;
        }
        if (length < 11)
          return fromCharCode(a, b, c, d, e, f, g, h, i, j);
        let k = src[position++];
        if ((k & 128) > 0) {
          position -= 11;
          return;
        }
        return fromCharCode(a, b, c, d, e, f, g, h, i, j, k);
      } else {
        let i = src[position++];
        let j = src[position++];
        let k = src[position++];
        let l = src[position++];
        if ((i & 128) > 0 || (j & 128) > 0 || (k & 128) > 0 || (l & 128) > 0) {
          position -= 12;
          return;
        }
        if (length < 14) {
          if (length === 12)
            return fromCharCode(a, b, c, d, e, f, g, h, i, j, k, l);
          else {
            let m = src[position++];
            if ((m & 128) > 0) {
              position -= 13;
              return;
            }
            return fromCharCode(a, b, c, d, e, f, g, h, i, j, k, l, m);
          }
        } else {
          let m = src[position++];
          let n = src[position++];
          if ((m & 128) > 0 || (n & 128) > 0) {
            position -= 14;
            return;
          }
          if (length < 15)
            return fromCharCode(a, b, c, d, e, f, g, h, i, j, k, l, m, n);
          let o = src[position++];
          if ((o & 128) > 0) {
            position -= 15;
            return;
          }
          return fromCharCode(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o);
        }
      }
    }
  }
}
function readOnlyJSString() {
  let token = src[position++];
  let length;
  if (token < 192) {
    length = token - 160;
  } else {
    switch (token) {
      case 217:
        length = src[position++];
        break;
      case 218:
        length = dataView.getUint16(position);
        position += 2;
        break;
      case 219:
        length = dataView.getUint32(position);
        position += 4;
        break;
      default:
        throw new Error("Expected string");
    }
  }
  return readStringJS(length);
}
function readBin(length) {
  return currentUnpackr.copyBuffers ? (
    // specifically use the copying slice (not the node one)
    Uint8Array.prototype.slice.call(src, position, position += length)
  ) : src.subarray(position, position += length);
}
function readExt(length) {
  let type = src[position++];
  if (currentExtensions[type]) {
    let end;
    return currentExtensions[type](src.subarray(position, end = position += length), (readPosition) => {
      position = readPosition;
      try {
        return read();
      } finally {
        position = end;
      }
    });
  } else
    throw new Error("Unknown extension type " + type);
}
var keyCache = new Array(4096);
function readKey() {
  let length = src[position++];
  if (length >= 160 && length < 192) {
    length = length - 160;
    if (srcStringEnd >= position)
      return srcString.slice(position - srcStringStart, (position += length) - srcStringStart);
    else if (!(srcStringEnd == 0 && srcEnd < 180))
      return readFixedString(length);
  } else {
    position--;
    return asSafeString(read());
  }
  let key = (length << 5 ^ (length > 1 ? dataView.getUint16(position) : length > 0 ? src[position] : 0)) & 4095;
  let entry = keyCache[key];
  let checkPosition = position;
  let end = position + length - 3;
  let chunk;
  let i = 0;
  if (entry && entry.bytes == length) {
    while (checkPosition < end) {
      chunk = dataView.getUint32(checkPosition);
      if (chunk != entry[i++]) {
        checkPosition = 1879048192;
        break;
      }
      checkPosition += 4;
    }
    end += 3;
    while (checkPosition < end) {
      chunk = src[checkPosition++];
      if (chunk != entry[i++]) {
        checkPosition = 1879048192;
        break;
      }
    }
    if (checkPosition === end) {
      position = checkPosition;
      return entry.string;
    }
    end -= 3;
    checkPosition = position;
  }
  entry = [];
  keyCache[key] = entry;
  entry.bytes = length;
  while (checkPosition < end) {
    chunk = dataView.getUint32(checkPosition);
    entry.push(chunk);
    checkPosition += 4;
  }
  end += 3;
  while (checkPosition < end) {
    chunk = src[checkPosition++];
    entry.push(chunk);
  }
  let string = length < 16 ? shortStringInJS(length) : longStringInJS(length);
  if (string != null)
    return entry.string = string;
  return entry.string = readFixedString(length);
}
function asSafeString(property) {
  if (typeof property === "string") return property;
  if (typeof property === "number" || typeof property === "boolean" || typeof property === "bigint") return property.toString();
  if (property == null) return property + "";
  if (currentUnpackr.allowArraysInMapKeys && Array.isArray(property) && property.flat().every((item) => ["string", "number", "boolean", "bigint"].includes(typeof item))) {
    return property.flat().toString();
  }
  throw new Error(`Invalid property type for record: ${typeof property}`);
}
var recordDefinition = (id, highByte) => {
  let structure = read().map(asSafeString);
  let firstByte = id;
  if (highByte !== void 0) {
    id = id < 32 ? -((highByte << 5) + id) : (highByte << 5) + id;
    structure.highByte = highByte;
  }
  let existingStructure = currentStructures[id];
  if (existingStructure && (existingStructure.isShared || sequentialMode)) {
    (currentStructures.restoreStructures || (currentStructures.restoreStructures = []))[id] = existingStructure;
  }
  currentStructures[id] = structure;
  structure.read = createStructureReader(structure, firstByte);
  return structure.read();
};
currentExtensions[0] = () => {
};
currentExtensions[0].noBuffer = true;
currentExtensions[66] = (data) => {
  let length = data.length;
  let value2 = BigInt(data[0] & 128 ? data[0] - 256 : data[0]);
  for (let i = 1; i < length; i++) {
    value2 <<= BigInt(8);
    value2 += BigInt(data[i]);
  }
  return value2;
};
var errors = { Error, TypeError, ReferenceError };
currentExtensions[101] = () => {
  let data = read();
  return (errors[data[0]] || Error)(data[1], { cause: data[2] });
};
currentExtensions[105] = (data) => {
  if (currentUnpackr.structuredClone === false) throw new Error("Structured clone extension is disabled");
  let id = dataView.getUint32(position - 4);
  if (!referenceMap)
    referenceMap = /* @__PURE__ */ new Map();
  let token = src[position];
  let target2;
  if (token >= 144 && token < 160 || token == 220 || token == 221)
    target2 = [];
  else if (token >= 128 && token < 144 || token == 222 || token == 223)
    target2 = /* @__PURE__ */ new Map();
  else if ((token >= 199 && token <= 201 || token >= 212 && token <= 216) && src[position + 1] === 115)
    target2 = /* @__PURE__ */ new Set();
  else
    target2 = {};
  let refEntry = { target: target2 };
  referenceMap.set(id, refEntry);
  let targetProperties = read();
  if (!refEntry.used) {
    return refEntry.target = targetProperties;
  } else {
    Object.assign(target2, targetProperties);
  }
  if (target2 instanceof Map)
    for (let [k, v] of targetProperties.entries()) target2.set(k, v);
  if (target2 instanceof Set)
    for (let i of Array.from(targetProperties)) target2.add(i);
  return target2;
};
currentExtensions[112] = (data) => {
  if (currentUnpackr.structuredClone === false) throw new Error("Structured clone extension is disabled");
  let id = dataView.getUint32(position - 4);
  let refEntry = referenceMap.get(id);
  refEntry.used = true;
  return refEntry.target;
};
currentExtensions[115] = () => new Set(read());
var typedArrays = ["Int8", "Uint8", "Uint8Clamped", "Int16", "Uint16", "Int32", "Uint32", "Float32", "Float64", "BigInt64", "BigUint64"].map((type) => type + "Array");
var glbl = typeof globalThis === "object" ? globalThis : window;
currentExtensions[116] = (data) => {
  let typeCode = data[0];
  let buffer = Uint8Array.prototype.slice.call(data, 1).buffer;
  let typedArrayName = typedArrays[typeCode];
  if (!typedArrayName) {
    if (typeCode === 16) return buffer;
    if (typeCode === 17) return new DataView(buffer);
    throw new Error("Could not find typed array for code " + typeCode);
  }
  return new glbl[typedArrayName](buffer);
};
currentExtensions[120] = () => {
  let data = read();
  return new RegExp(data[0], data[1]);
};
var TEMP_BUNDLE = [];
currentExtensions[98] = (data) => {
  let dataSize = (data[0] << 24) + (data[1] << 16) + (data[2] << 8) + data[3];
  let dataPosition = position;
  position += dataSize - data.length;
  bundledStrings = TEMP_BUNDLE;
  bundledStrings = [readOnlyJSString(), readOnlyJSString()];
  bundledStrings.position0 = 0;
  bundledStrings.position1 = 0;
  bundledStrings.postBundlePosition = position;
  position = dataPosition;
  return read();
};
currentExtensions[255] = (data) => {
  if (data.length == 4)
    return new Date((data[0] * 16777216 + (data[1] << 16) + (data[2] << 8) + data[3]) * 1e3);
  else if (data.length == 8)
    return new Date(
      ((data[0] << 22) + (data[1] << 14) + (data[2] << 6) + (data[3] >> 2)) / 1e6 + ((data[3] & 3) * 4294967296 + data[4] * 16777216 + (data[5] << 16) + (data[6] << 8) + data[7]) * 1e3
    );
  else if (data.length == 12)
    return new Date(
      ((data[0] << 24) + (data[1] << 16) + (data[2] << 8) + data[3]) / 1e6 + ((data[4] & 128 ? -281474976710656 : 0) + data[6] * 1099511627776 + data[7] * 4294967296 + data[8] * 16777216 + (data[9] << 16) + (data[10] << 8) + data[11]) * 1e3
    );
  else
    return /* @__PURE__ */ new Date("invalid");
};
function saveState(callback) {
  if (onSaveState)
    onSaveState();
  let savedSrcEnd = srcEnd;
  let savedPosition = position;
  let savedStringPosition = stringPosition;
  let savedSrcStringStart = srcStringStart;
  let savedSrcStringEnd = srcStringEnd;
  let savedSrcString = srcString;
  let savedStrings = strings;
  let savedReferenceMap = referenceMap;
  let savedBundledStrings = bundledStrings;
  let savedSrc = new Uint8Array(src.slice(0, srcEnd));
  let savedStructures = currentStructures;
  let savedStructuresContents = currentStructures.slice(0, currentStructures.length);
  let savedPackr = currentUnpackr;
  let savedSequentialMode = sequentialMode;
  let value2 = callback();
  srcEnd = savedSrcEnd;
  position = savedPosition;
  stringPosition = savedStringPosition;
  srcStringStart = savedSrcStringStart;
  srcStringEnd = savedSrcStringEnd;
  srcString = savedSrcString;
  strings = savedStrings;
  referenceMap = savedReferenceMap;
  bundledStrings = savedBundledStrings;
  src = savedSrc;
  sequentialMode = savedSequentialMode;
  currentStructures = savedStructures;
  currentStructures.splice(0, currentStructures.length, ...savedStructuresContents);
  currentUnpackr = savedPackr;
  dataView = new DataView(src.buffer, src.byteOffset, src.byteLength);
  return value2;
}
function clearSource() {
  src = null;
  referenceMap = null;
  currentStructures = null;
}
function addExtension(extension) {
  if (extension.unpack)
    currentExtensions[extension.type] = extension.unpack;
  else
    currentExtensions[extension.type] = extension;
}
var mult10 = new Array(147);
for (let i = 0; i < 256; i++) {
  mult10[i] = +("1e" + Math.floor(45.15 - i * 0.30103));
}
var Decoder = Unpackr;
var defaultUnpackr = new Unpackr({ useRecords: false });
var unpack = defaultUnpackr.unpack;
var unpackMultiple = defaultUnpackr.unpackMultiple;
var decode4 = defaultUnpackr.unpack;
var FLOAT32_OPTIONS = {
  NEVER: 0,
  ALWAYS: 1,
  DECIMAL_ROUND: 3,
  DECIMAL_FIT: 4
};
var f32Array = new Float32Array(1);
var u8Array = new Uint8Array(f32Array.buffer, 0, 4);
function roundFloat32(float32Number) {
  f32Array[0] = float32Number;
  let multiplier = mult10[(u8Array[3] & 127) << 1 | u8Array[2] >> 7];
  return (multiplier * float32Number + (float32Number > 0 ? 0.5 : -0.5) >> 0) / multiplier;
}

// node_modules/msgpackr/pack.js
var textEncoder;
try {
  textEncoder = new TextEncoder();
} catch (error) {
}
var extensions;
var extensionClasses;
var hasNodeBuffer = typeof Buffer !== "undefined";
var ByteArrayAllocate = hasNodeBuffer ? function(length) {
  return Buffer.allocUnsafeSlow(length);
} : Uint8Array;
var ByteArray = hasNodeBuffer ? Buffer : Uint8Array;
var MAX_BUFFER_SIZE = hasNodeBuffer ? 4294967296 : 2144337920;
var target;
var keysTarget;
var targetView;
var position2 = 0;
var safeEnd;
var bundledStrings2 = null;
var writeStructSlots;
var MAX_BUNDLE_SIZE = 21760;
var hasNonLatin = /[\u0080-\uFFFF]/;
var RECORD_SYMBOL = Symbol("record-id");
var Packr = class extends Unpackr {
  constructor(options7) {
    super(options7);
    this.offset = 0;
    let typeBuffer;
    let start;
    let hasSharedUpdate;
    let structures;
    let referenceMap2;
    let encodeUtf8 = ByteArray.prototype.utf8Write ? function(string, position3) {
      return target.utf8Write(string, position3, target.byteLength - position3);
    } : textEncoder && textEncoder.encodeInto ? function(string, position3) {
      return textEncoder.encodeInto(string, target.subarray(position3)).written;
    } : false;
    let packr = this;
    if (!options7)
      options7 = {};
    let isSequential = options7 && options7.sequential;
    let hasSharedStructures = options7.structures || options7.saveStructures;
    let maxSharedStructures = options7.maxSharedStructures;
    if (maxSharedStructures == null)
      maxSharedStructures = hasSharedStructures ? 32 : 0;
    if (maxSharedStructures > 8160)
      throw new Error("Maximum maxSharedStructure is 8160");
    if (options7.structuredClone && options7.moreTypes == void 0) {
      this.moreTypes = true;
    }
    let maxOwnStructures = options7.maxOwnStructures;
    if (maxOwnStructures == null)
      maxOwnStructures = hasSharedStructures ? 32 : 64;
    if (!this.structures && options7.useRecords != false)
      this.structures = [];
    let useTwoByteRecords = maxSharedStructures > 32 || maxOwnStructures + maxSharedStructures > 64;
    let sharedLimitId = maxSharedStructures + 64;
    let maxStructureId = maxSharedStructures + maxOwnStructures + 64;
    if (maxStructureId > 8256) {
      throw new Error("Maximum maxSharedStructure + maxOwnStructure is 8192");
    }
    let recordIdsToRemove = [];
    let transitionsCount = 0;
    let serializationsSinceTransitionRebuild = 0;
    this.pack = this.encode = function(value2, encodeOptions) {
      if (!target) {
        target = new ByteArrayAllocate(8192);
        targetView = target.dataView || (target.dataView = new DataView(target.buffer, 0, 8192));
        position2 = 0;
      }
      safeEnd = target.length - 10;
      if (safeEnd - position2 < 2048) {
        target = new ByteArrayAllocate(target.length);
        targetView = target.dataView || (target.dataView = new DataView(target.buffer, 0, target.length));
        safeEnd = target.length - 10;
        position2 = 0;
      } else
        position2 = position2 + 7 & 2147483640;
      start = position2;
      if (encodeOptions & RESERVE_START_SPACE) position2 += encodeOptions & 255;
      referenceMap2 = packr.structuredClone ? /* @__PURE__ */ new Map() : null;
      if (packr.bundleStrings && typeof value2 !== "string") {
        bundledStrings2 = [];
        bundledStrings2.size = Infinity;
      } else
        bundledStrings2 = null;
      structures = packr.structures;
      if (structures) {
        if (structures.uninitialized)
          structures = packr._mergeStructures(packr.getStructures());
        let sharedLength = structures.sharedLength || 0;
        if (sharedLength > maxSharedStructures) {
          throw new Error("Shared structures is larger than maximum shared structures, try increasing maxSharedStructures to " + structures.sharedLength);
        }
        if (!structures.transitions) {
          structures.transitions = /* @__PURE__ */ Object.create(null);
          for (let i = 0; i < sharedLength; i++) {
            let keys = structures[i];
            if (!keys)
              continue;
            let nextTransition, transition = structures.transitions;
            for (let j = 0, l = keys.length; j < l; j++) {
              let key = keys[j];
              nextTransition = transition[key];
              if (!nextTransition) {
                nextTransition = transition[key] = /* @__PURE__ */ Object.create(null);
              }
              transition = nextTransition;
            }
            transition[RECORD_SYMBOL] = i + 64;
          }
          this.lastNamedStructuresLength = sharedLength;
        }
        if (!isSequential) {
          structures.nextId = sharedLength + 64;
        }
      }
      if (hasSharedUpdate)
        hasSharedUpdate = false;
      let encodingError;
      try {
        if (packr.randomAccessStructure && value2 && value2.constructor && value2.constructor === Object)
          writeStruct(value2);
        else
          pack3(value2);
        let lastBundle = bundledStrings2;
        if (bundledStrings2)
          writeBundles(start, pack3, 0);
        if (referenceMap2 && referenceMap2.idsToInsert) {
          let idsToInsert = referenceMap2.idsToInsert.sort((a, b) => a.offset > b.offset ? 1 : -1);
          let i = idsToInsert.length;
          let incrementPosition = -1;
          while (lastBundle && i > 0) {
            let insertionPoint = idsToInsert[--i].offset + start;
            if (insertionPoint < lastBundle.stringsPosition + start && incrementPosition === -1)
              incrementPosition = 0;
            if (insertionPoint > lastBundle.position + start) {
              if (incrementPosition >= 0)
                incrementPosition += 6;
            } else {
              if (incrementPosition >= 0) {
                targetView.setUint32(
                  lastBundle.position + start,
                  targetView.getUint32(lastBundle.position + start) + incrementPosition
                );
                incrementPosition = -1;
              }
              lastBundle = lastBundle.previous;
              i++;
            }
          }
          if (incrementPosition >= 0 && lastBundle) {
            targetView.setUint32(
              lastBundle.position + start,
              targetView.getUint32(lastBundle.position + start) + incrementPosition
            );
          }
          position2 += idsToInsert.length * 6;
          if (position2 > safeEnd)
            makeRoom(position2);
          packr.offset = position2;
          let serialized = insertIds(target.subarray(start, position2), idsToInsert);
          referenceMap2 = null;
          return serialized;
        }
        packr.offset = position2;
        if (encodeOptions & REUSE_BUFFER_MODE) {
          target.start = start;
          target.end = position2;
          return target;
        }
        return target.subarray(start, position2);
      } catch (error) {
        encodingError = error;
        throw error;
      } finally {
        if (structures) {
          resetStructures();
          if (hasSharedUpdate && packr.saveStructures) {
            let sharedLength = structures.sharedLength || 0;
            let returnBuffer = target.subarray(start, position2);
            let newSharedData = prepareStructures(structures, packr);
            if (!encodingError) {
              if (packr.saveStructures(newSharedData, newSharedData.isCompatible) === false) {
                return packr.pack(value2, encodeOptions);
              }
              packr.lastNamedStructuresLength = sharedLength;
              if (target.length > 1073741824) target = null;
              return returnBuffer;
            }
          }
        }
        if (target.length > 1073741824) target = null;
        if (encodeOptions & RESET_BUFFER_MODE)
          position2 = start;
      }
    };
    const resetStructures = () => {
      if (serializationsSinceTransitionRebuild < 10)
        serializationsSinceTransitionRebuild++;
      let sharedLength = structures.sharedLength || 0;
      if (structures.length > sharedLength && !isSequential)
        structures.length = sharedLength;
      if (transitionsCount > 1e4) {
        structures.transitions = null;
        serializationsSinceTransitionRebuild = 0;
        transitionsCount = 0;
        if (recordIdsToRemove.length > 0)
          recordIdsToRemove = [];
      } else if (recordIdsToRemove.length > 0 && !isSequential) {
        for (let i = 0, l = recordIdsToRemove.length; i < l; i++) {
          recordIdsToRemove[i][RECORD_SYMBOL] = 0;
        }
        recordIdsToRemove = [];
      }
    };
    const packArray = (value2) => {
      var length = value2.length;
      if (length < 16) {
        target[position2++] = 144 | length;
      } else if (length < 65536) {
        target[position2++] = 220;
        target[position2++] = length >> 8;
        target[position2++] = length & 255;
      } else {
        target[position2++] = 221;
        targetView.setUint32(position2, length);
        position2 += 4;
      }
      for (let i = 0; i < length; i++) {
        pack3(value2[i]);
      }
    };
    const pack3 = (value2) => {
      if (position2 > safeEnd)
        target = makeRoom(position2);
      var type = typeof value2;
      var length;
      if (type === "string") {
        let strLength = value2.length;
        if (bundledStrings2 && strLength >= 4 && strLength < 4096) {
          if ((bundledStrings2.size += strLength) > MAX_BUNDLE_SIZE) {
            let extStart;
            let maxBytes2 = (bundledStrings2[0] ? bundledStrings2[0].length * 3 + bundledStrings2[1].length : 0) + 10;
            if (position2 + maxBytes2 > safeEnd)
              target = makeRoom(position2 + maxBytes2);
            let lastBundle;
            if (bundledStrings2.position) {
              lastBundle = bundledStrings2;
              target[position2] = 200;
              position2 += 3;
              target[position2++] = 98;
              extStart = position2 - start;
              position2 += 4;
              writeBundles(start, pack3, 0);
              targetView.setUint16(extStart + start - 3, position2 - start - extStart);
            } else {
              target[position2++] = 214;
              target[position2++] = 98;
              extStart = position2 - start;
              position2 += 4;
            }
            bundledStrings2 = ["", ""];
            bundledStrings2.previous = lastBundle;
            bundledStrings2.size = 0;
            bundledStrings2.position = extStart;
          }
          let twoByte = hasNonLatin.test(value2);
          bundledStrings2[twoByte ? 0 : 1] += value2;
          target[position2++] = 193;
          pack3(twoByte ? -strLength : strLength);
          return;
        }
        let headerSize;
        if (strLength < 32) {
          headerSize = 1;
        } else if (strLength < 256) {
          headerSize = 2;
        } else if (strLength < 65536) {
          headerSize = 3;
        } else {
          headerSize = 5;
        }
        let maxBytes = strLength * 3;
        if (position2 + maxBytes > safeEnd)
          target = makeRoom(position2 + maxBytes);
        if (strLength < 64 || !encodeUtf8) {
          let i, c1, c2, strPosition = position2 + headerSize;
          for (i = 0; i < strLength; i++) {
            c1 = value2.charCodeAt(i);
            if (c1 < 128) {
              target[strPosition++] = c1;
            } else if (c1 < 2048) {
              target[strPosition++] = c1 >> 6 | 192;
              target[strPosition++] = c1 & 63 | 128;
            } else if ((c1 & 64512) === 55296 && ((c2 = value2.charCodeAt(i + 1)) & 64512) === 56320) {
              c1 = 65536 + ((c1 & 1023) << 10) + (c2 & 1023);
              i++;
              target[strPosition++] = c1 >> 18 | 240;
              target[strPosition++] = c1 >> 12 & 63 | 128;
              target[strPosition++] = c1 >> 6 & 63 | 128;
              target[strPosition++] = c1 & 63 | 128;
            } else {
              target[strPosition++] = c1 >> 12 | 224;
              target[strPosition++] = c1 >> 6 & 63 | 128;
              target[strPosition++] = c1 & 63 | 128;
            }
          }
          length = strPosition - position2 - headerSize;
        } else {
          length = encodeUtf8(value2, position2 + headerSize);
        }
        if (length < 32) {
          target[position2++] = 160 | length;
        } else if (length < 256) {
          if (headerSize < 2) {
            target.copyWithin(position2 + 2, position2 + 1, position2 + 1 + length);
          }
          target[position2++] = 217;
          target[position2++] = length;
        } else if (length < 65536) {
          if (headerSize < 3) {
            target.copyWithin(position2 + 3, position2 + 2, position2 + 2 + length);
          }
          target[position2++] = 218;
          target[position2++] = length >> 8;
          target[position2++] = length & 255;
        } else {
          if (headerSize < 5) {
            target.copyWithin(position2 + 5, position2 + 3, position2 + 3 + length);
          }
          target[position2++] = 219;
          targetView.setUint32(position2, length);
          position2 += 4;
        }
        position2 += length;
      } else if (type === "number") {
        if (value2 >>> 0 === value2) {
          if (value2 < 32 || value2 < 128 && this.useRecords === false || value2 < 64 && !this.randomAccessStructure) {
            target[position2++] = value2;
          } else if (value2 < 256) {
            target[position2++] = 204;
            target[position2++] = value2;
          } else if (value2 < 65536) {
            target[position2++] = 205;
            target[position2++] = value2 >> 8;
            target[position2++] = value2 & 255;
          } else {
            target[position2++] = 206;
            targetView.setUint32(position2, value2);
            position2 += 4;
          }
        } else if (value2 >> 0 === value2) {
          if (value2 >= -32) {
            target[position2++] = 256 + value2;
          } else if (value2 >= -128) {
            target[position2++] = 208;
            target[position2++] = value2 + 256;
          } else if (value2 >= -32768) {
            target[position2++] = 209;
            targetView.setInt16(position2, value2);
            position2 += 2;
          } else {
            target[position2++] = 210;
            targetView.setInt32(position2, value2);
            position2 += 4;
          }
        } else {
          let useFloat32;
          if ((useFloat32 = this.useFloat32) > 0 && value2 < 4294967296 && value2 >= -2147483648) {
            target[position2++] = 202;
            targetView.setFloat32(position2, value2);
            let xShifted;
            if (useFloat32 < 4 || // this checks for rounding of numbers that were encoded in 32-bit float to nearest significant decimal digit that could be preserved
            (xShifted = value2 * mult10[(target[position2] & 127) << 1 | target[position2 + 1] >> 7]) >> 0 === xShifted) {
              position2 += 4;
              return;
            } else
              position2--;
          }
          target[position2++] = 203;
          targetView.setFloat64(position2, value2);
          position2 += 8;
        }
      } else if (type === "object" || type === "function") {
        if (!value2)
          target[position2++] = 192;
        else {
          if (referenceMap2) {
            let referee = referenceMap2.get(value2);
            if (referee) {
              if (!referee.id) {
                let idsToInsert = referenceMap2.idsToInsert || (referenceMap2.idsToInsert = []);
                referee.id = idsToInsert.push(referee);
              }
              target[position2++] = 214;
              target[position2++] = 112;
              targetView.setUint32(position2, referee.id);
              position2 += 4;
              return;
            } else
              referenceMap2.set(value2, { offset: position2 - start });
          }
          let constructor = value2.constructor;
          if (constructor === Object) {
            writeObject(value2);
          } else if (constructor === Array) {
            packArray(value2);
          } else if (constructor === Map) {
            if (this.mapAsEmptyObject) target[position2++] = 128;
            else {
              length = value2.size;
              if (length < 16) {
                target[position2++] = 128 | length;
              } else if (length < 65536) {
                target[position2++] = 222;
                target[position2++] = length >> 8;
                target[position2++] = length & 255;
              } else {
                target[position2++] = 223;
                targetView.setUint32(position2, length);
                position2 += 4;
              }
              for (let [key, entryValue] of value2) {
                pack3(key);
                pack3(entryValue);
              }
            }
          } else {
            for (let i = 0, l = extensions.length; i < l; i++) {
              let extensionClass = extensionClasses[i];
              if (value2 instanceof extensionClass) {
                let extension = extensions[i];
                if (extension.write) {
                  if (extension.type) {
                    target[position2++] = 212;
                    target[position2++] = extension.type;
                    target[position2++] = 0;
                  }
                  let writeResult = extension.write.call(this, value2);
                  if (writeResult === value2) {
                    if (Array.isArray(value2)) {
                      packArray(value2);
                    } else {
                      writeObject(value2);
                    }
                  } else {
                    pack3(writeResult);
                  }
                  return;
                }
                let currentTarget = target;
                let currentTargetView = targetView;
                let currentPosition = position2;
                target = null;
                let result;
                try {
                  result = extension.pack.call(this, value2, (size) => {
                    target = currentTarget;
                    currentTarget = null;
                    position2 += size;
                    if (position2 > safeEnd)
                      makeRoom(position2);
                    return {
                      target,
                      targetView,
                      position: position2 - size
                    };
                  }, pack3);
                } finally {
                  if (currentTarget) {
                    target = currentTarget;
                    targetView = currentTargetView;
                    position2 = currentPosition;
                    safeEnd = target.length - 10;
                  }
                }
                if (result) {
                  if (result.length + position2 > safeEnd)
                    makeRoom(result.length + position2);
                  position2 = writeExtensionData(result, target, position2, extension.type);
                }
                return;
              }
            }
            if (Array.isArray(value2)) {
              packArray(value2);
            } else {
              if (value2.toJSON) {
                const json5 = value2.toJSON();
                if (json5 !== value2)
                  return pack3(json5);
              }
              if (type === "function")
                return pack3(this.writeFunction && this.writeFunction(value2));
              writeObject(value2);
            }
          }
        }
      } else if (type === "boolean") {
        target[position2++] = value2 ? 195 : 194;
      } else if (type === "bigint") {
        if (value2 < 9223372036854776e3 && value2 >= -9223372036854776e3) {
          target[position2++] = 211;
          targetView.setBigInt64(position2, value2);
        } else if (value2 < 18446744073709552e3 && value2 > 0) {
          target[position2++] = 207;
          targetView.setBigUint64(position2, value2);
        } else {
          if (this.largeBigIntToFloat) {
            target[position2++] = 203;
            targetView.setFloat64(position2, Number(value2));
          } else if (this.largeBigIntToString) {
            return pack3(value2.toString());
          } else if ((this.useBigIntExtension || this.moreTypes) && value2 < BigInt(2) ** BigInt(1023) && value2 > -(BigInt(2) ** BigInt(1023))) {
            target[position2++] = 199;
            position2++;
            target[position2++] = 66;
            let bytes = [];
            let alignedSign;
            do {
              let byte = value2 & BigInt(255);
              alignedSign = (byte & BigInt(128)) === (value2 < BigInt(0) ? BigInt(128) : BigInt(0));
              bytes.push(byte);
              value2 >>= BigInt(8);
            } while (!((value2 === BigInt(0) || value2 === BigInt(-1)) && alignedSign));
            target[position2 - 2] = bytes.length;
            for (let i = bytes.length; i > 0; ) {
              target[position2++] = Number(bytes[--i]);
            }
            return;
          } else {
            throw new RangeError(value2 + " was too large to fit in MessagePack 64-bit integer format, use useBigIntExtension, or set largeBigIntToFloat to convert to float-64, or set largeBigIntToString to convert to string");
          }
        }
        position2 += 8;
      } else if (type === "undefined") {
        if (this.encodeUndefinedAsNil)
          target[position2++] = 192;
        else {
          target[position2++] = 212;
          target[position2++] = 0;
          target[position2++] = 0;
        }
      } else {
        throw new Error("Unknown type: " + type);
      }
    };
    const writePlainObject = this.variableMapSize || this.coercibleKeyAsNumber || this.skipValues ? (object) => {
      let keys;
      if (this.skipValues) {
        keys = [];
        for (let key2 in object) {
          if ((typeof object.hasOwnProperty !== "function" || object.hasOwnProperty(key2)) && !this.skipValues.includes(object[key2]))
            keys.push(key2);
        }
      } else {
        keys = Object.keys(object);
      }
      let length = keys.length;
      if (length < 16) {
        target[position2++] = 128 | length;
      } else if (length < 65536) {
        target[position2++] = 222;
        target[position2++] = length >> 8;
        target[position2++] = length & 255;
      } else {
        target[position2++] = 223;
        targetView.setUint32(position2, length);
        position2 += 4;
      }
      let key;
      if (this.coercibleKeyAsNumber) {
        for (let i = 0; i < length; i++) {
          key = keys[i];
          let num = Number(key);
          pack3(isNaN(num) ? key : num);
          pack3(object[key]);
        }
      } else {
        for (let i = 0; i < length; i++) {
          pack3(key = keys[i]);
          pack3(object[key]);
        }
      }
    } : (object) => {
      target[position2++] = 222;
      let objectOffset = position2 - start;
      position2 += 2;
      let size = 0;
      for (let key in object) {
        if (typeof object.hasOwnProperty !== "function" || object.hasOwnProperty(key)) {
          pack3(key);
          pack3(object[key]);
          size++;
        }
      }
      if (size > 65535) {
        throw new Error('Object is too large to serialize with fast 16-bit map size, use the "variableMapSize" option to serialize this object');
      }
      target[objectOffset++ + start] = size >> 8;
      target[objectOffset + start] = size & 255;
    };
    const writeRecord = this.useRecords === false ? writePlainObject : options7.progressiveRecords && !useTwoByteRecords ? (
      // this is about 2% faster for highly stable structures, since it only requires one for-in loop (but much more expensive when new structure needs to be written)
      (object) => {
        let nextTransition, transition = structures.transitions || (structures.transitions = /* @__PURE__ */ Object.create(null));
        let objectOffset = position2++ - start;
        let wroteKeys;
        for (let key in object) {
          if (typeof object.hasOwnProperty !== "function" || object.hasOwnProperty(key)) {
            nextTransition = transition[key];
            if (nextTransition)
              transition = nextTransition;
            else {
              let keys = Object.keys(object);
              let lastTransition = transition;
              transition = structures.transitions;
              let newTransitions = 0;
              for (let i = 0, l = keys.length; i < l; i++) {
                let key2 = keys[i];
                nextTransition = transition[key2];
                if (!nextTransition) {
                  nextTransition = transition[key2] = /* @__PURE__ */ Object.create(null);
                  newTransitions++;
                }
                transition = nextTransition;
              }
              if (objectOffset + start + 1 == position2) {
                position2--;
                newRecord(transition, keys, newTransitions);
              } else
                insertNewRecord(transition, keys, objectOffset, newTransitions);
              wroteKeys = true;
              transition = lastTransition[key];
            }
            pack3(object[key]);
          }
        }
        if (!wroteKeys) {
          let recordId = transition[RECORD_SYMBOL];
          if (recordId)
            target[objectOffset + start] = recordId;
          else
            insertNewRecord(transition, Object.keys(object), objectOffset, 0);
        }
      }
    ) : (object) => {
      let nextTransition, transition = structures.transitions || (structures.transitions = /* @__PURE__ */ Object.create(null));
      let newTransitions = 0;
      for (let key in object) if (typeof object.hasOwnProperty !== "function" || object.hasOwnProperty(key)) {
        nextTransition = transition[key];
        if (!nextTransition) {
          nextTransition = transition[key] = /* @__PURE__ */ Object.create(null);
          newTransitions++;
        }
        transition = nextTransition;
      }
      let recordId = transition[RECORD_SYMBOL];
      if (recordId) {
        if (recordId >= 96 && useTwoByteRecords) {
          target[position2++] = ((recordId -= 96) & 31) + 96;
          target[position2++] = recordId >> 5;
        } else
          target[position2++] = recordId;
      } else {
        newRecord(transition, transition.__keys__ || Object.keys(object), newTransitions);
      }
      for (let key in object)
        if (typeof object.hasOwnProperty !== "function" || object.hasOwnProperty(key)) {
          pack3(object[key]);
        }
    };
    const checkUseRecords = typeof this.useRecords == "function" && this.useRecords;
    const writeObject = checkUseRecords ? (object) => {
      checkUseRecords(object) ? writeRecord(object) : writePlainObject(object);
    } : writeRecord;
    const makeRoom = (end) => {
      let newSize;
      if (end > 16777216) {
        if (end - start > MAX_BUFFER_SIZE)
          throw new Error("Packed buffer would be larger than maximum buffer size");
        newSize = Math.min(
          MAX_BUFFER_SIZE,
          Math.round(Math.max((end - start) * (end > 67108864 ? 1.25 : 2), 4194304) / 4096) * 4096
        );
      } else
        newSize = (Math.max(end - start << 2, target.length - 1) >> 12) + 1 << 12;
      let newBuffer = new ByteArrayAllocate(newSize);
      targetView = newBuffer.dataView || (newBuffer.dataView = new DataView(newBuffer.buffer, 0, newSize));
      end = Math.min(end, target.length);
      if (target.copy)
        target.copy(newBuffer, 0, start, end);
      else
        newBuffer.set(target.slice(start, end));
      position2 -= start;
      start = 0;
      safeEnd = newBuffer.length - 10;
      return target = newBuffer;
    };
    const newRecord = (transition, keys, newTransitions) => {
      let recordId = structures.nextId;
      if (!recordId)
        recordId = 64;
      if (recordId < sharedLimitId && this.shouldShareStructure && !this.shouldShareStructure(keys)) {
        recordId = structures.nextOwnId;
        if (!(recordId < maxStructureId))
          recordId = sharedLimitId;
        structures.nextOwnId = recordId + 1;
      } else {
        if (recordId >= maxStructureId)
          recordId = sharedLimitId;
        structures.nextId = recordId + 1;
      }
      let highByte = keys.highByte = recordId >= 96 && useTwoByteRecords ? recordId - 96 >> 5 : -1;
      transition[RECORD_SYMBOL] = recordId;
      transition.__keys__ = keys;
      structures[recordId - 64] = keys;
      if (recordId < sharedLimitId) {
        keys.isShared = true;
        structures.sharedLength = recordId - 63;
        hasSharedUpdate = true;
        if (highByte >= 0) {
          target[position2++] = (recordId & 31) + 96;
          target[position2++] = highByte;
        } else {
          target[position2++] = recordId;
        }
      } else {
        if (highByte >= 0) {
          target[position2++] = 213;
          target[position2++] = 114;
          target[position2++] = (recordId & 31) + 96;
          target[position2++] = highByte;
        } else {
          target[position2++] = 212;
          target[position2++] = 114;
          target[position2++] = recordId;
        }
        if (newTransitions)
          transitionsCount += serializationsSinceTransitionRebuild * newTransitions;
        if (recordIdsToRemove.length >= maxOwnStructures)
          recordIdsToRemove.shift()[RECORD_SYMBOL] = 0;
        recordIdsToRemove.push(transition);
        pack3(keys);
      }
    };
    const insertNewRecord = (transition, keys, insertionOffset, newTransitions) => {
      let mainTarget = target;
      let mainPosition = position2;
      let mainSafeEnd = safeEnd;
      let mainStart = start;
      target = keysTarget;
      position2 = 0;
      start = 0;
      if (!target)
        keysTarget = target = new ByteArrayAllocate(8192);
      safeEnd = target.length - 10;
      newRecord(transition, keys, newTransitions);
      keysTarget = target;
      let keysPosition = position2;
      target = mainTarget;
      position2 = mainPosition;
      safeEnd = mainSafeEnd;
      start = mainStart;
      if (keysPosition > 1) {
        let newEnd = position2 + keysPosition - 1;
        if (newEnd > safeEnd)
          makeRoom(newEnd);
        let insertionPosition = insertionOffset + start;
        target.copyWithin(insertionPosition + keysPosition, insertionPosition + 1, position2);
        target.set(keysTarget.slice(0, keysPosition), insertionPosition);
        position2 = newEnd;
      } else {
        target[insertionOffset + start] = keysTarget[0];
      }
    };
    const writeStruct = (object) => {
      let newPosition = writeStructSlots(object, target, start, position2, structures, makeRoom, (value2, newPosition2, notifySharedUpdate) => {
        if (notifySharedUpdate)
          return hasSharedUpdate = true;
        position2 = newPosition2;
        let startTarget = target;
        pack3(value2);
        resetStructures();
        if (startTarget !== target) {
          return { position: position2, targetView, target };
        }
        return position2;
      }, this);
      if (newPosition === 0)
        return writeObject(object);
      position2 = newPosition;
    };
  }
  useBuffer(buffer) {
    target = buffer;
    target.dataView || (target.dataView = new DataView(target.buffer, target.byteOffset, target.byteLength));
    position2 = 0;
  }
  set position(value2) {
    position2 = value2;
  }
  get position() {
    return position2;
  }
  clearSharedData() {
    if (this.structures)
      this.structures = [];
    if (this.typedStructs)
      this.typedStructs = [];
  }
};
extensionClasses = [Date, Set, Error, RegExp, ArrayBuffer, Object.getPrototypeOf(Uint8Array.prototype).constructor, DataView, C1Type];
extensions = [{
  pack(date, allocateForWrite, pack3) {
    let seconds2 = date.getTime() / 1e3;
    if ((this.useTimestamp32 || date.getMilliseconds() === 0) && seconds2 >= 0 && seconds2 < 4294967296) {
      let { target: target2, targetView: targetView2, position: position3 } = allocateForWrite(6);
      target2[position3++] = 214;
      target2[position3++] = 255;
      targetView2.setUint32(position3, seconds2);
    } else if (seconds2 > 0 && seconds2 < 4294967296) {
      let { target: target2, targetView: targetView2, position: position3 } = allocateForWrite(10);
      target2[position3++] = 215;
      target2[position3++] = 255;
      targetView2.setUint32(position3, date.getMilliseconds() * 4e6 + (seconds2 / 1e3 / 4294967296 >> 0));
      targetView2.setUint32(position3 + 4, seconds2);
    } else if (isNaN(seconds2)) {
      if (this.onInvalidDate) {
        allocateForWrite(0);
        return pack3(this.onInvalidDate());
      }
      let { target: target2, targetView: targetView2, position: position3 } = allocateForWrite(3);
      target2[position3++] = 212;
      target2[position3++] = 255;
      target2[position3++] = 255;
    } else {
      let { target: target2, targetView: targetView2, position: position3 } = allocateForWrite(15);
      target2[position3++] = 199;
      target2[position3++] = 12;
      target2[position3++] = 255;
      targetView2.setUint32(position3, date.getMilliseconds() * 1e6);
      targetView2.setBigInt64(position3 + 4, BigInt(Math.floor(seconds2)));
    }
  }
}, {
  pack(set6, allocateForWrite, pack3) {
    if (this.setAsEmptyObject) {
      allocateForWrite(0);
      return pack3({});
    }
    let array = Array.from(set6);
    let { target: target2, position: position3 } = allocateForWrite(this.moreTypes ? 3 : 0);
    if (this.moreTypes) {
      target2[position3++] = 212;
      target2[position3++] = 115;
      target2[position3++] = 0;
    }
    pack3(array);
  }
}, {
  pack(error, allocateForWrite, pack3) {
    let { target: target2, position: position3 } = allocateForWrite(this.moreTypes ? 3 : 0);
    if (this.moreTypes) {
      target2[position3++] = 212;
      target2[position3++] = 101;
      target2[position3++] = 0;
    }
    pack3([error.name, error.message, error.cause]);
  }
}, {
  pack(regex, allocateForWrite, pack3) {
    let { target: target2, position: position3 } = allocateForWrite(this.moreTypes ? 3 : 0);
    if (this.moreTypes) {
      target2[position3++] = 212;
      target2[position3++] = 120;
      target2[position3++] = 0;
    }
    pack3([regex.source, regex.flags]);
  }
}, {
  pack(arrayBuffer, allocateForWrite) {
    if (this.moreTypes)
      writeExtBuffer(arrayBuffer, 16, allocateForWrite);
    else
      writeBuffer(hasNodeBuffer ? Buffer.from(arrayBuffer) : new Uint8Array(arrayBuffer), allocateForWrite);
  }
}, {
  pack(typedArray, allocateForWrite) {
    let constructor = typedArray.constructor;
    if (constructor !== ByteArray && this.moreTypes)
      writeExtBuffer(typedArray, typedArrays.indexOf(constructor.name), allocateForWrite);
    else
      writeBuffer(typedArray, allocateForWrite);
  }
}, {
  pack(arrayBuffer, allocateForWrite) {
    if (this.moreTypes)
      writeExtBuffer(arrayBuffer, 17, allocateForWrite);
    else
      writeBuffer(hasNodeBuffer ? Buffer.from(arrayBuffer) : new Uint8Array(arrayBuffer), allocateForWrite);
  }
}, {
  pack(c1, allocateForWrite) {
    let { target: target2, position: position3 } = allocateForWrite(1);
    target2[position3] = 193;
  }
}];
function writeExtBuffer(typedArray, type, allocateForWrite, encode4) {
  let length = typedArray.byteLength;
  if (length + 1 < 256) {
    var { target: target2, position: position3 } = allocateForWrite(4 + length);
    target2[position3++] = 199;
    target2[position3++] = length + 1;
  } else if (length + 1 < 65536) {
    var { target: target2, position: position3 } = allocateForWrite(5 + length);
    target2[position3++] = 200;
    target2[position3++] = length + 1 >> 8;
    target2[position3++] = length + 1 & 255;
  } else {
    var { target: target2, position: position3, targetView: targetView2 } = allocateForWrite(7 + length);
    target2[position3++] = 201;
    targetView2.setUint32(position3, length + 1);
    position3 += 4;
  }
  target2[position3++] = 116;
  target2[position3++] = type;
  if (!typedArray.buffer) typedArray = new Uint8Array(typedArray);
  target2.set(new Uint8Array(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength), position3);
}
function writeBuffer(buffer, allocateForWrite) {
  let length = buffer.byteLength;
  var target2, position3;
  if (length < 256) {
    var { target: target2, position: position3 } = allocateForWrite(length + 2);
    target2[position3++] = 196;
    target2[position3++] = length;
  } else if (length < 65536) {
    var { target: target2, position: position3 } = allocateForWrite(length + 3);
    target2[position3++] = 197;
    target2[position3++] = length >> 8;
    target2[position3++] = length & 255;
  } else {
    var { target: target2, position: position3, targetView: targetView2 } = allocateForWrite(length + 5);
    target2[position3++] = 198;
    targetView2.setUint32(position3, length);
    position3 += 4;
  }
  target2.set(buffer, position3);
}
function writeExtensionData(result, target2, position3, type) {
  let length = result.length;
  switch (length) {
    case 1:
      target2[position3++] = 212;
      break;
    case 2:
      target2[position3++] = 213;
      break;
    case 4:
      target2[position3++] = 214;
      break;
    case 8:
      target2[position3++] = 215;
      break;
    case 16:
      target2[position3++] = 216;
      break;
    default:
      if (length < 256) {
        target2[position3++] = 199;
        target2[position3++] = length;
      } else if (length < 65536) {
        target2[position3++] = 200;
        target2[position3++] = length >> 8;
        target2[position3++] = length & 255;
      } else {
        target2[position3++] = 201;
        target2[position3++] = length >> 24;
        target2[position3++] = length >> 16 & 255;
        target2[position3++] = length >> 8 & 255;
        target2[position3++] = length & 255;
      }
  }
  target2[position3++] = type;
  target2.set(result, position3);
  position3 += length;
  return position3;
}
function insertIds(serialized, idsToInsert) {
  let nextId;
  let distanceToMove = idsToInsert.length * 6;
  let lastEnd = serialized.length - distanceToMove;
  while (nextId = idsToInsert.pop()) {
    let offset = nextId.offset;
    let id = nextId.id;
    serialized.copyWithin(offset + distanceToMove, offset, lastEnd);
    distanceToMove -= 6;
    let position3 = offset + distanceToMove;
    serialized[position3++] = 214;
    serialized[position3++] = 105;
    serialized[position3++] = id >> 24;
    serialized[position3++] = id >> 16 & 255;
    serialized[position3++] = id >> 8 & 255;
    serialized[position3++] = id & 255;
    lastEnd = offset;
  }
  return serialized;
}
function writeBundles(start, pack3, incrementPosition) {
  if (bundledStrings2.length > 0) {
    targetView.setUint32(bundledStrings2.position + start, position2 + incrementPosition - bundledStrings2.position - start);
    bundledStrings2.stringsPosition = position2 - start;
    let writeStrings = bundledStrings2;
    bundledStrings2 = null;
    pack3(writeStrings[0]);
    pack3(writeStrings[1]);
  }
}
function addExtension2(extension) {
  if (extension.Class) {
    if (!extension.pack && !extension.write)
      throw new Error("Extension has no pack or write function");
    if (extension.pack && !extension.type)
      throw new Error("Extension has no type (numeric code to identify the extension)");
    extensionClasses.unshift(extension.Class);
    extensions.unshift(extension);
  }
  addExtension(extension);
}
function prepareStructures(structures, packr) {
  structures.isCompatible = (existingStructures) => {
    let compatible = !existingStructures || (packr.lastNamedStructuresLength || 0) === existingStructures.length;
    if (!compatible)
      packr._mergeStructures(existingStructures);
    return compatible;
  };
  return structures;
}
var defaultPackr = new Packr({ useRecords: false });
var pack = defaultPackr.pack;
var encode3 = defaultPackr.pack;
var Encoder = Packr;
var { NEVER, ALWAYS, DECIMAL_ROUND, DECIMAL_FIT } = FLOAT32_OPTIONS;
var REUSE_BUFFER_MODE = 512;
var RESET_BUFFER_MODE = 1024;
var RESERVE_START_SPACE = 2048;

// node_modules/msgpackr/iterators.js
function packIter(objectIterator, options7 = {}) {
  if (!objectIterator || typeof objectIterator !== "object") {
    throw new Error("first argument must be an Iterable, Async Iterable, or a Promise for an Async Iterable");
  } else if (typeof objectIterator[Symbol.iterator] === "function") {
    return packIterSync(objectIterator, options7);
  } else if (typeof objectIterator.then === "function" || typeof objectIterator[Symbol.asyncIterator] === "function") {
    return packIterAsync(objectIterator, options7);
  } else {
    throw new Error("first argument must be an Iterable, Async Iterable, Iterator, Async Iterator, or a Promise");
  }
}
function* packIterSync(objectIterator, options7) {
  const packr = new Packr(options7);
  for (const value2 of objectIterator) {
    yield packr.pack(value2);
  }
}
async function* packIterAsync(objectIterator, options7) {
  const packr = new Packr(options7);
  for await (const value2 of objectIterator) {
    yield packr.pack(value2);
  }
}
function unpackIter(bufferIterator, options7 = {}) {
  if (!bufferIterator || typeof bufferIterator !== "object") {
    throw new Error("first argument must be an Iterable, Async Iterable, Iterator, Async Iterator, or a promise");
  }
  const unpackr = new Unpackr(options7);
  let incomplete;
  const parser = (chunk) => {
    let yields;
    if (incomplete) {
      chunk = Buffer.concat([incomplete, chunk]);
      incomplete = void 0;
    }
    try {
      yields = unpackr.unpackMultiple(chunk);
    } catch (err) {
      if (err.incomplete) {
        incomplete = chunk.slice(err.lastPosition);
        yields = err.values;
      } else {
        throw err;
      }
    }
    return yields;
  };
  if (typeof bufferIterator[Symbol.iterator] === "function") {
    return function* iter() {
      for (const value2 of bufferIterator) {
        yield* parser(value2);
      }
    }();
  } else if (typeof bufferIterator[Symbol.asyncIterator] === "function") {
    return async function* iter() {
      for await (const value2 of bufferIterator) {
        yield* parser(value2);
      }
    }();
  }
}
var decodeIter = unpackIter;
var encodeIter = packIter;

// node_modules/msgpackr/index.js
var useRecords = false;
var mapsAsObjects = true;

// node_modules/@effect/platform/dist/esm/MsgPack.js
var ErrorTypeId5 = Symbol.for("@effect/platform/MsgPack/MsgPackError");
var MsgPackError = class extends TaggedError("MsgPackError") {
  /**
   * @since 1.0.0
   */
  [ErrorTypeId5] = ErrorTypeId5;
  /**
   * @since 1.0.0
   */
  get message() {
    return this.reason;
  }
};
var pack2 = () => suspend2(() => {
  const packr = new Packr();
  const loop = readWithCause({
    onInput: (input) => zipRight2(flatMap3(try_({
      try: () => of(packr.pack(toReadonlyArray(input))),
      catch: (cause) => new MsgPackError({
        reason: "Pack",
        cause
      })
    }), write), loop),
    onFailure: (cause) => failCause4(cause),
    onDone: succeed4
  });
  return loop;
});
var packSchema = (schema4) => () => pipeTo(encode2(schema4)(), pack2());
var unpack2 = () => flatMap3(sync3(() => new Unpackr()), (packr) => {
  let incomplete = void 0;
  const unpack3 = (value2) => try_({
    try: () => flatMap(value2, (buf) => {
      if (incomplete !== void 0) {
        const chunk = new Uint8Array(incomplete.length + buf.length);
        chunk.set(incomplete);
        chunk.set(buf, incomplete.length);
        buf = chunk;
        incomplete = void 0;
      }
      try {
        return unsafeFromArray(packr.unpackMultiple(buf).flat());
      } catch (error_) {
        const error = error_;
        if (error.incomplete) {
          incomplete = buf.subarray(error.lastPosition);
          return unsafeFromArray(error.values ?? []);
        }
        throw error;
      }
    }),
    catch: (cause) => new MsgPackError({
      reason: "Unpack",
      cause
    })
  });
  const loop = readWithCause({
    onInput: (input) => zipRight2(flatMap3(unpack3(input), write), loop),
    onFailure: (cause) => failCause4(cause),
    onDone: succeed4
  });
  return loop;
});
var unpackSchema = (schema4) => () => pipeTo(unpack2(), decodeUnknown2(schema4)());
var duplex2 = (self) => pipeTo(pipeTo(pack2(), self), unpack2());
var duplexSchema = dual(2, (self, options7) => duplexUnknown(duplex2(self), options7));
var schema2 = (schema4) => transformOrFail(Uint8ArrayFromSelf, schema4, {
  decode(fromA, _, ast) {
    return _try({
      try: () => decode4(fromA),
      catch: (cause) => new Type(ast, fromA, hasProperty(cause, "message") ? String(cause.message) : String(cause))
    });
  },
  encode(toI, _, ast) {
    return _try({
      try: () => encode3(toI),
      catch: (cause) => new Type(ast, toI, hasProperty(cause, "message") ? String(cause.message) : String(cause))
    });
  }
});

// node_modules/@effect/platform/dist/esm/SocketServer.js
var SocketServer_exports = {};
__export(SocketServer_exports, {
  ErrorTypeId: () => ErrorTypeId6,
  SocketServer: () => SocketServer,
  SocketServerError: () => SocketServerError
});
var SocketServer = class extends Tag("@effect/platform/SocketServer")() {
};
var ErrorTypeId6 = Symbol.for("@effect/platform/SocketServer/SocketServerError");
var SocketServerError = class extends TaggedError("SocketServerError") {
  /**
   * @since 1.0.0
   */
  [ErrorTypeId6] = ErrorTypeId6;
  /**
   * @since 1.0.0
   */
  get message() {
    return this.reason;
  }
};

// node_modules/@effect/platform/dist/esm/Transferable.js
var Transferable_exports = {};
__export(Transferable_exports, {
  Collector: () => Collector,
  ImageData: () => ImageData,
  MessagePort: () => MessagePort,
  Uint8Array: () => Uint8Array3,
  addAll: () => addAll2,
  makeCollector: () => makeCollector,
  schema: () => schema3,
  unsafeMakeCollector: () => unsafeMakeCollector
});
var Collector = class extends Tag("@effect/platform/Transferable/Collector")() {
};
var unsafeMakeCollector = () => {
  let tranferables = [];
  const unsafeAddAll = (transfers) => {
    tranferables.push(...transfers);
  };
  const unsafeRead = () => tranferables;
  const unsafeClear = () => {
    const prev = tranferables;
    tranferables = [];
    return prev;
  };
  return Collector.of({
    unsafeAddAll,
    addAll: (transferables) => sync(() => unsafeAddAll(transferables)),
    unsafeRead,
    read: sync(unsafeRead),
    unsafeClear,
    clear: sync(unsafeClear)
  });
};
var makeCollector = sync(unsafeMakeCollector);
var addAll2 = (tranferables) => flatMap2(serviceOption(Collector), match2({
  onNone: () => _void,
  onSome: (_) => _.addAll(tranferables)
}));
var schema3 = dual(2, (self, f) => transformOrFail(encodedSchema(self), self, {
  strict: true,
  decode: succeed5,
  encode: (i) => as(addAll2(f(i)), i)
}));
var ImageData = schema3(Any, (_) => [_.data.buffer]);
var MessagePort = schema3(Any, (_) => [_]);
var Uint8Array3 = schema3(Uint8ArrayFromSelf, (_) => [_.buffer]);

// node_modules/@effect/platform/dist/esm/WorkerError.js
var WorkerError_exports = {};
__export(WorkerError_exports, {
  WorkerError: () => WorkerError,
  WorkerErrorTypeId: () => WorkerErrorTypeId2,
  isWorkerError: () => isWorkerError
});

// node_modules/@effect/platform/dist/esm/internal/workerError.js
var WorkerErrorTypeId = Symbol.for("@effect/platform/WorkerError");

// node_modules/@effect/platform/dist/esm/WorkerError.js
var WorkerErrorTypeId2 = WorkerErrorTypeId;
var isWorkerError = (u) => hasProperty(u, WorkerErrorTypeId2);
var WorkerError = class extends TaggedError2()("WorkerError", {
  reason: Literal("spawn", "decode", "send", "unknown", "encode"),
  cause: Defect
}) {
  /**
   * @since 1.0.0
   */
  [WorkerErrorTypeId2] = WorkerErrorTypeId2;
  /**
   * @since 1.0.0
   */
  static Cause = Cause({
    error: this,
    defect: Defect
  });
  /**
   * @since 1.0.0
   */
  static encodeCause = encodeSync(this.Cause);
  /**
   * @since 1.0.0
   */
  static decodeCause = decodeSync(this.Cause);
  /**
   * @since 1.0.0
   */
  get message() {
    switch (this.reason) {
      case "send":
        return "An error occurred calling .postMessage";
      case "spawn":
        return "An error occurred while spawning a worker";
      case "decode":
        return "An error occurred during decoding";
      case "encode":
        return "An error occurred during encoding";
      case "unknown":
        return "An unexpected error occurred";
    }
  }
};

// node_modules/@effect/platform/dist/esm/Worker.js
var Worker_exports = {};
__export(Worker_exports, {
  PlatformWorker: () => PlatformWorker2,
  PlatformWorkerTypeId: () => PlatformWorkerTypeId2,
  Spawner: () => Spawner2,
  WorkerManager: () => WorkerManager2,
  WorkerManagerTypeId: () => WorkerManagerTypeId2,
  layerManager: () => layerManager2,
  layerSpawner: () => layerSpawner2,
  makeManager: () => makeManager2,
  makePlatform: () => makePlatform2,
  makePool: () => makePool2,
  makePoolLayer: () => makePoolLayer2,
  makePoolSerialized: () => makePoolSerialized2,
  makePoolSerializedLayer: () => makePoolSerializedLayer2,
  makeSerialized: () => makeSerialized2
});

// node_modules/@effect/platform/dist/esm/internal/worker.js
var PlatformWorkerTypeId = Symbol.for("@effect/platform/Worker/PlatformWorker");
var PlatformWorker = GenericTag("@effect/platform/Worker/PlatformWorker");
var WorkerManagerTypeId = Symbol.for("@effect/platform/Worker/WorkerManager");
var WorkerManager = GenericTag("@effect/platform/Worker/WorkerManager");
var Spawner = GenericTag("@effect/platform/Worker/Spawner");
var makeManager = gen(function* () {
  const platform = yield* PlatformWorker;
  let idCounter = 0;
  return WorkerManager.of({
    [WorkerManagerTypeId]: WorkerManagerTypeId,
    spawn({
      encode: encode4,
      initialMessage
    }) {
      return gen(function* () {
        const id = idCounter++;
        let requestIdCounter = 0;
        const requestMap = /* @__PURE__ */ new Map();
        const collector = unsafeMakeCollector();
        const wrappedEncode = encode4 ? (message) => zipRight(collector.clear, provideService(encode4(message), Collector, collector)) : succeed2;
        const readyLatch = yield* make2();
        const backing = yield* platform.spawn(id);
        yield* backing.run((message) => {
          if (message[0] === 0) {
            return complete(readyLatch, _void);
          }
          return handleMessage(message[1]);
        }).pipe(onError((cause) => forEach2(requestMap.values(), (mailbox) => DeferredTypeId in mailbox ? failCause(mailbox, cause) : mailbox.failCause(cause))), tapErrorCause(logWarning), retry(spaced(1e3)), annotateLogs({
          package: "@effect/platform",
          module: "Worker"
        }), interruptible, forkScoped);
        yield* addFinalizer2(() => zipRight(forEach2(requestMap.values(), (mailbox) => DeferredTypeId in mailbox ? interrupt(mailbox) : mailbox.end, {
          discard: true
        }), sync(() => requestMap.clear())));
        const handleMessage = (response) => suspend(() => {
          const mailbox = requestMap.get(response[0]);
          if (!mailbox) return _void;
          switch (response[1]) {
            // data
            case 0: {
              return DeferredTypeId in mailbox ? succeed(mailbox, response[2][0]) : mailbox.offerAll(response[2]);
            }
            // end
            case 1: {
              if (response.length === 2) {
                return DeferredTypeId in mailbox ? interrupt(mailbox) : mailbox.end;
              }
              return DeferredTypeId in mailbox ? succeed(mailbox, response[2][0]) : zipRight(mailbox.offerAll(response[2]), mailbox.end);
            }
            // error / defect
            case 2:
            case 3: {
              if (response[1] === 2) {
                return DeferredTypeId in mailbox ? fail(mailbox, response[2]) : mailbox.fail(response[2]);
              }
              const cause = WorkerError.decodeCause(response[2]);
              return DeferredTypeId in mailbox ? failCause(mailbox, cause) : mailbox.failCause(cause);
            }
          }
        });
        const executeAcquire = (request, makeMailbox) => withFiberRuntime((fiber) => {
          const context2 = fiber.getFiberRef(currentContext);
          const span = getOption(context2, ParentSpan).pipe(filter((span2) => span2._tag === "Span"));
          const id2 = requestIdCounter++;
          return makeMailbox.pipe(tap((mailbox) => {
            requestMap.set(id2, mailbox);
            return wrappedEncode(request).pipe(tap((payload) => backing.send([id2, 0, payload, span._tag === "Some" ? [span.value.traceId, span.value.spanId, span.value.sampled] : void 0], collector.unsafeRead())), catchAllCause((cause) => isMailbox(mailbox) ? mailbox.failCause(cause) : failCause(mailbox, cause)));
          }), map5((mailbox) => ({
            id: id2,
            mailbox
          })));
        });
        const executeRelease = ({
          id: id2
        }, exit2) => {
          const release = sync(() => requestMap.delete(id2));
          return isFailure(exit2) ? zipRight(orDie(backing.send([id2, 1])), release) : release;
        };
        const execute3 = (request) => fromChannel(acquireUseRelease2(executeAcquire(request, make5()), ({
          mailbox
        }) => toChannel(mailbox), executeRelease));
        const executeEffect = (request) => acquireUseRelease(executeAcquire(request, make2()), ({
          mailbox
        }) => _await(mailbox), executeRelease);
        yield* _await(readyLatch);
        if (initialMessage) {
          yield* sync(initialMessage).pipe(flatMap2(executeEffect), mapError((cause) => new WorkerError({
            reason: "spawn",
            cause
          })));
        }
        return {
          id,
          execute: execute3,
          executeEffect
        };
      });
    }
  });
});
var layerManager = effect(WorkerManager, makeManager);
var makePool = (options7) => gen(function* () {
  const manager = yield* WorkerManager;
  const workers = /* @__PURE__ */ new Set();
  const acquire = pipe(manager.spawn(options7), tap((worker) => acquireRelease(sync(() => workers.add(worker)), () => sync(() => workers.delete(worker)))), options7.onCreate ? tap(options7.onCreate) : identity);
  const backing = "minSize" in options7 ? yield* makeWithTTL({
    acquire,
    min: options7.minSize,
    max: options7.maxSize,
    concurrency: options7.concurrency,
    targetUtilization: options7.targetUtilization,
    timeToLive: options7.timeToLive
  }) : yield* make7({
    acquire,
    size: options7.size,
    concurrency: options7.concurrency,
    targetUtilization: options7.targetUtilization
  });
  const pool = {
    backing,
    broadcast: (message) => forEach2(workers, (worker) => worker.executeEffect(message), {
      concurrency: "unbounded",
      discard: true
    }),
    execute: (message) => unwrapScoped4(map5(backing.get, (worker) => worker.execute(message))),
    executeEffect: (message) => scoped(flatMap2(backing.get, (worker) => worker.executeEffect(message)))
  };
  yield* scoped(backing.get);
  return pool;
});
var makePoolLayer = (tag5, options7) => scoped2(tag5, makePool(options7));
var makeSerialized = (options7) => gen(function* () {
  const manager = yield* WorkerManager;
  const backing = yield* manager.spawn({
    ...options7,
    encode(message) {
      return mapError(serialize(message), (cause) => new WorkerError({
        reason: "encode",
        cause
      }));
    }
  });
  const execute3 = (message) => {
    const parseSuccess = decode2(successSchema(message));
    const parseFailure = decode2(failureSchema(message));
    return pipe(backing.execute(message), catchAll2((error) => flatMap2(parseFailure(error), fail4)), mapEffect(parseSuccess));
  };
  const executeEffect = (message) => {
    const parseSuccess = decode2(successSchema(message));
    const parseFailure = decode2(failureSchema(message));
    return matchEffect(backing.executeEffect(message), {
      onFailure: (error) => flatMap2(parseFailure(error), fail4),
      onSuccess: parseSuccess
    });
  };
  return identity({
    id: backing.id,
    execute: execute3,
    executeEffect
  });
});
var makePoolSerialized = (options7) => gen(function* () {
  const manager = yield* WorkerManager;
  const workers = /* @__PURE__ */ new Set();
  const acquire = pipe(makeSerialized(options7), tap((worker) => sync(() => workers.add(worker))), tap((worker) => addFinalizer2(() => sync(() => workers.delete(worker)))), options7.onCreate ? tap(options7.onCreate) : identity, provideService(WorkerManager, manager));
  const backing = yield* "timeToLive" in options7 ? makeWithTTL({
    acquire,
    min: options7.minSize,
    max: options7.maxSize,
    concurrency: options7.concurrency,
    targetUtilization: options7.targetUtilization,
    timeToLive: options7.timeToLive
  }) : make7({
    acquire,
    size: options7.size,
    concurrency: options7.concurrency,
    targetUtilization: options7.targetUtilization
  });
  const pool = {
    backing,
    broadcast: (message) => forEach2(workers, (worker) => worker.executeEffect(message), {
      concurrency: "unbounded",
      discard: true
    }),
    execute: (message) => unwrapScoped4(map5(backing.get, (worker) => worker.execute(message))),
    executeEffect: (message) => scoped(flatMap2(backing.get, (worker) => worker.executeEffect(message)))
  };
  yield* scoped(backing.get);
  return pool;
});
var makePoolSerializedLayer = (tag5, options7) => scoped2(tag5, makePoolSerialized(options7));
var layerSpawner = (spawner) => succeed3(Spawner, spawner);
var makePlatform = () => (options7) => PlatformWorker.of({
  [PlatformWorkerTypeId]: PlatformWorkerTypeId,
  spawn(id) {
    return gen(function* () {
      const spawn = yield* Spawner;
      let currentPort;
      const buffer = [];
      const run4 = (handler2) => uninterruptibleMask((restore) => gen(function* () {
        const scope2 = yield* scope;
        const port = yield* options7.setup({
          worker: spawn(id),
          scope: scope2
        });
        currentPort = port;
        yield* addFinalizer(scope2, sync(() => {
          currentPort = void 0;
        }));
        const runtime4 = (yield* runtime2()).pipe(updateContext(omit(Scope)));
        const fiberSet = yield* make4();
        const runFork2 = runFork(runtime4);
        yield* options7.listen({
          port,
          scope: scope2,
          emit(data) {
            unsafeAdd(fiberSet, runFork2(handler2(data)));
          },
          deferred: fiberSet.deferred
        });
        if (buffer.length > 0) {
          for (const [message, transfers] of buffer) {
            port.postMessage([0, message], transfers);
          }
          buffer.length = 0;
        }
        return yield* restore(join(fiberSet));
      }).pipe(scoped));
      const send = (message, transfers) => try_({
        try: () => {
          if (currentPort === void 0) {
            buffer.push([message, transfers]);
          } else {
            currentPort.postMessage([0, message], transfers);
          }
        },
        catch: (cause) => new WorkerError({
          reason: "send",
          cause
        })
      });
      return {
        run: run4,
        send
      };
    });
  }
});

// node_modules/@effect/platform/dist/esm/Worker.js
var PlatformWorkerTypeId2 = PlatformWorkerTypeId;
var makePlatform2 = makePlatform;
var PlatformWorker2 = PlatformWorker;
var Spawner2 = Spawner;
var WorkerManagerTypeId2 = WorkerManagerTypeId;
var WorkerManager2 = WorkerManager;
var makeManager2 = makeManager;
var layerManager2 = layerManager;
var makePool2 = makePool;
var makePoolLayer2 = makePoolLayer;
var makeSerialized2 = makeSerialized;
var makePoolSerialized2 = makePoolSerialized;
var makePoolSerializedLayer2 = makePoolSerializedLayer;
var layerSpawner2 = layerSpawner;

// node_modules/@effect/platform/dist/esm/WorkerRunner.js
var WorkerRunner_exports = {};
__export(WorkerRunner_exports, {
  CloseLatch: () => CloseLatch2,
  PlatformRunner: () => PlatformRunner2,
  PlatformRunnerTypeId: () => PlatformRunnerTypeId2,
  launch: () => launch2,
  layer: () => layer8,
  layerCloseLatch: () => layerCloseLatch2,
  layerSerialized: () => layerSerialized2,
  make: () => make33,
  makeSerialized: () => makeSerialized4
});

// node_modules/@effect/platform/dist/esm/internal/workerRunner.js
var PlatformRunnerTypeId = Symbol.for("@effect/platform/Runner/PlatformRunner");
var PlatformRunner = GenericTag("@effect/platform/Runner/PlatformRunner");
var CloseLatch = Reference()("@effect/platform/WorkerRunner/CloseLatch", {
  defaultValue: () => unsafeMake2(none2)
});
var layerCloseLatch = effect(CloseLatch, make2());
var make32 = fnUntraced(function* (process, options7) {
  const fiber = yield* withFiberRuntime(succeed2);
  const platform = yield* PlatformRunner;
  const closeLatch = yield* CloseLatch;
  const backing = yield* platform.start(closeLatch);
  const fiberMap = /* @__PURE__ */ new Map();
  yield* _await(closeLatch).pipe(onExit(() => {
    fiber.currentScheduler.scheduleTask(() => {
      fiber.unsafeInterruptAsFork(fiber.id());
    }, 0);
    return _void;
  }), forkScoped);
  yield* backing.run((portId, [id, kind, data, span]) => {
    if (kind === 1) {
      const fiber2 = fiberMap.get(id);
      if (!fiber2) return _void;
      return interrupt2(fiber2);
    }
    return withFiberRuntime((fiber2) => {
      fiberMap.set(id, fiber2);
      return options7?.decode ? options7.decode(data) : succeed2(data);
    }).pipe(flatMap2((input) => {
      const collector = unsafeMakeCollector();
      const stream8 = process(input);
      let effect2 = isEffect(stream8) ? flatMap2(stream8, (out) => pipe(options7?.encodeOutput ? provideService(options7.encodeOutput(input, out), Collector, collector) : succeed2(out), flatMap2((payload) => backing.send(portId, [id, 0, [payload]], collector.unsafeRead())))) : pipe(stream8, runForEachChunk((chunk) => {
        if (options7?.encodeOutput === void 0) {
          const payload = toReadonlyArray(chunk);
          return backing.send(portId, [id, 0, payload]);
        }
        collector.unsafeClear();
        return pipe(forEach2(chunk, (data2) => options7.encodeOutput(input, data2)), provideService(Collector, collector), flatMap2((payload) => backing.send(portId, [id, 0, payload], collector.unsafeRead())));
      }), andThen(backing.send(portId, [id, 1])));
      if (span) {
        effect2 = withParentSpan(effect2, {
          _tag: "ExternalSpan",
          traceId: span[0],
          spanId: span[1],
          sampled: span[2],
          context: empty2()
        });
      }
      return uninterruptibleMask((restore) => restore(effect2).pipe(catchIf(isWorkerError, (error) => backing.send(portId, [id, 3, WorkerError.encodeCause(fail3(error))])), catchAllCause((cause) => match(failureOrCause(cause), {
        onLeft: (error) => {
          collector.unsafeClear();
          return pipe(options7?.encodeError ? provideService(options7.encodeError(input, error), Collector, collector) : succeed2(error), flatMap2((payload) => backing.send(portId, [id, 2, payload], collector.unsafeRead())), catchAllCause((cause2) => backing.send(portId, [id, 3, WorkerError.encodeCause(cause2)])));
        },
        onRight: (cause2) => backing.send(portId, [id, 3, WorkerError.encodeCause(cause2)])
      }))));
    }), ensuring(sync(() => fiberMap.delete(id))));
  });
});
var layer7 = (process, options7) => scopedDiscard(make32(process, options7)).pipe(provide2(layerCloseLatch));
var makeSerialized3 = (schema4, handlers) => gen(function* () {
  const scope2 = yield* scope;
  let context2 = empty2();
  const parseRequest = decodeUnknown(schema4);
  return yield* make32((request) => {
    const result = handlers[request._tag](request);
    if (isLayer(result)) {
      return flatMap2(buildWithScope(result, scope2), (_) => sync(() => {
        context2 = merge(context2, _);
      }));
    } else if (isEffect(result)) {
      return provide(result, context2);
    }
    return provideContext(result, context2);
  }, {
    decode(message) {
      return mapError(parseRequest(message), (cause) => new WorkerError({
        reason: "decode",
        cause
      }));
    },
    encodeError(request, message) {
      return mapError(serializeFailure(request, message), (cause) => new WorkerError({
        reason: "encode",
        cause
      }));
    },
    encodeOutput(request, message) {
      return catchAllCause(serializeSuccess(request, message), (cause) => new WorkerError({
        reason: "encode",
        cause
      }));
    }
  });
});
var layerSerialized = (schema4, handlers) => scopedDiscard(makeSerialized3(schema4, handlers)).pipe(provide2(layerCloseLatch));
var launch = (layer9) => scopedWith(fnUntraced(function* (scope2) {
  const context2 = yield* buildWithScope(provideMerge(layer9, layerCloseLatch), scope2);
  const closeLatch = get2(context2, CloseLatch);
  return yield* _await(closeLatch);
}));

// node_modules/@effect/platform/dist/esm/WorkerRunner.js
var PlatformRunnerTypeId2 = PlatformRunnerTypeId;
var PlatformRunner2 = PlatformRunner;
var CloseLatch2 = CloseLatch;
var layerCloseLatch2 = layerCloseLatch;
var make33 = make32;
var layer8 = layer7;
var makeSerialized4 = makeSerialized3;
var layerSerialized2 = layerSerialized;
var launch2 = launch;

export {
  encode2 as encode,
  decodeUnknown2 as decodeUnknown,
  duplexUnknown,
  ChannelSchema_exports,
  isPlatformError,
  TypeIdError,
  SystemError,
  Error_exports,
  Cookies_exports,
  Etag_exports,
  empty6 as empty,
  fromInput,
  merge3 as merge,
  Headers_exports,
  RequestError,
  ResponseError,
  HttpClientError_exports,
  FileSystem,
  FileSystem_exports,
  fromInput2,
  toString3 as toString,
  schemaParse,
  UrlParams_exports,
  schemaBodyJson,
  schemaBodyUrlParams,
  schemaHeaders,
  HttpIncomingMessage_exports,
  HttpTraceContext_exports,
  TypeId23 as TypeId,
  fromWeb3 as fromWeb,
  schemaJson5 as schemaJson,
  schemaNoBody,
  stream7 as stream,
  matchStatus,
  filterStatus,
  filterStatusOk,
  make22 as make,
  layerMergedContext,
  getEncoding,
  getParam,
  annotations2 as annotations,
  UnionUnify,
  NoContent,
  HttpApiSchema_exports,
  HttpApiError_exports,
  Api,
  reflect,
  HttpApi_exports,
  HttpApiMiddleware_exports,
  isHttpBody,
  uint8Array2 as uint8Array,
  text2 as text,
  json2 as json,
  urlParams2 as urlParams,
  HttpBody_exports,
  Template_exports,
  empty11 as empty2,
  text4 as text2,
  html2 as html,
  stream6 as stream2,
  HttpServerResponse_exports,
  HttpServerRespondable_exports,
  RouteNotFound,
  HttpServerError_exports,
  Path2 as Path,
  Path_exports,
  Multipart_exports,
  Socket,
  SocketGenericError,
  SocketCloseError,
  Socket_exports,
  HttpServerRequest,
  HttpServerRequest_exports,
  toWebHandlerRuntime,
  HttpApp_exports,
  hasBody,
  HttpMethod_exports,
  HttpMiddleware_exports,
  HttpClient,
  mapRequest2 as mapRequest,
  HttpClient_exports,
  make24 as make2,
  setHeaders4 as setHeaders,
  setUrl2 as setUrl,
  prependUrl2 as prependUrl,
  setUrlParams2 as setUrlParams,
  appendUrlParams2 as appendUrlParams,
  setBody4 as setBody,
  bodyFormData2 as bodyFormData,
  HttpClientRequest_exports,
  TypeId27 as TypeId2,
  tag4 as tag,
  make25 as make3,
  layer5 as layer,
  HttpServer_exports,
  prefixPath2 as prefixPath,
  Default,
  HttpRouter_exports,
  OpenApiJsonSchema_exports,
  fromApi,
  OpenApi_exports,
  Router,
  HttpApiBuilder_exports,
  HttpRouter,
  HttpLayerRouter_exports,
  msgpackr_exports,
  MsgPack_exports,
  SocketServer,
  SocketServer_exports,
  Collector,
  unsafeMakeCollector,
  Transferable_exports,
  WorkerError_exports,
  PlatformWorker2 as PlatformWorker,
  Worker_exports,
  PlatformRunner2 as PlatformRunner,
  CloseLatch2 as CloseLatch,
  WorkerRunner_exports
};
//# sourceMappingURL=chunk-EX52NJ6G.js.map
