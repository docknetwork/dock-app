import React from 'react';
import { TouchableWithoutFeedback, View } from "react-native";
import {Box as NBox} from 'native-base';
import _ from 'lodash';

export { NBox };

export const rnStyleAttributes = _.flatten([
	'marginBottom',
	'marginTop',
	'marginLeft',
	'marginRight',
	'paddingLeft',
	'color',
	'fontSize',
	'fontFamily',
	'fontWeight',
	'lineHeight',
	'paddingTop',
	'paddingRight',
	'paddingBottom',
	'backgroundColor',
	'borderRadius',
	'margin',
	'padding',
	'flex',
	'flexDirection',
	'alignItems',
	'justifyContent',
	'flexWrap',
	'display',
	'borderWidth',
	'borderColor',
	'width',
	'height',
	[
		'borderBottom',
		'borderTop',
		'borderLeft',
		'borderRight',
	].map(opt => [
		`${opt}Width`,
		`${opt}Color`,
		`${opt}Style`,
	])
]);

export function Box(props: CSSStyleDeclaration) {
	let style = {};

	if (props.col) {
		style.flexBasis = 'auto';
		style.flexDirection = 'column';
		if (!props.noPadding) {
			style.paddingLeft = 5;
			style.paddingRight = 5;
			style.paddingTop = 8;
			style.paddingBottom = 8;
		}
	}

	if (props.row) {
		style.flexBasis = 'auto';
		style.flexDirection = 'row';
		if (!props.noMargin) {
			style.marginLeft = -5;
			style.marginRight = -5;
		}
	}

	rnStyleAttributes.forEach(key => {
		if (props[key]) {
			style[key] = props[key];
		}
	});

	if (style.flex === true) {
		style.flex = 1;
	}

	if (props.autoSize) {
		style.flex = 0;
	}

	// Style override
	if (props.style) {
		style = {
			...style,
			...props.style,
		};
	}

	const content = <View style={style}>{props.children}</View>;

	if (props.onPress) {
		return (
			<TouchableWithoutFeedback onPress={props.onPress} testID={props.testID}>
				{ content }
			</TouchableWithoutFeedback>
		)
	}

	return content;
}