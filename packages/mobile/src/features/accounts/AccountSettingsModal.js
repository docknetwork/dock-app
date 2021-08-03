import { Box, Pressable, Stack } from 'native-base';
import React, { useEffect, useState } from 'react';
import {
  BackIcon,
  DocumentDownloadIcon,
  OptionList,
  PlusCircleIcon
} from 'src/design-system';
import { Modal } from '../../components/Modal';
import { Typography } from '../../design-system';
import { translate } from '../../locales';

export function AccountSettingsModal({onClose, visible, onDelete, onExport}) {
  const [view, setView] = useState('options');

  useEffect(() => {
    setView('options');
  }, [visible]);

  const content =
    view === 'options' ? (
      <Stack p={8}>
        <Typography variant="h1">
          {translate('account_settings_modal.options_title')}
        </Typography>
        <OptionList
          mt={5}
          items={[
            {
              title: 'Export account',
              icon: <PlusCircleIcon />,
              onPress: () => setView('export'),
            },
            {
              title: 'Delete account',
              icon: <DocumentDownloadIcon />,
              onPress: () => {
                onDelete();
                onClose();
              },
            },
          ]}
        />
      </Stack>
    ) : (
      <Stack p={8}>
        <Stack direction="row">
          <Pressable onPress={() => setView('options')}>
            <Box pt={1} pr={5}>
              <BackIcon />
            </Box>
          </Pressable>
          <Typography variant="h1">
            {translate('account_settings_modal.export_account_titlte')}
          </Typography>
        </Stack>
        <OptionList
          mt={5}
          postPress={onClose}
          items={[
            {
              title: translate('account_settings_modal.export_via_json'),
              icon: <DocumentDownloadIcon />,
              onPress: () => onExport('json'),
            },
            {
              title: translate('account_settings_modal.export_via_qrcode'),
              icon: <DocumentDownloadIcon />,
              onPress: () => onExport('qrcode'),
            },
          ]}
        />
      </Stack>
    );
  return (
    <Modal visible={visible} onClose={onClose}>
      {content}
    </Modal>
  );
}
