---
layout: post
title:  "One of the most satisfying Baba solves I've ever done"
date:   2022-01-30 15:56:00 -0500
categories: puzzle baba
---

I know I just posted about Baba Is You, but I couldn't pass up on writing about this level I just solved last night. The level was "The Return of Scenic Pond," which according to [Baba Is Hint](https://www.keyofw.com/baba-is-hint) is one of the absolute hardest levels in the game. (Not sure if I agree because I spent similar amounts of time on levels like Booby Trap and Parade, but it's definitely up there.) It took me maybe a total of 3 hours combined over many sittings, and I can safely say I got pretty lucky while experimenting, but it was still extremely satisfying to finally figure it out.

Here is the level.

![baba-level-meta-16](/assets/return-of-scenic-pond/The_Return_Of_Scenic_Pond.png){:width="100%"}
{:style="text-align: center;"}

## Spoiler alert: I will reveal the full solution below. This level is very far into the late stage of the game. The solution will reveal numerous mechanics that are better discovered in their own respective levels.
{:style="text-align: center;"}

Now let's get into it.

~
{:style="text-align: center;"}

This level is clearly a variation of Scenic Pond (Forest of Fall-D), although frankly I don't remember solving that level. So we'll start from scratch.

**Also, a note on notation: I will capitalize the first letter of a word when I'm referring to text of that word, e.g. Baba, and otherwise I'm referring to the character/object, e.g. baba.**

Notice that our goal is to eventually set Flag Is Win and then maneuver back down to the flag to complete the level. To do this, we have to get past both the water, which is Sink, and the skull, which is Sink and has wall (so if we sink in the skull, the wall will prevent us from going back).

My initial thought was to start clearing the water using Has. Normally, sinking things into water would destroy them, but by setting Baba Has Text and vice versa, we can preserve the number of objects that we have while simultaneously clearing the water. This is a central functionality of Has and has been used in numerous levels prior to this.

We can't immediately turn baba into text because then we'd have no babas left. We also can't set Text Is You, since Text Is Defeat. So to begin pulling this off, we have to set Text Has Baba and choose a piece of text to sacrifice (Keke seems like a good option). This allows us to clear an arbitrary amount of water.

![baba-level-meta-16-0.5](/assets/return-of-scenic-pond/The_Return_Of_Scenic_Pond-0.5.png){:width="100%"}
{:style="text-align: center;"}

![baba-level-meta-16-1](/assets/return-of-scenic-pond/The_Return_Of_Scenic_Pond-1.png){:width="100%"}
{:style="text-align: center;"}

Getting past the skull is tricky, though. I settled on trying to clear the water in such a way that there was a text that we could push into the skull. Assuming we have Text Has Baba set, this would sink the text and create a baba on top of the newly created wall. Since Stop only affects things moving *into* the object, this baba can just leave the wall. However, the baba can't actually create Flag Is Win because the wall blocks the baba from pushing the text. Bummer.

![baba-level-meta-16-2](/assets/return-of-scenic-pond/The_Return_Of_Scenic_Pond-2.png){:width="100%"}
{:style="text-align: center;"}

![baba-level-meta-16-3](/assets/return-of-scenic-pond/The_Return_Of_Scenic_Pond-3.png){:width="100%"}
{:style="text-align: center;"}

Now, I started thinking about the corner of the map I'd just been completely ignoring up to this point: the Is Float. I'm sure I tried to work with it before, but I probably couldn't figure out what to do about it, since you can't push any text into the fenced area due to the placement of the wall near the entrance. But at this point, I realized that using the same trick as above, we can sink a baba in the water and get a Baba (text) that creates Baba Is Float. This allows us to simply float above the water and the skull to create Flag Is Win! But we can't even go onto the flag because we're still floating!!! And there doesn't appear to be a way to break the Baba Is Float text. So maybe it was just a red herring after all?

![baba-level-meta-16-3.5](/assets/return-of-scenic-pond/The_Return_Of_Scenic_Pond-3.5.png){:width="100%"}
{:style="text-align: center;"}

I'll note here that Arvi's level design style makes it so that levels *never* have extra text. So that Is Float must be there for something. I thought it might just be there to replicate Scenic Pond and that I was meant to use the text for some other purpose.

Around this point I did think about setting Text Has Baba and pushing the Is (of the Is Float) into the water to create a new baba. This combined with the previous idea could give us three babas, which I experimented with a bit. I also considered the possibility that we wanted to keep both Baba and Keke, so that we could set Baba Is Float and later set Keke Is You and reach the flag that way. Neither of these ideas got very far, though, because it was no longer possible to get past the water and the skull.

![baba-level-meta-16-4](/assets/return-of-scenic-pond/The_Return_Of_Scenic_Pond-4.png){:width="100%"}
{:style="text-align: center;"}

![baba-level-meta-16-5](/assets/return-of-scenic-pond/The_Return_Of_Scenic_Pond-5.png){:width="100%"}
{:style="text-align: center;"}

So now I was out of ideas. I knew the level was supposed to be really difficult, so I thought about what fancy tricks Arvi might have up his sleeve. One thing I remember being really impressed by was the idea of overlapping text: levels like Queue completely blew my mind, and I had been waiting excitedly for more opportunities to try overlapping text. This idea also seemed doubly promising because it gave me the potential to increase the total number of objects, which would expand the possibilities a significant amount (such as being able to have both a baba and a keke while maintaining most of the original text).

My first idea was to overlap Baba and Keke, since this would allow me to set Baba and Keke Is You simultaneously. I had no idea how this would work, but I thought it had to do with setting Baba Has Text and Keke Has Text alternately while sinking them both into water at some point. This idea didn't end up going anywhere, but I was determined to figure out at least one way to overlap text.

I can't say that I figured out a lot by sheer willpower, though. The main benefit of really wanting to see text overlap is that I stuck with the idea for a long time instead of dismissing it. And eventually, the miracle came while I was experimenting with the two Babas, one Keke situation. I was messing around with setting Baba Is You and Keke Is You when something weird happened: I accidentally set Baba Is You while one of the babas was underneath a piece of text, and that baba instantly got destroyed.

**And that is when I realized that Text Is Defeat was where Arvi was hiding his tricks. Because if I had set Baba Has Text, then I would've gotten two pieces of overlapping text.**

The only question remaining was which piece of text to overlap with Baba, but this became clear pretty quickly. See, I was still thinking about how to break Baba Is Float, and I realized that the only way to do it would be to get a character underneath one of the pieces of text so that it could push the rest away. The natural solution was then to overlap Baba and Text so that I could set Baba Has Baba/Text simultaneously.

At this point, the level was basically done for. There were a few other things to figure out, but they mostly mirrored previous levels' tricks: for example, to get text on top of a baba, I had to create two babas and use one of them to push text onto the other. But the solution came quickly and I was very happy.

![baba-level-meta-16-6](/assets/return-of-scenic-pond/The_Return_Of_Scenic_Pond-6.png){:width="100%"}
{:style="text-align: center;"}

![baba-level-meta-16-7](/assets/return-of-scenic-pond/The_Return_Of_Scenic_Pond-7.png){:width="100%"}
{:style="text-align: center;"}

![baba-level-meta-16-8](/assets/return-of-scenic-pond/The_Return_Of_Scenic_Pond-8.png){:width="100%"}
{:style="text-align: center;"}

![baba-level-meta-16-9](/assets/return-of-scenic-pond/The_Return_Of_Scenic_Pond-9.png){:width="100%"}
{:style="text-align: center;"}

Two more levels left until I complete the main levelpack of Baba Is You.
