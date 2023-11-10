import * as React from 'react';
import BorderWalletGrid, { GridType } from 'react-native-border-wallets';

export default function App() {
  return (
    <BorderWalletGrid
      gridType={GridType.WORDS}
      mnemonic=""
      accentColor="tomato"
      onCellSelected={(index, selectedCells) =>
        console.log(index, selectedCells)
      }
      onGridLoaded={(grid) => console.log('onGridLoaded', grid)}
    />
  );
}
