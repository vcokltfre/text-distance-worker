import { jaroWinkler } from "jaro-winkler-typescript"
import { digest, compareDigests } from "nilsimsa"
import { TextEncoder } from "text-encoding";
import { get } from "fast-levenshtein";

function createHTMLResponse(content: string): Response {
  const init = {
    headers: {
      "Content-Type": "text/html; charset=utf-8;"
    }
  }

  return new Response(content, init)
}

function createJSONResponse(content: string): Response {
  const init = {
    headers: {
      "Content-Type": "application/json"
    }
  }

  return new Response(content, init)
}

function buildMetaTags(tags: Array<Array<string>>): string {
  let metaTags = ""

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  tags.forEach((val, _, __) => {
    metaTags += `<meta property="og:${val[0]}" content="${val[1]}">`
  })

  return metaTags
}

export async function handleRequest(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url)
  const s1 = searchParams.get('s1')
  const s2 = searchParams.get('s2')
  const algo = searchParams.get('algo')
  const rf = searchParams.get('format') || 'html'

  if ((!(rf === "json" || rf === "html")) || (!(algo === "jw" || algo === "nilsimsa" || algo === "levenshtein"))) {
    return new Response("Bad request.", { status: 400 })
  }

  if (!s1 || !s2 || !algo) {
    const metaTags = buildMetaTags([
      ["title", "Invalid query."]
    ])
    return createHTMLResponse(metaTags)
  }

  let result = 0;

  if (algo == "nilsimsa") {
    const e = new TextEncoder()
    const r1 = digest(e.encode(s1))
    const r2 = digest(e.encode(s2))

    result = compareDigests(r1, r2) / 128
  } else if (algo === "jw") {
    result = jaroWinkler(s1, s2)
  } else {
    const raw_result = get(s1, s2)
    const length = s1.length | s2.length

    result = 1 - raw_result / length
  }

  if (rf === "html") {
    const metaTags = buildMetaTags([
      ["title", `String Similarity (${(algo === "jw") ? "JaroWinkler" : algo === "nilsimsa" ? "Nilsimsa" : "Levenshtein"})`],
      ["description", `Input 1: ${s1}\nInput 2: ${s2}\n\Similarity: ${Math.round(result * 1000) / 10}%`],
    ])
    return createHTMLResponse(metaTags)
  }

  return createJSONResponse(JSON.stringify({
    s1,
    s2,
    algo,
    result,
  }))
}
