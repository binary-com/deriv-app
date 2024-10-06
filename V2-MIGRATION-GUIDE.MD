# Purpose of this guide

This is guide for developers who want to migrate their packages to V2. 
Explains general concepts and ideas.

Further improvements in technology welcome. 
**Everything is documented "as is", definitely it's not final state. **

# Why?

As it have been proven over time, previous approach (mobx, massive stores) is not suitable for large-scale application. 
Also, amount of accumulated tech debt, is simply too much to reasonably refactor, so its justified to rewrite stuff entirely. 

# Main differences
Main differences between legacy and new patterns:
- **MobX is not allowed**. Unfortunatelly, functions used by MobX do not work well with large application (especially "observer" have prooven to generate massive problems - it works beutifully in small apps, but its not great for large ones)
- **Redux stores are no longer in use** Wallets do not use Redux anymore, in favour of hooks. 
- **Use hooks** use hooks for data handling and processing
- **React-query for data handling** use react query for server interaction


# Handbook

The recommended approach is to choose the most recent and clean -v2 package. Copy it over and rename. 
Then strip out of anything unnecessary. As of Mar'23, recommended package is cashier-v2 to base new ones of (though its completely fine to start from others if there are resons for it). 

# Engineering principles / compass / north star:

The below are based on observations of what is missing. 

This is not complete set of engineering rules and principles and design patters. 
This is merely subjective selections of ones I found particularly useful within deriv-app.

* KIS (Keep It Simple): the most important one, above all. Code is being read way more often than its being written, so it's important for it to be readable and maintanable.
* SOLID: set of general principles applicable in all application, to support maintanability, healthy architecture and avoid spaghetti (https://en.wikipedia.org/wiki/SOLID)
  * example: client-store.js does not follow **Single responsibility** and contains hundreds of features ("responsibilities") in one massive > 100kB large file. Which obviously its very hard to maintain. Following **Single responsibility** rule would prevent it from growing out of control and aggregating so much tech debt in it.
* Zen Of Python: set of 19 rules of clean code, originating from Python, but almost all rules are universally applicable. Mainly about clean-code, and less about architecture/design like SOLID.
* Loose coupling: very important one. Components, packages, repositories should only "talk" with each other through established interfaces and apart from those established interfaces, should be isolated as much as possible. Lack of loose coupling is main source of spaghetti. https://en.wikipedia.org/wiki/Loose_coupling
* DDD: domain drive design. With that in mind, code structure represents objects/UI structure (sometimes at the cost of duplication). So it's extremely easy to read - if you know product, you already know the code structure. By learning code structure, you're actually learning the product. Makes everything way easier.
* Flat is better than nested: keep inheritance depth low (or avoid inheritance completely, )

# Data handling

Use hooks and customised react-query. 
Ideally, hooks should return pure data models. 

https://tanstack.com/query/latest

Common pitfalls:
- useQuery, useMutate which are within our hooks, are not the same as original react-query ones, so behaviour might differ 

# Testing

Every feature should be tested one way or the other. 
It's up to developer to decide which tests should be used for given case - e2e, component or unit, as long as all the features have nice coverage. 
For more info, recorded knowledge sharing session + presentation here:
https://drive.google.com/drive/folders/1XOCreZ6Zfd0uyh-Xmm6ux2_ak1Cqo2Hw?usp=drive_link

All the informations should be within the above presentation. But to reiterate very briefly:
- unit tests are the default ones. They are easy to write and quick to execute, so feel free to add as many as you need
- e2e tests are the slowest, and they are in separate repository, and they use actual backend (which makes them prone to flakiness), so use as a last resort in a daily work

## Css patterns:
Use BEM - Block Element Modifier
Its common pattern and very easy to understand and maintain. There are plenty of resources online, starting from: https://en.bem.info/methodology/quick-start/#:~:text=BEM%20(Block%2C%20Element%2C%20Modifier,code%20without%20copying%20and%20pasting.

Main idea is to have a block, which is a component, and then elements inside it. For example:
```
<div class="block">
  <div class="block__element"></div>
  <div class="block__element"></div>
</div>
```
Then you can have modifiers, which are used to change the look of the block or element. For example:
```
<div class="block block--modifier">
  <div class="block__element block__element--modifier"></div>
  <div class="block__element"></div>
</div>
```

Common pitfalls of BEM:
- Components needs to be isolated, so if I change component A, component B shouldn't be affected at all. Thats why its not allowed to reuse classes between different components, as that would created tight coupling between them.
- BEM only allows one level of nesting. So you can't have a block inside a block. Thats to keep cognitive load low and make it readable and maintanable.
- size of components should be set by parent component, same about margins (except from icons, badges etc which does have constant size)

# FAQ
- what if I need to use store?
  * you can't.
- what if I *really* need to use store?
  * re-implement necessary logic within your package and don't use store
  * if re-implementing not viable, make explicit data synchronisation e.g. via special class responsible for synchronisation. So all the bad code interacting with old store is in one place and easy to remove.
  * under no circumstances, DO NOT attempt to synchronise code using non-explicit ways, like global variables, local storage, session etc. There should be zero coupling between old, core packages and new -v2 (as ultimate goal is to completely move away from core)
