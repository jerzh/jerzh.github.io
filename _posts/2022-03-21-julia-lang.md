---
layout: post
title:  "The wonderful Julia programming language"
short_title: "The wonderful Julia language"
date:   2022-03-21 01:14:00 -0400
categories: cs software
external: katex
---

I'm not any kind of programming language expert, so I don't know exactly how to describe Julia, but I do know that I really loved using it as soon as I had to learn it for my analytics class. I hope that everyone who loves functional programming in Python appreciates the beauty of this block of code:

```julia
function worst_drive_time(distribution_centers)
    maximum(minimum.(eachrow(driving_times[!, distribution_centers])))
end

function best_exchange(distribution_centers, index)
    reduced = deleteat!(copy(distribution_centers), index)
    search = filter(h -> !(h in reduced), hospitals)
    best = argmin(h -> worst_drive_time(vcat(reduced, [h])), search)
    vcat(reduced, [best])
end
```

This was half of my homework assignment in 5 lines of code. You might notice a builtin `argmin`, which I am just obsessed with. There's also `minimum.`, which broadcasts the `minimum` function across an entire array. You may notice as well that there are no `return` statements; that's because Julia automatically returns the last expression in the function.

I also think it's cute that functions that modify their input end in `!`. Because why not add a bit of spice into your life.

Anyway, after having gotten used to working with Python over the last few years, I was expecting the program to take a while to run. I love Python, and I often use builtins that are compiled into C anyway, but sometimes the slowness gets to me nonetheless. But contrary to my expectations, the entire algorithm ran in 2 seconds. I'm not sure exactly how many computations were done, but I was definitely happy about the result, and I hear that Julia is supposed to be almost as fast as C.

That's all I wanted to say. I will be looking to learn more Julia in the future for sure.

Further reading:
* [Julia language official site](https://julialang.org/)
* [Julia on GitHub](https://github.com/JuliaLang/julia)
* Docs for specific packages: [JuMP](https://jump.dev/JuMP.jl/stable/), [Plots](https://docs.juliaplots.org/latest/), [DataFrames](https://dataframes.juliadata.org/stable/)
