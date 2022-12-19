---
title: Learning GitHub Collaboration
seoTitle: Learning Open Source Collaboration using Git and GitHub
slug: learning-github-collaboration
abstract: Learning how to use the Git and GitHub for collaborating on open source projects
isPublished: false
publishedOn: 2022-12-09
---

<script>
  import DocInfo from '../lib/components/doc-info.svelte';
</script>

Git is a unique beast of a program. For years I had been using git in its most bare minimum of capacity. Though when I got involved with an open source project, my eyes were opened to the power of source control.

I had a task. I was using a library, found an issue in the documentation and figured out how to fix it. So I created an issue on GitHub and the maintainer asked if I could do a _PR_... I had to look that up 😂. But through the graceful help of the maintainer and a lot of googling, I finally cobbled together an acceptable pull request, and it was merged. I was hooked.

This article is space for me to document some of the simple workflows I learned.

<DocInfo>
  I've only used GitHub for collaboration, so this article will be skewed toward it's workflow.
</DocInfo>

## Forking

A fork is an copy of a repository, from which pull requests can be submitted to the [upstream repo](#upstream).

I made a few mistakes after my first attempts at forking a repo. The first was to commit changes directly into the `main` branch. It wasn't apparent it was an issue until I want to sync my fork back to the [upstream](#upstream) repo so I could make another PR. It's recoverable, but in my option it's best to avoid.

<DocInfo>
  Tip: Don't make edits in the `main` branch. Create your own branches for changes and save `main` for [syncing](#syncing) with the [upstream](#upstream) repository.
</DocInfo>

## Upstream

The repository from which a forked was made.

A fork's [upstream](#upstream) repo isn't automatically added as a remote. Below is how you would add one and name it `upstream`.

```sh
$ git remote add upstream https://github.com/ORIGINAL_OWNER/ORIGINAL_REPOSITORY.git
```

You can now [rebase](#rebase) a branch in your local repo to an upstream one. This is necessary when changes have been made upstream and you need add them into your local changes.

[configuring a remote repository for a fork](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/configuring-a-remote-repository-for-a-fork)

[syncing tutorial](https://www.atlassian.com/git/tutorials/syncing)

## Squash

Reduce all the commits of a branch into a single one.

It's really helpful to squash commits to keep things organized. While working in a branch, I usually make lots of commits to ensure I can walk back an edit that doesn't work or breaks something. But it would be hard to see the overview of a series of changes in a repository if all the commits were made this way. So when merging the edits into another branch it's normal to squash all the commits into one.

```sh
$ git checkout BRANCH_TO_MERGE_INTO
$ git merge --squash BRANCH_TO_MERGE
$ git commit
```

[rewriting history](https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History)

[squash and merge](https://docs.gitlab.com/ee/user/project/merge_requests/squash_and_merge.html)

## Rebase

Change the base from which a branch is based on.

It's common while working in a collaborative environment that changes will be made [upstream](#upstream) before your pull request can be accepted and merged. Rebasing your PR onto the upstream changes will...

<DocInfo>
  Tip: The first time you rebase and have merge conflicts, don't panic. It can be intimidating but you can always `git rebase --abort` to cancel the rebase and take time to research how to resolve conflicts.
</DocInfo>

[rebase article](https://www.atlassian.com/git/tutorials/rewriting-history/git-rebase)

## Conventional Commits

A specification of how commit messages should be authored.

It's very common to use automation to release packages. If your commit messages follow the conventional commit pattern, [SemVer](https://semver.org/), Semantic Versioning, can be automatically generated based off the commit messages. Also, the system helps humans quickly and consistently document their edits.

[conventional commits summery](https://www.conventionalcommits.org/en/v1.0.0/)
