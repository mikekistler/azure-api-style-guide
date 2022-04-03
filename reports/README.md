# Reports

This directory contains a script and data file for checking coverage of the MUST/MUST NOT rules
in the Azure REST API Guidelines.

### How may MUST/MUST NOT rules are there?
```sh
> jq 'length' reqs.json
131
```

### What is a concise list of the MUST/MUST NOT rules?
```sh
> jq '.[] | select(.linter) | .reqline' reqs.json
```

### How many MUST/MUST NOT rules can be checked by linting the API definition?
```sh
> jq '[.[] | select(.linter) | .reqline] | length' reqs.json
34
```

### How many MUST/MUST NOT rules can be checked with live tests?
```sh
> jq '[.[] | select(.liveTest) | .reqline] | length' reqs.json
34
```

Sheer coincidence that it is the same as can be checked with linting.

### How many MUST/MUST NOT rules are checked by a linter rule?
```sh
> jq '[.[] | select(.linter and .rule) | .reqline] | length' reqs.json
15
```

### How many MUST/MUST NOT rules are NOT checked by a linter rule?
```sh
> jq '[.[] | select(.linter) | select(.rule|not) | .reqline] | length' reqs.json
19
```

### Which MUST/MUST NOT rules are NOT checked by a linter rule (but could be)?
```sh
> jq -r '.[] | select(.linter) | select(.rule|not) | .reqline' reqs.json
```
