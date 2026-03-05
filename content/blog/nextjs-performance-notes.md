---
title: "Next.js Performance Notes"
excerpt: "A practical checklist I use to keep pages fast and clean."
date: "2026-03-04"
tags:
  - nextjs
  - performance
published: true
---

A few practical rules I use on every project:

- keep components small and focused
- avoid over-fetching on the server
- use caching intentionally
- load media assets with clear size constraints

Performance is mostly about consistent habits, not one-time tricks.

## Example Snippet

```lua
export async function getServerData() {
  const res = await fetch("https://api.example.com/data", {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}
```

I usually combine this with small reusable components and `cache` strategy checks.

## Useful Link

Read the official docs: [Next.js Rendering Strategies](https://nextjs.org/docs/app/building-your-application/rendering)

## Image Example

![Performance dashboard preview](https://picsum.photos/1200/560?grayscale)

## Quick Comparison

| Strategy | Best For | Note |
| --- | --- | --- |
| SSG | Mostly static pages | Fast and cacheable |
| ISR | Semi-dynamic content | Great for content updates |
| SSR | Highly dynamic data | More server load |
