---
layout: post
title:  "Pretty pictures in parameter estimation"
date: 2023-07-26 00:21:00 -0500
categories: math stats
external: katex
---

People keep asking me what exactly it means for statistics to be non-asymptotic, so I've decided to post my explanation here, and at the same time show just how cool this subject is. I think that out of all the classes I've taken at MIT, my two favorites have been 6.780 (formerly 6.437, Inference and Information) and 18.656 (Non-Asymptotic Statistics), and both for a pretty similar reason -- they build a strong intuitive base for understanding stats, and they feature pretty pictures.

Stats is all about estimating models. You have some data, and you want to know something about what the underlying mechnaism generating the data might be. It's important to discuss the distinction between *inference* and *prediction* here: prediction is about predicting the outcome with maximal accuracy, while inference deals with understanding the data generation process, particularly whether your model's assumptions hold and how accurate your estimates are for the model parameters. For example, what matters for prediction is only whether the predictive method *works*, not whether the model used is the "truth" (for some definition of truth). This is why linear regression is so common as a prediction tool, since most functions are approximately linear near a point, but this tells you nothing about the underlying data generation process.

Prediction is to inference as machine learning is to statistics. When running a machine learning algorithm, an overparameterized function (composed of successive [ReLUs](https://en.wikipedia.org/wiki/Rectifier_(neural_networks)) or similar) is fit to the data that has a good ability to predict the output. In theory, if we took the hypothesized underlying model to be successive ReLUs, then this approach would be equivalent to inference. But since successive ReLUs are *designed* to be overparameterized enough to fit any function anyway, using this as the underlying model tells us nothing about whether our data seems to fit anything meaningful.

Anyway, back to statistics. Let's pull out a demonstrative example.

# Non-asymptotic bounds on mean estimation

Suppose we have $$n$$ samples of some random variable $$X_1, \dots, X_n$$. We hypothesize that this random variable has distribution of the form $$F(\mu)$$, which is a known distribution parameterized by $$\mu$$, and furthermore, suppose that we know $$\mathbb{E}[F(\mu)] = \mu$$ and $$\operatorname{Var}[F(\mu)] = \sigma^2$$ for some constant $$\sigma$$. (The prototypical example is $$\mathcal{N}(\mu, \sigma^2)$$.) We want to estimate the value of $$\mu$$.

Intuitively, the mean of the data is probably a good estimate of the distribution mean. In other words, we can use the estimator $$\hat{\mu} = \frac{1}{n} \sum_{i=1}^n X_i$$. How do we know whether this is a good estimate? Or in statistical terms, can we estimate a 90% confidence interval (in 90% of experiments, $$\mu$$ is in this interval)?

To do this, we're interested in the distribution of $$\hat{\mu}$$. Our best friend here is the (Lindeberg–Lévy) [central limit theorem](https://en.wikipedia.org/wiki/Central_limit_theorem), which tells us that **asymptotically**, as $$n \to \infty$$, the distribution of $$\hat{\mu}$$ approaches $$\mathcal{N}(\mu, \frac{\sigma^2}{n})$$ (technically we should say $$\sqrt{n} (\hat{\mu} - \mu) \xrightarrow{d} \mathcal{N}(0, \sigma^2)$$ where the arrow denotes [convergence in distribution](https://en.wikipedia.org/wiki/Convergence_of_random_variables#Convergence_in_distribution)). So in theory, for large enough $$n$$, we can treat $$\hat{\mu}$$ as having variance $$\frac{\sigma^2}{n}$$ and construct 90% confidence intervals that way. This method is traditionally used in **asymptotic** statistics, and for most cases with large $$n$$, it works great.

The issue with any asymptotic analysis is that it's completely useless for small $$n$$ (or equivalently, for high dimensions), where the CLT doesn't really come into effect. For that matter, if we really want to be rigorous, we should try and understand the *rate of convergence* of the CLT anyway, since no part of the theorem actually says at what scale of $$n$$ the asymptotic normality will become useful. $$10^2$$? $$10^4$$? So then, the field of non-asymptotic statistics is manifested into existence.

For our toy problem here, we want a way to analyze the distribution of sample means that provides *exact* bounds, even if they are not tight. The answer comes in the form of a property of distributions called sub-Gaussianity.[^1] For some motivation, notice that analyzing the sum of *independent* random variables is much easier when considering their [moment generating functions](https://en.wikipedia.org/wiki/Moment-generating_function), since their MGFs just get multiplied (this is a standard method in statistics, and actually CLT can be proven using a similar concept, [characteristic functions](https://en.wikipedia.org/wiki/Characteristic_function_(probability_theory))). Thus, if we define sub-Gaussianity as a condition on MGFs, we can easily extrapolate results on sums of random variables. Precisely, the sub-Gaussianity condition with constant $$\sigma$$ is:

[^1]: The definition of sub-Gaussianity I learned in class is slightly different from the Wikipedia definition, which we call sub-exponential.

$$\mathbb{E}[e^{\lambda (X - \mu)}] \le e^{\frac{\sigma^2 \lambda^2}{2}}$$

for all $$\lambda$$. In other words, sub-Gaussian distributions have MGFs upper bounded by the MGF of the normal distribution. In many ways, the behavior of sub-Gaussian distributions can be extrapolated from normal distributions: the sum of sub-Gaussians is also sub-Gaussian, and the expected maximum of sub-Gaussians has the same bound as the normal distribution, $$\sqrt{2 \sigma^2 \log n}$$.

So what about the confidence interval problem that we set out to resolve? We now have the tools to form a *concentration bound* on $$\hat{\mu}$$, i.e. an inequality bounding the probability of $$\hat{\mu}$$ being in a certain interval. Specifically, since $$\hat{\mu}$$ is sub-Gaussian with constant $$\frac{\sigma^2}{n}$$, we can show the concentration bound

$$\mathbb{P}\left[ |\hat{\mu} - \mu| \ge t \right] \le 2e^{-\frac{nt^2}{2\sigma^2}}$$

(intuitively, $$\hat{\mu}$$ has smaller tails than a normal distribution), and voilà. A true confidence interval $$[\hat{\mu} - t, \hat{\mu} + t]$$.

What's nice about non-asymptotic statistics besides slightly more accurate concentration bounds? Actually, pretty much everything, in my opinion. It's an entirely better way to understand statistics, even if it loses some of the simplicity of asymptotic analysis, because a lot of results are just much more strongly motivated when you see all of the mathematical structure surrounding them. (The primary example in this section being the central limit theorem, which seems much more motivated when MGFs come into play.) Plus, the flexibility of non-asymptotic analysis invites the exploration of arbitrarily complex statistical situations, such as nonparametric regression (function estimation) under arbitrary constraints -- another subtopic that I have found absolutely beautiful.

# Non-asymptotic bounds on nonparametric regression

Suppose we have a set of candidate functions $$\mathcal{F}$$ (i.e. linear models) and an unknown true model $$f^* \in \mathcal{F}$$. We fix some inputs $$x_i$$ for $$1 \le i \le n$$, and we then observe $$y_i = f^*(x_i) + \eta_i$$, where $$\eta_i \sim \mathcal{N}(0, \sigma^2)$$ is a random error term. Define the *nonparametric least-squares estimator* $$\hat{f}_n$$ as the function $$\hat{f}_n \in \mathcal{F}$$ minimizing

$$\Vert \hat{f}_n - y \Vert_n^2 = \frac{1}{n} \sum_{i=0}^n (\hat{f}_n(x_i) - y_i)^2.$$

What can we say about the estimation error, i.e. $$\Vert \hat{f}_n - f^* \Vert_n^2$$? As it turns out, quite a lot. The main theorem of this section states that

$$\mathbb{P}\left[ \Vert \hat{f} - f^* \Vert_n^2 \ge 16t \right] \le e^{-\frac{nt}{2\sigma^2}},$$

as long as $$\mathcal{F}$$ is star-shaped around $$f^*$$ (a relatively general condition, i.e. if $$\mathcal{F}$$ is convex, then it's star-shaped around every point) and $$t \ge \delta_n^2$$, where $$\delta_n$$ is called the *critical radius* and depends on a local complexity measure of $$\mathcal{F}$$ around $$f^*$$.

The proof of this theorem is fairly involved, and I don't feel like replicating it here (see Theorem 13.5 of *High-Dimensional Statistics: A Non-Asymptotic Viewpoint* by Martin Wainwright). I should make a few points though. Despite this result being a vast generalization of the one above, I hope you can see patterns starting to emerge already with how the two results are defined and structured. This reflects my experience studying non-asymptotic statistics -- all the topics feel interconnected, and you find yourself using the same results over and over again (sub-Gaussanity, Holder's inequality, Chernoff bound) and really gaining an appreciation for how important they are.

Here is the Chernoff bound:

$$\mathbb{P}\left[ X \ge t \right] \le \min_\lambda \frac{\mathbb{E}[e^{\lambda X}]}{e^{\lambda t}}.$$

Notice that the numerator is the MGF (in fact, the bound itself uses the [Legendre transform](https://en.wikipedia.org/wiki/Legendre_transformation) of the log MGF). With respect to the Chernoff bound especially, I can't empahsize enough how differently I conceptualized it between 6.046 (Algorithms) and this class. In 6.046, I just memorized special cases of the bound and could not remember it for the life of me, but now I think of the Chernoff bound as the foundation of *all* exponential concentration inequalities in the entirety of statistics (because it is). To my understanding, it's also the backbone of the entire field of [large deviations theory](https://en.wikipedia.org/wiki/Large_deviations_theory). And the proof is a super simple extension of Markov's inequality:

$$\mathbb{P}\left[ X \ge t \right] \le \frac{\mathbb{E}[X]}{t}$$

by sending $$x \mapsto e^{\lambda x}$$. In a sense, we've thus reduced all of statistics down to Markov's inequality (mod a couple of neat tricks along the way, like Dudley chaining -- see below). The concept feels analogous to how every algebraic inequality boils down to the trivial inequality.

I promised some pretty pictures, but because it's getting late I'll defer the inclusion of these pictures to a later date. Note to self: add diagram of projection and maybe critical radius stuff. Also will hopefully write another post on 6.437.

Further reading:
- Sparse estimation, particularly sparse signal processing
- Applications of random matrix theory to statistics, i.e. low rank matrix estimation
- Dudley chaining, a crazy technique for bounding function estimation error using covering numbers (literally how many $$\delta$$-balls it takes to cover $$\mathcal{F}$$)
- [Statistical learning theory](https://en.wikipedia.org/wiki/Statistical_learning_theory) > [Vapnik-Chervonenkis theory](https://en.wikipedia.org/wiki/Vapnik%E2%80%93Chervonenkis_theory)
