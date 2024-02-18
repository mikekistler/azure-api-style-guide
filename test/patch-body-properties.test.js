const { linterForRule } = require('./utils');

let linter;

beforeAll(async () => {
  linter = await linterForRule('az-patch-body-properties');
  return linter;
});

test('az-patch-body-properties should find errors', () => {
  const oasV2Document = {
    swagger: '2.0',
    paths: {
      '/path1': {
        patch: {
          parameters: [
            {
              name: 'body',
              in: 'body',
              schema: {
                $ref: '#/definitions/MyPatchBodyModel',
              },
              required: true,
            },
          ],
        },
      },
    },
    definitions: {
      MyPatchBodyModel: {
        type: 'object',
        properties: {
          prop1: {
            type: 'string',
            default: 'foo',
          },
          inner: {
            $ref: '#/definitions/MyNestedBodyModel',
          },
        },
        allOf: [
          {
            properties: {
              prop3: {
                type: 'string',
                default: 'baz',
              },
            },
          },
        ],
      },
      MyNestedBodyModel: {
        type: 'object',
        properties: {
          prop2: {
            type: 'string',
            default: 'bar',
          },
        },
      },
    },
  };
  return linter.run(oasV2Document).then((results) => {
    expect(results.length).toBe(3);
    // Note: Spectral sorts the results by path, so we can rely on the order here.
    expect(results[0].path.join('.')).toBe(
      'paths./path1.patch.parameters.0.schema.allOf.0.properties.prop3.default',
    );
    expect(results[1].path.join('.')).toBe(
      'paths./path1.patch.parameters.0.schema.properties.inner.properties.prop2.default',
    );
    expect(results[2].path.join('.')).toBe(
      'paths./path1.patch.parameters.0.schema.properties.prop1.default',
    );
    results.forEach((result) => expect(result.message).toBe(
      'Properties in a patch request body must not have a default value.',
    ));
  });
});

test('az-patch-body-properties should find no errors', () => {
  const oasV2Document = {
    swagger: '2.0',
    paths: {
      '/path1': {
        patch: {
          parameters: [
            {
              name: 'body',
              in: 'body',
              schema: {
                $ref: '#/definitions/MyPatchBodyModel',
              },
              required: true,
            },
          ],
        },
      },
    },
    definitions: {
      MyPatchBodyModel: {
        type: 'object',
        properties: {
          prop1: {
            type: 'string',
          },
          inner: {
            $ref: '#/definitions/MyNestedBodyModel',
          },
        },
        allOf: [
          {
            properties: {
              prop3: {
                type: 'string',
              },
            },
          },
        ],
      },
      MyNestedBodyModel: {
        type: 'object',
        properties: {
          prop2: {
            type: 'string',
          },
        },
      },
    },
  };
  return linter.run(oasV2Document).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('az-patch-body-properties should find errors in oas3 definition', () => {
  const oasV3Document = {
    openapi: '3.0.3',
    paths: {
      '/path1': {
        patch: {
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/MyPatchBodyModel',
                },
              },
            },
            required: true,
          },
        },
      },
    },
    components: {
      schemas: {
        MyPatchBodyModel: {
          type: 'object',
          properties: {
            prop1: {
              type: 'string',
              default: 'foo',
            },
            inner: {
              $ref: '#/components/schemas/MyNestedBodyModel',
            },
          },
          allOf: [
            {
              properties: {
                prop3: {
                  type: 'string',
                  default: 'baz',
                },
              },
            },
          ],
        },
        MyNestedBodyModel: {
          type: 'object',
          properties: {
            prop2: {
              type: 'string',
              default: 'bar',
            },
          },
        },
      },
    },
  };
  return linter.run(oasV3Document).then((results) => {
    expect(results.length).toBe(3);
    // Note: Spectral sorts the results by path, so we can rely on the order here.
    expect(results[0].path.join('.')).toBe(
      'paths./path1.patch.requestBody.content.application/json.schema.allOf.0.properties.prop3.default',
    );
    expect(results[1].path.join('.')).toBe(
      'paths./path1.patch.requestBody.content.application/json.schema.properties.inner.properties.prop2.default',
    );
    expect(results[2].path.join('.')).toBe(
      'paths./path1.patch.requestBody.content.application/json.schema.properties.prop1.default',
    );
    results.forEach((result) => expect(result.message).toBe(
      'Properties in a patch request body must not have a default value.',
    ));
  });
});

test('az-patch-body-properties should find no errors in oas3 definition', () => {
  const oasV3Document = {
    openapi: '3.0.3',
    paths: {
      '/path1': {
        patch: {
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/MyPatchBodyModel',
                },
              },
            },
            required: true,
          },
        },
      },
    },
    components: {
      schemas: {
        MyPatchBodyModel: {
          type: 'object',
          properties: {
            prop1: {
              type: 'string',
            },
            inner: {
              $ref: '#/components/schemas/MyNestedBodyModel',
            },
          },
          allOf: [
            {
              properties: {
                prop3: {
                  type: 'string',
                },
              },
            },
          ],
        },
        MyNestedBodyModel: {
          type: 'object',
          properties: {
            prop2: {
              type: 'string',
            },
          },
        },
      },
    },
  };
  return linter.run(oasV3Document).then((results) => {
    expect(results.length).toBe(0);
  });
});
