# vue-scrolling-table

> A Vue component to create tables with vertical and horizontal scrolling. Flexbox-based.

## Demo
There is a live demo here:
https://tallent.us/vue-scrolling-table

The repo for the demo application is here:
https://github.com/richardtallent/vue-scrolling-table-sample

## Properties

### deadAreaColor
This is a **string** value. The default is `#CCC`. This is the color used for the "dead area" within
any scrolling table that isn't used for the table contents. This dead area is possible because
the table fits its parent container, but the rows or columns may not fill the entire space. This
property accepts any legal CSS color expression (triplets, `rgb()`, etc.).

## includeFooter
This is a **Boolean** value, the default is `false`. Set this to `true` if you are providing content
for a `tfoot` slot, otherwise the element will not be rendered.

## Slots
This is a *very* simple wrapper for an HTML table. This component is not intended to, itself be used
as a data grid, etc., though one could be built using it. Instead, there are three slots, which are
decorated as needed to make the scrolling happen, but otherwise the calling parent component/application
is responsible for the **contents of** the `<thead>`, `<tbody>`, and (optional) `<tfoot>` elements
(*i.e.*, the `<tr>`, `<td>`, and `<th>` tags). This is done using Vue's *named slots*.</p>

### thead
Required. Use this slot to inject the `<thead>` element's contents. The component will freeze it at
the top, and will synchronize its horizontal scrolling with `<tbody>` scroll (there may be a short
delay).

### tbody
Required. Use this slot to inject the `<tbody>` element's contents. The component will make it
scrollable.

### tfoot
Optional. Use this slot if you want to inject contents for a `<tfoot>` element. The component will
freeze it at the bottom, below the scrolled `<tbody>`. For now, this element is not scrolled
automatically with the body. If a user has a use case for this, it could be done pretty easily.

## Example Usage
```HTML
<vue-scrolling-table>
  <template slot="thead">
    <tr>
	  <th v-for="col in columns" 
		:class="col.cssClasses"
		:key="col.id">{{ col.title }}</th>
    </tr>
  </template>
  <template slot="tbody">
    <tr v-for="item in items" :key="item.id">
	  <td v-for="col in columns"
		:class="col.cssClasses"
		:key="col.id">{{ item[col.id] }}</td>
    </tr>
  </template>
</vue-scrolling-table>
```

## Browser Compatibility
The underlying CodePen has been tested on IE11, and the latest versions of Chrome, Firefox, Safari,
and iOS Safari.

The component itself has not been tested, I plan to write a demo/test app next.

## Implementation Details
A table that scrolls its contents without losing its header or footer is a common need, as is
(these days) a table that will reliably fit itself into a flexbox layout. Unfortunately, I couldn't
find any lightweight Vue components that gave this functionality but still allowed me full freedom
to manage the actual markup inside the table.

The flexbox part of this is pretty simple and has been covered by tutorials elsewhere much better
than I could explain it, but basically, the table is displayed using flexbox, it stretches to fill
its container. Its `<thead>` and `<tfoot>` use flexbox to render at whatever height they need and
no more or less, and `<tbody>` gets the remainder between them.

Thus, `<tbody>`'s height and width are no longer dependent on the rows and columns, they size with
the table itself. This allows us to set it to scroll the contents of the table body by setting
the CSS `overflow` property.

However, the use of `block` on the head and body disconnects how HTML tables usually ensure that
the header and body rows have the same column widths and scroll horizontally in tandem.

Fixing the scroll just requires tracking the user's horizontal scroll events on the body and 
matching the resulting scroll position on the header.

There's also a problem on browsers that show scrollbars: since the body is being scrolled but
the header isn't, the portion of the body used by the scrollbar doesn't look right in the header.
To alleviate this, we tell the `<thead>` to have a vertical scrollbar (even though it is never
needed), then we use CSS to style the scrollbar to be the same as our the color used outside the
table itself. There are no standard CSS properties for this, we target the browser-specific ones
for IE and WebKit.

Before creating the Vue component, the proof of concept was done on CodePen:
https://codepen.io/richardtallent/pen/rpWBQK

## Slot Markup and Styling Requirements
While a component could attempt to track changes to the width of each column of the header and
body and synchronize those changes with the other, in practice it is much more difficult than
synchronized scrolling, because there is no one reliable DOM event to listen to to capture 
everything that could resize a `<th>` or `<td>`... it could be a result of a content change,
CSS change, window resize, layout resize, etc. Most implementations I've seen track some events,
but also end up polling widths on a timer just to be sure they keep everything aligned.

So for sanity, I took the path of requiring that the calling component ensure that each header
column's width matches the corresponding body columns width. The default CSS for the component
sets the `width`, `min-width`, and `max-width` to `10em` to make all cells match out of the box.
Cells are also defaulted to word-wrap if needed, even if there are no word breaks in the text,
and they are set to, if overflow is inevitable, that the overflow is hidden. This is all key
to having a reliable column width. You can use CSS or `style` attributes in your markup to
customize this for any column (remember to set all three width attributes, otherwise contents
of your cells could still resize the column width).

While you cannot use auto-width or percentages and hope to keep the header and body columns
aligned, depending on your layout, you may be able to use `vw` units and achieve a similar
scaled effect. You can also attempt to implement your own code to track and align widths.

## Customizing the Style
What little default styling is provided on the table is purposefully *very* basic, and is not
scoped, so it's easy to override in your calling application. Use `table.scrolling` as the base
selector.

## Future plans
I plan to actually use this on an upcoming project at work, one that will require very complex
table markup and very wide tables. It will be a good torture-test for the component. However,
the only functionality I can think of to *add* to the component at the moment would be maybe a
property to control whether horizontal scrolling is desired -- in some cases, you may only
want vertical scrolling, which means the scroll-tracking can be disabled, and the horizontal
scroll bar.

I'm open to other ideas, as long as they don't limit the flexibility of using slots for the
header, body, and footer. But if someone wants to *build* a data grid component that has this
as a dependency, I'm all for it.

## Build Setup

```bash
# install dependencies
npm install

# build for production with minification
npm run build
```

## Release History

| Date       | Version | Notes                                                                                      |
| ---------- | ------- | ------------------------------------------------------------------------------------------ |
| 2017.12.24 | 0.1.0   | First published version                                                                    |
| 2017.12.24 | 0.1.1   | Patch based on sample app deveopment                                                       |
| 2017.12.24 | 0.1.2   | Fix: old version went to npm                                                               |
