import React, { useMemo } from "react";
import { useHistory, useLocation } from "react-router";
import { HashRouter, Route } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import { MuiThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { unstable_createMuiStrictModeTheme as createMuiTheme } from "@material-ui/core/styles";
import { PublicKey } from "@solana/web3.js";
import Layout from "./components/Layout";
import Multisig from "./components/Multisig";
import { WalletDialogProvider } from "@solana/wallet-adapter-material-ui";
import { WalletProvider } from "@solana/wallet-adapter-react";
import {
  getLedgerWallet,
  getMathWallet,
  getPhantomWallet,
  getSolflareWallet,
  getSolletWallet,
  getSolongWallet,
  getTorusWallet,
} from '@solana/wallet-adapter-wallets';
import { ConnectionProvider } from "./context/connection";
import './App.css'
import { AccountProvider } from "./context/AccountContext";
import { store } from "./store";

function App() {
  const theme = createMuiTheme({
    palette: {
      background: {
        default: "rgb(255,255,255)",
      },
    },
    typography: {
      fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
    },
    overrides: {},
  });
  const wallets = useMemo(
    () => [
        getPhantomWallet(),
        getSolflareWallet(),
        getSolletWallet(),
        getTorusWallet({
            options: {
                clientId: 'BOM5Cl7PXgE9Ylq1Z1tqzhpydY0RVr8k90QQ85N7AKI5QGSrr9iDC-3rvmy0K_hF0JfpLMiXoDhta68JwcxS1LQ',
            },
        }),
        getLedgerWallet(),
        getSolongWallet(),
        getMathWallet(),
    ],
    []
  );

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider maxSnack={5} autoHideDuration={8000}>
        <ConnectionProvider>
          <WalletProvider wallets={wallets} autoConnect>
              <WalletDialogProvider>
                <AccountProvider>
                  <HashRouter basename={"/"}>
                        <Layout>
                          <Route exact path="/" component={MultisigPage} />
                          <Route
                            exact
                            path="/:address"
                            component={MultisigInstancePage}
                          />
                        </Layout>
                  </HashRouter>
                </AccountProvider>
              </WalletDialogProvider>
          </WalletProvider>
        </ConnectionProvider>
      </SnackbarProvider>
    </MuiThemeProvider>
  );
}

function MultisigPage() {
  // const state = store.getState()
  // const { hash } = window.location;
  // if (hash) {
  //   window.location.href = `#/${state.common.network.defaultMultisig!.toString()}`;
  // }
  const multisig = new PublicKey("99FCf6q7yaC7vZkAz37ZerZxCJrhaabQnv8yR3jATzvS");

  // const multisig = state.common.network.defaultMultisig;
  return <Multisig multisig={multisig} />;
}

export function MultisigInstancePage() {
  const history = useHistory();
  const location = useLocation();
  const path = location.pathname.split("/");
  if (path.length !== 2) {
    history.push(`/multisig`);
    return <></>;
  } else {
    const multisig = new PublicKey(path[1]);
    return <Multisig multisig={multisig} />;
  }
}

export default App;
