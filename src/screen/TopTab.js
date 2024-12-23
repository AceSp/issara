import React from 'react';
import ScrollableTabView from 'rn-collapsing-tab-bar';
import PopularScreen from './PopularScreen';

const TopTab = () =>  {
    return(
        <ScrollableTabView>
            <PopularScreen onScroll={() => 50} tabLabel="1"/>
            <PopularScreen tabLabel="2"/>
            <PopularScreen tabLabel="3"/>
        </ScrollableTabView>
    )
}

export default TopTab;