import React from 'react';
import {FormControl, Input, Select, Stack} from 'native-base';
import {InputPopover, SelectToggler} from '../design-system';
import {translate} from '../locales';

export function AccountAdvancedOptions({onChange, form}) {
  return (
    <SelectToggler placeholder={translate('account_advanced_options.advanced_options')}>
      <FormControl>
        <Stack mt={7}>
          <FormControl.Label>
            {translate('account_advanced_options.keypair_type')}
            <InputPopover title={translate('account_advanced_options.keypair_type')}>
              {translate('account_advanced_options.keypair_type_tip')}
            </InputPopover>
          </FormControl.Label>
          <Select
            onValueChange={onChange('keypairType')}
            selectedValue={form.keypairType}>
            <Select.Item
              label={translate('account_advanced_options.keypair_type_sr25519')}
              value="sr25519"
            />
            <Select.Item
              label={translate('account_advanced_options.keypair_type_ed25519')}
              value="ed25519"
            />
            <Select.Item
              label={translate('account_advanced_options.keypair_type_ecdsa')}
              value="ecdsa"
            />
          </Select>
        </Stack>
      </FormControl>
      <FormControl isInvalid={false}>
        <Stack mt={7}>
          <FormControl.Label>
            {translate('account_advanced_options.secret_derivation_path')}
            <InputPopover
              title={translate('account_advanced_options.secret_derivation_path')}>
              {translate('account_advanced_options.secret_derivation_path_tip')}
            </InputPopover>
          </FormControl.Label>
          <Input
            placeholder="//hard/soft//password"
            onChangeText={onChange('derivationPath')}
            autoCapitalize="none"
          />
          <FormControl.ErrorMessage>
            {translate('account_advanced_options.invalid_secret_uri')}
          </FormControl.ErrorMessage>
        </Stack>
      </FormControl>
    </SelectToggler>
  );
}
