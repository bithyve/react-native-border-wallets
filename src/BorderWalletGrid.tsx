import {
  ActivityIndicator,
  FlatList,
  InteractionManager,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { wordList } from './wordlist';
import { GridType } from './Interface';
import { shuffle } from './generateBorderWalletGrid';

const wordlists = wordList;
export const columns = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
];
const cellHeight = 25;
const cellWidth = 60;

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    padding: 10,
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
    overflow: 'hidden',
  },
  column: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cell: {
    padding: 5,
    width: cellWidth,
    height: cellHeight,
    margin: 1,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellSelected: {
    padding: 5,
    width: cellWidth,
    height: cellHeight,
    backgroundColor: '#69A2B0',
    margin: 1,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    position: 'relative',
  },
  text: {
    fontSize: 12,
    color: '#BEBBBB',
  },
  textSeq: {
    position: 'absolute',
    fontSize: 9,
    color: '#F8F8F8',
    top: 1,
    left: 3,
  },
  headerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ceilText: {
    color: '#BEBBBB',
  },
});

const rows = Array.from(Array(128).keys());

export const Ceil = ({ onPress, text, index, selected }) => {
  const isSelected = selected.includes(index);
  const sequence = isSelected ? selected.findIndex((i) => i === index) + 1 : -1;
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={() => onPress(index)}
      style={
        isSelected
          ? styles.cellSelected
          : [
              styles.cell,
              {
                backgroundColor: '#E5E5E5',
              },
            ]
      }
    >
      {isSelected && <Text style={styles.textSeq}>{sequence} &nbsp;</Text>}
      <Text
        style={[
          styles.text,
          {
            color: isSelected ? '#F8F8F8' : '#BEBBBB',
            fontWeight: isSelected ? 'bold' : '500',
          },
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const BorderWalletGrid = () => {
  const mnemonic = '';
  const gridType = useState(GridType.WORDS);
  const [grid, setGrid] = useState([]);
  const [selected, setSelected] = useState([]);
  const columnHeaderRef = useRef();
  const rowHeaderRef = useRef();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let listener: NodeJS.Timeout;
    InteractionManager.runAfterInteractions(() => {
      listener = setTimeout(() => {
        generateGrid();
      }, 500);
    });
    return () => clearTimeout(listener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gridType]);

  const generateGrid = () => {
    const words = [...wordlists];
    shuffle(words, mnemonic);
    const cells = words.map((word) => {
      switch (gridType) {
        case GridType.WORDS:
          return word.slice(0, 4);
        case GridType.HEXADECIMAL:
          return (
            ' ' + (wordlists.indexOf(word) + 1).toString(16).padStart(3, '0')
          );
        case GridType.NUMBERS:
          return (wordlists.indexOf(word) + 1).toString().padStart(4, '0');
        default:
          return ' ';
      }
    });
    const g = [];
    Array.from(
      {
        length: 128,
      },
      (_, rowIndex) => {
        g.push(cells.slice(rowIndex * 16, (rowIndex + 1) * 16));
      }
    );
    setGrid(g);
    setLoading(false);
  };

  return loading ? (
    <ActivityIndicator
      size="large"
      style={{
        height: '80%',
      }}
    />
  ) : (
    <View
      style={{
        flex: 1,
        marginHorizontal: 2,
        flexDirection: 'row',
      }}
    >
      <View>
        <FlatList
          data={rows}
          ref={rowHeaderRef}
          contentContainerStyle={{
            paddingBottom: 100 + 36,
          }}
          overScrollMode="never"
          bounces={false}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.cell}>
              <Text style={styles.ceilText}>
                {('000' + (item + 1)).substr(-3)}
              </Text>
            </View>
          )}
          // keyExtractor={( item ) => item.toString()}
        />
      </View>

      <View
        style={{
          flex: 1,
        }}
      >
        <ScrollView
          horizontal
          overScrollMode="never"
          bounces={false}
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={10}
          snapToInterval={cellWidth + 2}
          snapToAlignment="start"
          onScroll={(e) => {
            columnHeaderRef.current?.scrollToIndex({
              index: e.nativeEvent.contentOffset.x / (cellWidth + 2),
              animated: false,
            });
          }}
        >
          <ScrollView
            overScrollMode="never"
            bounces={false}
            contentContainerStyle={{
              paddingBottom: 100,
            }}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={10}
            onScroll={(e) => {
              rowHeaderRef.current?.scrollToIndex({
                index: e.nativeEvent.contentOffset.y / (cellHeight + 2),
                animated: false,
              });
            }}
          >
            {grid.map((rowData, index) => (
              <FlatList
                key={index}
                data={rowData}
                horizontal
                overScrollMode="never"
                bounces={false}
                scrollEnabled={false}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item, index: i }) => (
                  <Ceil
                    onPress={(i) => onCeilPress(i)}
                    text={item}
                    index={index * 16 + i}
                    selected={selected}
                  />
                )}
                // keyExtractor={( item ) => item}
              />
            ))}
          </ScrollView>
        </ScrollView>
      </View>
    </View>
  );
};

export default BorderWalletGrid;
