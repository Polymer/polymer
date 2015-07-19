# Contributing to Polymer

There are many ways to contribute to the Polymer project! We welcome and truly appreciate contribution in all forms - issues and pull requests to the [main library](https://github.com/polymer/polymer), issues and pull requests to the [elements the Polymer team maintains](https://github.com/polymerelements), issues and pull requests to one of our many [Polymer-related tools](https://github.com/polymer), and of course we love to hear about any Polymer elements that you build to share with the community!

# Logistics

## Communicating with the Polymer team

Beyond Github, we try to have a variety of different lines of communication open:

* [Blog](https://blog.polymer-project.org/)
* [Twitter](https://twitter.com/polymer)
* [Google+ Community](https://plus.sandbox.google.com/u/0/communities/115626364525706131031?cfem=1)
* [Mailing list](https://groups.google.com/forum/#!forum/polymer-dev)
* [Slack channel](https://bit.ly/polymerslack)

## The Polymer Repositories

Because of the component-based nature of the Polymer project, we tend to have lots of different repositories. Our main repository for the Polymer library itself is at [github.com/Polymer/polymer](https://github.com/polymer/polymer). File any issues or pull requests that have to do with the core library on that repository, and we'll take a look ASAP.

We keep all of the element "product lines" that the Polymer team maintains and distributes in the [PolymerElements](https://github.com/polymerelements) organization. For any element-specific issues or pull requests, file directly on the element's repository, such as the `paper-button` repository at [github.com/polymerelements/paper-button](https://github.com/polymerelements/paper-button). Of course, the elements built by the Polymer team are just a tiny fraction of all the Polymer-based elements out there - catalogs of other web components include [customelements.io](http://www.customelements.io) and [component.kitchen](http://www.component.kitchen).

The GoogleWebComponents element product line is maintained by teams all across Google, and so is kept in a separate organization: the [GoogleWebComponents](https://github.com/googlewebcomponents) org. Feel free to file issues and PR's on those elements directly in that organization.

We also track each element product line overall in "meta-repos", named as `$PRODUCTLINE-elements`. These include [paper-elements](https://github.com/polymerelements/paper-elements), [iron-elements](https://github.com/polymerelements/iron-elements), [gold-elements](https://github.com/polymerelements/gold-elements), and more. Feel free to file issues for element requests on those meta-repos, and the README in each repo tracks a roadmap for the product line.

## Contributor License Agreement

You might notice our friendly CLA-bot commenting on a pull request you open if you haven't yet signed our CLA. We use the same CLA for all open-source Google projects, so you only have to sign it once. Once you complete the CLA, all your pull-requests will automatically get the `cla: yes` tag.

If you've already signed a CLA but are still getting bothered by the awfully insistent CLA bot, it's possible we don't have your GitHub username or you're using a different email address. Check the [information on your CLA](https://cla.developers.google.com/clas) or see this help article on [setting the email on your git commits](https://help.github.com/articles/setting-your-email-in-git/).

[Complete the CLA](https://cla.developers.google.com/clas)

# Contributing

## Filing bugs

The Polymer team heavily uses (and loves!) Github for all of our software management. We use Github issues to track all bugs and features.

If you find an issue, please do file it on the repository. The [Polymer/polymer issues](https://github.com/polymer/polymer/issues) should be used only for issues on the Polymer library itself - bugs somewhere in the core codebase.

For issues with elements the team maintains, please file directly on the element's repository. If you're not sure if a bug stems from the element or the library, air toward filing it on the element and we'll move the issue if necessary.

We love examples for addressing issues - issues with a Plunkr, jsFiddle, or jsBin will be much easier for us to work on quickly. You can start with [this jsbin](http://jsbin.com/cijadomupa/1/edit?html,output) which sets up the basics to demonstrate a Polymer element.

Occasionally we'll close issues if they appear stale or are too vague - please don't take this personally! Please feel free to re-open issues we've closed if there's something we've missed and they still need to be addressed.

## Contributing Code to Elements

Though the aim of the Polymer library is to allow lots of flexibility and not get in your way, we work to standardize our elements to make them as toolable and easy to maintain as possible.

All elements should follow the [Polymer element style guide](http://polymerelements.github.io/style-guide/), which defines how to specify properties, documentation, and more. It's a great guide to follow when building your own elements as well, for maximum standardization and toolability. For instance, structuring elements following the style guide will ensure that they work with the [`iron-component-page`](https://github.com/polymerelements/iron-component-page) element, an incredibly easy way to turn any raw element directly into a documentation page.

## Contributing Code to the Polymer library

We follow the most common javascript and HTML style guidelines for how we structure our code - in general, look at the code and you'll know how to contribute! If you'd like a bit more structure, the [Google Javascript Styleguide](https://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml) is a good place to start.

Polymer also participates in Google's [Patch Rewards Program](http://www.google.com/about/appsecurity/patch-rewards/), where you can earn cold, hard cash for qualifying security patches to the Polymer library. Visit the [patch rewards page](http://www.google.com/about/appsecurity/patch-rewards/) to find out more.
