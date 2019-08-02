# Contributing

First of all, thanks for taking the time to contribute to Kauri! 🎉 Your help
is very much appreciated.

This guide will walk you through the process of making contributions to the
[Kauri GitHub repository](https://github.com/sean0x42/kauri). Please follow this
guide whenever you make a contribution to this project.


## Step-By-Step Instructions

If you follow the instructions laid out below, it makes everyone's lives a
little easier, and will improve the speed with which your pull requests can be
reviewed!

 1. **Fork the repo**: You can learn more about forking repositories in [this
    GitHub Help article](https://help.github.com/en/articles/fork-a-repo), or
    you can just get started at: <https://github.com/sean0x42/kauri/fork>.

 2. **Clone**: Cloning will download the repository to your file system. You can
    learn how to do that [here](https://help.github.com/en/articles/cloning-a-repository).
    ![Clone button](https://help.github.com/assets/images/help/repository/clone-repo-clone-url-button.png)

 3. **Create a branch**: Please use *one* branch per feature/bug fix. You can
    learn more about our branching model by reading Vincent Driessen's [A
    Successful Git branching model](https://nvie.com/posts/a-successful-git-branching-model/?).

    > **Note**: do not include the angle brackets (`<` and `>`) in your branch
      name.

      * For feature branches:
        ```
        git checkout -b feature-<feature-name> develop
        ```

      * For hotfixes (bug fixes for the production version of Kauri):
      	```
      	git checkout -b hotfix-<hotfix-name> master
      	```

    If it's been a while since you cloned the repository, be sure to pull the
    latest changes into `master` or `develop` *before* creating your new branch.
    ```
    git checkout master
    git pull
    ```

 4. **Make your changes**: Now you can safely make your changes!

 5. **Run linters**

     * For JavaScript contributions, simply run prettier:
       ```
       yarn clean
       ```
     * For Rust contributions, you'll need to run clippy and rustfmt:
       ```
       cargo fmt --all
       cargo clippy
       ```

 6. **Stage and commit**: Please write a meaningful commit message which
    summarises what you've done. You can always go into more detail in the
    commit description.

    You can learn more about writing great commit messages by reading through
    [these conventions](https://gist.github.com/robertpainsi/b632364184e70900af4ab688decf6f53#file-commit-message-guidelines-md).

    ```
    git add *
    git commit -m "Made a meaningful change"
    ```

 7. **Push**: Push your changes upstream to your fork.
    ````
    git push origin <branch>
    ````

 8. **Make a pull request**: Make sure your PR targets the correct branch!
    *(i.e. `develop` for feature branches, and `master` for hotfixes).*

    > *Remember*: you're not done yet. Kauri maintainers will review and discuss
      your pull request. They may request changes, or close your PR entirely.
      It's best to keep an eye on your pull request for a few days whilst we
      consider your proposal.


## Versioning

Wherever possible, Kauri conforms to the versioning spec outlined in [Semantic
Versioning](https://semver.org/).
