import {useCallback, useMemo, useState} from 'react';
import {showToast, withErrorToast} from '../../core/toast';
import {translate} from '../../locales';
import {ANALYTICS_EVENT, logAnalyticsEvent} from '../analytics/analytics-slice';
import {navigate} from '../../core/navigation';
import {Routes} from '../../core/routes';
import {useDIDManagement} from '@docknetwork/wallet-sdk-react-native/lib';
import RNFS from 'react-native-fs';
import {exportFile} from '../accounts/account-slice';

export function useDIDManagementHandlers() {
  const {createKeyDID, deleteDID, editDID, didList, importDID, exportDID} =
    useDIDManagement();
  const [form, setForm] = useState({
    didName: '',
    didType: '',
    password: '',
    showDIDDockQuickInfo: true,
    keypairType: 'ed25519',
    derivationPath: '',
    _errors: {
      didType: '',
    },
    _hasError: false,
  });

  const onImportDID = useCallback(
    async ({encryptedJSONWallet, password}) => {
      await importDID({encryptedJSONWallet, password});
      showToast({
        message: translate('didManagement.did_imported_successfully'),
        type: 'success',
      });
      navigate(Routes.DID_MANAGEMENT_LIST);
      logAnalyticsEvent(ANALYTICS_EVENT.DID.DID_IMPORTED, {});
    },
    [importDID],
  );
  const handleChange = useCallback(key => {
    return evt => {
      setForm(v => ({
        ...v,
        [key]: evt,
      }));
    };
  }, []);

  const onCreateDID = useCallback(async () => {
    const {derivationPath, didType, keypairType, didName} = form;
    const newDIDParams = {
      derivePath: derivationPath,
      didType,
      type: keypairType,
      name: didName,
    };
    await createKeyDID(newDIDParams);
    showToast({
      message: translate('didManagement.did_created'),
      type: 'success',
    });
    navigate(Routes.DID_MANAGEMENT_LIST);
    logAnalyticsEvent(ANALYTICS_EVENT.DID.DID_CREATED, {});
  }, [createKeyDID, form]);

  const onDeleteDID = useCallback(
    async didResolution => {
      await deleteDID({id: didResolution.id});
      showToast({
        message: translate('didManagement.did_deleted'),
        type: 'success',
      });
    },
    [deleteDID],
  );

  const onEditDID = useCallback(async () => {
    const {id, didName} = form;

    await editDID({id, name: didName});
    showToast({
      message: translate('didManagement.did_edited_successfully'),
      type: 'success',
    });
    navigate(Routes.DID_MANAGEMENT_LIST);
    logAnalyticsEvent(ANALYTICS_EVENT.DID.DID_UPDATED, {});
  }, [editDID, form]);

  const onExportDID = useCallback(
    async ({id, password}) => {
      const res = await exportDID({id, password});

      const encryptedWalletJSONStr =
        typeof res === 'string' ? res : JSON.stringify(res);

      const path = `${RNFS.DocumentDirectoryPath}/did_${id}.json`;
      const mimeType = 'application/json';
      await RNFS.writeFile(path, encryptedWalletJSONStr);

      exportFile({
        path,
        mimeType,
        errorMessage: translate('didManagement.export_error'),
      });
      showToast({
        message: translate('didManagement.did_exported'),
        type: 'success',
      });
      navigate(Routes.DID_MANAGEMENT_LIST);
      logAnalyticsEvent(ANALYTICS_EVENT.DID.DID_EXPORTED, {});
    },
    [exportDID],
  );
  return useMemo(() => {
    return {
      onCreateDID: withErrorToast(onCreateDID),
      form,
      handleChange,
      onEditDID: withErrorToast(onEditDID),
      onDeleteDID: withErrorToast(onDeleteDID),
      onImportDID: withErrorToast(onImportDID),
      onExportDID: withErrorToast(onExportDID),
      didList,
    };
  }, [
    onCreateDID,
    form,
    handleChange,
    onEditDID,
    onDeleteDID,
    onImportDID,
    onExportDID,
    didList,
  ]);
}
