My personal website.

To serve locally:
```bash
npm run build
npm run serve
```
You may also have to run `chmod +x build.sh` to give executable permissions for
`build.sh`.

Note that this project used to use Babel for transpiling JSX into plain JS, but the
TypeScript compiler is also able to handle JSX, so Babel is no longer necessary.
