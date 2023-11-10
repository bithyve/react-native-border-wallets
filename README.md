# react-native-border-wallets

[Border Wallets](https://www.borderwallets.com/ "Border Wallets") library for React Native

## Installation
This library uses core crypto module so install [rn-nodify](https://github.com/tradle/rn-nodeify "rn-nodify")

```sh
npm install react-native-border-wallets
```

## Usage

```js
import BorderWalletGrid, { GridType, generateBorderWalletGrid } from 'react-native-border-wallets';


    <BorderWalletGrid
      gridType={GridType.WORDS}
      mnemonic="12 word mnemonic"
      accentColor="tomato"
      onCellSelected={(index, selectedCells) =>
        console.log(index, selectedCells)
      }
      onGridLoaded={(grid) => console.log('onGridLoaded', grid)}
    />
	
	const grid = generateBorderWalletGrid('12 words', GridType.WORDS)
	
```
---

`<BorderWalletGrid .../>` renders Border Wallet grid for a given mnemonic
**Props:**
- `mnemonic: string`
	Initial 12 words mnemonic to be use to generate entropy grid
- `gridType: WORDS | NUMBERS | HEXADECIMAL(Base64) | BLANK`
	Type of grid
-  `accentColor: string`
	Accent color for loader and selected cell
- `onGridLoaded: (grid: string[]) => void`
	Optional: Callback to handle grid load completion
- `onCellSelected: (index: number, selectedCells: number[])=>  void`
	Optional callback to handle pattern selection
---

`generateBorderWalletGrid` returns grid array of 2048 elements for a given mnemonic and grid type

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

