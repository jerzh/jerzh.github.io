My personal website.

To serve locally:
```bash
npx webpack  # compile javascript with webpack
wasm-pack build wasm/domain-coloring  # compile rust-wasm
bundle exec jekyll serve
```

Note that this project used to use Babel for transpiling JSX into plain JS, but the
TypeScript compiler is also able to handle JSX, so Babel is no longer necessary.
