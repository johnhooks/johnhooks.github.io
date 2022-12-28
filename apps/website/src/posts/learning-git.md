---
title: Learning Git
seoTitle: Learning how to use the Git source control system
slug: learning-git
abstract: An article of helpful resources for learning Git.
isPublished: false
publishedOn: 2021-07-22
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

## Squash

[Git Tools - Rewriting History](https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History)

[Squash and merge](https://docs.gitlab.com/ee/user/project/merge_requests/squash_and_merge.html)

## Syncing

[Syncing Tutorial](https://www.atlassian.com/git/tutorials/syncing)

## References

- [Configuring a remote for a fork](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/configuring-a-remote-repository-for-a-fork)

- [Syncing a fork](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/syncing-a-fork)
- [Merge conflicts](https://www.atlassian.com/git/tutorials/using-branches/merge-conflicts) use `git diff` to show where the conflicts are located.
- [Rewriting history](https://www.atlassian.com/git/tutorials/rewriting-history) `git commit --amend`
- [Undo Possibilities in Git](https://docs.gitlab.com/ee/topics/git/numerous_undo_possibilities_in_git/)
- [Github Flow](https://docs.github.com/en/get-started/quickstart/github-flow)
- [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
