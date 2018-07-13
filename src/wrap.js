const nonEnumerableProps = /^(valueOf|isPrototypeOf|to(Locale)?String|propertyIsEnumerable|hasOwnProperty)$/;

function extend(f, wrapped) {
  for (var k in f) {
    if (!nonEnumerableProps.test(k)) {
      wrapped[k] = f[k];
    }
  }
  return wrapped;
}

export default function wrap(f, wrapper) {
  return extend(f, function(context) {
    for (var i = 0, ii = arguments.length, args = Array(ii + 1); i < ii; i++) {
      args[i + 1] = arguments[i];
    }
    args[0] = extend(f, function(wrappedContext) {
      for (var i = 0, ii = arguments.length, args = Array(ii); i < ii; i++) {
        args[i] = arguments[i];
      }
      if (context.selection && wrappedContext !== context && !wrappedContext.selection) {
        args[0] = wrappedContext.transition(context);
      }
      return f.apply(this, args);
    });
    return wrapper.apply(this, args);
  });
}
