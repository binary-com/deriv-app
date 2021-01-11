# DatePicker component
The date picker component is a fluid element, and it fills it's parent workspace.

#### Supported events:
- onBlur
- onFocus
- onChange

## Usage
 
```jsx
import { DatePicker } from 'deriv-components';

const DummyComponent = (props) => (
    <DatePicker
        value={props.value}
    />
)
```

## Props

| Name                   | Type                   | Default       | Description                                                                                                   |
|------------------------|------------------------|---------------|-------------------------------------------------------------------------------------------------------------- |
| id                     | {string}               | null          |                                                                                                               |
| disabled               | {boolean}              | false         |                                                                                                               |
| display\_format        | {string}               | 'DD MMM YYYY' | Date format for displaying in input                                                                           |
| date\_format           | {string}               | 'YYYY-MM-DD'  | Date format for Calendar component                                                                            |
| footer                 | {node}                 | null          | Custom footer text for Calendar component                                                                     |
| has\_range\_selection  | {bolean}               | null          | Enable range select for Calendar component                                                                    |
| name                   | {string}               | null          | Name of the field                                                                                             |
| error                  | {string}               | null          | If any text is set for this prop, select compenent will get error styles and show this text as error message  |
| label                  | {string}               | null          |                                                                                                               |
| max\_date              | {string}               | null          | Maximum date that is available in YYYY-MM-DD format                                                           |
| min\_date              | {string}               | true          | Minimum date that is available in YYYY-MM-DD format                                                           |
| placeholder            | {string}               | null          |                                                                                                               |
| onBlur                 | {function}             | null          |                                                                                                               |
| onFocus                | {function}             | null          |                                                                                                               |
| onChange               | {string}               | null          | Will execute on date select                                                                                   |
| value                  | {string}               | null          | Selected date in YYYY-MM-DD format                                                                            |
| mode                   | {string}               | date          | You can choose between `date` and `durattion` modes of calendar out put                                       |
| portal\_id             | {string}               | null          | Use this if you want to render calendar in a dom element with the id of `portal_id`                           |
| required               | {string}               | null          | If the field is required use this prop                                                                        |
| type                   | {string}               | null          | Type of the input field                                                                                       |


## Full example:

```jsx
import { DatePicker } from 'deriv-components';

const DummyComponent = (props) => (
    <DatePicker
        id='my-id'          
        display_format='MMM DD YYYY'     
        date_format='YYYY-DD-MM'        
        footer={<span>My footer text</span>}             
        has_range_selection
        name='my-field-name'               
        error='Has an error'           
        label='This is the label'           
        max_date='2021-06-01'           
        min_date='2020-01-15'           
        placeholder='My placeholder text'        
        onBlur={props.onBlur}             
        onFocus={props.onFocus}            
        onChange={props.onChange}           
        value={props.value}              
        mode='duration'               
        portal_id='my-portal-id'          
        required           
        type='text'
    />
)
```
