---
title: My Boss Was Right About empty()
seoTitle: My Boss Was Right About PHP's empty()
abstract: PHP's empty() is convenient, but it can hide the exact state I needed to notice.
isPublished: true
publishedOn: 2025-09-30
writingSourcePath: ../blog/posts/my-boss-was-right-about-empty.md
---

My boss has pointed out my misuse of PHP’s `empty()` enough times that I finally had to
write it down.

Not literally a hundred times, but enough.

The pattern is usually the same. I reach for `empty()` because I want a quick guard. He
asks what state I actually mean.

That is the part I kept skipping. The real lesson is not just about `empty()`. It is about
asking more specific questions in conditionals.

`empty()` is convenient because it answers a bunch of questions at once:

```php
empty(null);        // true
empty(false);       // true
empty(0);           // true
empty("0");         // true
empty("");          // true
empty([]);          // true
empty($undefined);  // true
```

That last one is the part that makes me nervous now. If I typo a variable name, I usually
want PHP to complain. I do not want the code to quietly decide the value is empty and keep
going.

```php
$payment_gateway = get_option('payment_gateway');

if (empty($paymentGateway)) {
    $payment_gateway = 'test_mode';
}
```

That code has a typo. `$paymentGateway` is not `$payment_gateway`. But `empty()` treats
the undefined variable as empty, so the bug can slide by without the warning I needed.

The bigger problem is that `empty()` collapses states that may mean different things.

WordPress code runs into this a lot because APIs often use different falsy values for
different cases. A missing value, an invalid ID, a disabled flag, and the string `"0"` are
not always the same thing. If I use `empty()`, I might erase the difference before I have
even thought about it.

```php
$price = get_post_meta($post_id, 'price', true);

if (empty($price)) {
    return 'Price not set';
}
```

Maybe that is fine. Or maybe `0` is a real price. Maybe the post ID was wrong. Maybe the
metadata is missing. The point is not that `empty()` is always broken. The point is that I
have not said which case I mean.

Most of the time, the better version is boring and explicit:

```php
$price = get_post_meta($post_id, 'price', true);

if ($price === '') {
    return 'Price not set';
}
```

The same problem can show up with null coalescing if I use it to avoid thinking through
the condition.

This is not much better:

```php
if (($_POST['subscribe'] ?? false)) {
    subscribe_user_to_newsletter();
}
```

It handles the missing key, but it still turns the value into a boolean decision without
saying what value I expected. If `subscribe` is supposed to be a checkbox value, check for
that value:

```php
if (($_POST['subscribe'] ?? '') === '1') {
    subscribe_user_to_newsletter();
}
```

The point is not null coalescing itself. The point is being clear about the state I am
checking. Missing key is one state. Submitted value is another. Boolean truthiness is not
a substitute for deciding which one matters.

I still use `empty()` sometimes. This is not a purity rule. But I try to notice when I am
using it to avoid deciding what state I actually care about.

That is the useful version of the lesson for me.

Be specific in conditionals. If the real question is more precise than “is this empty?” or
“is this truthy?”, ask that question instead.
