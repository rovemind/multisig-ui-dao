import { Provider } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';
import { useEffect, useState } from 'react';
import { AccountInfo as TokenAccount } from "@solana/spl-token";
import { getOwnedTokenAccounts } from '../components/Multisig';


export function useMultiSigOwnedTokenAccounts(
  provider: Provider,
  multiSig: PublicKey,
  programId: PublicKey
): TokenAccount[] {
  const [results, setResults] = useState<TokenAccount[]>([]);

  useEffect(() => {
    const connection = provider.connection;

    const onLoad = async () => {
      const [signer, nounce] = await PublicKey.findProgramAddress(
        [multiSig.toBuffer()],
        programId
      );
      const ownedTokenAccounts = await getOwnedTokenAccounts(connection, signer);
      console.log([multiSig.toBuffer()]);
      console.log('programId: ' + programId);
      console.log('ownedTokenAccounts: ' + ownedTokenAccounts);

      setResults(ownedTokenAccounts);
      return ownedTokenAccounts;
    };
    onLoad()
      .then(results => {
        console.log(
          `Fetched ${results.length} accounts for multisig ${multiSig}.`,
        );
      })
      .catch(() => {
        console.error(
          'Connection Failed',
          `Failed to fetch token accounts owned by ${multiSig}`,
        );
      });


    return () => {
      setResults([]);
    };
  }, [provider]);

  return results;
}
