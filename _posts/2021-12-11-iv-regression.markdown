---
layout: post
title:  "IV regression: econometrics is way crazier than you thought"
date:   2021-12-11 02:33:00 -0500
categories: econ econometrics
external: katex
---

The age-old question is: [correlation or causation](https://en.wikipedia.org/wiki/Correlation_does_not_imply_causation)? One can deduce from empirical data that the more years of education you get ($$X$$), the higher your earnings ($$Y$$) are likely to be. But how much of this effect is actually from education, and how much is from other factors ([confounding variables](https://en.wikipedia.org/wiki/Confounding))?
* Pre-existing socioeconomic class? If your parents are wealthier, you are more likely to be well-educated and also more likely to earn a lot.
* Natural ability? If you are naturally smarter, you are more likely to stay in school and also more likely to work in a skilled profession.

The first factor isn't too difficult to deal with, actually. We can *control for* parental income ($$W$$):

$$Y = \alpha + \beta X + \gamma W + e$$

We perform a [multiple linear regression](https://en.wikipedia.org/wiki/Linear_regression), which separates the effect of $$X$$ from the effect of $$W$$. Cool.

But the second variable is hard to quantify, let alone measure. What can we do? This is where [*instrumental variable regression*](https://en.wikipedia.org/wiki/Instrumental_variables_estimation), or IV regression, comes in.

No controls? No fear! IV regression allows you to tease out causal relationships, even when there are many confounding variables! (It's obviously more complex to apply in practice, and often the right conditions for an instrument don't exist, but when it does work, it's powerful.)

Let's introduce a new variable, called an *instrument*: the month in which you were born ($$Z$$). As it turns out, your birth month actually affects how many years of education you get! This is because in the US, there is a minimum age for dropping out of school (usually 16), and there is a date cutoff to determine your grade level (usually December 31). Thus, people born in January can drop out earlier than people born in December.

That's cool and all, but what about the earnings question? Here's the trick. The advantage of picking an obscure variable like birth month is that it's unlikely to have a causal effect on most things. In particular, it likely has no causal effect on earnings *other than* the effect it has through years of education!

So we run two regressions. We first find the effect of birth month on years of education. Then, we find the effect of birth month on earnings. And finally, we divide the two. The study that did this was [Angrist and Krueger (1991)](https://academic.oup.com/qje/article-abstract/106/4/979/1873496) (using quarter rather than month, but same idea): it has over 3000 citations!

(In practice, the [two-stage least squares method](https://en.wikipedia.org/wiki/Instrumental_variables_estimation#Interpretation_as_two-stage_least_squares) is a more robust method that can use multiple controls and instruments, but the method above gets the idea across.)

Other applications of the IV method, largely taken from Angrist and Krueger (2001) below:
* Duflo (2001): Want to find effect of *years of education* on *earnings*. Instrument: *region/time variation of school construction*
* Card (1995): Want to find effect of *years of education* on *earnings*. Instrument: *proximity to college*
* Angrist (1990): Want to find effect of *veteran status* on *earnings*. Instrument: *draft lottery number*
* Evans and Ringel (1999): Want to find effect of *maternal smoking* on *birth weight*. Instrument: *state cigarette taxes*
* Levitt (1997): Want to find effect of *police* on *crime*. Instrument: *electoral cycles*
* Klick and Tabarrok (2005): Want to find effect of *police* on *crime*. Instrument: *terrorist alerts*
* Levitt (1996): Want to find effect of *incarceration rate* on *crime*. Instrument: *prison overcrowding litigations*
* Figlio (2007): Want to find effect of (middle school) *classroom disruptions* on *learning outcome*. Instrument: *boys with names most commonly given to girls*

Further reading:
* [Angrist and Krueger (2001)](https://economics.mit.edu/files/18): an overview of IV regression by the legends themselves
