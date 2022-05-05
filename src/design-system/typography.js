import {ITextProps, Text} from 'native-base';
import {ComponentType} from 'react';
import styled from 'styled-components/native';
import {Theme} from './theme';

const headerVariantBase = {
  fontFamily: Theme.fontFamily.default,
  lineHeight: 32,
  fontWeight: '600',
  color: Theme.colors.headerText,
};

const transactionFilterVariantBase = {
  ...headerVariantBase,
  fontFamily: Theme.fontFamily.default,
  fontSize: 16,
  fontWeight: 600,
  fontStyle: 'normal',
  lineHeight: '24px',
  color: Theme.colors.textHighlighted,
};
const transactionItemMinorDetail = {
  fontFamily: Theme.fontFamily.default,
  fontWeight: 400,
  fontSize: 14,
  fontStyle: 'normal',
  lineHeight: '20px',
  color: Theme.colors.description,
};

type TypographyProps = ITextProps & {
  variant:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'description'
    | 'list-description'
    | 'montserrat'
    | 'fiat-amount'
    | 'transaction-filter'
    | 'transaction-filter-amount-sent'
    | 'transaction-filter-amount-received'
    | 'transaction-type-label'
    | 'transaction-item-small-details'
    | 'transaction-filter-amount-failed',
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
  'transaction-type-label': {
    fontFamily: Theme.fontFamily.default,
    fontWeight: 600,
    fontSize: 16,
    fontStyle: 'normal',
    lineHeight: '24px',
    color: Theme.colors.textHighlighted,
  },
  'transaction-item-date': {
    ...transactionItemMinorDetail,
  },
  'transaction-item-fiat-amount': {
    ...transactionItemMinorDetail,
    textAlign: 'right',
  },
  'fiat-amount': {
    ...headerVariantBase,
    fontFamily: Theme.fontFamily.default,
    fontStyle: 'normal',
    fontSize: 16,
    fontWeight: 400,
    lineHeight: 24,
    color: Theme.colors.description,
  },
  'transaction-filter': {
    fontFamily: Theme.fontFamily.default,
    fontStyle: 'normal',
    fontSize: 15,
    fontWeight: 400,
    lineHeight: '20px',
    textAlign: 'center',
    paddingLeft: '12px',
    paddingRight: '12px',
  },
  'transaction-filter-amount-sent': {
    ...transactionFilterVariantBase,
    color: Theme.colors.textHighlighted,
  },
  'transaction-filter-amount-received': {
    ...transactionFilterVariantBase,
    color: Theme.colors.transactionCompleted,
  },
  'transaction-filter-amount-failed': {
    ...transactionFilterVariantBase,
    color: Theme.colors.textHighlighted,
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
  transactionRetryTxt: {
    fontFamily: Theme.fontFamily.default,
    fontWeight: 500,
    fontSize: 14,
    lineHeight: 20,
    color: Theme.colors.primaryBackground,
  },
};

export const Typography: ComponentType<TypographyProps> = styled(Text)`
  font-family: ${Theme.fontFamily.default};
  line-height: 25px;
  color: ${props => (props.color ? props.color : Theme.colors.text)};
  ${({variant}) => {
    return variantsMap[variant] || {};
  }}
`;
