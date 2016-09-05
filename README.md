# Sensu monitoring for chrome extension

_Many thanks to Nobuhito for the [original version](https://github.com/nobuhito/Tessen):_ nobuhito.sato@gmail.com

## Introduction

Good monitoring is essential in any organisation to provide a view of
the environment and allow a proactive support team.  I have designed
monitoring systems for very large organisations and know what works
and what doesn't.

Many teams seem to use email as an alerting mechanism.  I find emails
to be deficient in many ways:
- email storms
- the spam effect
- provide a snapshot of an event that may not be a problem now
- limited information that requires the user to login to the box to
find out that it's not a problem now.

This extension aims to rid the end user of email (or provide an additional
alert mechanism) without taking up valuable screen real estate in the form of the sensu dashboard.

## Planned Enhancements

- [ ] Add a popup notification with configurable timeout
- [ ] Auto dismiss the popup dialog if problem is resolved
- [ ] Allow stashing from the popup
- [ ] Configuration window
  - [x] URL entry
  - [ ] Dialog timeout
  - [ ] Dialog location
  - [ ] Dialog colour
  - [ ] Dialog stacking
[ ] Language support
[ ] Publish to Chrome Store as open source




