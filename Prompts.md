# Prompts.md — AI Usage Log
Sprint 03 | Piyush | Prodesk IT

---

## About
I built this Dev Detective GitHub Search Client myself.
I used AI only when I was stuck on specific concepts
or errors. All logic and structure was done by me.

---

## Prompt 1 — Async/Await Concept
**Prompt:**
> "what is async await in javascript and 
how is it different from normal functions"

**What I did:**
I was confused about why we need async/await.
AI explained that API calls take time and 
async/await makes JavaScript wait for the 
response before continuing. I implemented 
this myself in my fetchUser function.

---

## Prompt 2 — Fetch API Error Handling
**Prompt:**
> "how to handle 404 error in fetch api javascript"

**What I did:**
I learned that fetch does not throw error on 404.
I need to check response.status === 404 manually
and throw my own error. I fixed this in my 
try/catch block myself.

---

## Prompt 3 — Promise.all Usage
**Prompt:**
> "how to fetch two api calls at same time 
using Promise.all in javascript"

**What I did:**
I learned that Promise.all takes an array of 
promises and resolves them simultaneously.
This is faster than fetching one by one.
I used this in my battle mode feature.

---

## Prompt 4 — Date Formatting
**Prompt:**
> "how to convert ISO date 2023-01-25T12:00:00Z 
to readable format in javascript"

**What I did:**
I learned about toLocaleDateString() method.
I wrote the formatDate() utility function 
myself using this method.

---

## Summary
Total AI interactions: 4
AI was used to understand concepts only.
All features were built and modified by me.
I understood every line before using it.