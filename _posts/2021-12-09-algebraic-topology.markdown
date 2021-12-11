---
layout: post
title:  "Why algebraic topology is my favorite field of math"
date:   2021-12-10 17:54:00 -0500
categories: math algtop
---

Ever wondered what field of math you should study? Say no more.

Here's a bit of motivation. [Topological spaces](https://en.wikipedia.org/wiki/Topology) are fun to think about, but how do you work with them in practice? Formal definitions of topologies can get clunky sometimes. Enter algebraic topology.

How do you tell the difference between a circle and a line? Well, a circle has a nontrivial loop (closed path). You can walk around the circle. A line, in contrast, has no nontrivial loops; any loop is equivalent (can be continuously deformed) to not going anywhere at all.

This idea naturally leads to a group structure on any topological space $$X$$. Fix an arbitrary point $$x \in X$$ (the choice ends up not mattering). The elements of the group are loops starting and ending at $$x$$ mod continuous deformation. The group operation is combining two loops by walking along one and then the other. This group is called the [*fundamental group*](https://en.wikipedia.org/wiki/Fundamental_group) and denoted $$\pi_1(X)$$. Voilà: an algebraic invariant!

This idea can be generalized to higher [*homotopy groups*](https://en.wikipedia.org/wiki/Homotopy_group) $$\pi_n(X)$$ (loops are like maps $$S_1 \to X$$, so consider maps $$S_n \to X$$). It can also be "abelianized" to get the [*homology groups*](https://en.wikipedia.org/wiki/Homology_(mathematics)) $$H_n(X)$$. These give rise to separate but related fields of algebraic topology: [homotopy theory](https://en.wikipedia.org/wiki/Homotopy_theory) and [homological algebra](https://en.wikipedia.org/wiki/Homological_algebra). The two fields are extremely deep and complex, but here is a bit of my personal intuition to distinguish them:
* Homotopy theory concerns continuous deformations to the max. Have you ever considered continuous deformations *of* continuous deformations?
* Homological algebra turns everything commutative, which essentially breaks things into pieces that can be jumbled around. Imagine breaking a loop into little pieces and considering the set of all possible pieces across all loops.

It's easier to work with homology than homotopy, but it retains less information about the original space. For instance, the [Whitehead theorem](https://en.wikipedia.org/wiki/Whitehead_theorem) says that if a map of topological spaces induces isomorphsims on all homotopy groups, then it must be a homotopy equivalence (almost an equivalence). No such theorem exists for homology.

Homological algebra appears in many contexts: see
* [sheaf cohomology](https://en.wikipedia.org/wiki/Sheaf_cohomology)
* [group cohomology](https://en.wikipedia.org/wiki/Group_cohomology)
* [étale cohomology](https://en.wikipedia.org/wiki/%C3%89tale_cohomology)
* [de Rham cohomology](https://en.wikipedia.org/wiki/De_Rham_cohomology)

Homotopy theory has connections with [higher category theory](https://en.wikipedia.org/wiki/Higher_category_theory).

Further reading:
* Evan Chen - [*An Infinitely Large Napkin*](https://web.evanchen.cc/napkin.html), parts XV and XVII (where I first learned algebraic topology)
* Allen Hatcher - *Algebraic Topology*
* James Munkres - *Elements of Algebraic Topology*

Interesting concepts and theorems:
* [Hairy ball theorem](https://en.wikipedia.org/wiki/Hairy_ball_theorem): you can't comb a hairy ball in an odd number of dimensions
* [Brouwer fixed-point theorem](https://en.wikipedia.org/wiki/Brouwer_fixed-point_theorem): anytime you mix a cup of coffee, at least one molecule doesn't move
* [Borsuk-Ulam theorem](https://en.wikipedia.org/wiki/Borsuk%E2%80%93Ulam_theorem): there are always two points on opposite sides of the Earth with the same temperature and air pressure
* [Poincaré duality](https://en.wikipedia.org/wiki/Poincar%C3%A9_duality): homology and cohomology are closely related for oriented closed manifolds

Development notes:
* [Setting up KaTeX](https://codewrites.me/jekyll/katex/blog/2020/08/26/use-katex-gh-pages/) (failed attempts [1](https://varunagrawal.github.io/2018/03/27/latex-jekyll/) [2](https://xuc.me/blog/katex-and-jekyll/) [3](https://gendignoux.com/blog/2020/05/23/katex.html#katex-integration-in-the-browser) - these all either used to work or work in other environments, but not GitHub Pages)
* [Overriding theme CSS](https://tomkadwill.com/2017/12/16/how-to-override-css-styles-in-jekyll.html)
* [Customizing header and footer](https://www.eliascarter.ca/2021/09/11/customizing-jekyll-header-and-footer.html)
* I find it hilarious that nearly every blog I've looked at so far has had the Jekyll Minima theme. Maybe I'll consider changing the theme of this blog.
