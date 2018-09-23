import React from 'react';
import { Text, View } from 'react-native';
import GridView from 'react-native-gridview';

const itemsPerRow = 3;

// Use data from an array...
const data = Array(20)
  .fill(null)
  .map((item, index) => index + 1);

// ...or create your own data source.
// This will randomly allocate 1-3 items per row, and will be used
// if the `randomizeRows` prop is `true`.
const randomData = [];
for (let i = 0; i < data.length; i) {
  const endIndex = Math.max(Math.round(Math.random() * itemsPerRow), 1) + i;
  randomData.push(data.slice(i, endIndex));
  i = endIndex;
}
const dataSource = new GridView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2,
}).cloneWithRows(randomData);

export default function MyGrid(props) {
  return (
    <GridView
      data={data}
      dataSource={props.randomizeRows ? dataSource : null}
      itemsPerRow={itemsPerRow}
      renderItem={(item, sectionID, rowID, itemIndex, itemID) => {
        return (
          <View style={{ flex: 1, backgroundColor: '#8F8', borderWidth: 1 }}>
            <Text>{`${item} (${sectionID}-${rowID}-${itemIndex}-${itemID})`}</Text>
          </View>
        );
      }}
    />
  );
}
