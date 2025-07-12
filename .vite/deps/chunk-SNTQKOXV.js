import {
  ConfigProviderTypeId,
  FlatConfigProviderTypeId,
  LoggerTypeId,
  __export,
  addLogger,
  addLoggerEffect,
  addLoggerScoped,
  andThen,
  batchedLogger,
  configProviderTag,
  constantCase,
  currentServices,
  defaultLogger,
  dual,
  empty11 as empty3,
  empty12 as empty4,
  empty15 as empty5,
  empty7 as empty,
  empty8 as empty2,
  filterLogLevel,
  fromEnv,
  fromFlat,
  fromJson,
  fromMap,
  isLogger,
  jsonLogger,
  jsonLogger2,
  kebabCase,
  liveServices,
  logFmtLogger,
  logLevelInfo,
  logfmtLogger,
  loggerWithConsoleError,
  loggerWithConsoleLog,
  loggerWithLeveledLog,
  loggerWithSpanAnnotations,
  lowerCase,
  make8 as make,
  makeFlat,
  makeLogger,
  map8 as map,
  mapInput2 as mapInput,
  mapInputOptions,
  mapInputPath,
  mapName,
  minimumLogLevel,
  nested,
  nested2,
  none2 as none,
  none5 as none2,
  orElse2 as orElse,
  prettyLogger,
  prettyLogger2,
  prettyLoggerDefault,
  removeLogger,
  replaceLogger,
  replaceLoggerEffect,
  replaceLoggerScoped,
  simple,
  snakeCase,
  stringLogger,
  structuredLogger,
  structuredLogger2,
  succeed4 as succeed,
  sync2 as sync,
  tracerLogger,
  unnested,
  unnested2,
  upperCase,
  withMinimumLogLevel,
  within,
  zip2 as zip,
  zipLeft,
  zipRight2 as zipRight
} from "./chunk-6XTNYBYF.js";

// node_modules/effect/dist/esm/ConfigProvider.js
var ConfigProvider_exports = {};
__export(ConfigProvider_exports, {
  ConfigProvider: () => ConfigProvider,
  ConfigProviderTypeId: () => ConfigProviderTypeId2,
  FlatConfigProviderTypeId: () => FlatConfigProviderTypeId2,
  constantCase: () => constantCase2,
  fromEnv: () => fromEnv2,
  fromFlat: () => fromFlat2,
  fromJson: () => fromJson2,
  fromMap: () => fromMap2,
  kebabCase: () => kebabCase2,
  lowerCase: () => lowerCase2,
  make: () => make2,
  makeFlat: () => makeFlat2,
  mapInputPath: () => mapInputPath2,
  nested: () => nested3,
  orElse: () => orElse2,
  snakeCase: () => snakeCase2,
  unnested: () => unnested3,
  upperCase: () => upperCase2,
  within: () => within2
});
var ConfigProviderTypeId2 = ConfigProviderTypeId;
var FlatConfigProviderTypeId2 = FlatConfigProviderTypeId;
var ConfigProvider = configProviderTag;
var make2 = make;
var makeFlat2 = makeFlat;
var fromEnv2 = fromEnv;
var fromFlat2 = fromFlat;
var fromJson2 = fromJson;
var fromMap2 = fromMap;
var constantCase2 = constantCase;
var mapInputPath2 = mapInputPath;
var kebabCase2 = kebabCase;
var lowerCase2 = lowerCase;
var nested3 = nested2;
var orElse2 = orElse;
var unnested3 = unnested2;
var snakeCase2 = snakeCase;
var upperCase2 = upperCase;
var within2 = within;

// node_modules/effect/dist/esm/ConfigProviderPathPatch.js
var ConfigProviderPathPatch_exports = {};
__export(ConfigProviderPathPatch_exports, {
  andThen: () => andThen2,
  empty: () => empty6,
  mapName: () => mapName2,
  nested: () => nested4,
  unnested: () => unnested4
});
var empty6 = empty3;
var andThen2 = andThen;
var mapName2 = mapName;
var nested4 = nested;
var unnested4 = unnested;

// node_modules/effect/dist/esm/DefaultServices.js
var DefaultServices_exports = {};
__export(DefaultServices_exports, {
  currentServices: () => currentServices2,
  liveServices: () => liveServices2
});
var liveServices2 = liveServices;
var currentServices2 = currentServices;

// node_modules/effect/dist/esm/Logger.js
var Logger_exports = {};
__export(Logger_exports, {
  LoggerTypeId: () => LoggerTypeId2,
  add: () => add,
  addEffect: () => addEffect,
  addScoped: () => addScoped,
  batched: () => batched,
  defaultLogger: () => defaultLogger2,
  filterLogLevel: () => filterLogLevel2,
  isLogger: () => isLogger2,
  json: () => json,
  jsonLogger: () => jsonLogger3,
  logFmt: () => logFmt,
  logfmtLogger: () => logfmtLogger2,
  make: () => make3,
  map: () => map2,
  mapInput: () => mapInput2,
  mapInputOptions: () => mapInputOptions2,
  minimumLogLevel: () => minimumLogLevel2,
  none: () => none3,
  pretty: () => pretty,
  prettyLogger: () => prettyLogger3,
  prettyLoggerDefault: () => prettyLoggerDefault2,
  remove: () => remove,
  replace: () => replace,
  replaceEffect: () => replaceEffect,
  replaceScoped: () => replaceScoped,
  simple: () => simple2,
  stringLogger: () => stringLogger2,
  structured: () => structured,
  structuredLogger: () => structuredLogger3,
  succeed: () => succeed2,
  sync: () => sync2,
  test: () => test2,
  tracerLogger: () => tracerLogger2,
  withConsoleError: () => withConsoleError,
  withConsoleLog: () => withConsoleLog,
  withLeveledConsole: () => withLeveledConsole,
  withMinimumLogLevel: () => withMinimumLogLevel2,
  withSpanAnnotations: () => withSpanAnnotations,
  zip: () => zip2,
  zipLeft: () => zipLeft2,
  zipRight: () => zipRight2
});

// node_modules/effect/dist/esm/internal/logger-circular.js
var test = dual(2, (self, input) => self.log({
  fiberId: none,
  logLevel: logLevelInfo,
  message: input,
  cause: empty5,
  context: empty4(),
  spans: empty2(),
  annotations: empty(),
  date: /* @__PURE__ */ new Date()
}));

// node_modules/effect/dist/esm/Logger.js
var LoggerTypeId2 = LoggerTypeId;
var make3 = makeLogger;
var add = addLogger;
var addEffect = addLoggerEffect;
var addScoped = addLoggerScoped;
var mapInput2 = mapInput;
var mapInputOptions2 = mapInputOptions;
var filterLogLevel2 = filterLogLevel;
var map2 = map;
var batched = batchedLogger;
var withConsoleLog = loggerWithConsoleLog;
var withLeveledConsole = loggerWithLeveledLog;
var withConsoleError = loggerWithConsoleError;
var none3 = none2;
var remove = removeLogger;
var replace = replaceLogger;
var replaceEffect = replaceLoggerEffect;
var replaceScoped = replaceLoggerScoped;
var simple2 = simple;
var succeed2 = succeed;
var sync2 = sync;
var test2 = test;
var withMinimumLogLevel2 = withMinimumLogLevel;
var withSpanAnnotations = loggerWithSpanAnnotations;
var zip2 = zip;
var zipLeft2 = zipLeft;
var zipRight2 = zipRight;
var defaultLogger2 = defaultLogger;
var jsonLogger3 = jsonLogger;
var logfmtLogger2 = logfmtLogger;
var stringLogger2 = stringLogger;
var prettyLogger3 = prettyLogger;
var prettyLoggerDefault2 = prettyLoggerDefault;
var structuredLogger3 = structuredLogger;
var tracerLogger2 = tracerLogger;
var json = replace(defaultLogger, jsonLogger2);
var logFmt = replace(defaultLogger, logFmtLogger);
var pretty = replace(defaultLogger, prettyLogger2);
var structured = replace(defaultLogger, structuredLogger2);
var minimumLogLevel2 = minimumLogLevel;
var isLogger2 = isLogger;

export {
  ConfigProvider,
  makeFlat2 as makeFlat,
  fromFlat2 as fromFlat,
  fromMap2 as fromMap,
  orElse2 as orElse,
  ConfigProvider_exports,
  empty6 as empty,
  ConfigProviderPathPatch_exports,
  currentServices2 as currentServices,
  DefaultServices_exports,
  batched,
  defaultLogger2 as defaultLogger,
  prettyLoggerDefault2 as prettyLoggerDefault,
  isLogger2 as isLogger,
  Logger_exports
};
//# sourceMappingURL=chunk-SNTQKOXV.js.map
