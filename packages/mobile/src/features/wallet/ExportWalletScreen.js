import React from 'react';
import { useDispatch } from "react-redux";
import { GenericPasswordContainer } from "../accounts/ExportAccountPasswordScreen";
import { WalletConstants } from "./constants";
import { walletOperations } from "./wallet-slice";

export function ExportWalletContainer({ route }) {
  const { callback } = route.params || {};
  const dispatch = useDispatch();

  return (
    <GenericPasswordContainer
      testID={WalletConstants.exportWallet.testID.container}
      description={WalletConstants.exportWallet.locales.description}
      title={WalletConstants.exportWallet.locales.title}
      onSubmit={(form) => {
        return dispatch(
          walletOperations.exportWallet({
            password: form.password,
            callback,
          }),
        );
      }}
    />
  )
}
