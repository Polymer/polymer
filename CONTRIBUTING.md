## Contributing

### Initial setup

Want to contribute to the toolkit? Great! Here's an easy guide that should get you up and running:

1. Fork the project on github and pull down your copy.

        git clone git@github.com:username/toolkit.git --recursive

    Note the `--recursive`. This is necessary for submodules to initialize properly. If you don't do a recursive clone, you'll have to init them manually:

        git submodule init
        git submodule update

- Development happens on the `dev` branch. Get yourself on it!

        git checkout dev

That's it for the one time setup. Now you're ready to make a change.

### Submitting a pull request

We iterate fast! To avoid potential merge conflicts, it's a good idea to pull from the main project before making a change and submitting a pull request. The easiest way to do this is setup a remote called `upstream` and do a pull before working on a change:

    cd toolkit
    git remote add upstream git://github.com/toolkitchen/toolkit.git

Then before making a change, do a pull from the upstream `dev` branch:

    git pull upstream dev

To make life easier, add a "pull upstream" alias in your `.gitconfig`:

    [alias]
      pu = !"git fetch origin -v; git fetch upstream -v; git merge upstream/dev"

That will pull in changes from your forked repo, the main (upstream) repo, and merge the two. Then it's just a matter of running `git pu` before a change and pushing to your repo:

    git checkout dev
    git pu
    # make change
    git commit -a -m 'Awesome things.'
    git push

Lastly, don't forget to submit the pull request.
