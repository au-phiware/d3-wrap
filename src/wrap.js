var nonEnumerableProps = /^(valueOf|isPrototypeOf|to(Locale)?String|propertyIsEnumerable|hasOwnProperty)$/;

export default function wrap(f, wrapper) {
  var wrapped = function(context) {
    for (var i = 0, ii = arguments.length, args = Array(ii + 1); i < ii; i++) {
      args[i + 1] = arguments[i];
    }
    args[0] = function(wrappedContext) {
      for (var i = 0, ii = arguments.length, args = Array(ii); i < ii; i++) {
        args[i] = arguments[i];
      }
      if (context.selection && wrappedContext !== context && !wrappedContext.selection) {
        args[0] = wrappedContext.transition(context);
      }
      return f.apply(this, args);
    };
    return wrapper.apply(this, args);
  }
  for (var k in f) {
    if (!nonEnumerableProps.test(k)) {
      wrapped[k] = f[k];
    }
  }
  return wrapped;
}
