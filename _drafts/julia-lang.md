---
layout: post
title:  "The wonderful Julia programming language"
categories: cs software
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

function best_exchange_overall(distribution_centers)
    argmin(d -> worst_drive_time(d), [best_exchange(distribution_centers, i) for i=1:10])
end

function greedy_search(distribution_centers)
    orig = copy(distribution_centers)
    while true
        best = best_exchange_overall(orig)
        Set(best) != Set(orig) || break
        orig = copy(best)
    end
    orig
end
```

This was my entire homework assignment in around 15 lines of code, not including the function definitions. You might notice a builtin `argmin`, which I am just obsessed with. There's also `minimum.`, which broadcasts the `minimum` function across an entire array. You may notice as well that there are no `return` statements; that's because Julia automatically returns the last expression in the function.
