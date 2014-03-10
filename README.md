# Tablet Layout using AngularJS

Experiments using a full screen layout with some mechanisms to manipulate the
header and footer size. The idea is that the header and footer need not be full size
while the user is interacting with the main content area, so they should gracefully
get out of the way. When the user needs to navigate or select a tool, they are only a
click or swipe away.

> ### Note
> This project has an incremental journey that may be worthwhile to experience.
> * The [second milestone](https://github.com/Transcordia/tablet-layout/tree/v0.3.0) adds
    animation capability to the release.
> * The [first milestone](https://github.com/Transcordia/tablet-layout/tree/v0.3.0) is
    representative of a brute force approach with no animations. The `ng-show` directive
    is used along with a controller scope variable to toggle visibility of particular
    block elements when it is set. The `<main>` content is re-anchored based on a class
    that is managed on the body using an `ng-class` directive.

## Element Positioning

The layout consists of three major page elements, the `<header>`, `<footer>` and the
`<main>` content area. All are absolutely positioned and anchored to `left:0; right: 0;`
in the css.

The `<main>` area in anchored to a fixed top and bottom location that varies depending on
whether the header and footer are collapsed or expanded. In either case, it has
`overflow-y: auto;` set so it will scroll when necessary.

The `<header>` and `<footer>` tags are not fixed height, but the elements contained
within them are which enables us to set the top and bottom anchors of our `main` section
solely using CSS.

## Animation

Unfortunately, this experiment needs to support IE9, so I cannot use CSS3 transitioning.




