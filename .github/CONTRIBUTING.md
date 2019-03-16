# Contributing

First of all, thanks for taking the time to contribute to Kauri! 🎉 Your help
is very much appreciated.

This guide will walk you through the process of making contributions to the
[Kauri GitHub repository](https://github.com/sean0x42/kauri). Please follow this
guide whenever you make a contribution to this project.


## Contributing on GitHub

> **Note:** If you've contributed to a repository on GitHub before, then you can
> safely skip this section, and move onto the repository specific discussion.
> In particular, check out the [Branching Model](#branching-model) and
> [Versioning](#versioning) sections.

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


### Features

Feature development should be added in a branch titled `feature-{feature name}`,
referred to herein as *feature branches*. Feature branches **must** branch from
`develop`, and should contain work for a single feature.


### Hotfixes

If you're patching a bug within the release version of Kauri, then you'll want
to create a *hotfix branch*. These branches should be titled `hotfix-{fix name}`,
and **must** branch from `master`. Unlike feature branches, hotfix branches may
have one or more closely related fixes within. Please do not try to smuggle
features in alongside hotfixes.

Hotfixes will also bump Kauri's patch version. This is usually a straightforward
process, but if you get lost, the project maintainers will be more than happy to
bump it for you. See [Versioning](#versioning) for more on versioning Kauri.


### Releases

> **Note**: Only project maintainers will ever need to create release branches.

*Release branches* are used to bump either the major or minor versions of the
project. Which type of version is bumped depends on the features that have been
added to `develop`, and should be agreed upon by the project lead (Sean Bailey).

These branches are titled `release-{version}`, and merge from `develop` into
`master`. When the merge has been complete, be sure to tag the merge commit with
the version name, and add a release on GitHub. More detail can be found in the
[versioning](#versioning) section.


## Versioning

Wherever possible, Kauri conforms to the versioning spec outlined in
[Semantic Versioning](https://semver.org/).
