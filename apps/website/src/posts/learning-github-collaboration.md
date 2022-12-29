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

Git is a unique beast of a program. For years I had been using it at the most bare minimum of it's capacity . It took was getting involved with an open source project that opened my eyes to the power of source control.

I had a task. I was using a library, found an issue in the documentation and figured out how to fix it. So I created an issue on GitHub and the maintainer asked if I could do a _PR_... I had to look that up 😂. Though, through the graceful help of the maintainer and a lot of googling, I finally cobbled together an acceptable pull request, and it was merged. I was hooked.

This article is space for me to document some of the simple workflows I learned.

<DocInfo>
  I've only used GitHub for collaboration, so this article will be skewed toward it's workflow.
</DocInfo>

## Forking

A fork is an copy of a repository that can submit pull request to the [upstream repository](#upstream-repo).

I made a few mistakes after my first attempts at forking a repo. The first was to commit changes directly into the `main` branch. It wasn't apparent it was an issue until I want to sync my fork back to the [upstream repo](#upstream-repo) so I could make another PR.

## Upstream Repo

The repository from which a forked was made.

[configuring a remote repository for a fork](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/configuring-a-remote-repository-for-a-fork)

## Squash

[Git Tools - Rewriting History](https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History)

[Squash and merge](https://docs.gitlab.com/ee/user/project/merge_requests/squash_and_merge.html)

## Syncing

[Syncing Tutorial](https://www.atlassian.com/git/tutorials/syncing)
