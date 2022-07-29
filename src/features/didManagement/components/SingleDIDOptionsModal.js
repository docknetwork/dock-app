import {Stack} from 'native-base';
import React, {useCallback} from 'react';
import {DownloadIcon, BinIcon, OptionList, PencilIcon} from 'src/design-system';
import {translate} from 'src/locales';
import {Modal} from '../../../components/Modal';
import {Typography} from '../../../design-system';
import {addTestId} from '../../../core/automation-utils';
import {showConfirmationModal} from '../../../components/ConfirmationModal';
import {navigate} from '../../../core/navigation';
import {Routes} from '../../../core/routes';

export function SingleDIDOptionsModal({
  onClose,
  visible,
  didDocumentResolution,
  onDeleteDID,
}) {
  const showConfirmDeleteDIDModal = useCallback(() => {
    showConfirmationModal({
      type: 'warning',
      title: translate('didManagement.delete_did'),
      description: translate('didManagement.delete_description'),
      confirmText: translate('didManagement.delete'),
      cancelText: translate('didManagement.cancel'),
      onConfirm: () => {
        onDeleteDID(didDocumentResolution);
      },
      onCancel: () => {},
    });
  }, [didDocumentResolution, onDeleteDID]);

  const content = (
    <Stack p={8} testID="addAccountModal">
      <Typography variant="h1">
        {translate('didManagement.edit_did')}
      </Typography>
      <OptionList
        mt={5}
        items={[
          {
            testID: addTestId('EditDIDOption').testID,
            title: translate('didManagement.edit_did'),
            icon: <PencilIcon />,
            onPress: () => {
              if (didDocumentResolution) {
                navigate(Routes.DID_MANAGEMENT_EDIT_DID, {
                  didDocumentResolution,
                });
              }
            },
          },
          {
            testID: addTestId('ExportDIDOption').testID,
            title: translate('didManagement.export_did'),
            icon: <DownloadIcon />,
            onPress: () => {
              if (didDocumentResolution) {
                navigate(Routes.DID_MANAGEMENT_EXPORT_DID, {
                  didDocumentResolution,
                });
              }
            },
          },
          {
            testID: addTestId('DeleteDIDOption').testID,
            title: translate('didManagement.delete_did'),
            icon: <BinIcon />,
            onPress: () => {
              onClose();
              showConfirmDeleteDIDModal();
            },
          },
        ]}
      />
    </Stack>
  );
  return (
    <Modal visible={visible} onClose={onClose} onBackButtonPress={onClose}>
      {content}
    </Modal>
  );
}
