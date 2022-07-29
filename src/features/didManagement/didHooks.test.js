import {renderHook, act} from '@testing-library/react-hooks';
import {useDIDManagementHandlers} from './didHooks';
import {useDIDManagement} from '@docknetwork/wallet-sdk-react-native/lib';
import Share from 'react-native-share';
import RNFS from 'react-native-fs';
describe('DID hooks', () => {
  test('Handle on change', () => {
    const {result} = renderHook(() => useDIDManagementHandlers());

    act(() => {
      result.current.handleChange('didType')('didkey');
    });
    expect(result.current.form.didType).toBe('didkey');
  });
  //
  test('Handle new DID key creation', async () => {
    const {result} = renderHook(() => useDIDManagementHandlers());

    act(() => {
      result.current.handleChange('didType')('didkey');
    });

    await result.current.onCreateDID();

    const {result: dIDManagementResult} = renderHook(() => useDIDManagement());
    expect(dIDManagementResult.current.createKeyDID).toBeCalledWith({
      derivePath: '',
      type: 'ed25519',
      name: '',
      didType: 'didkey',
    });
  });
  test('Handle new DID key creation with invalid params', async () => {
    const {result} = renderHook(() => useDIDManagementHandlers());

    act(() => {
      result.current.handleChange('didType')('didkey');
      result.current.handleChange('keypairType')('sr25519');
    });

    await expect(result.current.onCreateDID()).rejects.toMatch(
      'Only ed25519 keypair is supported.',
    );
  });
  //
  test('Delete DID', async () => {
    const {result} = renderHook(() => useDIDManagementHandlers());
    await result.current.onDeleteDID({
      id: 'did:key:z6MkjjCpsoQrwnEmqHzLdxWowXk5gjbwor4urC1RPDmGeV8r',
    });
    const {result: dIDManagementResult} = renderHook(() => useDIDManagement());
    expect(dIDManagementResult.current.deleteDID).toBeCalledWith({
      id: 'did:key:z6MkjjCpsoQrwnEmqHzLdxWowXk5gjbwor4urC1RPDmGeV8r',
    });
  });
  //
  test('Update  DID', async () => {
    const {result} = renderHook(() => useDIDManagementHandlers());
    act(() => {
      result.current.handleChange('didName')('DockSocials');
      result.current.handleChange('id')(
        'did:key:z6MkjjCpsoQrwnEmqHzLdxWowXk5gjbwor4urC1RPDmGeV8r',
      );
    });
    await result.current.onEditDID();
    const {result: dIDManagementResult} = renderHook(() => useDIDManagement());
    expect(dIDManagementResult.current.editDID).toBeCalledWith({
      id: 'did:key:z6MkjjCpsoQrwnEmqHzLdxWowXk5gjbwor4urC1RPDmGeV8r',
      name: 'DockSocials',
    });
  });
  test('Update  DID with invalid params', async () => {
    const {result} = renderHook(() => useDIDManagementHandlers());
    act(() => {
      result.current.handleChange('id')('');
    });

    await expect(result.current.onEditDID()).rejects.toMatch(
      'Document ID is not set',
    );
  });

  test('Import DID', async () => {
    const {result} = renderHook(() => useDIDManagementHandlers());
    const encryptedJSONWallet = {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://w3id.org/wallet/v1',
      ],
      id: 'did:key:z6LSjTbRETJjUCDiQopbeCgZKRisy7mdchwiMBPTQktcibGh#encrypted-wallet',
      type: ['VerifiableCredential', 'EncryptedWallet'],
      issuer: 'did:key:z6LSjTbRETJjUCDiQopbeCgZKRisy7mdchwiMBPTQktcibGh',
      issuanceDate: '2022-07-19T20:59:44.798Z',
      credentialSubject: {
        id: 'did:key:z6LSjTbRETJjUCDiQopbeCgZKRisy7mdchwiMBPTQktcibGh',
        encryptedWalletContents: {
          protected: 'eyJlbmMiOiJYQzIwUCJ9',
          recipients: [
            {
              header: {
                kid: 'did:key:z6LSjTbRETJjUCDiQopbeCgZKRisy7mdchwiMBPTQktcibGh#z6LSjTbRETJjUCDiQopbeCgZKRisy7mdchwiMBPTQktcibGh',
                alg: 'ECDH-ES+A256KW',
                epk: {
                  kty: 'OKP',
                  crv: 'X25519',
                  x: '-ABoa59NY2qVI66NZ8EbqxCwp02sft5onyKhfa2yfUU',
                },
                apu: '-ABoa59NY2qVI66NZ8EbqxCwp02sft5onyKhfa2yfUU',
                apv: 'ZGlkOmtleTp6NkxTalRiUkVUSmpVQ0RpUW9wYmVDZ1pLUmlzeTdtZGNod2lNQlBUUWt0Y2liR2gjejZMU2pUYlJFVEpqVUNEaVFvcGJlQ2daS1Jpc3k3bWRjaHdpTUJQVFFrdGNpYkdo',
              },
              encrypted_key:
                'Mmf6YGug9bL-L4bi2UwS9R8nUk6bJmgVKJvP2_a0BwsjxtxBN0ly6w',
            },
          ],
          iv: '-u0i0V9ENM3rUwxj-Yv_7jd3veFLzVEO',
          ciphertext:
            'jahwvff1Afy19A9C4kP51nno-14Ea7m-omq39JGlG5_qmmEgrBcd0KsStpfDFKj4gMRR8izsALXqKz78vzhCRTd3RNa5rNOKbzfT3HALRkn1y7n6RlSRRZ0MKuBP9JVg49opLSqAIJ9j64Ebj2KhXALX6Wbv1h9FhAIhIxGkZJZDgKFQmpI54IGKS-J4_19gE2IcJrt7nYb_jXa9VwmmPbH-GDUFGVVbk3uoGCIcpxPSTiwEn7RSC2iSb_kARyOb7ft5546TKiODN-98QMV7lQTn4kZ59RqgC2w7rwDui85He_X21z0GcK9Ipkg5tRm5U7GNqzZtT3Ev952VOUW960istZ6s5gMpcngv0YMGBqnboYqHC3Uq22-ZRM7ya1ijJOi-UD0ozdGNrLs6kdAQWlvrGh7NAnpEdpBfxq_2CuxLZxTI8TGXfpXH39Njc_L3241AISN7HyTrHsoA2F0QIoIE6njMcxaqQy8OWeWYJD7jAhiWMCE-M5UGUbgJUB5BpUV4Q_hndQqL_c5YVf2Fbc98_8vVwtsUeqbMB97qgN3Pq3du00N7rJ7zs9SNuO3D_2A9KD9Y7tN7QywXA565HQC2k-OJpkVqsRDsihWpn3qtTMaSu0OKJS6rKeugSNE6VlsGFC_PoD_6qx3FpcAPsl5_3MDuE-aZBden_iMfUkdXKxZFrkYbc2bLMekoQwa3gfrjBc4EoN9aPbIux3dqS8nBS6-31UCIMkfEv6OmKmm0_wIm-CeMUM8BW9EgGk_9k9kOySZbTQ5VxwomOLWHundKCFTp_I3adoobUORpbxl9LivFqX0T47w5ktblOMUiTMSzgmI4WbGYrvi4otb33vH88aRc_WneCeoSuWFnCUih2R8xBNqhqIESIB1zTqYnVlaENTNZXIRfw7qSatT6i7pnkaBygp059LeBJCkG79V0yB_ZnNTHX3oTViHHNfFmTpeuT7puhWFBkgQnLzr0zdc03hyjVNA99BhR3dz1gjL3TP8TgaYG6LLS2h-6HeLYRX8uDi-SmVU1hIvWR11l6dbzcQrj4b5cjMbbHvyxaegaXCNB5LPLRxg03z1Z74faueBRfWb3l2z_slbAhmJK2KJe9evl47_Fd5RgVAjbxRqwwFAAyUtzKtyHGZhUN7lJrOFATl89mzpGNg0Qt3lTC7rfzCD0xFWruC7PZnw7lCI8aNsPnNMG-2En-JE1eTyMUyG9um7ernec_AUqqntf7JjvNbjQO_PBu6qsOAsaKWbx1DxgEOFa-LPT7NGzBPr13pMFjIoiOXmLUexAl_LuZyEJuyjtfijSepZ6pYEKPQvAFMyNFBO-Og-jRoHaw78mVsoNV2jURkVwDfFuTeA_it5Xk00zgRGra3z1WELN8r-VWBewlj69H7ui4GF0PWZNEG5nxxZbmmrZgvj-Zqv9oCKHC60El2jX2KMniXiBXW-wcoh5pqT4P4dMOqkLdtpOtFvdWW0cQBJEdGcccfWdd0NUIhr0pSL3tfJ5yPxke8kTpHuwIb7Dbb55nqYDpyU-3hdx1QJtTFcCT2EottF0XDx1nrmLM9t_ZpZRx06tOOhK-CQLYNouqaMkpIEuW-utycHuS6qW-dNX95b15r3z1wuLxBA7CxgjYHmswedWnvMNshEIcTLAAYHttSsUVRBVLNVllqKs9swEN2Klq1L0d8iW3KGkpiGfrPpVeobcwB9E2sPIZyjNPwxlQboVAU8evbuk6e4slGTJwnz0VvDpRDtqM9Kz0ndIcuaOoB9he57zi037Aup8C2G8_qATcBhka7SHfP8XJdlDjz7cU5ACl2Mt0FH1C6HPBJj_FKbWLxjPgM17vfeDqgI_R6Du05kTFpQuwyqtnXYk10bd-M50jIWfrlrX-pdSObjolCVEtuUt2lZvZahe0r2bg87Zbk3eFU9bI8eVtdosvSGtP9ZrKfe5BjrfMAC0XsKfWwoKT0JXznXD0Brw11PBQwsslusQOPI6HqskmmaE3NCkKB9a2Wnzs1eO1_Ompqbx_J7uoBphNMzlnrOQL74UVRifDqTFc_o0-rhp3EaXnlDnuOCbYwbOO7Ah3jX5OdU49Vnm-VHIB5_MAtYeEonVaMdSyXa1LXboy-LespvK9P7x1Zfnk5FW9SQCEa1cp7_dXD4h5ho7shKTzPLxbFShKQ_twsoP7JeMdZd1MNCtt_7B9Be-uRfGPwV2XQijME0xtq_8OMhbxFAJh-6MLVZqqKlDSw',
          tag: 'kKoF2f10Da0kBqX2brBZug',
        },
      },
    };
    const password = 'test';
    await result.current.onImportDID({encryptedJSONWallet, password});

    const {result: dIDManagementResult} = renderHook(() => useDIDManagement());
    expect(dIDManagementResult.current.importDID).toBeCalledWith({
      encryptedJSONWallet,
      password,
    });
  });
  test('Import DID with invalid params', async () => {
    const {result} = renderHook(() => useDIDManagementHandlers());
    const encryptedJSONWallet = {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://w3id.org/wallet/v1',
      ],
      id: 'did:key:z6LSjTbRETJjUCDiQopbeCgZKRisy7mdchwiMBPTQktcibGh#encrypted-wallet',
      type: ['VerifiableCredential', 'EncryptedWallet'],
      issuer: 'did:key:z6LSjTbRETJjUCDiQopbeCgZKRisy7mdchwiMBPTQktcibGh',
      issuanceDate: '2022-07-19T20:59:44.798Z',
      credentialSubject: {
        id: 'did:key:z6LSjTbRETJjUCDiQopbeCgZKRisy7mdchwiMBPTQktcibGh',
        encryptedWalletContents: {
          protected: 'eyJlbmMiOiJYQzIwUCJ9',
          recipients: [
            {
              header: {
                kid: 'did:key:z6LSjTbRETJjUCDiQopbeCgZKRisy7mdchwiMBPTQktcibGh#z6LSjTbRETJjUCDiQopbeCgZKRisy7mdchwiMBPTQktcibGh',
                alg: 'ECDH-ES+A256KW',
                epk: {
                  kty: 'OKP',
                  crv: 'X25519',
                  x: '-ABoa59NY2qVI66NZ8EbqxCwp02sft5onyKhfa2yfUU',
                },
                apu: '-ABoa59NY2qVI66NZ8EbqxCwp02sft5onyKhfa2yfUU',
                apv: 'ZGlkOmtleTp6NkxTalRiUkVUSmpVQ0RpUW9wYmVDZ1pLUmlzeTdtZGNod2lNQlBUUWt0Y2liR2gjejZMU2pUYlJFVEpqVUNEaVFvcGJlQ2daS1Jpc3k3bWRjaHdpTUJQVFFrdGNpYkdo',
              },
              encrypted_key:
                'Mmf6YGug9bL-L4bi2UwS9R8nUk6bJmgVKJvP2_a0BwsjxtxBN0ly6w',
            },
          ],
          iv: '-u0i0V9ENM3rUwxj-Yv_7jd3veFLzVEO',
          ciphertext:
            'jahwvff1Afy19A9C4kP51nno-14Ea7m-omq39JGlG5_qmmEgrBcd0KsStpfDFKj4gMRR8izsALXqKz78vzhCRTd3RNa5rNOKbzfT3HALRkn1y7n6RlSRRZ0MKuBP9JVg49opLSqAIJ9j64Ebj2KhXALX6Wbv1h9FhAIhIxGkZJZDgKFQmpI54IGKS-J4_19gE2IcJrt7nYb_jXa9VwmmPbH-GDUFGVVbk3uoGCIcpxPSTiwEn7RSC2iSb_kARyOb7ft5546TKiODN-98QMV7lQTn4kZ59RqgC2w7rwDui85He_X21z0GcK9Ipkg5tRm5U7GNqzZtT3Ev952VOUW960istZ6s5gMpcngv0YMGBqnboYqHC3Uq22-ZRM7ya1ijJOi-UD0ozdGNrLs6kdAQWlvrGh7NAnpEdpBfxq_2CuxLZxTI8TGXfpXH39Njc_L3241AISN7HyTrHsoA2F0QIoIE6njMcxaqQy8OWeWYJD7jAhiWMCE-M5UGUbgJUB5BpUV4Q_hndQqL_c5YVf2Fbc98_8vVwtsUeqbMB97qgN3Pq3du00N7rJ7zs9SNuO3D_2A9KD9Y7tN7QywXA565HQC2k-OJpkVqsRDsihWpn3qtTMaSu0OKJS6rKeugSNE6VlsGFC_PoD_6qx3FpcAPsl5_3MDuE-aZBden_iMfUkdXKxZFrkYbc2bLMekoQwa3gfrjBc4EoN9aPbIux3dqS8nBS6-31UCIMkfEv6OmKmm0_wIm-CeMUM8BW9EgGk_9k9kOySZbTQ5VxwomOLWHundKCFTp_I3adoobUORpbxl9LivFqX0T47w5ktblOMUiTMSzgmI4WbGYrvi4otb33vH88aRc_WneCeoSuWFnCUih2R8xBNqhqIESIB1zTqYnVlaENTNZXIRfw7qSatT6i7pnkaBygp059LeBJCkG79V0yB_ZnNTHX3oTViHHNfFmTpeuT7puhWFBkgQnLzr0zdc03hyjVNA99BhR3dz1gjL3TP8TgaYG6LLS2h-6HeLYRX8uDi-SmVU1hIvWR11l6dbzcQrj4b5cjMbbHvyxaegaXCNB5LPLRxg03z1Z74faueBRfWb3l2z_slbAhmJK2KJe9evl47_Fd5RgVAjbxRqwwFAAyUtzKtyHGZhUN7lJrOFATl89mzpGNg0Qt3lTC7rfzCD0xFWruC7PZnw7lCI8aNsPnNMG-2En-JE1eTyMUyG9um7ernec_AUqqntf7JjvNbjQO_PBu6qsOAsaKWbx1DxgEOFa-LPT7NGzBPr13pMFjIoiOXmLUexAl_LuZyEJuyjtfijSepZ6pYEKPQvAFMyNFBO-Og-jRoHaw78mVsoNV2jURkVwDfFuTeA_it5Xk00zgRGra3z1WELN8r-VWBewlj69H7ui4GF0PWZNEG5nxxZbmmrZgvj-Zqv9oCKHC60El2jX2KMniXiBXW-wcoh5pqT4P4dMOqkLdtpOtFvdWW0cQBJEdGcccfWdd0NUIhr0pSL3tfJ5yPxke8kTpHuwIb7Dbb55nqYDpyU-3hdx1QJtTFcCT2EottF0XDx1nrmLM9t_ZpZRx06tOOhK-CQLYNouqaMkpIEuW-utycHuS6qW-dNX95b15r3z1wuLxBA7CxgjYHmswedWnvMNshEIcTLAAYHttSsUVRBVLNVllqKs9swEN2Klq1L0d8iW3KGkpiGfrPpVeobcwB9E2sPIZyjNPwxlQboVAU8evbuk6e4slGTJwnz0VvDpRDtqM9Kz0ndIcuaOoB9he57zi037Aup8C2G8_qATcBhka7SHfP8XJdlDjz7cU5ACl2Mt0FH1C6HPBJj_FKbWLxjPgM17vfeDqgI_R6Du05kTFpQuwyqtnXYk10bd-M50jIWfrlrX-pdSObjolCVEtuUt2lZvZahe0r2bg87Zbk3eFU9bI8eVtdosvSGtP9ZrKfe5BjrfMAC0XsKfWwoKT0JXznXD0Brw11PBQwsslusQOPI6HqskmmaE3NCkKB9a2Wnzs1eO1_Ompqbx_J7uoBphNMzlnrOQL74UVRifDqTFc_o0-rhp3EaXnlDnuOCbYwbOO7Ah3jX5OdU49Vnm-VHIB5_MAtYeEonVaMdSyXa1LXboy-LespvK9P7x1Zfnk5FW9SQCEa1cp7_dXD4h5ho7shKTzPLxbFShKQ_twsoP7JeMdZd1MNCtt_7B9Be-uRfGPwV2XQijME0xtq_8OMhbxFAJh-6MLVZqqKlDSw',
          tag: 'kKoF2f10Da0kBqX2brBZug',
        },
      },
    };
    const password = 'test1';

    await expect(
      result.current.onImportDID({encryptedJSONWallet, password}),
    ).rejects.toMatch('Incorrect password');
  });

  test('Export DID', async () => {
    const {result} = renderHook(() => useDIDManagementHandlers());
    await result.current.onExportDID({
      id: 'did:key:z6MkjjCpsoQrwnEmqHzLdxWowXk5gjbwor4urC1RPDmGeV8r',
      password: 'test',
    });

    const {result: dIDManagementResult} = renderHook(() => useDIDManagement());
    expect(dIDManagementResult.current.exportDID).toBeCalledWith({
      id: 'did:key:z6MkjjCpsoQrwnEmqHzLdxWowXk5gjbwor4urC1RPDmGeV8r',
      password: 'test',
    });
    expect(Share.open).toBeCalled();
    expect(RNFS.writeFile).toBeCalledWith(
      'DocumentDirectoryPath/did_did:key:z6MkjjCpsoQrwnEmqHzLdxWowXk5gjbwor4urC1RPDmGeV8r.json',
      '{}',
    );
  });
  test('Export DID with invalid params', async () => {
    const {result} = renderHook(() => useDIDManagementHandlers());
    await expect(
      result.current.onExportDID({
        password: 'test',
      }),
    ).rejects.toMatch('DID Document not found');
  });
});
