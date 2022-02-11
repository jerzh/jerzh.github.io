---
layout: post
title:  "Added a way to include custom JS frameworks"
date:   2022-02-10 22:12:00 -0500
categories: status
---

I actually did this a few weeks ago but might as well write a post about it now. Essentially, what I did is add a new Jekyll variable to each page I create that stores the names of JS frameworks that I want to include. So for example, in the YAML header of `blog.md` I put:
```markdown
---
...
external: d3
---
```
We want to pass the variable `external` to the `head.html` include file. To do this, we edit the include statement in `default.html` as follows:

{% raw %}
```html
{%- include head.html -%}
```

```html
{%- include head.html external=page.external -%}
```

and then in `head.html` we just need:

```html
{%- if include.external contains 'd3' -%}
  <!-- D3.js -->
  <script defer src="https://d3js.org/d3.v7.min.js"></script>
{%- endif -%}
```
{% endraw %}

The `defer` tells the script to execute after the HTML is finished loading so that a user can see the content even with slow internet.

Anyway, that's about it. I've added statements like this for KaTeX, D3, and React so far.

Development notes:
* [Found out](https://talk.jekyllrb.com/t/how-to-escape-in-markdown/4173) that you have to wrap Jekyll templating code in `raw`/`endraw` tags. I mean, of course you do, but I was wondering why my post suddenly had 2000 words.
