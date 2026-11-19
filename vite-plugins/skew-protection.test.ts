import { describe, expect, it } from "vitest";

import { skewProtection, __testing } from "./skew-protection";

const { collectDocumentReferences, collectEmittedFiles, pinReferences } = __testing;

const LAZY = new Set(["booking-modal-xGkdgDcd.js", "booking-BcZ2p1qR.css"]);
const ID = "dpl_AnozFWGqnyaRVCeYgpnWwWMaNWo3";

/** Runs the plugin's generateBundle hook over a minimal bundle. */
function runPlugin(deploymentId: string, bundle: Record<string, unknown>) {
  const plugin = skewProtection(deploymentId);
  const hook = plugin.generateBundle as (
    options: unknown,
    bundle: Record<string, unknown>
  ) => void;

  hook.call(null, {}, bundle);
  return bundle as Record<string, { code?: string; source?: string }>;
}

/** A bundle shaped like a real build: a document, a boot chunk, a lazy chunk. */
function bundleFixture() {
  return {
    "index.html": {
      type: "asset",
      fileName: "index.html",
      source:
        '<script type="module" src="/assets/react-vendor-CE45KTfG.js"></script>',
    },
    "assets/react-vendor-CE45KTfG.js": {
      type: "chunk",
      fileName: "assets/react-vendor-CE45KTfG.js",
      code: "export const React = {}",
    },
    "assets/bootstrap-DIPujcji.js": {
      type: "chunk",
      fileName: "assets/bootstrap-DIPujcji.js",
      code:
        'o(()=>import(`./booking-modal-xGkdgDcd.js`),' +
        'm.f=["assets/booking-modal-xGkdgDcd.js","assets/react-vendor-CE45KTfG.js"])',
    },
    "assets/booking-modal-xGkdgDcd.js": {
      type: "chunk",
      fileName: "assets/booking-modal-xGkdgDcd.js",
      code: "export default null",
    },
  };
}

describe("pinReferences", () => {
  it("pins a dynamic import, whatever quotes it uses", () => {
    const code = 'import(`./booking-modal-xGkdgDcd.js`)';

    expect(pinReferences(code, LAZY, ID)).toBe(
      `import(\`./booking-modal-xGkdgDcd.js?dpl=${ID}\`)`
    );
  });

  it("pins an entry in the runtime dependency table", () => {
    const code = 'm.f=["assets/booking-modal-xGkdgDcd.js"]';

    expect(pinReferences(code, LAZY, ID)).toBe(
      `m.f=["assets/booking-modal-xGkdgDcd.js?dpl=${ID}"]`
    );
  });

  it("pins stylesheets as well as scripts", () => {
    const code = "m.f=['assets/booking-BcZ2p1qR.css']";

    expect(pinReferences(code, LAZY, ID)).toContain(
      `booking-BcZ2p1qR.css?dpl=${ID}`
    );
  });

  // The guard that makes a permissive pattern safe: a string that merely looks
  // like a filename is not one this build can serve, so it is left alone.
  it("leaves a filename this build did not emit untouched", () => {
    const code = 'fetch("https://example.test/vendor/analytics.js")';

    expect(pinReferences(code, LAZY, ID)).toBe(code);
  });

  it("never appends twice", () => {
    const once = pinReferences('import(`./booking-modal-xGkdgDcd.js`)', LAZY, ID);

    expect(pinReferences(once, LAZY, ID)).toBe(once);
  });
});

describe("collectEmittedFiles", () => {
  it("keeps scripts and stylesheets, by basename", () => {
    const emitted = collectEmittedFiles([
      "assets/app-a1b2c3d4.js",
      "assets/app-a1b2c3d4.css",
      "assets/logo-e5f6.svg",
      "index.html",
    ]);

    expect([...emitted].sort()).toEqual(["app-a1b2c3d4.css", "app-a1b2c3d4.js"]);
  });
});

describe("collectDocumentReferences", () => {
  it("reads what a document loads directly", () => {
    const referenced = collectDocumentReferences([
      '<link rel="modulepreload" href="/assets/react-vendor-CE45KTfG.js">' +
        '<link rel="stylesheet" href="/assets/bootstrap-mexxJRSQ.css">',
    ]);

    expect([...referenced].sort()).toEqual([
      "bootstrap-mexxJRSQ.css",
      "react-vendor-CE45KTfG.js",
    ]);
  });
});

describe("skewProtection", () => {
  it("pins a lazily-loaded chunk everywhere it is named", () => {
    const bundle = runPlugin(ID, bundleFixture());
    const code = bundle["assets/bootstrap-DIPujcji.js"].code ?? "";

    expect(code).toContain(`import(\`./booking-modal-xGkdgDcd.js?dpl=${ID}\`)`);
    expect(code).toContain(`"assets/booking-modal-xGkdgDcd.js?dpl=${ID}"`);
  });

  // The whole point of the narrower boundary: a chunk the document already
  // loads keeps its URL, so a returning visitor keeps it in cache across
  // deployments. One file must never end up under two URLs.
  it("leaves a chunk the document loads alone, in the table too", () => {
    const bundle = runPlugin(ID, bundleFixture());

    expect(bundle["assets/bootstrap-DIPujcji.js"].code).toContain(
      '"assets/react-vendor-CE45KTfG.js"'
    );
    expect(bundle["index.html"].source).not.toContain("?dpl=");
  });

  it("leaves documents untouched", () => {
    const original = bundleFixture()["index.html"].source;

    expect(runPlugin(ID, bundleFixture())["index.html"].source).toBe(original);
  });

  // Local builds, and any host that is not Vercel, must produce exactly what
  // they produced before this plugin existed.
  it("changes nothing without a deployment id", () => {
    const original = bundleFixture()["assets/bootstrap-DIPujcji.js"].code;

    expect(runPlugin("", bundleFixture())["assets/bootstrap-DIPujcji.js"].code).toBe(
      original
    );
  });
});
