# Stylesheet Guidelines

**In this document:**

-   [General Guidelines](#general-guidelines)
    -   [Naming Conventions](#naming-conventions)
    -   [Units](#units)
    -   [Absolute and relative units](#absolute-and-relative-units)
    -   [Converts px to em values](#converts-px-to-em-values)
-   [Typography](#typography)
-   [Theme](#theme)
-   [SVG](#svg)
-   [Commenting](#commenting)

## General Guidelines

In order to improve the clarity, quality, and development time it is worth considering the following principles whenever possible:

-   [Keep Sass Simple](https://www.sitepoint.com/keep-sass-simple/), which means [KISS (Keep It Simple, Stupid)](https://en.wikipedia.org/wiki/KISS_principle) may override [DRY (Don't Repeat Yourself)](https://en.wikipedia.org/wiki/Don't_repeat_yourself) in some cases
-   [Single responsibility selectors](https://en.bem.info/methodology/css/#single-responsibility-principle)

---

## Style Guide

-   [Airbnb CSS / Sass Styleguide](https://github.com/airbnb/css/blob/master/README.md) is partially being followed in our code base.

-   [CSS with BEM](https://en.bem.info/methodology/css/) is partially being followed in our code base.

-   Most styling issues will be caught by [stylelint](https://github.com/stylelint/stylelint/blob/master/README.md), so before pushing your changes remember to run `grunt stylelint` to catch and fix any issues that it finds.

-   Check below for the rules that are not caught by styling but should be followed.

### Naming Conventions

<a id="naming-conventions-selectors"></a>
**[Selectors:](#naming-conventions-selectors)** Selectors should follow the [BEM Two Dashes style](https://en.bem.info/methodology/naming-convention/#two-dashes-style): `block-name__elem-name--mod-name--mod-val`.

```scss
.button {
}
.button--disabled {
}
```

Remember to follow the [Single responsibility principle](https://en.bem.info/methodology/css/#single-responsibility-principle).

<a id="naming-conventions-variables"></a>
**[Variables:](#naming-conventions-variables)** Sass variables should be in uppercase and have a meaningful prefix.

```scss
$COLOR_RED: #e31c4b;

// Light theme
$COLOR_LIGHT_BLACK_1: rgba(0, 0, 0, 0.8);

// Dark theme
$COLOR_DARK_BLUE_1: #0b0e18;
```

Keep all common variables in the [constants.scss](https://github.com/deriv-com/deriv-app/blob/master/src/sass/app/_common/base/constants.scss) file.

---

### Units

<a id="units-flexibility"></a>
**[Flexibility:](#units-flexibility)** If flexibility is needed, for example for font-size, use units such as `rem`, `vh`, `vw`, `fr`, and only use `px` if it's supposed to be a fixed value.

#### Absolute and relative units

-   `em` is typically used in padding and margin to maintain the vertical rhythm. If a user resizes the text, the `em` unit will be scaled proportionately. `em` size is always relative to the font-size of the element.

```scss
// For example: `span` with font-size of 14px and padding of 8px.
// The padding in `em` should be `14px/8px * 1em ~ 0.571em`.
span {
    font-size: 1.4em;
    padding: 0.571em;
}
```

-   `px` is used to define a fixed value such as for `box-shadow`, `border-radius`, and `border-width`.

#### Converts px to em values

1. Since the base font-size is set to be `10px = 1rem`, convert `px` to `em` by dividing the `px` value by 10.

```scss
.balloon {
    padding: 1.6em; // 16px;
}
```

2. Or use the `@toEm($property, $px-to-be-converted, $font-size)` mixin. This is particularly helpful when you want to convert the padding/margin `px` values of an element that also has a `font-size`.

```scss
// Converts padding 10px into `em` value
p {
    font-size: 1.4em;
    @include toEm(padding, 10px, 1.4em); // font-size in em
}
```

3. Or any online converter tool.

---

## Typography

Refer to `Text` component for in components package.

## Theme

Themes scopes and variables are in `themes.scss` file.
We have light and dark themes. For colors use these variables listed in both`.theme--light` and `.dark--themes`.
Make sure the design looks good on both themes.

## SVG

<a id="svg-template-versus-sass"></a>
**[Template versus Sass:](#svg-template-versus-sass)** Add `SVG`s as components if you need to add classes to modify them in different themes. Otherwise you may import them in Sass, or you may import the `SVG` directly to a `Component` from `src/images`:

```JavaScript
import SomeIconSvg from 'Assets/SvgComponents/folder_name/some_icon.svg';

<SomeIconSvg width='15px' height='15px' />
```

<a id="svg-theme"></a>
**[Theme:](#svg-theme)** Use declared classes such as `color1-fill` to handle colouring of SVGs between different themes instead of adding extra Sass for each new image. If the existing classes don't cover what you need, create more [here](https://github.com/deriv-com/deriv-app/blob/master/src/sass/app/_common/inline_icons.scss#L1-L10).

---

## Commenting

<a id="commenting-explanations"></a>
**[Explanations:](#commenting-explanations)** Feel free to add comments to explain any styling that is confusing.

<a id="commenting-todo"></a>
**[To do:](#commenting-todo)** Use `TODO: ...` comments anywhere that needs consideration or attention in the future.
