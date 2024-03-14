import React, { isValidElement } from 'react';

const reactNodeToString = function (reactNode: React.ReactNode): string {
    let string = '';
    if (typeof reactNode === 'string') {
        string = reactNode;
    } else if (typeof reactNode === 'number') {
        string = reactNode.toString();
    } else if (reactNode instanceof Array) {
        reactNode.forEach(function (child) {
            string += reactNodeToString(child);
        });
    } else if (isValidElement(reactNode)) {
        string += reactNodeToString(reactNode.props.children);
    }
    return string;
};

export default reactNodeToString;
