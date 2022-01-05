# text-distance-worker

A cloudflare worker to get text distance.

This is hosted at `https://vcokltfre.dev/distance`. All arguments should be query params.

Params:

| Name   | Type                                | Required | Description                                                                                                        |
|--------|-------------------------------------|----------|--------------------------------------------------------------------------------------------------------------------|
| algo   | "jw" or "nilsimsa" or "levenshtein" | Yes      | The algorith to use.                                                                                               |
| s1     | string                              | Yes      | The first input string.                                                                                            |
| s2     | string                              | Yes      | The second input string.                                                                                           |
| format | "json" or "html"                    | No       | The return format. "json" returns an object as described below, "html" returns Discord embed compatible meta tags. |

JSON response format:

| Name   | Type                                | Description                                           |
|--------|-------------------------------------|-------------------------------------------------------|
| algo   | "jw" or "nilsimsa" or "levenshtein" | The algorithm used.                                   |
| s1     | string                              | The first input string.                               |
| s2     | string                              | The second input string.                              |
| result | float                               | The result as a floating point value between 0 and 1. |
