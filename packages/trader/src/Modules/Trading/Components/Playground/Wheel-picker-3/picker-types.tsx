export interface IPickerProps {
    disabled?: boolean;
    selectedValue?: any;
    onValueChange?: (value: any) => void;
    itemStyle?: any;
    /** web only */
    prefixCls?: string;
    indicatorStyle?: any;
    indicatorClassName?: string;
    className?: string;
    children: React.ReactNode;
    defaultSelectedValue?: any;
    style?: any;
    onScrollChange?: (value: any) => void;
    noAnimate?: boolean;
    rotate?: number;
}
