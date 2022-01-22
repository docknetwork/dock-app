import {ITextProps, Text} from 'native-base';
import {ComponentType} from 'react';
import styled from 'styled-components/native';
import {Theme} from './theme';

const headerVariantBase = {
  fontFamily: Theme.fontFamily.montserrat,
  lineHeight: 32,
  fontWeight: '600',
  color: Theme.colors.headerText,
};

type TypographyProps = ITextProps & {
  variant:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'description'
    | 'list-description'
    | 'montserrat',
};

const variantsMap = {
  h1: {
    ...headerVariantBase,
    fontSize: 24,
  },
  h2: {
    ...headerVariantBase,
    fontSize: 20,
  },
  h3: {
    ...headerVariantBase,
    fontSize: 17,
  },
  h4: {
    ...headerVariantBase,
    fontSize: 14,
  },
  description: {
    ...headerVariantBase,
    fontSize: 17,
    fontWeight: 400,
    lineHeight: 22,
  },
  'list-description': {
    fontFamily: Theme.fontFamily.montserrat,
    fontSize: 16,
    fontWeight: 400,
    lineHeight: 22,
    color: Theme.colors.description,
  },
  'screen-description': {
    fontSize: 14,
  },
  montserrat: {
    fontFamily: Theme.fontFamily.montserrat,
  },
  label: {
    fontWeight: 600,
    fontSize: 14,
    color: Theme.colors.description,
  },
  warning: {
    color: Theme.colors.warningText,
  },
};

export const Typography: ComponentType<TypographyProps> = styled(Text)`
  font-family: Nunito Sans;
  line-height: 24px;
  color: ${Theme.colors.text};
  ${({variant}) => {
    return variantsMap[variant] || {};
  }}
`;
