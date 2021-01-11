# Carousel Component

A simple slider width navigator.


## Usage

```jsx
import Carousel from 'deriv-components';

const DummyComponent = props => (
  <Carousel list={slides} />
);
```

## Props

| Name                   | Type        | Default                     | Description                                              |
| ---------------------- | ----------- | --------------------------- | -------------------------------------------------------- |
| className              | {string}    | null                        | The classname for the Slider wrapper                     |
| initial\_index         | {number}    | 0                           | Slide to start with                                      |
| onItemSelect           | {function}  | null                        | Callback funtion on click one slide                      |
| bullet\_color          | {string}    | var(--text-less-prominent)  | Color of the bullets                                     |
| active\_bullet\_color  | {string}    | var(--text-prominent)       | Color of the active bullet                               |
| list                   | {array}     | null                        | List of slides                                           |
| nav\_position          | {string}    | bottom                      | You can show navigation on 'top', 'middle' or 'bottom'.  |
| show\_nav              | {boolean}   | true                        | Set it to 'false' if you don't want a navigation         |
| bullet\_position       | {string}    | bottom                      | You can show bullets on 'top' or 'bottom'.               |
| show\_bullet           | {boolean}   | true                        | Set it to 'false' if you don't want to have bullets      |
| autoplay\_time         | {number}    | null                        | Delay for changing a slide                               |
| width                  | {number}    | 400                         | Width of slider                                          |


# Full example:

```jsx
import Carousel from 'deriv-components';

const DummyComponent = props => (
  <Carousel 
    className='my-slider__wrapper'
    initial_index={2}
    onItemSelect={props.onItemSelect}
    bullet_color='#cccccc'
    active_bullet_color='#dddddd'
    list={props.list}
    nav_position='top'
    bullet_position='top'
    autoplay_time={500}
    width={600}
    />
);
```
