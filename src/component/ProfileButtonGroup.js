import React from 'react';
import {
    ButtonGroup
} from 'react-native-elements';

export default class ProfileButtonGroup extends React.Component {
    constructor () {
        super()
        this.state = {
          selectedIndex: 2
        }
        this.updateIndex = this.updateIndex.bind(this)
      }
      
      updateIndex (selectedIndex) {
        this.setState({selectedIndex})
      }
      
      render () {
        const buttons = ['โพสต์ของคุณ', 'ที่คุณให้ดาว', 'ที่คุณคอมเมนต์']
        const { selectedIndex } = this.state
      
        return (
          <ButtonGroup
            onPress={this.updateIndex}
            selectedIndex={selectedIndex}
            buttons={buttons}
            containerStyle={{height: 35, marginTop: 20,}}
          />
        )
      }
}