---
layout: post
title:  "The website is up :)"
date:   2021-12-08 22:50:00 -0500
categories:
---
I figured out how to install Ruby (with `rbenv`) and get Jekyll to properly serve the site! Wow, the site looks nice.

A bit of background is in order. Aside from being about me, I want this site to be an *infodump*, in the sense of being a receptacle for anything pertaining to my interests that I encounter or create. I find interest in many things, and there isn't much I can do about it, so I thought I might make this information as publicly accessible as possible. There are also a fair amount of idiosyncratic documents and spreadsheets I have that I think would be entertaining for people to look at.

The current plan is to host the website on GitHub Pages, which uses Jekyll. I haven't worked with Jekyll much before, so I'll be learning as I go.

For reference, if anyone is in the same situation as I was: Installing Ruby on the M1 Mac is a bit of a hassle because of the different architectures (x86 & ARM). [This blog post](https://www.shouvikbasak.net/website/jekyll-on-macos-apple-m1-solved/) helped me a lot. The main thing I had trouble with was that I installed `rbenv` using my x86 version of Homebrew (`/usr/local/bin/brew`), but `readline` is apparently installed on ARM, so it kept throwing nonsensical errors. The solution was to install `rbenv` using the ARM version of Homebrew (`/opt/homebrew/bin/brew`).

Also, I'm using Ruby 3.0.3, so in order to run `bundle exec jekyll serve`, [I had to add Webrick](https://github.com/jekyll/jekyll/issues/8523) (`bundle add webrick`).
