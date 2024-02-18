// Check that properties of a patch request body schema do not have a default.

// `input` is the schema of a patch request body
module.exports = function patchBodyPropertyDefaultNotAllowed(
  schema,
  options,
  { path },
) {
  if (schema === null || typeof schema !== 'object') {
    return [];
  }

  const errors = [];

  for (const [name, prop] of Object.entries(schema.properties || {})) {
    if (prop.default) {
      errors.push({
        message:
          'Properties in a patch request body must not have a default value.',
        path: [...path, 'properties', name, 'default'],
      });
    }
  }

  // Recurse into nested properties
  for (const [name, prop] of Object.entries(schema.properties || {})) {
    if ((prop.type || 'object') === 'object' && prop.properties) {
      errors.push(
        ...patchBodyPropertyDefaultNotAllowed(prop, options, {
          path: [...path, 'properties', name],
        }),
      );
    }
  }

  // Since array properties are patched "wholesale", we don't need to check for defaults
  // in the items of an array.

  if (schema.allOf && Array.isArray(schema.allOf)) {
    for (const [index, value] of schema.allOf.entries()) {
      errors.push(
        ...patchBodyPropertyDefaultNotAllowed(value, options, {
          path: [...path, 'allOf', index],
        }),
      );
    }
  }

  return errors;
};
