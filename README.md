# Tablet Layout using AngularJS

Experiments using a full screen layout with some mechanisms to manipulate the
header and footer size. The idea is that the header and footer need not be full size
while the user is interacting with the main content area, so they should gracefully
get out of the way. When the user needs to navigate or select a tool, they are only a
click or swipe away.

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

In this tagged version, there is no animation enabled. Sections of content simply are set
to hide/show based on the value of the scope's `layout.max` value which is a boolean
`true` or `false`.



