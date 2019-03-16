# Contributing

First of all, thanks for taking the time to contribute to Kauri! 🎉 Your help
is very much appreciated.

This guide will walk you through the process of making contributions to the
[Kauri GitHub repository](https://github.com/sean0x42/kauri). Please follow this
guide whenever you make a contribution to this project.


## Contributing on GitHub

> **Note:** If you've contributed to a repository on GitHub before, then you can
> safely skip this section, and move onto the repository specific discussion.
> In particular, check out the [Branching Model](#branching-model) section.

You'll first want to clone the repo to your GitHub account.

![Imgur](https://i.imgur.com/IeiKED6.png)


## Branching Model

Our approach to branching is heavily inspired by the branching model outlined in
Vincent Driessen's [A Successful Git branching
model](https://nvie.com/posts/a-successful-git-branching-model/?). Here's what
you need to know: there are two primary, protected branches.

 - `master`: contains the most recent release version of Kauri.
 - `develop`: contains current feature work, and development for the next major
   release.

Unless you're writing a bug fix for something in `master`, then `develop` is
definitely the place to start.

Once you begin making contributions, you can either work directly from the
target branch (not recommended), or create a new one. The name of the branch
doesn't really matter, but the Kauri maintainers will always use this approach:

 - **Feature branches**: Titled `feature-{feature name}`, and contain a single
   feature. They must branch off of `develop`.
 - **Hot fix branches**: Titled `hotfix-{fix name}`, and contain one or more
   closely related hot fixes for the release version of Kauri. Hot fixes must
   branch off of `master`, and will bump the project's patch version.
 - **Release branches**: Titled `release-{version}`, and bump the major or minor
   version of the project. *Only project maintainers will need to create these
   branches*.
