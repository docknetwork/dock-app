import React, { useEffect, useState } from 'react';
import {Box, Pressable, Stack} from 'native-base';
import {
  DocumentDownloadIcon,
  PlusCircleIcon,
  Text,
  OptionList,
  BackIcon
} from 'src/design-system';
import {Modal} from '../../components/Modal';
import {AddAccountModalTestIDs} from './test-ids';
import { ImportExistingAccount } from './ImportExistingAccount';
import { translate } from 'src/locales';

export function AddAccountModal({
  onClose,
  visible,
  onAddAccount,
  onImportExistingAccount,
}) {
  const [importExisting, setImportExisting] = useState();

  useEffect(() => {
    setImportExisting(false);
  }, [visible])

  const content = !importExisting ? (
    <Stack p={8} testID="addAccountModal">
      <Text
        fontSize="24px"
        fontWeight={600}
        color="#fff"
        fontFamily="Montserrat">
        {translate('add_account_modal.title')}
      </Text>
      <OptionList
        mt={5}
        items={[
          {
            testID: AddAccountModalTestIDs.addAccountOption,
            title: translate('add_account_modal.create_new'),
            icon: <PlusCircleIcon />,
            onPress: () => {
              onAddAccount();
              onClose();
            },
          },
          {
            testID: AddAccountModalTestIDs.importExistingOption,
            title: translate('add_account_modal.import_existing'),
            icon: <DocumentDownloadIcon />,
            onPress: () => setImportExisting(true),
          },
        ]}
      />
    </Stack>
  ) : (
    <ImportExistingAccount
      onClose={onClose}
      onSelect={onImportExistingAccount}
      onBack={() => setImportExisting(false)}
    />
  );
  return <Modal visible={visible} onClose={onClose}>{content}</Modal>;
}
